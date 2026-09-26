import { Challenge } from '../types';

export const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: `import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Implement your solution here using HashMap for O(n) time
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`,
    solutionCode: `import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
}`,
    hints: [
      'Think about using a HashMap to store values you have seen along with their indices.',
      'For each element `num`, check if `target - num` already exists in the map.',
      'If it exists, return `[map.get(target - num), currentIndex]`.'
    ],
    testCases: [
      {
        id: 'tc-ts-1',
        name: 'Target 9 on [2, 7, 11, 15]',
        input: '',
        expectedOutput: '[0, 1]'
      }
    ]
  },
  {
    id: 'challenge-2',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Strings & Two Pointers',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Write a Java method \`isPalindrome(String s)\` that returns \`true\` if \`s\` is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    constraints: [
      '1 <= s.length() <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    starterCode: `public class Main {
    public static boolean isPalindrome(String s) {
        // Implement two-pointer check
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String test = "A man, a plan, a canal: Panama";
        System.out.println("Is Palindrome: " + isPalindrome(test));
    }
}`,
    hints: [
      'Use two pointers starting at the beginning and end of the string.',
      'Skip non-alphanumeric characters using `Character.isLetterOrDigit(char)`.',
      'Compare characters in lowercase using `Character.toLowerCase(char)`.'
    ],
    testCases: [
      {
        id: 'tc-vp-1',
        name: 'Panama phrase',
        input: '',
        expectedOutput: 'Is Palindrome: true'
      }
    ]
  },
  {
    id: 'challenge-3',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    category: 'Stack & Data Structures',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}".'
    ],
    starterCode: `import java.util.Stack;

public class Main {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println("isValid(\"()[]{}\"): " + isValid("()[]{}"));
        System.out.println("isValid(\"(]\"): " + isValid("(]"));
    }
}`,
    hints: [
      'A Stack (LIFO: Last In First Out) is ideal for matching brackets.',
      'When you see an opening bracket, push its matching closing bracket onto the stack.',
      'When you see a closing bracket, pop from the stack and verify it matches.'
    ],
    testCases: [
      {
        id: 'tc-paren-1',
        name: 'Standard combinations',
        input: '',
        expectedOutput: `isValid("()[]{}"): true\nisValid("(]"): false`
      }
    ]
  },
  {
    id: 'challenge-4',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    category: 'Linked Lists & References',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Main {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }

    public static void printList(ListNode head) {
        StringBuilder sb = new StringBuilder();
        ListNode curr = head;
        while (curr != null) {
            sb.append(curr.val);
            if (curr.next != null) sb.append(" -> ");
            curr = curr.next;
        }
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);
        
        System.out.print("Original: ");
        printList(head);
        
        ListNode reversed = reverseList(head);
        System.out.print("Reversed: ");
        printList(reversed);
    }
}`,
    hints: [
      'Maintain three pointers: prev (initially null), curr (initially head), and nextTemp.',
      'In each step, save curr.next, point curr.next to prev, then move prev and curr one step forward.'
    ],
    testCases: [
      {
        id: 'tc-ll-1',
        name: 'List 1..5 reversed',
        input: '',
        expectedOutput: `Original: 1 -> 2 -> 3 -> 4 -> 5\nReversed: 5 -> 4 -> 3 -> 2 -> 1`
      }
    ]
  },
  {
    id: 'challenge-5',
    title: 'Bank Account & Custom Exception Simulator',
    difficulty: 'Hard',
    category: 'Object-Oriented Design & Exceptions',
    description: `Design a thread-safe \`BankAccount\` class with \`deposit(double amount)\` and \`withdraw(double amount)\` methods.
Throw a custom checked \`InsufficientFundsException\` when attempting to withdraw more money than the available balance.`,
    examples: [
      {
        input: 'Deposit $100, Withdraw $40, Withdraw $80',
        output: 'Balance $60, then InsufficientFundsException caught'
      }
    ],
    constraints: [
      'Amounts must be positive numbers.',
      'Exception must carry the shortfall amount.'
    ],
    starterCode: `class InsufficientFundsException extends Exception {
    private double shortfall;
    
    public InsufficientFundsException(String message, double shortfall) {
        super(message);
        this.shortfall = shortfall;
    }
    
    public double getShortfall() {
        return shortfall;
    }
}

class BankAccount {
    private String accountNumber;
    private double balance;
    
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
        System.out.println("Deposited $" + amount + ". New balance: $" + this.balance);
    }
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > this.balance) {
            double shortfall = amount - this.balance;
            throw new InsufficientFundsException("Insufficient funds for withdrawal", shortfall);
        }
        this.balance -= amount;
        System.out.println("Withdrew $" + amount + ". Remaining balance: $" + this.balance);
    }
    
    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("ACC-9876", 100.0);
        
        try {
            account.withdraw(40.0);
            account.withdraw(80.0); // Should trigger custom exception
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction Failed: " + e.getMessage() + " (Short by $" + e.getShortfall() + ")");
        }
    }
}`,
    hints: [
      'Define a custom exception by extending `Exception`.',
      'Declare `throws InsufficientFundsException` in the method signature of `withdraw`.',
      'Wrap calls in a `try-catch` block in `main`.'
    ],
    testCases: [
      {
        id: 'tc-bank-1',
        name: 'Withdraw test with exception catch',
        input: '',
        expectedOutput: `Withdrew $40.0. Remaining balance: $60.0\nTransaction Failed: Insufficient funds for withdrawal (Short by $20.0)`
      }
    ]
  }
];
