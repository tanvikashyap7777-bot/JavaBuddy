import React, { useRef, useState } from 'react';
import { highlightJava } from '../utils/javaSyntax';
import { Play, RotateCcw, Copy, Check, FileCode, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface JavaEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  isLoading: boolean;
  activeLine?: number;
  errorLines?: number[];
  onFormat?: () => void;
  onReset?: () => void;
}

const TEMPLATES = [
  {
    name: 'Hello World',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  {
    name: 'Interactive Scanner',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        if (scanner.hasNextLine()) {
            String name = scanner.nextLine();
            System.out.println("Welcome to Java, " + name + "!");
        } else {
            System.out.println("Hello from Java!");
        }
    }
}`
  },
  {
    name: 'OOP Class & Objects',
    code: `class Hero {
    private String name;
    private int health;
    private int power;

    public Hero(String name, int health, int power) {
        this.name = name;
        this.health = health;
        this.power = power;
    }

    public void attack(Hero target) {
        System.out.println(this.name + " strikes " + target.name + " for " + this.power + " damage!");
        target.takeDamage(this.power);
    }

    public void takeDamage(int damage) {
        this.health = Math.max(0, this.health - damage);
        System.out.println(this.name + " now has " + this.health + " HP remaining.");
    }
}

public class Main {
    public static void main(String[] args) {
        Hero knight = new Hero("Arthur", 100, 25);
        Hero dragon = new Hero("Smaug", 200, 40);

        knight.attack(dragon);
        dragon.attack(knight);
    }
}`
  },
  {
    name: 'ArrayList & Sorting',
    code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        numbers.add(42);
        numbers.add(15);
        numbers.add(88);
        numbers.add(7);
        numbers.add(23);

        System.out.println("Unsorted: " + numbers);
        Collections.sort(numbers);
        System.out.println("Sorted Ascending: " + numbers);
        Collections.reverse(numbers);
        System.out.println("Sorted Descending: " + numbers);
    }
}`
  },
  {
    name: 'Stream Pipeline',
    code: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<String> cities = Arrays.asList("Tokyo", "San Francisco", "London", "Sydney", "Toronto");

        List<String> result = cities.stream()
            .filter(city -> city.length() > 5)
            .map(String::toUpperCase)
            .sorted()
            .collect(Collectors.toList());

        System.out.println("Filtered & Uppercased Cities: " + result);
    }
}`
  }
];

// Quick Java symbols and snippets for mobile keyboard
const MOBILE_SYMBOLS = [
  { label: ';', insert: ';' },
  { label: '{ }', insert: '{\n    \n}', cursorOffset: -2 },
  { label: '( )', insert: '()', cursorOffset: -1 },
  { label: '[ ]', insert: '[]', cursorOffset: -1 },
  { label: '" "', insert: '""', cursorOffset: -1 },
  { label: '=', insert: ' = ' },
  { label: '.', insert: '.' },
  { label: '+', insert: ' + ' },
  { label: 'sout', insert: 'System.out.println();', cursorOffset: -2 },
  { label: 'for', insert: 'for (int i = 0; i < ; i++) {\n    \n}', cursorOffset: -17 },
  { label: 'if', insert: 'if () {\n    \n}', cursorOffset: -8 },
  { label: 'Tab', insert: '    ' }
];

export const JavaEditor: React.FC<JavaEditorProps> = ({
  code,
  onChange,
  onRun,
  isLoading,
  activeLine,
  errorLines = [],
  onReset
}) => {
  const [fontSize, setFontSize] = useState<number>(13);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Synchronize scrolling between textarea, highlighted pre, and line numbers
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab outdent
        const beforeCursor = code.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const currentLinePrefix = code.substring(lineStart, lineStart + 4);
        if (currentLinePrefix.startsWith('    ')) {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + 4);
          onChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, start - 4);
            textarea.selectionEnd = Math.max(lineStart, end - 4);
          }, 0);
        }
      } else {
        // Tab indent (4 spaces)
        const newCode = code.substring(0, start) + '    ' + code.substring(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
      return;
    }

    // Auto-close brackets and quotes
    const pairs: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        e.preventDefault();
        const selected = code.substring(start, end);
        const newCode = code.substring(0, start) + e.key + selected + pairs[e.key] + code.substring(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = end + 1;
        }, 0);
      }
    }
  };

  // Insert virtual symbol at current cursor position
  const handleInsertSymbol = (symbolInsert: string, cursorOffset: number = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + symbolInsert + code.substring(end);
    onChange(newCode);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + symbolInsert.length + cursorOffset;
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
    }, 10);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TEMPLATES.find(t => t.name === e.target.value);
    if (selected) {
      onChange(selected.code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-[#282828] border-b-2 sm:border-b-4 border-black gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Traffic light dots */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF521B] border border-black" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFD23F] border border-black" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#49BE25] border border-black" />
          </div>

          <div className="flex items-center space-x-1 bg-[#141414] px-2 py-0.5 sm:py-1 rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF8A8A]" />
            <span className="font-mono text-[11px] sm:text-xs font-bold text-white">Main.java</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Quick Template Selector */}
          <div className="flex items-center space-x-1">
            <select
              onChange={handleTemplateSelect}
              defaultValue=""
              className="bg-[#141414] text-[11px] sm:text-xs text-white font-bold border-2 border-black rounded-xl px-2 py-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
            >
              <option value="" disabled>Load Example...</option>
              {TEMPLATES.map(t => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Zoom controls (hidden on small mobile) */}
          <div className="hidden sm:flex items-center space-x-1 bg-[#141414] p-0.5 sm:p-1 rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-slate-300 font-mono font-bold px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(20, prev + 1))}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 bg-white text-black border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-rose-50"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#49BE25]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 bg-white text-black border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-rose-50"
              title="Reset to Starter Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Big Run Button */}
          <button
            id="run-code-button"
            onClick={onRun}
            disabled={isLoading}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold tracking-wide border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] brutal-btn ${
              isLoading
                ? 'bg-[#8B0000]/70 text-white cursor-not-allowed opacity-75'
                : 'bg-[#8B0000] text-white hover:bg-[#700000]'
            }`}
          >
            <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Compiling...' : 'Run ▶'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden font-mono bg-[#141414] min-h-[260px] sm:min-h-[340px]">
        
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-10 sm:w-12 py-3 bg-[#111111] text-slate-500 select-none text-right pr-2 sm:pr-3 font-mono border-r-2 border-black overflow-hidden flex-shrink-0"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.6}px` }}
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const lineNum = i + 1;
            const isStepActive = activeLine === lineNum;
            const isError = errorLines.includes(lineNum);
            return (
              <div
                key={i}
                className={`relative flex items-center justify-end ${
                  isStepActive 
                    ? 'text-[#FF8A8A] font-bold bg-[#8B0000]/30 -mr-2 sm:-mr-3 pr-2 sm:pr-3' 
                    : isError 
                    ? 'text-[#FF521B] font-bold bg-[#FF521B]/20 -mr-2 sm:-mr-3 pr-2 sm:pr-3' 
                    : ''
                }`}
              >
                {isStepActive && (
                  <span className="absolute left-0.5 text-[9px] text-[#FF8A8A]">▶</span>
                )}
                {isError && (
                  <span className="absolute left-0.5 text-[9px] text-[#FF521B] font-bold">✖</span>
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Code Display Layer (Syntax Highlighted) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 left-10 sm:left-12 p-3 overflow-hidden pointer-events-none whitespace-pre font-mono text-white"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.6}px` }}
          dangerouslySetInnerHTML={{ __html: highlightJava(code) + '<br/>' }}
        />

        {/* Interactive Textarea Layer */}
        <textarea
          ref={textareaRef}
          id="java-code-textarea"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 left-10 sm:left-12 p-3 bg-transparent text-transparent caret-[#8B0000] resize-none outline-none overflow-auto font-mono whitespace-pre selection:bg-[#8B0000]/40"
          style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.6}px` }}
        />
      </div>

      {/* Mobile Virtual Symbol Toolbar */}
      <div className="bg-[#1f1f1f] border-t-2 border-black px-2 py-1.5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider pl-1 pr-0.5 flex-shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span className="hidden xs:inline">Keys:</span>
        </span>
        {MOBILE_SYMBOLS.map((sym, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSymbol(sym.insert, sym.cursorOffset)}
            className="px-2.5 py-1 rounded-lg bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-mono text-xs font-bold border border-zinc-700 active:bg-[#8B0000] active:text-white flex-shrink-0 brutal-btn"
          >
            {sym.label}
          </button>
        ))}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-[#141414] border-t-2 border-black text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium">
        <div className="flex items-center space-x-2">
          <span className="text-rose-400 font-bold">OpenJDK 21</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>L: {lineCount}</span>
          <span>•</span>
          <span>Ch: {code.length}</span>
        </div>
      </div>
    </div>
  );
};

