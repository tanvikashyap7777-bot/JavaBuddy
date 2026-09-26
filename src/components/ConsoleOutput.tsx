import React, { useState } from 'react';
import { CompilationResult } from '../types';
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Check, 
  Trash2, 
  Keyboard, 
  Layers, 
  AlertTriangle
} from 'lucide-react';
import { MemoryVisualizer } from './MemoryVisualizer';

interface ConsoleOutputProps {
  result: CompilationResult | null;
  isLoading: boolean;
  stdin: string;
  setStdin: (val: string) => void;
  onClear: () => void;
  onStepChange?: (line: number | undefined) => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  isLoading,
  stdin,
  setStdin,
  onClear,
  onStepChange
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'stdin' | 'memory' | 'tests'>('output');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text = result.stdout || result.stderr || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasErrors = result && (!result.success || result.compilationErrors.length > 0 || !!result.stderr);
  const hasTests = result?.testResults && result.testResults.length > 0;
  const hasSteps = result?.executionSteps && result.executionSteps.length > 0;

  return (
    <div className="flex flex-col h-full bg-white border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Console Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border-b-2 sm:border-b-4 border-black gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
          <button
            onClick={() => setActiveConsoleTab('output')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-2 border-black transition-all brutal-btn flex-shrink-0 ${
              activeConsoleTab === 'output'
                ? 'bg-[#8B0000] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-rose-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('stdin')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-2 border-black transition-all brutal-btn flex-shrink-0 ${
              activeConsoleTab === 'stdin'
                ? 'bg-[#700000] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-rose-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Stdin</span>
            {stdin.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] border border-black ml-0.5" />
            )}
          </button>

          {hasSteps && (
            <button
              onClick={() => setActiveConsoleTab('memory')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-2 border-black transition-all brutal-btn flex-shrink-0 ${
                activeConsoleTab === 'memory'
                  ? 'bg-[#5C0000] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-rose-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Memory</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-[#8B0000] font-bold ml-0.5">
                {result?.executionSteps?.length}
              </span>
            </button>
          )}

          {hasTests && (
            <button
              onClick={() => setActiveConsoleTab('tests')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-2 border-black transition-all brutal-btn flex-shrink-0 ${
                activeConsoleTab === 'tests'
                  ? 'bg-[#49BE25] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-rose-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tests</span>
            </button>
          )}
        </div>

        {/* Right Status & Tools */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 text-xs">
          {result && (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {result.success ? (
                <div className="flex items-center space-x-1 text-black bg-[#49BE25] border-2 border-black px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Success</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-white bg-[#8B0000] border-2 border-black px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Exit {result.exitCode || 1}</span>
                </div>
              )}

              <div className="flex items-center space-x-1 text-black bg-white border-2 border-black px-1.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="w-3 h-3 text-slate-700" />
                <span>{result.executionTimeMs}ms</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              disabled={!result}
              className="p-1 sm:p-1.5 bg-white text-black border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-rose-50 disabled:opacity-30"
              title="Copy Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#49BE25]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClear}
              className="p-1 sm:p-1.5 bg-white text-black border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-rose-50"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#8B0000]" />
            </button>
          </div>
        </div>
      </div>

      {/* Console Content Area */}
      <div className="flex-1 p-3 sm:p-4 bg-[#141414] font-mono text-xs overflow-auto text-white min-h-[180px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-3">
            <div className="w-8 h-8 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-white font-bold text-sm">Compiling Java Code...</p>
              <p className="text-xs text-slate-400">Simulating JVM stack and standard I/O</p>
            </div>
          </div>
        ) : activeConsoleTab === 'stdin' ? (
          <div className="flex flex-col h-full space-y-2 font-sans">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span>Standard Input fed into `Scanner(System.in)`:</span>
              <span className="text-slate-400 font-mono text-[11px]">Sequential lines</span>
            </div>
            <textarea
              id="stdin-input"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input values here (e.g. name, numbers separated by newline)..."
              className="flex-1 w-full p-3 bg-white text-black border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none font-mono text-xs placeholder:text-slate-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        ) : activeConsoleTab === 'memory' && result?.executionSteps ? (
          <MemoryVisualizer
            steps={result.executionSteps}
            onStepChange={onStepChange}
          />
        ) : activeConsoleTab === 'tests' && result?.testResults ? (
          <div className="space-y-2.5 font-sans">
            {result.testResults.map((test, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  test.passed 
                    ? 'bg-[#49BE25]/20 text-[#49BE25]' 
                    : 'bg-[#FF521B]/20 text-[#FF521B]'
                }`}
              >
                <div className="flex items-center justify-between font-black mb-1">
                  <div className="flex items-center space-x-2">
                    {test.passed ? <CheckCircle2 className="w-4 h-4 text-[#49BE25]" /> : <XCircle className="w-4 h-4 text-[#FF521B]" />}
                    <span className="text-slate-100">{test.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-lg border-2 border-black ${
                    test.passed ? 'bg-[#49BE25] text-black' : 'bg-[#FF521B] text-white'
                  }`}>
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                {!test.passed && (
                  <div className="mt-2 text-xs space-y-1 text-slate-300 bg-[#111111] p-2.5 rounded-xl border border-black font-mono">
                    <div><span className="text-slate-500 font-bold">Expected:</span> <span className="text-[#49BE25] font-bold">{test.expected}</span></div>
                    <div><span className="text-slate-500 font-bold">Actual:</span> <span className="text-[#FF521B] font-bold">{test.actual || '(no output)'}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : result ? (
          <div className="space-y-2 select-text">
            {/* If Compilation Errors exist */}
            {result.compilationErrors && result.compilationErrors.length > 0 && (
              <div className="bg-[#FF521B]/20 border-2 border-[#FF521B] rounded-2xl p-3.5 text-[#FF521B] space-y-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-2 font-black text-sm uppercase text-[#FF521B] mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Compilation Error ({result.compilationErrors.length})</span>
                </div>
                {result.compilationErrors.map((err, i) => (
                  <div key={i} className="font-mono text-xs pl-2.5 border-l-2 border-[#FF521B] text-slate-200">
                    <span className="text-[#FFD23F] font-bold">Line {err.line}:</span> {err.message}
                  </div>
                ))}
              </div>
            )}

            {/* Standard Output */}
            {result.stdout && (
              <pre className="text-[#FDFCF0] whitespace-pre-wrap leading-relaxed">
                {result.stdout}
              </pre>
            )}

            {/* Standard Error */}
            {result.stderr && (!result.compilationErrors || result.compilationErrors.length === 0) && (
              <pre className="text-[#FF521B] whitespace-pre-wrap bg-[#FF521B]/10 p-3 rounded-xl border border-[#FF521B]/40">
                {result.stderr}
              </pre>
            )}

            {/* Empty Output notice */}
            {!result.stdout && !result.stderr && result.compilationErrors.length === 0 && (
              <div className="text-slate-400 italic py-6 text-center">
                Program completed successfully with no output to System.out.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 py-8 font-sans">
            <Terminal className="w-10 h-10 text-slate-600 mb-1" />
            <p className="text-slate-200 font-bold text-xs uppercase tracking-wider">Ready to compile Java code.</p>
            <p className="text-[11px] text-slate-500">Click &quot;Run (Ctrl+↵)&quot; to execute your program and see output.</p>
          </div>
        )}
      </div>
    </div>
  );
};
