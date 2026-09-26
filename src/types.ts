export type ActiveTab = 'learn' | 'compiler';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string; // Markdown or rich formatted text
  starterCode: string;
  expectedOutput?: string;
  quiz?: QuizQuestion[];
  exercise?: {
    instruction: string;
    starterCode: string;
    solutionCode: string;
    hint: string;
    testCases: TestCase[];
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  actualOutput?: string;
  passed?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: string;
  solutionCode?: string;
  hints: string[];
  testCases: TestCase[];
}

export interface ExecutionStep {
  stepNumber: number;
  lineNumber: number;
  codeLine: string;
  explanation: string;
  callStack: Array<{
    functionName: string;
    line: number;
    variables: Record<string, string | number | boolean | object>;
  }>;
  heapObjects: Array<{
    id: string;
    type: string;
    fields: Record<string, string | number | boolean | object>;
  }>;
  stdout: string;
}

export interface CompilationResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compilationErrors: Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
  executionTimeMs: number;
  exitCode: number;
  testResults?: Array<{
    name: string;
    passed: boolean;
    expected: string;
    actual: string;
    input: string;
  }>;
  explanation?: string;
  executionSteps?: ExecutionStep[];
}

export interface UserProgress {
  completedLessonIds: string[];
  completedChallengeIds: string[];
  quizScores: Record<string, number>;
  savedSnippets: SavedSnippet[];
  currentStreak: number;
  lastActiveDate: string;
  xp: number;
  bookmarkedLessons: string[];
}

export interface SavedSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  codeSnippet?: string;
}

export interface CheatSheetItem {
  id: string;
  category: string;
  title: string;
  syntax: string;
  description: string;
  example: string;
}
