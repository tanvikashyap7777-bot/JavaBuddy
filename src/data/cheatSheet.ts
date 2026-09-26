import { CheatSheetItem } from '../types';

export const CHEAT_SHEET_CATEGORIES = [
  'All',
  'Basics & Primitives',
  'Control Flow',
  'OOP & Modifiers',
  'Strings & Arrays',
  'Collections Framework',
  'Exceptions & Errors',
  'Modern Java (8-21)'
];

export const CHEAT_SHEET_ITEMS: CheatSheetItem[] = [
  {
    id: 'cs-1',
    category: 'Basics & Primitives',
    title: 'Primitive Types & Default Values',
    syntax: `byte (8-bit, 0) | short (16-bit, 0) | int (32-bit, 0) | long (64-bit, 0L)
float (32-bit, 0.0f) | double (64-bit, 0.0d)
boolean (1-bit, false) | char (16-bit Unicode, '\\u0000')`,
    description: 'Java has 8 primitive types. All non-primitives are Reference Types pointing to Heap objects.',
    example: `int count = 10;
double price = 19.99;
boolean isActive = true;
char grade = 'A';`
  },
  {
    id: 'cs-2',
    category: 'OOP & Modifiers',
    title: 'Access Modifiers Matrix',
    syntax: `public    : Accessible anywhere in all packages
protected : Accessible within same package + subclasses
default   : (No modifier) Accessible within same package only
private   : Accessible strictly within the declaring class only`,
    description: 'Controls encapsulation and visibility for classes, methods, and member fields.',
    example: `public class User {
    private String password;   // Private: hidden
    protected int rank;        // Protected: subclasses
    public String username;    // Public: everywhere
}`
  },
  {
    id: 'cs-3',
    category: 'OOP & Modifiers',
    title: 'static, final & abstract Keywords',
    syntax: `static   : Belongs to Class, shared across all instances
final    : Immutable variable / Unoverridable method / Unextendable class
abstract : Blueprint without implementation, must be overridden by subclass`,
    description: 'Key non-access modifiers defining behavior, inheritance, and mutability.',
    example: `public static final double PI = 3.1415926535;
public abstract void execute();`
  },
  {
    id: 'cs-4',
    category: 'Strings & Arrays',
    title: 'Common String Methods',
    syntax: `.length() | .charAt(i) | .substring(start, end)
.equals(str) | .equalsIgnoreCase(str) | .compareTo(str)
.contains(str) | .startsWith(str) | .endsWith(str)
.toUpperCase() | .toLowerCase() | .trim() | .replace(old, new)
.split(regex) | .toCharArray() | .isEmpty() | .isBlank()`,
    description: 'Strings are immutable. Methods return newly created strings without modifying the original.',
    example: `String s = "  Java Master  ";
System.out.println(s.trim().toUpperCase()); // "JAVA MASTER"`
  },
  {
    id: 'cs-5',
    category: 'Collections Framework',
    title: 'Collections Hierarchy & Big-O Summary',
    syntax: `List<T>    : ArrayList (O(1) get, O(n) insert/delete), LinkedList (O(1) insert at ends)
Set<T>     : HashSet (O(1) unique), TreeSet (O(log n) sorted)
Map<K, V>  : HashMap (O(1) key-value), TreeMap (O(log n) sorted keys), LinkedHashMap (ordered)
Queue<T>   : ArrayDeque, PriorityQueue (Min/Max Heap)`,
    description: 'Use the generic interfaces List, Set, Map for flexible and clean object typing.',
    example: `List<String> list = new ArrayList<>();
Set<Integer> unique = new HashSet<>();
Map<String, Integer> scores = new HashMap<>();`
  },
  {
    id: 'cs-6',
    category: 'Exceptions & Errors',
    title: 'try-with-resources (AutoCloseable)',
    syntax: `try (ResourceType res = new ResourceType()) {
    // res is automatically closed when block finishes
} catch (Exception e) {
    // handle exception
}`,
    description: 'Introduced in Java 7 to eliminate manual finally { res.close(); } boilerplate.',
    example: `try (Scanner scanner = new Scanner(System.in)) {
    String input = scanner.nextLine();
}`
  },
  {
    id: 'cs-7',
    category: 'Modern Java (8-21)',
    title: 'Stream API One-Liners',
    syntax: `// Filter, Map, Collect
List<String> upper = list.stream().filter(s -> s.length() > 3).map(String::toUpperCase).toList();

// Find Any / Reduce
int sum = numbers.stream().reduce(0, Integer::sum);

// Grouping by
Map<Integer, List<String>> byLength = list.stream().collect(Collectors.groupingBy(String::length));`,
    description: 'Declarative stream operations for powerful data transformation and filtering.',
    example: `List<Integer> evens = List.of(1, 2, 3, 4).stream().filter(n -> n % 2 == 0).toList();`
  },
  {
    id: 'cs-8',
    category: 'Modern Java (8-21)',
    title: 'Records & Pattern Matching (Java 16+)',
    syntax: `public record Point(int x, int y) {} 
// Automatically generates private final fields, constructor, getters (x(), y()), equals(), hashCode(), toString()!`,
    description: 'Records provide immutable data carrier classes with zero boilerplate.',
    example: `record User(String name, int age) {}
User u = new User("Alice", 25);
System.out.println(u.name()); // "Alice"`
  }
];
