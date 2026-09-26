import { Module } from '../types';

export const CURRICULUM_MODULES: Module[] = [
  {
    id: 'module-1',
    title: 'Java Basics & Fundamentals',
    description: 'Learn the core anatomy of Java programs, variables, data types, and operators.',
    icon: 'Terminal',
    lessons: [
      {
        id: 'lesson-1-1',
        moduleId: 'module-1',
        title: 'Anatomy of a Java Program',
        description: 'Understand class declarations, the main method, and how Java executes code.',
        durationMinutes: 10,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

Java is a **class-based, object-oriented, strictly typed** programming language. In Java, **every piece of executable code must reside inside a class**.

#### Key Terms & Definition:
- **Class**: A blueprint or container for data and methods. The filename must match the public class name (\`Main.java\`).
- **JVM (Java Virtual Machine)**: The runtime engine that loads, verifies, and executes compiled Java bytecode (\`.class\` files).
- **Entry Point (\`main\` method)**: The starting point where JVM starts executing the program.

#### Structure of the Main Method:
\`\`\`java
public static void main(String[] args)
\`\`\`

#### Keyword Breakdown:
- \`public\`: An access modifier that makes the class and method accessible from anywhere.
- \`static\`: Tells Java that this method belongs to the class itself, so JVM can invoke it without instantiating an object.
- \`void\`: Specifies that the method does not return any value.
- \`String[] args\`: An array that captures command-line arguments passed during execution.
- \`System.out.println(...)\`: Standard output stream method that prints text followed by a new line.`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Welcome to your first Java program!
        System.out.println("Hello, Java Master!");
        System.out.println("Java is strongly-typed and compiled to bytecode.");
    }
}`,
        expectedOutput: `Hello, Java Master!
Java is strongly-typed and compiled to bytecode.`,
        quiz: [
          {
            id: 'q1-1-1',
            question: 'What is the exact entry point method signature required by the JVM to run a Java application?',
            options: [
              'public void main(String args)',
              'public static void main(String[] args)',
              'static public int main(String[] args)',
              'public static main(String[] args)'
            ],
            correctIndex: 1,
            explanation: 'The JVM requires "public static void main(String[] args)" as the standard entry point signature.'
          },
          {
            id: 'q1-1-2',
            question: 'What happens if a Java file is named "Calculator.java" but the public class inside is named "MathUtils"?',
            options: [
              'It compiles and runs normally',
              'The JVM automatically renames the file',
              'A compilation error occurs because public class name must match file name',
              'It runs as an anonymous class'
            ],
            correctIndex: 2,
            explanation: 'In Java, the name of a public class must match the name of the file (including case sensitivity) with the .java extension.'
          }
        ],
        exercise: {
          instruction: 'Write a program that prints your name on the first line and your programming goal on the second line using System.out.println.',
          starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here:
        System.out.println("Alex");
        System.out.println("Master Java and build high-performance software!");
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Alex");
        System.out.println("Master Java and build high-performance software!");
    }
}`,
          hint: 'Use two consecutive System.out.println("...") statements inside the main method.',
          testCases: [
            {
              id: 'tc-1',
              name: 'Output has two lines',
              input: '',
              expectedOutput: 'Alex\nMaster Java and build high-performance software!'
            }
          ]
        }
      },
      {
        id: 'lesson-1-2',
        moduleId: 'module-1',
        title: 'Variables & Primitive Data Types',
        description: 'Explore the 8 primitive data types in Java, memory sizes, and variable declaration.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

A **Variable** is a named memory location reserved to store values of a specific data type during program execution.

Java is a **statically typed** language, meaning variable types are checked at compile time and cannot change dynamically.

#### The 8 Primitive Types in Java:
1. **\`byte\`**: 8-bit integer (-128 to 127)
2. **\`short\`**: 16-bit integer (-32,768 to 32,767)
3. **\`int\`**: 32-bit integer (-2,147,483,648 to 2,147,483,647) — *Default integer type*
4. **\`long\`**: 64-bit integer (requires \`L\` suffix, e.g. \`5000000000L\`)
5. **\`float\`**: 32-bit single-precision float (requires \`f\` suffix, e.g. \`3.14f\`)
6. **\`double\`**: 64-bit double-precision float — *Default decimal type*
7. **\`boolean\`**: Logical values: strictly \`true\` or \`false\`
8. **\`char\`**: 16-bit Unicode character enclosed in single quotes, e.g. \`'A'\`

#### Variable Declaration Syntax:
\`\`\`java
dataType variableName = initialValue;
\`\`\`

#### Type Casting Rules:
- **Widening (Automatic/Implicit)**: Smaller type to larger type (e.g. \`int\` -> \`double\`). No loss of precision.
- **Narrowing (Explicit/Manual)**: Larger type to smaller type (e.g. \`(int) 9.78\` results in \`9\`, truncating the fractional part).`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        // Declare and initialize primitive variables
        int age = 24;
        double gpa = 3.85;
        char grade = 'A';
        boolean isEnrolled = true;
        long population = 8000000000L;
        
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        System.out.println("Grade: " + grade);
        System.out.println("Enrolled: " + isEnrolled);
        System.out.println("World Population: " + population);
        
        // Type casting demonstration
        double rawScore = 95.8;
        int roundedScore = (int) rawScore; // Narrowing cast (truncates decimal)
        System.out.println("Truncated Score: " + roundedScore);
    }
}`,
        expectedOutput: `Age: 24
