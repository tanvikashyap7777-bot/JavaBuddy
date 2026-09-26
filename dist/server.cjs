var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/gemini.ts
var import_genai = require("@google/genai");
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
function localJavaFallback(code, stdin = "") {
  const startTime = Date.now();
  const errors = [];
  if (!code.includes("class ")) {
    errors.push({
      line: 1,
      message: "class, interface, or enum expected",
      severity: "error"
    });
  }
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      line: code.split("\n").length,
      message: `reached end of file while parsing (unmatched braces: ${openBraces} '{' vs ${closeBraces} '}')`,
      severity: "error"
    });
  }
  if (errors.length > 0) {
    return {
      success: false,
      stdout: "",
      stderr: errors.map((e) => `Main.java:${e.line}: error: ${e.message}`).join("\n") + `
${errors.length} error(s)`,
      compilationErrors: errors,
      executionTimeMs: Date.now() - startTime,
      exitCode: 1,
      explanation: "Compilation failed due to missing syntax structures."
    };
  }
  const outputLines = [];
  const lines = code.split("\n");
  const steps = [];
  const variables = {};
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const lineNum = idx + 1;
    const intMatch = trimmed.match(/int\s+([a-zA-Z0-9_]+)\s*=\s*([^;]+);/);
    if (intMatch) {
      try {
        variables[intMatch[1]] = intMatch[2].trim();
      } catch {
        variables[intMatch[1]] = intMatch[2].trim();
      }
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: lineNum,
        codeLine: trimmed,
        explanation: `Allocated 32-bit integer on stack: ${intMatch[1]} = ${variables[intMatch[1]]}`,
        callStack: [{ functionName: "main", line: lineNum, variables: { ...variables } }],
        heapObjects: [],
        stdout: outputLines.join("\n")
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
        callStack: [{ functionName: "main", line: lineNum, variables: { ...variables } }],
        heapObjects: [{ id: `@str_${strMatch[1]}`, type: "java.lang.String", fields: { value: strMatch[2] } }],
        stdout: outputLines.join("\n")
      });
    }
    const printMatch = trimmed.match(/System\.out\.print(ln)?\s*\((.*)\);/);
    if (printMatch) {
      let content = printMatch[2];
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1);
      }
      outputLines.push(content);
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: lineNum,
        codeLine: trimmed,
        explanation: `Printed to standard output: "${content}"`,
        callStack: [{ functionName: "main", line: lineNum, variables: { ...variables } }],
        heapObjects: [],
        stdout: outputLines.join("\n")
      });
    }
  });
  return {
    success: true,
    stdout: outputLines.length > 0 ? outputLines.join("\n") : "Program executed successfully with no output.",
    stderr: "",
    compilationErrors: [],
    executionTimeMs: Math.max(45, Date.now() - startTime + 50),
    exitCode: 0,
    explanation: "Executed via local deterministic runtime simulator.",
    executionSteps: steps.length > 0 ? steps : void 0
  };
}
async function executeJavaCode(code, stdin = "") {
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
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            success: { type: import_genai.Type.BOOLEAN, description: "True if code compiles and runs without uncaught runtime exception" },
            stdout: { type: import_genai.Type.STRING, description: "Exact console standard output" },
            stderr: { type: import_genai.Type.STRING, description: "Standard error or compiler error message" },
            exitCode: { type: import_genai.Type.INTEGER, description: "0 for success, 1 for compiler error, non-zero for runtime exception" },
            executionTimeMs: { type: import_genai.Type.INTEGER, description: "Simulated execution time in milliseconds (e.g. 60-250)" },
            compilationErrors: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  line: { type: import_genai.Type.INTEGER },
                  column: { type: import_genai.Type.INTEGER },
                  message: { type: import_genai.Type.STRING },
                  severity: { type: import_genai.Type.STRING }
                },
                required: ["line", "message", "severity"]
              }
            },
            explanation: { type: import_genai.Type.STRING, description: "Brief summary of what happened during execution" },
            executionSteps: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  stepNumber: { type: import_genai.Type.INTEGER },
                  lineNumber: { type: import_genai.Type.INTEGER },
                  codeLine: { type: import_genai.Type.STRING },
                  explanation: { type: import_genai.Type.STRING },
                  callStack: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        functionName: { type: import_genai.Type.STRING },
                        line: { type: import_genai.Type.INTEGER },
                        variables: { type: import_genai.Type.OBJECT }
                      },
                      required: ["functionName", "line", "variables"]
                    }
                  },
                  heapObjects: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        id: { type: import_genai.Type.STRING },
                        type: { type: import_genai.Type.STRING },
                        fields: { type: import_genai.Type.OBJECT }
                      },
                      required: ["id", "type", "fields"]
                    }
                  },
                  stdout: { type: import_genai.Type.STRING }
                },
                required: ["stepNumber", "lineNumber", "codeLine", "explanation", "callStack", "heapObjects", "stdout"]
              }
            }
          },
          required: ["success", "stdout", "stderr", "exitCode", "executionTimeMs", "compilationErrors"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return {
      success: !!parsed.success,
      stdout: parsed.stdout || "",
      stderr: parsed.stderr || "",
      exitCode: parsed.exitCode ?? (parsed.success ? 0 : 1),
      executionTimeMs: parsed.executionTimeMs || 85,
      compilationErrors: parsed.compilationErrors || [],
      explanation: parsed.explanation,
      executionSteps: parsed.executionSteps
    };
  } catch (err) {
    console.error("Gemini compilation error, falling back to local simulator:", err);
    return localJavaFallback(code, stdin);
  }
}
async function explainAndFixError(code, errorMessage) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      title: "Java Compiler Error Diagnostics",
      explanation: "Please check your syntax around the reported line number. Ensure all braces match and variables are declared before use.",
      mentalModel: "In Java, the compiler strictly verifies types and symbols before producing bytecode.",
      suggestedFix: code,
      diffSummary: "Review variable types and semicolons."
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
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            title: { type: import_genai.Type.STRING, description: 'Catchy name for the error, e.g. "Cannot find symbol: variable count"' },
            explanation: { type: import_genai.Type.STRING, description: "Plain English beginner-friendly explanation of why this happened" },
            mentalModel: { type: import_genai.Type.STRING, description: "How to conceptually visualize or remember this rule" },
            suggestedFix: { type: import_genai.Type.STRING, description: "Full corrected Java code that runs cleanly" },
            diffSummary: { type: import_genai.Type.STRING, description: "Summary of changes made" }
          },
          required: ["title", "explanation", "mentalModel", "suggestedFix", "diffSummary"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Error in explainAndFixError:", err);
    return {
      title: "Error Analysis",
      explanation: "The compiler reported: " + errorMessage,
      mentalModel: "Check that all types and methods match their definitions.",
      suggestedFix: code,
      diffSummary: "Manual inspection required."
    };
  }
}
async function askTutor(message, contextCode, history) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      reply: "Java is a statically-typed, object-oriented language. Try running the code in the compiler or checking the lessons tab!",
      codeSuggestion: void 0
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
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            reply: { type: import_genai.Type.STRING, description: "Markdown formatted tutor response" },
            codeSuggestion: { type: import_genai.Type.STRING, description: "Optional updated code snippet to paste into editor" }
          },
          required: ["reply"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Error in askTutor:", err);
    return {
      reply: "Java requires explicit declarations, static type checks, and class-based structure. Feel free to run your code to see the output!",
      codeSuggestion: void 0
    };
  }
}

