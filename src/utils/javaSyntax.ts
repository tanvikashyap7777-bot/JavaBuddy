/**
 * Lightweight token-based Java syntax colorizer for the interactive code editor
 */

export function highlightJava(code: string): string {
  // Escape HTML entities first
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Placeholders for strings and comments to prevent nested token regex collision
  const placeholders: string[] = [];
  const placeholderPrefix = '___TOK_PH_';

  // 1. Comments (multi-line and single-line)
  html = html.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (match) => {
    const idx = placeholders.length;
    placeholders.push(`<span class="text-slate-400 italic">${match}</span>`);
    return `${placeholderPrefix}${idx}___`;
  });

  // 2. String and Character Literals
  html = html.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/g, (match) => {
    const idx = placeholders.length;
    placeholders.push(`<span class="text-[#FFB7C5] font-medium">${match}</span>`);
    return `${placeholderPrefix}${idx}___`;
  });

  // 3. Annotations
  html = html.replace(/@\w+/g, '<span class="text-[#FF8A8A] font-bold">$&</span>');

  // 4. Keywords
  const keywords = [
    'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'for',
    'goto', 'if', 'implements', 'import', 'instanceof', 'interface', 'native',
    'new', 'package', 'private', 'protected', 'public', 'record', 'return', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'try', 'var', 'void', 'volatile', 'while', 'yield', 'sealed', 'permits'
  ];
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  html = html.replace(keywordRegex, '<span class="text-[#4ADE80] font-bold">$&</span>');

  // 5. Types & Built-ins
  const types = [
    'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short',
    'String', 'Integer', 'Double', 'Float', 'Long', 'Short', 'Byte', 'Boolean', 'Character',
    'Object', 'System', 'Math', 'Arrays', 'Collections', 'Collectors', 'Stream',
    'List', 'ArrayList', 'LinkedList', 'Map', 'HashMap', 'TreeMap', 'LinkedHashMap',
    'Set', 'HashSet', 'TreeSet', 'Stack', 'Queue', 'Deque', 'ArrayDeque', 'PriorityQueue',
    'Scanner', 'Exception', 'RuntimeException', 'Throwable', 'Error', 'Override',
    'Optional', 'Function', 'Predicate', 'Consumer', 'Supplier', 'Runnable', 'Thread'
  ];
  const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
  html = html.replace(typeRegex, '<span class="text-[#93C5FD] font-bold">$&</span>');

  // 6. Booleans and Null
  html = html.replace(/\b(true|false|null)\b/g, '<span class="text-[#F87171] font-bold">$&</span>');

  // 7. Numbers (Hex, Octal, Binary, Floating point, standard integers)
  html = html.replace(/\b(0x[0-9a-fA-F]+|0b[01]+|\d+(\.\d+)?[fFdDlL]?)\b/g, '<span class="text-[#FCA5A5] font-semibold">$&</span>');

  // 8. Method invocations e.g. println(...)
  html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="text-[#FFFFFF] font-bold">$&</span>');

  // Restore placeholders
  placeholders.forEach((ph, idx) => {
    const key = `${placeholderPrefix}${idx}___`;
    html = html.replace(key, ph);
  });

  return html;
}