GPA: 3.85
Grade: A
Enrolled: true
World Population: 8000000000
Truncated Score: 95`,
        quiz: [
          {
            id: 'q1-2-1',
            question: 'Which of the following data types uses 64 bits and stores decimal numbers by default in Java?',
            options: ['float', 'long', 'double', 'BigDecimal'],
            correctIndex: 2,
            explanation: 'In Java, double is a 64-bit IEEE 754 floating point number and is the default type for fractional numbers.'
          },
          {
            id: 'q1-2-2',
            question: 'What is the result of casting (int) 7.99 in Java?',
            options: ['8', '7', '7.99', 'Compilation Error'],
            correctIndex: 1,
            explanation: 'Casting a floating-point number to an integer in Java truncates the decimal portion, resulting in 7.'
          }
        ],
        exercise: {
          instruction: 'Declare an integer variable `celsius` with value 25, convert it to Fahrenheit using the formula `(celsius * 9 / 5) + 32`, and print "Fahrenheit: " followed by the result.',
          starterCode: `public class Main {
    public static void main(String[] args) {
        int celsius = 25;
        int fahrenheit = (celsius * 9 / 5) + 32;
        System.out.println("Fahrenheit: " + fahrenheit);
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        int celsius = 25;
        int fahrenheit = (celsius * 9 / 5) + 32;
        System.out.println("Fahrenheit: " + fahrenheit);
    }
}`,
          hint: 'Declare `int fahrenheit = (celsius * 9 / 5) + 32;` and print with `System.out.println("Fahrenheit: " + fahrenheit);`',
          testCases: [
            {
              id: 'tc-2',
              name: '25 Celsius to Fahrenheit',
              input: '',
              expectedOutput: 'Fahrenheit: 77'
            }
          ]
        }
      },
      {
        id: 'lesson-1-3',
        moduleId: 'module-1',
        title: 'Operators & Expressions',
        description: 'Master arithmetic, relational, logical, bitwise, and ternary operators.',
        durationMinutes: 12,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

**Operators** are special symbols in Java that perform specific mathematical, logical, or relational operations on one, two, or three operands.

#### 1. Arithmetic Operators
- \`+\` (Addition), \`-\` (Subtraction), \`*\` (Multiplication)
- \`/\` (Division: integer division \`7 / 2\` truncates to \`3\`)
- \`%\` (Modulo: returns the division remainder, \`7 % 2 = 1\`)

#### 2. Relational & Comparison Operators
- \`==\` (Equal to), \`!=\` (Not equal to)
- \`>\` (Greater than), \`<\` (Less than), \`>=\`, \`<=\`

#### 3. Logical Operators (Short-Circuit Evaluation)
- \`&&\` (Logical AND): true only if both expressions evaluate to true.
- \`||\` (Logical OR): true if at least one expression is true.
- \`!\` (Logical NOT): reverses the boolean value.

#### 4. Ternary Operator (Inline Condition)
\`\`\`java
variable = (condition) ? valueIfTrue : valueIfFalse;
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        
        System.out.println("Addition: " + (a + b));
        System.out.println("Integer Division: " + (a / b));
        System.out.println("Modulo (Remainder): " + (a % b));
        
        // Exact floating point division
        double exact = (double) a / b;
        System.out.println("Exact Division: " + exact);
        
        // Ternary operator
        int age = 18;
        String status = (age >= 18) ? "Eligible to vote" : "Too young";
        System.out.println("Voter status: " + status);
    }
}`,
        expectedOutput: `Addition: 19
Integer Division: 3
Modulo (Remainder): 3
Exact Division: 3.75
Voter status: Eligible to vote`,
        quiz: [
          {
            id: 'q1-3-1',
            question: 'What is the output of 17 % 5 in Java?',
            options: ['3.4', '3', '2', '1'],
            correctIndex: 2,
            explanation: '17 divided by 5 is 3 with a remainder of 2 (5 * 3 = 15; 17 - 15 = 2).'
          }
        ],
        exercise: {
          instruction: 'Write a program that checks if an integer `number = 14` is even or odd using the modulo `%` operator and ternary operator, then prints "14 is Even" or "14 is Odd".',
          starterCode: `public class Main {
    public static void main(String[] args) {
        int number = 14;
        String result = (number % 2 == 0) ? "Even" : "Odd";
        System.out.println(number + " is " + result);
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        int number = 14;
        String result = (number % 2 == 0) ? "Even" : "Odd";
        System.out.println(number + " is " + result);
    }
}`,
          hint: 'Use `(number % 2 == 0) ? "Even" : "Odd"` and print with `System.out.println(number + " is " + result);`',
          testCases: [
            {
              id: 'tc-3',
              name: 'Even number check',
              input: '',
              expectedOutput: '14 is Even'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Control Flow & Logic',
    description: 'Learn conditional branching (if-else, switch) and looping constructs (for, while, do-while).',
    icon: 'GitBranch',
    lessons: [
      {
        id: 'lesson-2-1',
        moduleId: 'module-2',
        title: 'Conditional Branching: if, else if, else & Switch',
        description: 'Control execution paths using conditions and modern enhanced switch expressions.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

**Control Flow** refers to the order in which individual statements or instructions are executed in a program. **Conditionals** allow the computer to make decisions and execute different blocks of code depending on whether a condition evaluates to \`true\` or \`false\`.

#### 1. \`if-else if-else\` Statement
Evaluates conditions sequentially from top to bottom:
\`\`\`java
if (condition1) {
    // code block 1
} else if (condition2) {
    // code block 2
} else {
    // fallback block
}
\`\`\`

#### 2. Modern Enhanced \`switch\` (Java 14+)
Modern Java supports arrow labels (\`->\`) that automatically prevent fall-through without requiring explicit \`break\` statements:
\`\`\`java
String result = switch (day) {
    case "Monday", "Friday" -> "Busy";
    case "Sunday" -> "Rest";
    default -> "Normal";
};
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int dayNumber = 3;
        
        // Modern Enhanced Switch
        String dayName = switch (dayNumber) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6 -> "Saturday";
            case 7 -> "Sunday";
            default -> "Unknown";
        };
        
        System.out.println("Day " + dayNumber + " is " + dayName);
        
        // Conditional Check
        if (dayNumber >= 1 && dayNumber <= 5) {
            System.out.println("It's a productive working day!");
        } else {
            System.out.println("Time to rest and recharge!");
        }
    }
}`,
        expectedOutput: `Day 3 is Wednesday
It's a productive working day!`,
        quiz: [
          {
            id: 'q2-1-1',
            question: 'What is the purpose of the "default" case in a switch statement?',
            options: [
              'It executes only before any other case',
              'It executes when no other case matches the condition',
              'It restarts the switch statement',
              'It terminates the JVM'
            ],
            correctIndex: 1,
            explanation: 'The default case acts as the catch-all branch when none of the specified case values match.'
          }
        ],
        exercise: {
          instruction: 'Write a program with an integer `score = 88`. Use `if-else` to assign and print: "Grade: A" for score >= 90, "Grade: B" for score >= 80, and "Grade: C" otherwise.',
          starterCode: `public class Main {
    public static void main(String[] args) {
        int score = 88;
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C");
        }
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        int score = 88;
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C");
        }
    }
}`,
          hint: 'Use `if (score >= 90)` followed by `else if (score >= 80)`.' ,
          testCases: [
            {
              id: 'tc-4',
              name: 'Score 88 gives Grade B',
              input: '',
              expectedOutput: 'Grade: B'
            }
          ]
        }
      },
      {
        id: 'lesson-2-2',
        moduleId: 'module-2',
        title: 'Loops: for, while, do-while & Loop Control',
        description: 'Iterate efficiently over ranges and collections with loop control statements.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

A **Loop** is a programming construct that executes a block of code repeatedly as long as a specified condition remains true.

#### Types of Loops in Java:
1. **\`for\` Loop**: Ideal when the number of iterations is known beforehand.
\`\`\`java
for (initialization; condition; update) { ... }
\`\`\`

2. **\`while\` Loop**: Evaluates condition **before** entering the loop body. If false initially, body never runs.
\`\`\`java
while (condition) { ... }
\`\`\`

3. **\`do-while\` Loop**: Evaluates condition **after** executing the body, guaranteeing **at least one** execution.
\`\`\`java
do { ... } while (condition);
\`\`\`

#### Loop Control Statements:
- **\`break\`**: Terminate and jump out of the loop immediately.
- **\`continue\`**: Skip the remainder of the current iteration and proceed to the next cycle.`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("--- Even numbers from 2 to 10 ---");
        for (int i = 2; i <= 10; i += 2) {
            System.out.print(i + " ");
        }
        System.out.println();
        
        System.out.println("\n--- Summing numbers 1 to 5 with while ---");
        int sum = 0;
        int n = 1;
        while (n <= 5) {
            sum += n;
            n++;
        }
        System.out.println("Sum is: " + sum);
        
        System.out.println("\n--- Skipping multiples of 3 with continue ---");
        for (int k = 1; k <= 7; k++) {
            if (k % 3 == 0) continue;
            System.out.print(k + " ");
        }
        System.out.println();
    }
}`,
        expectedOutput: `--- Even numbers from 2 to 10 ---
2 4 6 8 10 

--- Summing numbers 1 to 5 with while ---
Sum is: 15

--- Skipping multiples of 3 with continue ---
1 2 4 5 7 `,
        quiz: [
          {
            id: 'q2-2-1',
            question: 'Which loop is guaranteed to execute its code block at least once, even if the condition is initially false?',
            options: ['for loop', 'while loop', 'do-while loop', 'enhanced for-each loop'],
            correctIndex: 2,
            explanation: 'The do-while loop evaluates its condition at the bottom of the loop body, guaranteeing at least one execution.'
          }
        ],
        exercise: {
          instruction: 'Write a for loop that calculates and prints the product (factorial) of numbers from 1 to 5 (1 * 2 * 3 * 4 * 5 = 120).',
          starterCode: `public class Main {
    public static void main(String[] args) {
        int product = 1;
        for (int i = 1; i <= 5; i++) {
            product *= i;
        }
        System.out.println("Factorial of 5: " + product);
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        int product = 1;
        for (int i = 1; i <= 5; i++) {
            product *= i;
        }
        System.out.println("Factorial of 5: " + product);
    }
}`,
          hint: 'Initialize `int product = 1;` and use `product *= i;` inside the loop.',
          testCases: [
            {
              id: 'tc-5',
              name: 'Factorial of 5 is 120',
              input: '',
              expectedOutput: 'Factorial of 5: 120'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Arrays, Strings & Memory',
    description: 'Master fixed-size arrays, multi-dimensional grids, String immutability, and StringBuilder.',
    icon: 'Layers',
    lessons: [
      {
        id: 'lesson-3-1',
        moduleId: 'module-3',
        title: 'Arrays in Java',
        description: 'Create, populate, iterate, and search through one-dimensional and two-dimensional arrays.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: `### 📖 Definition & Core Concepts

An **Array** is a fixed-size, contiguous sequence of elements belonging to the exact same data type. In Java, arrays are objects allocated in heap memory.

#### Core Rules of Java Arrays:
- **0-indexed**: The first element is at index \`0\`, and the last element is at \`length - 1\`.
- **Fixed Size**: Once instantiated, an array's length cannot change.
- **\`array.length\`**: A public final property (not a method) containing the total number of slots.
- **\`ArrayIndexOutOfBoundsException\`**: Thrown at runtime if accessing an index outside \`0\` to \`length - 1\`.

#### Array Creation Syntax:
\`\`\`java
// Method 1: New allocation with default zero values
int[] numbers = new int[5];

// Method 2: Array literal initialization
int[] primes = {2, 3, 5, 7, 11};
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int[] scores = {88, 92, 79, 95, 84};
        
        // Calculate average and find maximum
        int sum = 0;
        int max = scores[0];
        
        for (int score : scores) {
            sum += score;
            if (score > max) {
                max = score;
            }
        }
        
        double average = (double) sum / scores.length;
        System.out.println("Number of tests: " + scores.length);
        System.out.println("Average Score: " + average);
        System.out.println("Highest Score: " + max);
        
        // 2D Array Matrix
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        System.out.println("Center element matrix[1][1]: " + matrix[1][1]);
    }
}`,
        expectedOutput: `Number of tests: 5
Average Score: 87.6
Highest Score: 95
Center element matrix[1][1]: 5`,
        quiz: [
          {
            id: 'q3-1-1',
            question: 'How do you obtain the number of elements in an array named `data` in Java?',
            options: ['data.length()', 'data.size()', 'data.length', 'data.count'],
            correctIndex: 2,
            explanation: 'For Java arrays, length is a public final field, so data.length (without parentheses) is used.'
          }
        ],
        exercise: {
          instruction: 'Create an integer array `{10, 20, 30, 40, 50}`, calculate the total sum of all elements using a loop, and print "Sum: " followed by the total.',
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[] values = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int v : values) {
            sum += v;
        }
        System.out.println("Sum: " + sum);
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        int[] values = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int v : values) {
            sum += v;
        }
        System.out.println("Sum: " + sum);
    }
}`,
          hint: 'Use an enhanced for-each loop: `for (int v : values) { sum += v; }`',
          testCases: [
            {
              id: 'tc-6',
              name: 'Sum of array elements is 150',
              input: '',
              expectedOutput: 'Sum: 150'
            }
          ]
        }
      },
      {
        id: 'lesson-3-2',
        moduleId: 'module-3',
        title: 'Strings & StringBuilder',
        description: 'Understand String pool, immutability, common string methods, and efficient mutation.',
        durationMinutes: 15,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

In Java, **\`String\`** is an object representing an immutable sequence of Unicode characters.

#### Core Rules of Java Strings:
- **Immutability**: Once created, a \`String\` object's internal character array cannot be modified. Any method like \`.toUpperCase()\` or concatenation returns a *new* String object.
- **String Constant Pool**: Memory optimization in Heap where identical string literals share memory references.
- **Equality**: Never compare strings with \`==\` (which compares memory addresses). Always use \`.equals()\` to compare character contents!
- **\`StringBuilder\`**: A mutable sequence of characters designed for fast, high-performance string manipulation inside loops.`,
        starterCode: `public class Main {
    public static void main(String[] args) {
        String greeting = "  Hello, Java World!  ";
        
        System.out.println("Original: '" + greeting + "'");
        System.out.println("Trimmed: '" + greeting.trim() + "'");
        System.out.println("Uppercase: " + greeting.toUpperCase().trim());
        System.out.println("Substring (0 to 5): " + greeting.trim().substring(0, 5));
        System.out.println("Contains 'Java': " + greeting.contains("Java"));
        System.out.println("Replaced: " + greeting.trim().replace("World", "Universe"));
        
        // Fast String Building
        StringBuilder sb = new StringBuilder();
        sb.append("Build");
        sb.append("-");
        sb.append("Run");
        sb.append("-");
        sb.append("Succeed");
        
        System.out.println("StringBuilder output: " + sb.toString());
        System.out.println("Reversed: " + sb.reverse().toString());
    }
}`,
        expectedOutput: `Original: '  Hello, Java World!  '
Trimmed: 'Hello, Java World!'
Uppercase: HELLO, JAVA WORLD!
Substring (0 to 5): Hello
Contains 'Java': true
Replaced: Hello, Java Universe!
StringBuilder output: Build-Run-Succeed
Reversed: deeccuS-nuR-dliuB`,
        quiz: [
          {
            id: 'q3-2-1',
            question: 'Why should you use s1.equals(s2) instead of s1 == s2 when comparing strings in Java?',
            options: [
              '== does not compile in Java',
              '== compares memory reference addresses, while .equals() compares the actual text content',
              '.equals() modifies s1 to match s2',
              'There is no difference'
            ],
            correctIndex: 1,
            explanation: 'In Java, == checks if both references point to the exact same object in memory, while .equals() checks if the sequence of characters is identical.'
          }
        ],
        exercise: {
          instruction: 'Create a StringBuilder, append "Java", " ", and "Programming", then print the result and its reversed version.',
          starterCode: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("Java").append(" ").append("Programming");
        System.out.println("Text: " + sb.toString());
        System.out.println("Reversed: " + sb.reverse().toString());
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("Java").append(" ").append("Programming");
        System.out.println("Text: " + sb.toString());
        System.out.println("Reversed: " + sb.reverse().toString());
    }
}`,
          hint: 'Use `sb.append("...")` and `sb.reverse().toString()`.' ,
          testCases: [
            {
              id: 'tc-7',
              name: 'Appends and reverses string',
              input: '',
              expectedOutput: 'Text: Java Programming\nReversed: gnimmargorP avaJ'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Object-Oriented Programming (OOP)',
    description: 'Master the 4 pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    icon: 'Box',
    lessons: [
      {
        id: 'lesson-4-1',
        moduleId: 'module-4',
        title: 'Classes, Objects & Constructors',
        description: 'Define custom classes, instance variables, methods, constructors, and the this keyword.',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

**Object-Oriented Programming (OOP)** is a paradigm based on the concept of **Objects**, which bundle state (attributes) and behavior (methods) together.

#### Core Definitions:
- **Class**: A user-defined template or blueprint.
- **Object**: A concrete instance of a class allocated in memory using the \`new\` keyword.
- **Constructor**: A special method called automatically when creating an object to initialize its state. It has **no return type** and shares the class name.
- **\`this\` Keyword**: A reference pointing to the current instance invoking the method or constructor.`,
        starterCode: `class Student {
    private String name;
    private int id;
    private double gpa;
    
    // Constructor
    public Student(String name, int id, double gpa) {
        this.name = name;
        this.id = id;
        this.gpa = gpa;
    }
    
    public void printReport() {
        System.out.println("Student: " + this.name + " (ID: #" + this.id + ") - GPA: " + this.gpa);
    }
    
    public boolean isHonorRoll() {
        return this.gpa >= 3.5;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Alice Johnson", 101, 3.9);
        Student s2 = new Student("Bob Smith", 102, 3.2);
        
        s1.printReport();
        System.out.println("Alice Honor Roll? " + s1.isHonorRoll());
        
        s2.printReport();
        System.out.println("Bob Honor Roll? " + s2.isHonorRoll());
    }
}`,
        expectedOutput: `Student: Alice Johnson (ID: #101) - GPA: 3.9
Alice Honor Roll? true
Student: Bob Smith (ID: #102) - GPA: 3.2
Bob Honor Roll? false`,
        quiz: [
          {
            id: 'q4-1-1',
            question: 'What is the return type of a constructor in Java?',
            options: ['void', 'int', 'The class type itself', 'Constructors have no return type'],
            correctIndex: 3,
            explanation: 'Constructors in Java have no return type (not even void), and their name must exactly match the class name.'
          }
        ],
        exercise: {
          instruction: 'Create a `Book` class with fields `title` and `price`. Add a constructor and a method `display()` that prints "Book: [title] | Price: $[price]". Instantiate it in main and call display.',
          starterCode: `class Book {
    private String title;
    private double price;

    public Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    public void display() {
        System.out.println("Book: " + title + " | Price: $" + price);
    }
}

public class Main {
    public static void main(String[] args) {
        Book myBook = new Book("Effective Java", 45.0);
        myBook.display();
    }
}`,
          solutionCode: `class Book {
    private String title;
    private double price;

    public Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    public void display() {
        System.out.println("Book: " + title + " | Price: $" + price);
    }
}

public class Main {
    public static void main(String[] args) {
        Book myBook = new Book("Effective Java", 45.0);
        myBook.display();
    }
}`,
          hint: 'Instantiate using `new Book("Effective Java", 45.0)` and invoke `myBook.display();`' ,
          testCases: [
            {
              id: 'tc-8',
              name: 'Book display output',
              input: '',
              expectedOutput: 'Book: Effective Java | Price: $45.0'
            }
          ]
        }
      },
      {
        id: 'lesson-4-2',
        moduleId: 'module-4',
        title: 'Inheritance & Polymorphism',
        description: 'Extend classes with extends, use super, override methods with @Override, and dynamic method dispatch.',
        durationMinutes: 20,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

#### 1. Inheritance (\`extends\`)
**Inheritance** is a mechanism where a new class (subclass/child) adopts attributes and behaviors from an existing class (superclass/parent), promoting code reusability. Java supports single inheritance for classes.

#### 2. Polymorphism (Dynamic Method Dispatch)
**Polymorphism** means "many forms". It allows a parent class reference variable to hold any child class object. At runtime, Java automatically invokes the child's overridden method.

#### Key Keywords:
- **\`extends\`**: Specifies the superclass being inherited.
- **\`@Override\`**: Compiler annotation confirming a method is overriding a parent definition.
- **\`super\`**: Accesses parent class constructors or parent method implementations.`,
        starterCode: `abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    public abstract double calculateArea();
    
    public void describe() {
        System.out.println("I am a " + color + " shape with area = " + calculateArea());
    }
}

class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = new Shape[] {
            new Circle("Red", 3.0),
            new Rectangle("Blue", 4.0, 5.0)
        };
        
        for (Shape s : shapes) {
            s.describe();
        }
    }
}`,
        expectedOutput: `I am a Red shape with area = 28.274333882308138
I am a Blue shape with area = 20.0`,
        quiz: [
          {
            id: 'q4-2-1',
            question: 'Can you instantiate an abstract class using the "new" keyword directly in Java?',
            options: ['Yes, always', 'No, abstract classes cannot be directly instantiated', 'Only if it has no abstract methods', 'Only inside the main method'],
            correctIndex: 1,
            explanation: 'Abstract classes serve as blueprints and cannot be directly instantiated with "new Shape()". You must instantiate concrete subclasses.'
          }
        ],
        exercise: {
          instruction: 'Create a base class `Vehicle` with method `startEngine()` printing "Engine started", and a subclass `Car` that overrides it to print "Car V8 engine roaring!". Test polymorphism in main.',
          starterCode: `class Vehicle {
    public void startEngine() {
        System.out.println("Engine started");
    }
}

class Car extends Vehicle {
    @Override
    public void startEngine() {
        System.out.println("Car V8 engine roaring!");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car();
        v.startEngine();
    }
}`,
          solutionCode: `class Vehicle {
    public void startEngine() {
        System.out.println("Engine started");
    }
}

class Car extends Vehicle {
    @Override
    public void startEngine() {
        System.out.println("Car V8 engine roaring!");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car();
        v.startEngine();
    }
}`,
          hint: 'Use `Vehicle v = new Car();` and call `v.startEngine();`' ,
          testCases: [
            {
              id: 'tc-9',
              name: 'Car engine roaring',
              input: '',
              expectedOutput: 'Car V8 engine roaring!'
            }
          ]
        }
      },
      {
        id: 'lesson-4-3',
        moduleId: 'module-4',
        title: 'Interfaces & Multiple Contract Implementation',
        description: 'Define contracts using interface, default/static methods, and implement multiple interfaces.',
        durationMinutes: 18,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

An **Interface** in Java is a completely abstract type used to specify a contract or behavior that implementing classes must fulfill.

#### Core Rules of Java Interfaces:
- A class can implement **multiple interfaces** (overcoming single-inheritance limits).
- All method declarations are implicitly \`public abstract\` (unless declared \`default\` or \`static\`).
- All variables in an interface are implicitly \`public static final\` (constants).
- **Default Methods (Java 8+)**: Allows interfaces to have method implementations using the \`default\` keyword.`,
        starterCode: `interface PaymentMethod {
    void pay(double amount);
    
    // Default method (Java 8+)
    default void printReceipt(double amount) {
        System.out.println("Receipt: Processed payment of $" + amount);
    }
}

class CreditCard implements PaymentMethod {
    private String cardNumber;
    
    public CreditCard(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " using Credit Card ending in " + cardNumber.substring(cardNumber.length() - 4));
        printReceipt(amount);
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentMethod card = new CreditCard("1234567890123456");
        card.pay(49.99);
    }
}`,
        expectedOutput: `Paid $49.99 using Credit Card ending in 3456
Receipt: Processed payment of $49.99`,
        quiz: [
          {
            id: 'q4-3-1',
            question: 'How many interfaces can a single Java class implement?',
            options: ['Only 1', 'Up to 2', 'Unlimited / Multiple', '0'],
            correctIndex: 2,
            explanation: 'While Java supports single class inheritance, a class can implement as many interfaces as required (e.g. implements A, B, C).'
          }
        ],
        exercise: {
          instruction: 'Create an interface `Playable` with method `play()`. Implement it in a `Guitar` class that prints "Playing acoustic chords!". Test it in main.',
          starterCode: `interface Playable {
    void play();
}

class Guitar implements Playable {
    @Override
    public void play() {
        System.out.println("Playing acoustic chords!");
    }
}

public class Main {
    public static void main(String[] args) {
        Playable instrument = new Guitar();
        instrument.play();
    }
}`,
          solutionCode: `interface Playable {
    void play();
}

class Guitar implements Playable {
    @Override
    public void play() {
        System.out.println("Playing acoustic chords!");
    }
}

public class Main {
    public static void main(String[] args) {
        Playable instrument = new Guitar();
        instrument.play();
    }
}`,
          hint: 'Use `class Guitar implements Playable` and override `public void play()`',
          testCases: [
            {
              id: 'tc-10',
              name: 'Guitar plays acoustic chords',
              input: '',
              expectedOutput: 'Playing acoustic chords!'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Collections Framework & Generics',
    description: 'Learn ArrayList, LinkedList, HashMap, HashSet, and type-safe Generics.',
    icon: 'Database',
    lessons: [
      {
        id: 'lesson-5-1',
        moduleId: 'module-5',
        title: 'List & Set Collections (ArrayList vs HashSet)',
        description: 'Explore dynamic arrays with ArrayList and unique value sets with HashSet.',
        durationMinutes: 18,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

The **Java Collections Framework** provides ready-made architecture for storing and manipulating groups of objects.

#### 1. \`ArrayList<E>\` (Dynamic Array)
- Resizable array that grows dynamically as elements are added.
- Preserves **insertion order** and allows **duplicates**.
- \`O(1)\` fast index-based lookup (\`.get(i)\`).

#### 2. \`HashSet<E>\` (Mathematical Set)
- Stores **unique elements only** (automatically eliminates duplicates).
- Fast lookup, insertion, and deletion: Average \`O(1)\` time via hash codes.
- Does **not** guarantee element ordering.`,
        starterCode: `import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        // 1. ArrayList demonstration
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        fruits.add("Apple"); // duplicate allowed
        
        System.out.println("ArrayList size: " + fruits.size());
        System.out.println("Element at index 1: " + fruits.get(1));
        System.out.println("All fruits: " + fruits);
        
        // 2. HashSet demonstration (eliminates duplicates)
        Set<String> uniqueFruits = new HashSet<>(fruits);
        System.out.println("\nHashSet (unique only): " + uniqueFruits);
        System.out.println("Contains 'Banana'? " + uniqueFruits.contains("Banana"));
    }
}`,
        expectedOutput: `ArrayList size: 4
Element at index 1: Banana
All fruits: [Apple, Banana, Orange, Apple]

HashSet (unique only): [Apple, Banana, Orange]
Contains 'Banana'? true`,
        quiz: [
          {
            id: 'q5-1-1',
            question: 'What happens when you attempt to add a duplicate element into a HashSet in Java?',
            options: [
              'An exception is thrown',
              'The duplicate is added to the end',
              'The add() method returns false and the set remains unchanged',
              'All existing elements are deleted'
            ],
            correctIndex: 2,
            explanation: 'HashSet rejects duplicates gracefully: the add() method returns false and does not store the duplicate.'
          }
        ],
        exercise: {
          instruction: 'Create an `ArrayList<Integer>`, add numbers `[5, 10, 15, 20]`, remove the number at index 0, and print the updated list.',
          starterCode: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(5);
        list.add(10);
        list.add(15);
        list.add(20);
        list.remove(0);
        System.out.println("Updated List: " + list);
    }
}`,
          solutionCode: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(5);
        list.add(10);
        list.add(15);
        list.add(20);
        list.remove(0);
        System.out.println("Updated List: " + list);
    }
}`,
          hint: 'Use `list.remove(0);` and print `System.out.println("Updated List: " + list);`' ,
          testCases: [
            {
              id: 'tc-11',
              name: 'List after removal',
              input: '',
              expectedOutput: 'Updated List: [10, 15, 20]'
            }
          ]
        }
      },
      {
        id: 'lesson-5-2',
        moduleId: 'module-5',
        title: 'Key-Value Mapping with HashMap',
        description: 'Store and retrieve associations efficiently with HashMap in O(1) average time.',
        durationMinutes: 18,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

A **\`HashMap<K, V>\`** is a hash table-based implementation of the \`Map\` interface that stores key-value pairings.

#### Key Characteristics:
- **Keys are unique**: Inserting an existing key replaces its old value.
- **Fast Performance**: Average \`O(1)\` time complexity for \`put()\` and \`get()\` operations.
- **Common Methods**:
  - \`map.put(key, value)\`: Insert or update a key-value entry.
  - \`map.get(key)\`: Retrieve value for a key (or \`null\` if missing).
  - \`map.containsKey(key)\`: Check if a key exists in \`O(1)\`.
  - \`map.getOrDefault(key, fallback)\`: Return value or fallback default.`,
        starterCode: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> inventory = new HashMap<>();
        
        inventory.put("Laptops", 15);
        inventory.put("Keyboards", 42);
        inventory.put("Monitors", 28);
        
        // Update an item
        inventory.put("Laptops", 18);
        
        System.out.println("Inventory map: " + inventory);
        System.out.println("Keyboard count: " + inventory.get("Keyboards"));
        System.out.println("Mice count (fallback): " + inventory.getOrDefault("Mice", 0));
        
        // Iterating over entries
        System.out.println("\n--- Stock Summary ---");
        for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
            System.out.println("Item: " + entry.getKey() + " -> In Stock: " + entry.getValue());
        }
    }
}`,
        expectedOutput: `Inventory map: {Keyboards=42, Laptops=18, Monitors=28}
Keyboard count: 42
Mice count (fallback): 0

--- Stock Summary ---
Item: Keyboards -> In Stock: 42
Item: Laptops -> In Stock: 18
Item: Monitors -> In Stock: 28`,
        quiz: [
          {
            id: 'q5-2-1',
            question: 'What is the average time complexity for HashMap get() and put() operations in Java?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
            correctIndex: 2,
            explanation: 'HashMap uses hashing to compute bucket indices, achieving O(1) constant time average performance for lookups and insertions.'
          }
        ],
        exercise: {
          instruction: 'Create a `HashMap<String, Double>` for student grades: add "Alice" -> 95.0, "Bob" -> 88.5, and print Alice\'s grade.',
          starterCode: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Double> grades = new HashMap<>();
        grades.put("Alice", 95.0);
        grades.put("Bob", 88.5);
        System.out.println("Alice's Grade: " + grades.get("Alice"));
    }
}`,
          solutionCode: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Double> grades = new HashMap<>();
        grades.put("Alice", 95.0);
        grades.put("Bob", 88.5);
        System.out.println("Alice's Grade: " + grades.get("Alice"));
    }
}`,
          hint: 'Use `grades.get("Alice")` to retrieve Alice\'s grade.',
          testCases: [
            {
              id: 'tc-12',
              name: 'Alice grade output',
              input: '',
              expectedOutput: "Alice's Grade: 95.0"
            }
          ]
        }
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Exception Handling & Robustness',
    description: 'Handle runtime errors gracefully using try-catch-finally, throws, and custom exceptions.',
    icon: 'AlertTriangle',
    lessons: [
      {
        id: 'lesson-6-1',
        moduleId: 'module-6',
        title: 'try-catch-finally & Checked vs Unchecked',
        description: 'Catch exceptions, prevent crashes, and ensure resource cleanup with finally.',
        durationMinutes: 16,
        difficulty: 'Intermediate',
        content: `### 📖 Definition & Core Concepts