// server.ts
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/compile", async (req, res) => {
    try {
      const { code, stdin, testCases } = req.body;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Code is required." });
      }
      const result = await executeJavaCode(code, stdin || "");
      if (testCases && Array.isArray(testCases) && testCases.length > 0) {
        const testResults = testCases.map((tc) => {
          const expected = (tc.expectedOutput || "").trim();
          const actual = (result.stdout || "").trim();
          const passed = result.success && (actual === expected || actual.includes(expected));
          return {
            name: tc.name || "Test Case",
            passed,
            expected,
            actual,
            input: tc.input || ""
          };
        });
        result.testResults = testResults;
      }
      res.json(result);
    } catch (err) {
      console.error("Error in /api/compile:", err);
      res.status(500).json({
        success: false,
        stdout: "",
        stderr: "Internal execution error: " + (err.message || "Unknown error"),
        exitCode: 1,
        executionTimeMs: 0,
        compilationErrors: []
      });
    }
  });
  app.post("/api/explain-error", async (req, res) => {
    try {
      const { code, errorMessage } = req.body;
      const diagnosis = await explainAndFixError(code || "", errorMessage || "");
      res.json(diagnosis);
    } catch (err) {
      console.error("Error in /api/explain-error:", err);
      res.status(500).json({ error: err.message || "Failed to explain error" });
    }
  });
  app.post("/api/tutor", async (req, res) => {
    try {
      const { message, contextCode, history } = req.body;
      const response = await askTutor(message || "", contextCode || "", history || []);
      res.json(response);
    } catch (err) {
      console.error("Error in /api/tutor:", err);
      res.status(500).json({ error: err.message || "Failed to query tutor" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Java Learning & Compiler Server running on http://localhost:${PORT} (bound to 0.0.0.0:${PORT})`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
