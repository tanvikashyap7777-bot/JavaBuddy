import { GoogleGenAI, Type } from '@google/genai';
import { CompilationResult, ExecutionStep } from '../src/types';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Fallback lightweight deterministic Java simulator when offline or without API key
 */
function localJavaFallback(code: string, stdin: string = ''): CompilationResult {
  const startTime = Date.now();
  
  // Basic syntax checks
  const errors: CompilationResult['compilationErrors'] = [];
  
  if (!code.includes('class ')) {
    errors.push({
      line: 1,
      message: 'class, interface, or enum expected',
      severity: 'error'
    });
  }

  // Count braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      line: code.split('\n').length,
      message: `reached end of file while parsing (unmatched braces: ${openBraces} '{' vs ${closeBraces} '}')`,
      severity: 'error'
    });
  }

  if (errors.length > 0) {
    return {
      success: false,
      stdout: '',
      stderr: errors.map(e => `Main.java:${e.line}: error: ${e.message}`).join('\n') + `\n${errors.length} error(s)`,
      compilationErrors: errors,
      executionTimeMs: Date.now() - startTime,
      exitCode: 1,
      explanation: 'Compilation failed due to missing syntax structures.'
    };
  }

  // Extract System.out.println / print statements for fallback simulation
  const outputLines: string[] = [];
  const lines = code.split('\n');
  const steps: ExecutionStep[] = [];
  const variables: Record<string, any> = {};

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const lineNum = idx + 1;

    // Simple variable detection
    const intMatch = trimmed.match(/int\s+([a-zA-Z0-9_]+)\s*=\s*([^;]+);/);
    if (intMatch) {
      try {
        // eslint-disable-next-line no-eval
        variables[intMatch[1]] = intMatch[2].trim();
      } catch {
        variables[intMatch[1]] = intMatch[2].trim();
      }
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: lineNum,
        codeLine: trimmed,
        explanation: `Allocated 32-bit integer on stack: ${intMatch[1]} = ${variables[intMatch[1]]}`,
        callStack: [{ functionName: 'main', line: lineNum, variables: { ...variables } }],
        heapObjects: [],
        stdout: outputLines.join('\n')
      });
    }

    const strMatch = trimmed.match(/String\s+([a-zA-Z0-9_]+)\s*=\s*"([^"]*)";/);
    if (strMatch) {
      variables[strMatch[1]] = `"${strMatch[2]}"`;
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: lineNum,
        codeLine: trimmed,
        explanation: `Reference '${strMatch[1]}' points to String in String Constant Pool: "${strMatch[2]}"`,
        callStack: [{ functionName: 'main', line: lineNum, variables: { ...variables } }],
        heapObjects: [{ id: `@str_${strMatch[1]}`, type: 'java.lang.String', fields: { value: strMatch[2] } }],
        stdout: outputLines.join('\n')
      });
    }

    const printMatch = trimmed.match(/System\.out\.print(ln)?\s*\((.*)\);/);
    if (printMatch) {
      let content = printMatch[2];
      // strip quotes if simple string
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1);
      }
      outputLines.push(content);

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: lineNum,
        codeLine: trimmed,
        explanation: `Printed to standard output: "${content}"`,
        callStack: [{ functionName: 'main', line: lineNum, variables: { ...variables } }],
        heapObjects: [],
        stdout: outputLines.join('\n')
      });
    }
  });

  return {
    success: true,
    stdout: outputLines.length > 0 ? outputLines.join('\n') : 'Program executed successfully with no output.',
    stderr: '',
    compilationErrors: [],
    executionTimeMs: Math.max(45, Date.now() - startTime + 50),
    exitCode: 0,
    explanation: 'Executed via local deterministic runtime simulator.',
    executionSteps: steps.length > 0 ? steps : undefined
  };
}