An **Exception** is an abnormal event or error condition that occurs during the execution of a program, disrupting the normal flow of instructions.

#### Exception Types:
1. **Checked Exceptions**: Subclasses of \`Exception\` verified at compile-time (e.g. \`IOException\`). Must be caught or declared with \`throws\`.
2. **Unchecked Exceptions**: Subclasses of \`RuntimeException\` occurring due to logic errors (e.g. \`ArithmeticException\`, \`NullPointerException\`).

#### Structure of try-catch-finally:
\`\`\`java
try {
    // Risky code that may throw an exception
} catch (SpecificException e) {
    // Recovery code
} finally {
    // Code that ALWAYS executes (cleanup / closing streams)
}
\`\`\``,
        starterCode: `public class Main {
    public static void main(String[] args) {
        int numerator = 50;
        int denominator = 0;
        
        try {
            System.out.println("Attempting division...");
            int result = numerator / denominator;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Caught Error: Cannot divide by zero! Message: " + e.getMessage());
        } finally {
            System.out.println("Finally block executed: Cleanup complete.");
        }
        
        System.out.println("Program continues safely without crashing!");
    }
}`,
        expectedOutput: `Attempting division...
Caught Error: Cannot divide by zero! Message: / by zero
Finally block executed: Cleanup complete.
Program continues safely without crashing!`,
        quiz: [
          {
            id: 'q6-1-1',
            question: 'Under what condition does the "finally" block NOT execute?',
            options: [
              'When an uncaught exception is thrown',
              'When System.exit(0) is called or JVM crashes',
              'When the catch block catches the exception',
              'When no exception occurs'
            ],
            correctIndex: 1,
            explanation: 'The finally block executes in almost all circumstances, except if the JVM process is forcefully terminated (e.g. System.exit(0)) or crashes.'
          }
        ],
        exercise: {
          instruction: 'Write a try-catch block that attempts to parse an invalid integer string `"abc"` using `Integer.parseInt("abc")`, catches `NumberFormatException`, and prints "Invalid number format caught!".',
          starterCode: `public class Main {
    public static void main(String[] args) {
        try {
            int val = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Invalid number format caught!");
        }
    }
}`,
          solutionCode: `public class Main {
    public static void main(String[] args) {
        try {
            int val = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Invalid number format caught!");
        }
    }
}`,
          hint: 'Place `int val = Integer.parseInt("abc");` inside the `try` block and catch `NumberFormatException`.',
          testCases: [
            {
              id: 'tc-13',
              name: 'NumberFormatException caught',
              input: '',
              expectedOutput: 'Invalid number format caught!'
            }
          ]
        }
      }
    ]
  }
];