export async function executeJavaCode(code: string, stdin: string = ''): Promise<CompilationResult> {
  const ai = getGeminiClient();
  if (!ai) {
    return localJavaFallback(code, stdin);
  }

  const prompt = `You are a high-precision OpenJDK 21 Java compiler and JVM execution engine simulator.
Analyze the following Java code and standard input (stdin).

Java Code:
\`\`\`java
${code}
\`\`\`

Standard Input (stdin):
\`\`\`
${stdin}
\`\`\`

Simulate javac compilation and java execution with complete fidelity to OpenJDK 21 standards.
Check for:
1. Syntax and compilation errors (e.g., missing semicolons, type mismatch, symbol resolution, access modifier errors).
2. Runtime exceptions (e.g., NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException with exact line numbers).
3. Exact stdout output as System.out.print / println / printf would produce.
4. Step-by-step execution trace (up to 8 key steps) showing line numbers, explanation of what the JVM does at this line, stack frames (local variables), and heap objects (arrays, object instances with references).

Return pure JSON conforming to this schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN, description: 'True if code compiles and runs without uncaught runtime exception' },
            stdout: { type: Type.STRING, description: 'Exact console standard output' },
            stderr: { type: Type.STRING, description: 'Standard error or compiler error message' },
            exitCode: { type: Type.INTEGER, description: '0 for success, 1 for compiler error, non-zero for runtime exception' },
            executionTimeMs: { type: Type.INTEGER, description: 'Simulated execution time in milliseconds (e.g. 60-250)' },
            compilationErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line: { type: Type.INTEGER },
                  column: { type: Type.INTEGER },
                  message: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ['line', 'message', 'severity']
              }
            },
            explanation: { type: Type.STRING, description: 'Brief summary of what happened during execution' },
            executionSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  lineNumber: { type: Type.INTEGER },
                  codeLine: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  callStack: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        functionName: { type: Type.STRING },
                        line: { type: Type.INTEGER },
                        variables: { type: Type.OBJECT }
                      },
                      required: ['functionName', 'line', 'variables']
                    }
                  },
                  heapObjects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        fields: { type: Type.OBJECT }
                      },
                      required: ['id', 'type', 'fields']
                    }
                  },
                  stdout: { type: Type.STRING }
                },
                required: ['stepNumber', 'lineNumber', 'codeLine', 'explanation', 'callStack', 'heapObjects', 'stdout']
              }
            }
          },
          required: ['success', 'stdout', 'stderr', 'exitCode', 'executionTimeMs', 'compilationErrors']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      success: !!parsed.success,
      stdout: parsed.stdout || '',
      stderr: parsed.stderr || '',
      exitCode: parsed.exitCode ?? (parsed.success ? 0 : 1),
      executionTimeMs: parsed.executionTimeMs || 85,
      compilationErrors: parsed.compilationErrors || [],
      explanation: parsed.explanation,
      executionSteps: parsed.executionSteps
    };
  } catch (err: any) {
    console.error('Gemini compilation error, falling back to local simulator:', err);
    return localJavaFallback(code, stdin);
  }
}

export async function explainAndFixError(code: string, errorMessage: string) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      title: 'Java Compiler Error Diagnostics',
      explanation: 'Please check your syntax around the reported line number. Ensure all braces match and variables are declared before use.',
      mentalModel: 'In Java, the compiler strictly verifies types and symbols before producing bytecode.',
      suggestedFix: code,
      diffSummary: 'Review variable types and semicolons.'
    };
  }

  const prompt = `You are an expert Java educator. A student encountered this error while compiling or running Java code.

Code:
\`\`\`java
${code}
\`\`\`

Error Output:
\`\`\`
${errorMessage}
\`\`\`

Explain the error clearly in simple, pedagogical terms. Give the mental model / root cause why Java requires this, and provide the fully corrected code.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Catchy name for the error, e.g. "Cannot find symbol: variable count"' },
            explanation: { type: Type.STRING, description: 'Plain English beginner-friendly explanation of why this happened' },
            mentalModel: { type: Type.STRING, description: 'How to conceptually visualize or remember this rule' },
            suggestedFix: { type: Type.STRING, description: 'Full corrected Java code that runs cleanly' },
            diffSummary: { type: Type.STRING, description: 'Summary of changes made' }
          },
          required: ['title', 'explanation', 'mentalModel', 'suggestedFix', 'diffSummary']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error in explainAndFixError:', err);
    return {
      title: 'Error Analysis',
      explanation: 'The compiler reported: ' + errorMessage,
      mentalModel: 'Check that all types and methods match their definitions.',
      suggestedFix: code,
      diffSummary: 'Manual inspection required.'
    };
  }
}

export async function askTutor(message: string, contextCode: string, history: Array<{ role: 'user' | 'assistant'; text: string }>) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      reply: 'Java is a statically-typed, object-oriented language. Try running the code in the compiler or checking the lessons tab!',
      codeSuggestion: undefined
    };
  }

  const prompt = `You are "Duke", a friendly, world-class interactive Java Tutor.
Your goal is to guide students to understand Java concepts deeply through clear examples, intuitive analogies, and encouraging advice.

Student's Current Editor Code:
\`\`\`java
${contextCode}
\`\`\`

Student's Message:
"${message}"

Recent conversation history:
${JSON.stringify(history.slice(-4))}

Provide a concise, helpful, friendly answer with Markdown formatting and Java code blocks if appropriate. If you suggest a full code replacement, include it in codeSuggestion.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: 'Markdown formatted tutor response' },
            codeSuggestion: { type: Type.STRING, description: 'Optional updated code snippet to paste into editor' }
          },
          required: ['reply']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Error in askTutor:', err);
    return {
      reply: 'Java requires explicit declarations, static type checks, and class-based structure. Feel free to run your code to see the output!',
      codeSuggestion: undefined
    };
  }
}
