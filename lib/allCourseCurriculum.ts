import { Course, CourseModule, Lesson } from './types';

export const ADDITIONAL_COURSES: Course[] = [
  {
    id: 'crs_react',
    title: 'Modern React & Frontend Engineering',
    slug: 'modern-react-frontend',
    category: 'Frontend Development',
    level: 'Beginner',
    duration: '18 Hours (4 Modules)',
    description: 'Master component architecture, hooks (useState, useEffect, useMemo, custom hooks), Tailwind CSS, Next.js App Router, and frontend performance optimization.',
    thumbnail: '/images/courses/crs_react.svg',
    modulesCount: 4,
    lessonsCount: 12,
    enrolledCount: 2450,
    rating: 4.93,
    targetSkills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    overview: 'Production-level frontend engineering designed to build fast, accessible web applications and ace frontend UI/coding rounds.'
  },
  {
    id: 'crs_ai_ml',
    title: 'Applied Machine Learning & GenAI Systems',
    slug: 'applied-ml-genai',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    duration: '22 Hours (4 Modules)',
    description: 'From data wrangling with Pandas/NumPy to supervised learning (Regression, Trees), PyTorch neural networks, LLM prompt engineering, and RAG architectures.',
    thumbnail: '/images/courses/crs_ai_ml.svg',
    modulesCount: 4,
    lessonsCount: 14,
    enrolledCount: 1980,
    rating: 4.91,
    targetSkills: ['AI/ML', 'Python', 'Pandas & NumPy', 'PyTorch'],
    overview: 'Practical machine learning and frontier generative AI engineering for real-world business intelligence and predictive modeling.'
  }
];

export const ALL_COURSE_MODULES: CourseModule[] = [
  // 1. Python (crs_python)
  { id: 'mod_py_1', courseId: 'crs_python', title: 'Module 1: Python Core Syntax & Memory Model', orderIndex: 1, description: 'Dynamic typing, pass-by-object-reference, memory references, and arithmetic operators.' },
  { id: 'mod_py_2', courseId: 'crs_python', title: 'Module 2: Control Flow & Iterations', orderIndex: 2, description: 'Conditionals, loops, comprehensions, and generator pipelines.' },
  { id: 'mod_py_3', courseId: 'crs_python', title: 'Module 3: Functions & Built-in Collections', orderIndex: 3, description: 'Lists, Tuples, Dictionaries, Sets, packing (*args, **kwargs), and lambda expressions.' },
  { id: 'mod_py_4', courseId: 'crs_python', title: 'Module 4: OOP & Class Architecture', orderIndex: 4, description: 'Classes, dunder methods, inheritance, polymorphism, properties, and encapsulation.' },
  { id: 'mod_py_5', courseId: 'crs_python', title: 'Module 5: Interview Algorithms & Problem Solving', orderIndex: 5, description: 'Two-pointer technique, frequency maps, string parsing, and placement coding challenges.' },

  // 2. C++ (crs_cpp)
  { id: 'mod_cpp_1', courseId: 'crs_cpp', title: 'Module 1: Pointers, References & Memory Management', orderIndex: 1, description: 'Stack vs Heap memory layout, pointer arithmetic, dynamic allocation, and memory leaks.' },
  { id: 'mod_cpp_2', courseId: 'crs_cpp', title: 'Module 2: RAII & Modern Smart Pointers', orderIndex: 2, description: 'Resource Acquisition Is Initialization, unique_ptr, shared_ptr, and weak_ptr.' },
  { id: 'mod_cpp_3', courseId: 'crs_cpp', title: 'Module 3: Standard Template Library (STL) Mastery', orderIndex: 3, description: 'vector, unordered_map, set, priority_queue, algorithms, and iterator invalidation.' },
  { id: 'mod_cpp_4', courseId: 'crs_cpp', title: 'Module 4: Systems Programming & Low-Latency C++', orderIndex: 4, description: 'Move semantics, rvalue references (std::move), cache locality, and low-latency optimizations.' },

  // 3. Java (crs_java)
  { id: 'mod_java_1', courseId: 'crs_java', title: 'Module 1: JVM Architecture & Memory Model', orderIndex: 1, description: 'ClassLoaders, Heap (Young/Old gen), Metaspace, JIT compiler, and Garbage Collection.' },
  { id: 'mod_java_2', courseId: 'crs_java', title: 'Module 2: Java Collections & Streams API', orderIndex: 2, description: 'ArrayList vs LinkedList, HashMap internals, ConcurrentHashMap, and functional Streams pipelines.' },
  { id: 'mod_java_3', courseId: 'crs_java', title: 'Module 3: Concurrency & Multithreading', orderIndex: 3, description: 'Thread lifecycle, synchronized blocks, volatile keyword, ExecutorService, and atomic primitives.' },
  { id: 'mod_java_4', courseId: 'crs_java', title: 'Module 4: Enterprise Spring Boot Foundations', orderIndex: 4, description: 'Dependency Injection, REST controllers, Spring Data JPA, and transactional persistence.' },

  // 4. DSA (crs_dsa)
  { id: 'mod_dsa_1', courseId: 'crs_dsa', title: 'Module 1: Asymptotic Analysis & Linear Structures', orderIndex: 1, description: 'Big-O complexity, Array manipulations, Linked Lists, Stacks, and Queues.' },
  { id: 'mod_dsa_2', courseId: 'crs_dsa', title: 'Module 2: Searching, Sorting & Two Pointers', orderIndex: 2, description: 'Binary Search variants, Merge/Quick sort, Sliding Window, and prefix sum arrays.' },
  { id: 'mod_dsa_3', courseId: 'crs_dsa', title: 'Module 3: Non-Linear Structures: Trees & Graphs', orderIndex: 3, description: 'Binary Search Trees, Traversal algorithms (BFS/DFS), Dijkstra, and Disjoint Set Union.' },
  { id: 'mod_dsa_4', courseId: 'crs_dsa', title: 'Module 4: Dynamic Programming & Recursion', orderIndex: 4, description: 'Memoization (Top-Down), Tabulation (Bottom-Up), 0/1 Knapsack, and Longest Common Subsequence.' },

  // 5. SQL (crs_sql)
  { id: 'mod_sql_1', courseId: 'crs_sql', title: 'Module 1: Relational Schema & Complex Joins', orderIndex: 1, description: 'Entity-relationship modeling, primary/foreign keys, INNER, LEFT, RIGHT, and FULL OUTER joins.' },
  { id: 'mod_sql_2', courseId: 'crs_sql', title: 'Module 2: Aggregations, GROUP BY & Subqueries', orderIndex: 2, description: 'COUNT, SUM, AVG, HAVING filters, correlated subqueries, and Common Table Expressions (CTEs).' },
  { id: 'mod_sql_3', courseId: 'crs_sql', title: 'Module 3: Window Functions & Analytical Queries', orderIndex: 3, description: 'ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, running totals, and partition frames.' },
  { id: 'mod_sql_4', courseId: 'crs_sql', title: 'Module 4: Indexing, ACID & Performance Tuning', orderIndex: 4, description: 'B-Tree vs Clustered indexes, transaction isolation levels, EXPLAIN execution plans, and normalization.' },

  // 6. Git (crs_git)
  { id: 'mod_git_1', courseId: 'crs_git', title: 'Module 1: Git Internals & Object Model', orderIndex: 1, description: 'Blobs, Trees, Commits, Tags, three-tree architecture (Working, Staging, HEAD).' },
  { id: 'mod_git_2', courseId: 'crs_git', title: 'Module 2: Branching, Rebasing & Conflict Resolution', orderIndex: 2, description: 'Fast-forward merges, 3-way merges, interactive rebase, squashing commits, and stash.' },
  { id: 'mod_git_3', courseId: 'crs_git', title: 'Module 3: Team Workflows & GitHub CI/CD', orderIndex: 3, description: 'Pull request reviews, branch protection rules, semantic commit messages, and GitHub Actions.' },

  // 7. OOP & Design Patterns (crs_oop)
  { id: 'mod_oop_1', courseId: 'crs_oop', title: 'Module 1: The 4 Pillars of Object-Oriented Design', orderIndex: 1, description: 'Encapsulation, Abstraction, Inheritance, and Polymorphism in real systems.' },
  { id: 'mod_oop_2', courseId: 'crs_oop', title: 'Module 2: SOLID Principles in Production', orderIndex: 2, description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.' },
  { id: 'mod_oop_3', courseId: 'crs_oop', title: 'Module 3: Gang of Four (GoF) Design Patterns', orderIndex: 3, description: 'Singleton, Factory, Builder, Adapter, Decorator, Strategy, and Observer patterns.' },

  // 8. Cloud & AWS (crs_cloud)
  { id: 'mod_cloud_1', courseId: 'crs_cloud', title: 'Module 1: Cloud Principles & VPC Networking', orderIndex: 1, description: 'Regions, Availability Zones, VPC, CIDR, public/private subnets, Internet Gateway, and NAT.' },
  { id: 'mod_cloud_2', courseId: 'crs_cloud', title: 'Module 2: Scalable Compute & Storage Architecture', orderIndex: 2, description: 'EC2 instances, Auto Scaling Groups, Elastic Load Balancer (ALB), S3 storage classes, and EBS.' },
  { id: 'mod_cloud_3', courseId: 'crs_cloud', title: 'Module 3: Serverless & Managed Database Services', orderIndex: 3, description: 'AWS Lambda event triggers, Amazon RDS Multi-AZ failover, DynamoDB NoSQL, and CloudWatch.' },

  // 9. Aptitude (crs_aptitude)
  { id: 'mod_apt_1', courseId: 'crs_aptitude', title: 'Module 1: Speed Arithmetic & Percentages', orderIndex: 1, description: 'Fast fraction-to-percentage conversion, Profit & Loss, Simple and Compound Interest shortcuts.' },
  { id: 'mod_apt_2', courseId: 'crs_aptitude', title: 'Module 2: Time, Work & Relative Speed', orderIndex: 2, description: 'LCM method for work rates, pipes & cisterns, train collisions, and boats & streams.' },
  { id: 'mod_apt_3', courseId: 'crs_aptitude', title: 'Module 3: Combinatorics, Probability & Logic', orderIndex: 3, description: 'Permutations, Combinations, conditional probability, syllogisms, and data sufficiency.' },

  // 10. Technical Interview & System Design (crs_interview)
  { id: 'mod_int_1', courseId: 'crs_interview', title: 'Module 1: Behavioral & STAR Method Mastery', orderIndex: 1, description: 'Structuring Situation, Task, Action, and Quantified Results for leadership questions.' },
  { id: 'mod_int_2', courseId: 'crs_interview', title: 'Module 2: High-Level System Design Framework', orderIndex: 2, description: '4-Step interview framework, back-of-the-envelope capacity estimates, and API contract design.' },
  { id: 'mod_int_3', courseId: 'crs_interview', title: 'Module 3: Distributed Scalability Patterns', orderIndex: 3, description: 'CAP theorem, database sharding, Redis caching strategies, and asynchronous message queues.' },

  // 11. Modern React (crs_react)
  { id: 'mod_react_1', courseId: 'crs_react', title: 'Module 1: React Component Model & JSX', orderIndex: 1, description: 'Functional components, props, JSX transformation, conditional rendering, and keys in lists.' },
  { id: 'mod_react_2', courseId: 'crs_react', title: 'Module 2: Hooks & Reactive State Management', orderIndex: 2, description: 'useState, useEffect lifecycles, useRef DOM references, useMemo/useCallback, and Context API.' },
  { id: 'mod_react_3', courseId: 'crs_react', title: 'Module 3: Next.js App Router & Server Components', orderIndex: 3, description: 'Server vs Client components, dynamic routing, layout nesting, and data fetching caching.' },
  { id: 'mod_react_4', courseId: 'crs_react', title: 'Module 4: Performance, Forms & Placement Prep', orderIndex: 4, description: 'Code splitting, memoization, controlled forms, accessibility (a11y), and frontend interview questions.' },

  // 12. AI & Machine Learning (crs_ai_ml)
  { id: 'mod_aiml_1', courseId: 'crs_ai_ml', title: 'Module 1: Python Data Science with Pandas & NumPy', orderIndex: 1, description: 'Vectorized operations, DataFrame manipulation, handling missing values, and exploratory data analysis.' },
  { id: 'mod_aiml_2', courseId: 'crs_ai_ml', title: 'Module 2: Supervised & Unsupervised Machine Learning', orderIndex: 2, description: 'Linear/Logistic regression, Decision Trees, Random Forests, K-Means clustering, and train-test splits.' },
  { id: 'mod_aiml_3', courseId: 'crs_ai_ml', title: 'Module 3: Deep Learning Foundations with PyTorch', orderIndex: 3, description: 'Tensors, autograd, forward/backward propagation, activation functions, and training loops.' },
  { id: 'mod_aiml_4', courseId: 'crs_ai_ml', title: 'Module 4: Generative AI, LLMs & RAG Architectures', orderIndex: 4, description: 'Transformer self-attention, prompt engineering, vector embeddings, semantic search, and RAG pipelines.' }
];


export const ALL_COURSE_LESSONS: Lesson[] = [
  {
    "id": "les_py_1",
    "moduleId": "mod_py_1",
    "courseId": "crs_python",
    "title": "Python Memory Allocation & Dynamic Typing",
    "orderIndex": 1,
    "durationMinutes": 25,
    "contentMarkdown": "# Python Memory Allocation\nIn Python, variables are reference pointers pointing to dynamically allocated heap objects.\n\n### Key Mechanisms:\n1. Small Integer Caching (-5 to 256)\n2. String Interning for common identifiers\n3. Reference Counting & Generational Garbage Collection",
    "codeExample": "a = 256\nb = 256\nprint(a is b) # True: Shared cached memory address\nx = 1000\ny = 1000\nprint(x is y) # False: Distinct heap allocations\nprint(x == y) # True: Equal numeric values",
    "practiceTask": "Create two list objects with identical items and compare them using both == and is.",
    "checkQuestion": {
      "question": "What does the `is` operator compare in Python?",
      "options": [
        "Value equality",
        "Memory address identity",
        "String length",
        "Data type name"
      ],
      "correctIndex": 1,
      "explanation": "The `is` operator checks whether two references point to the exact same memory address."
    }
  },
  {
    "id": "les_py_2",
    "moduleId": "mod_py_2",
    "courseId": "crs_python",
    "title": "Comprehensions & Lazy Generators",
    "orderIndex": 2,
    "durationMinutes": 25,
    "contentMarkdown": "# List Comprehensions vs Generators\nComprehensions build the full collection in RAM at once. Generators yield values lazily on demand using the yield keyword, keeping memory constant.",
    "codeExample": "# Generator yielding values lazily\ndef generate_squares(n):\n    for i in range(n):\n        yield i**2\n\ngen = generate_squares(5)\nprint(list(gen)) # [0, 1, 4, 9, 16]",
    "practiceTask": "Write a generator function that yields the Fibonacci sequence up to N terms.",
    "checkQuestion": {
      "question": "What keyword turns a standard Python function into a generator?",
      "options": [
        "return",
        "yield",
        "async",
        "generate"
      ],
      "correctIndex": 1,
      "explanation": "The `yield` keyword produces an iterator value lazily without terminating the function."
    }
  },
  {
    "id": "les_py_3",
    "moduleId": "mod_py_3",
    "courseId": "crs_python",
    "title": "Python Collections & Hash Maps",
    "orderIndex": 3,
    "durationMinutes": 30,
    "contentMarkdown": "# Built-in Hash Maps\nPython dictionaries offer average O(1) key lookups and preserve insertion order since Python 3.7.",
    "codeExample": "candidate = {\"name\": \"Alex\", \"cgpa\": 8.6, \"skills\": [\"Python\", \"SQL\"]}\nprint(candidate.get(\"college\", \"Apex Institute\"))",
    "practiceTask": "Group a list of job titles by department using collections.defaultdict.",
    "checkQuestion": {
      "question": "What is the average time complexity of key lookup in a Python dict?",
      "options": [
        "O(N)",
        "O(log N)",
        "O(1)",
        "O(N^2)"
      ],
      "correctIndex": 2,
      "explanation": "Python dictionaries are hash tables providing O(1) average lookup time."
    }
  },
  {
    "id": "les_py_4",
    "moduleId": "mod_py_4",
    "courseId": "crs_python",
    "title": "Object-Oriented Design in Python",
    "orderIndex": 4,
    "durationMinutes": 35,
    "contentMarkdown": "# Class Architecture & Encapsulation\nLearn classes, __init__ initializers, inheritance, polymorphism, and pythonic properties using @property.",
    "codeExample": "class Candidate:\n    def __init__(self, name: str, score: int):\n        self.name = name\n        self.score = score\n    def is_passed(self) -> bool:\n        return self.score >= 75\n\ncand = Candidate(\"Alex\", 88)\nprint(cand.is_passed()) # True",
    "practiceTask": "Create a Student class with encapsulated private attributes using getters and setters.",
    "checkQuestion": {
      "question": "Which dunder method is invoked when an instance is initialized?",
      "options": [
        "__new__",
        "__init__",
        "__create__",
        "__setup__"
      ],
      "correctIndex": 1,
      "explanation": "`__init__` acts as the constructor initializer receiving self and arguments."
    }
  },
  {
    "id": "les_cpp_1",
    "moduleId": "mod_cpp_1",
    "courseId": "crs_cpp",
    "title": "Pointers, References & Memory Management",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# C++ Memory & Pointers\nStack memory operates with zero allocation latency via CPU registers. Dynamic Heap memory requires explicit allocation and deallocation.",
    "codeExample": "#include <iostream>\nvoid passByReference(int& val) { val *= 2; }\nint main() {\n    int a = 10;\n    passByReference(a);\n    std::cout << a; // 20\n    return 0;\n}",
    "practiceTask": "Write a C++ function to swap two numbers using pointer dereferencing.",
    "checkQuestion": {
      "question": "What is a dangling pointer in C++?",
      "options": [
        "A null pointer",
        "A pointer pointing to deallocated or invalid memory",
        "A pointer to a constant",
        "A void pointer"
      ],
      "correctIndex": 1,
      "explanation": "A dangling pointer points to memory that has already been freed."
    }
  },
  {
    "id": "les_cpp_2",
    "moduleId": "mod_cpp_2",
    "courseId": "crs_cpp",
    "title": "Modern Smart Pointers & Zero-Leak RAII",
    "orderIndex": 2,
    "durationMinutes": 30,
    "contentMarkdown": "# RAII & Smart Pointers\nResource Acquisition Is Initialization (RAII) ensures heap memory is bound to object lifetime.",
    "codeExample": "#include <iostream>\n#include <memory>\nstruct Node { int data; };\nint main() {\n    auto ptr = std::make_unique<Node>();\n    ptr->data = 42;\n    // Automatically freed when exiting scope!\n    return 0;\n}",
    "practiceTask": "Demonstrate how std::shared_ptr and std::weak_ptr prevent cyclic memory leaks.",
    "checkQuestion": {
      "question": "Which smart pointer enforces single, non-copyable ownership of a resource?",
      "options": [
        "std::shared_ptr",
        "std::unique_ptr",
        "std::weak_ptr",
        "std::auto_ptr"
      ],
      "correctIndex": 1,
      "explanation": "`std::unique_ptr` cannot be copied, only moved."
    }
  },
  {
    "id": "les_cpp_3",
    "moduleId": "mod_cpp_3",
    "courseId": "crs_cpp",
    "title": "C++ STL Containers (vector, unordered_map, queue)",
    "orderIndex": 3,
    "durationMinutes": 35,
    "contentMarkdown": "# Standard Template Library (STL)\nThe STL provides guaranteed algorithmic complexities: vector (amortized O(1) push_back), unordered_map (O(1) lookup), priority_queue (O(log N) push/pop).",
    "codeExample": "#include <iostream>\n#include <unordered_map>\nint main() {\n    std::unordered_map<std::string, int> cutoffs;\n    cutoffs[\"TechNova\"] = 85;\n    std::cout << cutoffs[\"TechNova\"];\n    return 0;\n}",
    "practiceTask": "Use std::priority_queue to implement a min-heap for Top-K candidate sorting.",
    "checkQuestion": {
      "question": "What is the average time complexity of searching in `std::unordered_map`?",
      "options": [
        "O(N)",
        "O(log N)",
        "O(1)",
        "O(N log N)"
      ],
      "correctIndex": 2,
      "explanation": "`std::unordered_map` is hash-table based with average O(1) performance."
    }
  },
  {
    "id": "les_java_1",
    "moduleId": "mod_java_1",
    "courseId": "crs_java",
    "title": "JVM Architecture & Memory Hierarchy",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# Java Virtual Machine Execution\nJava bytecode runs on the JVM. Objects reside in Young (Eden, S0, S1) or Old Generation heaps, managed by Garbage Collectors.",
    "codeExample": "public class Main {\n    public static void main(String[] args) {\n        String s1 = \"Skill2Hire\";\n        String s2 = \"Skill2Hire\";\n        System.out.println(s1 == s2); // true (String Constant Pool reuse)\n    }\n}",
    "practiceTask": "Explain the purpose of the Java String Constant Pool and its impact on RAM consumption.",
    "checkQuestion": {
      "question": "Which memory area stores class-level bytecode metadata in modern Java (Java 8+)?",
      "options": [
        "PermGen",
        "Metaspace (Native OS Memory)",
        "Thread Stack",
        "Heap Eden Space"
      ],
      "correctIndex": 1,
      "explanation": "Metaspace replaced PermGen in Java 8 and resides in native OS memory."
    }
  },
  {
    "id": "les_java_2",
    "moduleId": "mod_java_2",
    "courseId": "crs_java",
    "title": "Java Collections & Streams Pipeline",
    "orderIndex": 2,
    "durationMinutes": 35,
    "contentMarkdown": "# Functional Streams in Java\nStreams enable declarative pipelines for filtering, mapping, and reducing collections without modifying underlying data structures.",
    "codeExample": "import java.util.*;\nimport java.util.stream.Collectors;\npublic class StreamsDemo {\n    public static void main(String[] args) {\n        List<Integer> scores = List.of(88, 72, 94, 65, 82);\n        List<Integer> passed = scores.stream().filter(s -> s >= 75).sorted().collect(Collectors.toList());\n        System.out.println(passed); // [82, 88, 94]\n    }\n}",
    "practiceTask": "Write a stream pipeline that finds the maximum CGPA from a list of Student records.",
    "checkQuestion": {
      "question": "What is the difference between an intermediate and a terminal stream operation in Java?",
      "options": [
        "Intermediate operations execute immediately; terminal operations are lazy",
        "Intermediate operations return a Stream and are lazy; terminal operations produce a result and trigger execution",
        "They are identical",
        "Terminal operations can be chained"
      ],
      "correctIndex": 1,
      "explanation": "Intermediate operations are lazy until a terminal operation (e.g. collect, forEach) is called."
    }
  },
  {
    "id": "les_java_3",
    "moduleId": "mod_java_3",
    "courseId": "crs_java",
    "title": "Java Concurrency & ExecutorService",
    "orderIndex": 3,
    "durationMinutes": 35,
    "contentMarkdown": "# Multithreading & Thread Pools\nThread management using ExecutorService prevents thread creation overhead and controls system concurrency.",
    "codeExample": "import java.util.concurrent.*;\npublic class ConcurrencyDemo {\n    public static void main(String[] args) {\n        ExecutorService service = Executors.newFixedThreadPool(2);\n        service.submit(() -> System.out.println(\"Running in: \" + Thread.currentThread().getName()));\n        service.shutdown();\n    }\n}",
    "practiceTask": "Demonstrate thread-safe counters using AtomicInteger without synchronized blocks.",
    "checkQuestion": {
      "question": "What does the `volatile` keyword guarantee in Java?",
      "options": [
        "Thread locks",
        "Direct read/write to main memory, ensuring cache visibility across threads",
        "Serialization",
        "Exception handling"
      ],
      "correctIndex": 1,
      "explanation": "`volatile` ensures all threads see the most up-to-date value in main memory."
    }
  },
  {
    "id": "les_dsa_1",
    "moduleId": "mod_dsa_1",
    "courseId": "crs_dsa",
    "title": "Linear Structures, Two-Pointers & Sliding Window",
    "orderIndex": 1,
    "durationMinutes": 35,
    "contentMarkdown": "# Optimal Linear Algorithms\nTwo-pointer and sliding window techniques optimize quadratic O(N^2) loops into linear O(N) operations.",
    "codeExample": "def max_consecutive_ones(nums, k):\n    left = 0\n    zeros = 0\n    max_len = 0\n    for right in range(len(nums)):\n        if nums[right] == 0: zeros += 1\n        while zeros > k:\n            if nums[left] == 0: zeros -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len",
    "practiceTask": "Solve the Two Sum problem on a sorted array using left and right pointers in O(N) time.",
    "checkQuestion": {
      "question": "What is the time complexity of the Two-Pointer approach on a sorted array of size N?",
      "options": [
        "O(N^2)",
        "O(N log N)",
        "O(N)",
        "O(1)"
      ],
      "correctIndex": 2,
      "explanation": "Each pointer moves at most N steps, giving strict O(N) linear time complexity."
    }
  },
  {
    "id": "les_dsa_2",
    "moduleId": "mod_dsa_2",
    "courseId": "crs_dsa",
    "title": "Binary Search & Monotonic Predicates",
    "orderIndex": 2,
    "durationMinutes": 30,
    "contentMarkdown": "# Logarithmic Binary Search\nBinary search operates in O(log N) time by halving search boundaries at each iteration over monotonic search spaces.",
    "codeExample": "def search_insert_position(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return left",
    "practiceTask": "Find the peak element in an array where nums[i] != nums[i+1] in O(log N) time.",
    "checkQuestion": {
      "question": "Why does `mid = left + (right - left) // 2` prevent overflow in integer arithmetic?",
      "options": [
        "It avoids adding left + right which could exceed max integer size",
        "It uses floating point",
        "It runs in O(1)",
        "It handles negatives"
      ],
      "correctIndex": 0,
      "explanation": "Subtracting prevents large sums from exceeding 32-bit integer limits."
    }
  },
  {
    "id": "les_dsa_3",
    "moduleId": "mod_dsa_3",
    "courseId": "crs_dsa",
    "title": "Tree & Graph Traversals (BFS & DFS)",
    "orderIndex": 3,
    "durationMinutes": 40,
    "contentMarkdown": "# Graph Traversals\nBFS uses a Queue for shortest paths in unweighted graphs. DFS explores branches recursively for connected components.",
    "codeExample": "from collections import deque\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited",
    "practiceTask": "Implement cycle detection in a directed graph using DFS and 3-color coloring.",
    "checkQuestion": {
      "question": "Which data structure is fundamentally required to implement Breadth-First Search (BFS)?",
      "options": [
        "Stack",
        "Queue (FIFO)",
        "Priority Queue",
        "Set"
      ],
      "correctIndex": 1,
      "explanation": "BFS explores level-by-level, requiring a First-In First-Out Queue."
    }
  },
  {
    "id": "les_dsa_4",
    "moduleId": "mod_dsa_4",
    "courseId": "crs_dsa",
    "title": "Dynamic Programming (Memoization vs Tabulation)",
    "orderIndex": 4,
    "durationMinutes": 40,
    "contentMarkdown": "# Dynamic Programming\nSolve complex problems by breaking them into overlapping subproblems with optimal substructure.",
    "codeExample": "def coin_change(coins, amount):\n    dp = [float(\"inf\")] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float(\"inf\") else -1",
    "practiceTask": "Solve the Longest Increasing Subsequence (LIS) problem using DP in O(N^2) and O(N log N).",
    "checkQuestion": {
      "question": "What is the space complexity of Tabulation (Bottom-Up) vs naive recursion for Fibonacci?",
      "options": [
        "O(N) or O(1) vs O(N) call stack",
        "Both are exponential",
        "Tabulation uses O(2^N)",
        "Recursion uses O(1)"
      ],
      "correctIndex": 0,
      "explanation": "Bottom-up tabulation computes state iteratively without recursive call-stack overhead."
    }
  },
  {
    "id": "les_sql_1",
    "moduleId": "mod_sql_1",
    "courseId": "crs_sql",
    "title": "Relational Schemas & Multi-Table Joins",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# Relational Joins\nCombine records across normalized tables: INNER, LEFT, RIGHT, and FULL OUTER joins.",
    "codeExample": "SELECT s.fullName, j.title, a.status\nFROM applications a\nJOIN students s ON a.studentId = s.id\nJOIN jobs j ON a.jobId = j.id\nWHERE a.status = \"Applied\";",
    "practiceTask": "Write a LEFT JOIN query finding all students who have not yet submitted any job applications.",
    "checkQuestion": {
      "question": "What does an INNER JOIN return?",
      "options": [
        "All rows from left table",
        "Only rows that have matching values in both tables",
        "All rows from both tables",
        "A Cartesian product"
      ],
      "correctIndex": 1,
      "explanation": "INNER JOIN selects records with matching values in both datasets."
    }
  },
  {
    "id": "les_sql_2",
    "moduleId": "mod_sql_2",
    "courseId": "crs_sql",
    "title": "Aggregations, GROUP BY & HAVING Filters",
    "orderIndex": 2,
    "durationMinutes": 25,
    "contentMarkdown": "# SQL Grouping & Aggregates\nAggregate functions (COUNT, AVG, SUM, MAX, MIN) summarize data groups. HAVING filters group aggregates.",
    "codeExample": "SELECT collegeName, COUNT(id) AS totalStudents, AVG(cgpa) AS avgCgpa\nFROM students\nGROUP BY collegeName\nHAVING AVG(cgpa) >= 8.0;",
    "practiceTask": "Find the top 3 colleges with the highest average student placement readiness scores.",
    "checkQuestion": {
      "question": "Why can you not use aggregate functions inside a WHERE clause?",
      "options": [
        "Syntax error",
        "WHERE executes before groups are formed; HAVING is required for aggregated rows",
        "WHERE only works on strings",
        "Aggregates require ORDER BY"
      ],
      "correctIndex": 1,
      "explanation": "WHERE filters individual row records before grouping occurs."
    }
  },
  {
    "id": "les_sql_3",
    "moduleId": "mod_sql_3",
    "courseId": "crs_sql",
    "title": "Window Functions (DENSE_RANK, ROW_NUMBER, LEAD/LAG)",
    "orderIndex": 3,
    "durationMinutes": 35,
    "contentMarkdown": "# Analytical Window Functions\nPerform calculations across row partitions without collapsing individual row details.",
    "codeExample": "WITH RankedApplicants AS (\n    SELECT studentName, jobTitle, matchPercentage,\n           DENSE_RANK() OVER (PARTITION BY jobTitle ORDER BY matchPercentage DESC) as rk\n    FROM applications\n)\nSELECT * FROM RankedApplicants WHERE rk <= 2;",
    "practiceTask": "Use LAG() to compute salary changes between consecutive job postings by the same company.",
    "checkQuestion": {
      "question": "What is the distinction between ROW_NUMBER() and DENSE_RANK()?",
      "options": [
        "ROW_NUMBER() always increments consecutively with zero ties; DENSE_RANK() shares ranks on ties",
        "They are identical",
        "ROW_NUMBER() skips ranks on ties",
        "DENSE_RANK() only works on numbers"
      ],
      "correctIndex": 0,
      "explanation": "`ROW_NUMBER()` assigns sequential integer IDs; `DENSE_RANK()` assigns the same rank to identical values without skipping."
    }
  },
  {
    "id": "les_git_1",
    "moduleId": "mod_git_1",
    "courseId": "crs_git",
    "title": "Git Internal Object Model (Blobs, Trees, Commits)",
    "orderIndex": 1,
    "durationMinutes": 20,
    "contentMarkdown": "# Content-Addressable Storage\nGit stores snapshots using cryptographically hashed objects: Blobs (files), Trees (folders), and Commits.",
    "codeExample": "# Initialize and inspect Git objects\ngit init\necho \"Skill2Hire\" > app.txt\ngit add app.txt\ngit commit -m \"feat: initial release\"\ngit cat-file -p HEAD",
    "practiceTask": "Inspect the commit hash and parent commit hash using `git log --graph --oneline`.",
    "checkQuestion": {
      "question": "What does a Git Blob object store?",
      "options": [
        "Folder hierarchy",
        "Raw file content without file names or permissions",
        "Commit author details",
        "Branch names"
      ],
      "correctIndex": 1,
      "explanation": "Blobs store raw file content; names and directory paths are stored in Tree objects."
    }
  },
  {
    "id": "les_git_2",
    "moduleId": "mod_git_2",
    "courseId": "crs_git",
    "title": "Rebase vs Merge & Safe Branch Protocols",
    "orderIndex": 2,
    "durationMinutes": 25,
    "contentMarkdown": "# Clean Linear Histories with Rebase\nRebasing moves feature branch commits onto the latest base commit for clean pull request reviews.",
    "codeExample": "# Rebase feature branch onto latest main\ngit checkout feature/auth\ngit fetch origin\ngit rebase origin/main\ngit push --force-with-lease origin feature/auth",
    "practiceTask": "Squash 3 experimental commits into one clean conventional commit using interactive rebase.",
    "checkQuestion": {
      "question": "Why is `--force-with-lease` preferred over `--force` when pushing a rebased branch?",
      "options": [
        "It is faster",
        "It prevents overwriting teammates commits if the remote branch was updated in the meantime",
        "It skips CI tests",
        "It deletes local branches"
      ],
      "correctIndex": 1,
      "explanation": "`--force-with-lease` validates remote state before force pushing."
    }
  },
  {
    "id": "les_oop_1",
    "moduleId": "mod_oop_1",
    "courseId": "crs_oop",
    "title": "The SOLID Principles of Extensible Design",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# SOLID Principles\nArchitect resilient, loosely coupled codebases:\n- Single Responsibility\n- Open/Closed\n- Liskov Substitution\n- Interface Segregation\n- Dependency Inversion",
    "codeExample": "// Dependency Inversion in TypeScript\ninterface EmailSender { send(to: string, msg: string): void; }\nclass AlertService {\n    constructor(private sender: EmailSender) {}\n    notify(user: string) { this.sender.send(user, \"Assessment Ready\"); }\n}",
    "practiceTask": "Refactor a monolithic class violating Single Responsibility into decoupled domain services.",
    "checkQuestion": {
      "question": "What does the Open/Closed Principle state?",
      "options": [
        "Files must be closed after reading",
        "Software entities should be open for extension, but closed for modification",
        "Databases should be private",
        "All classes must be final"
      ],
      "correctIndex": 1,
      "explanation": "Classes should allow behavior to be extended via polymorphism without editing existing tested code."
    }
  },
  {
    "id": "les_cloud_1",
    "moduleId": "mod_cloud_1",
    "courseId": "crs_cloud",
    "title": "AWS VPC Networking & Infrastructure Architecture",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# AWS Cloud Architecture\nDesign high-availability VPC networks spanning multiple Availability Zones with public ALB subnets and private application subnets.",
    "codeExample": "# AWS CLI VPC creation\naws ec2 create-vpc --cidr-block 10.0.0.0/16\naws ec2 create-subnet --vpc-id vpc-12345 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a",
    "practiceTask": "Create an architecture diagram showing Internet Gateway, NAT Gateway, Application Load Balancer, and EC2 Auto-Scaling Groups.",
    "checkQuestion": {
      "question": "Which component allows instances in private subnets to access the internet while blocking inbound internet traffic?",
      "options": [
        "Internet Gateway",
        "NAT Gateway",
        "Direct Connect",
        "VPC Peering"
      ],
      "correctIndex": 1,
      "explanation": "NAT Gateways permit outbound internet requests from private subnets while blocking unsolicited inbound connections."
    }
  },
  {
    "id": "les_apt_1",
    "moduleId": "mod_apt_1",
    "courseId": "crs_aptitude",
    "title": "Speed Arithmetic & Fraction Shortcuts",
    "orderIndex": 1,
    "durationMinutes": 25,
    "contentMarkdown": "# Speed Math for Screening Exams\nMemorize fraction conversions to crack placement tests without calculators: 1/7 = 14.28%, 1/8 = 12.5%, 1/12 = 8.33%.",
    "codeExample": "# Successive discount formula\ndef total_discount(d1, d2):\n    return d1 + d2 - (d1 * d2 / 100)\nprint(\"20% + 10% discount:\", total_discount(20, 10)) # 28%",
    "practiceTask": "Calculate the compound interest on $10,000 for 2 years at 10% using the successive addition formula.",
    "checkQuestion": {
      "question": "If a product cost $100 and sells for $125, what is the profit percentage?",
      "options": [
        "20%",
        "25%",
        "30%",
        "15%"
      ],
      "correctIndex": 1,
      "explanation": "Profit = (125 - 100) / 100 = 25%."
    }
  },
  {
    "id": "les_int_1",
    "moduleId": "mod_int_1",
    "courseId": "crs_interview",
    "title": "Behavioral Interviews & The STAR Method",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# High-Impact STAR Stories\nStructure responses clearly:\n- Situation (15%)\n- Task (15%)\n- Action Taken (50%)\n- Quantified Result (20%)",
    "codeExample": "/* STAR Example:\nSituation: High latency during campus drive login spikes.\nTask: Reduce API response time below 100ms within 48h.\nAction: Added Redis caching, database indexes, and connection pooling.\nResult: Decreased p99 latency by 68% and eliminated timeout errors.\n*/",
    "practiceTask": "Prepare a 90-second response to: \"Describe a high-stress bug you resolved under tight deadlines.\"",
    "checkQuestion": {
      "question": "Which part of a STAR answer should receive the most focus and detail?",
      "options": [
        "Situation",
        "Task",
        "Action (what you specifically did)",
        "Result summary"
      ],
      "correctIndex": 2,
      "explanation": "Interviewers evaluate your personal engineering contribution and problem solving in the Action phase."
    }
  },
  {
    "id": "les_react_1",
    "moduleId": "mod_react_1",
    "courseId": "crs_react",
    "title": "React Component Architecture & Virtual DOM",
    "orderIndex": 1,
    "durationMinutes": 30,
    "contentMarkdown": "# Functional Components & Props\nReact renders interfaces as pure functions of state. The Virtual DOM reconciles minimal updates to the real browser DOM.",
    "codeExample": "import React, { useState } from \"react\";\nexport function Counter() {\n    const [count, setCount] = useState(0);\n    return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}",
    "practiceTask": "Build an interactive SkillBadge component rendering dynamic proficiency levels.",
    "checkQuestion": {
      "question": "Why is Virtual DOM diffing faster than directly manipulating the browser DOM repeatedly?",
      "options": [
        "Virtual DOM runs in C++",
        "React batches in-memory computations and applies minimal changes to the real DOM",
        "Virtual DOM uses no memory",
        "Virtual DOM bypasses CSS"
      ],
      "correctIndex": 1,
      "explanation": "Reconciliation batches DOM mutations and modifies only changed nodes in the real DOM."
    }
  },
  {
    "id": "les_react_2",
    "moduleId": "mod_react_2",
    "courseId": "crs_react",
    "title": "Hooks: useEffect, useMemo, useCallback & Custom Hooks",
    "orderIndex": 2,
    "durationMinutes": 35,
    "contentMarkdown": "# Advanced React Hooks\n- useEffect: Side-effects with cleanup\n- useMemo: Cache computationally heavy outputs\n- useCallback: Cache function references\n- Custom Hooks: Reusable state patterns",
    "codeExample": "import { useState, useEffect } from \"react\";\nexport function useOnlineStatus() {\n    const [online, setOnline] = useState(true);\n    useEffect(() => {\n        const handle = () => setOnline(navigator.onLine);\n        window.addEventListener(\"online\", handle);\n        window.addEventListener(\"offline\", handle);\n        return () => { window.removeEventListener(\"online\", handle); window.removeEventListener(\"offline\", handle); };\n    }, []);\n    return online;\n}",
    "practiceTask": "Implement useLocalStorage custom hook to synchronize state with browser local storage.",
    "checkQuestion": {
      "question": "What is the purpose of the return function inside a `useEffect` hook?",
      "options": [
        "To return data to parent component",
        "To clean up timers, subscriptions, or event listeners when unmounting",
        "To trigger a re-render",
        "To handle errors"
      ],
      "correctIndex": 1,
      "explanation": "The returned cleanup function runs when the component unmounts or before re-running the effect."
    }
  },
  {
    "id": "les_aiml_1",
    "moduleId": "mod_aiml_1",
    "courseId": "crs_ai_ml",
    "title": "Vectorized Data Processing with Pandas & NumPy",
    "orderIndex": 1,
    "durationMinutes": 35,
    "contentMarkdown": "# Data Science Foundations\nNumPy provides C-level contiguous multidimensional arrays. Pandas provides flexible tabular DataFrames for cleaning and feature engineering.",
    "codeExample": "import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\"student\": [\"Alex\", \"Priya\"], \"score\": [88, 94]})\ndf[\"normalized\"] = (df[\"score\"] - df[\"score\"].mean()) / df[\"score\"].std()\nprint(df)",
    "practiceTask": "Load a dataset and impute missing numerical values with column median values.",
    "checkQuestion": {
      "question": "Why are NumPy vectorized operations faster than native Python for-loops?",
      "options": [
        "NumPy uses multithreading on GPUs",
        "NumPy arrays are stored in contiguous memory and execute precompiled C SIMD routines",
        "NumPy skips math checks",
        "NumPy converts code to assembly"
      ],
      "correctIndex": 1,
      "explanation": "Contiguous memory buffers and SIMD CPU vectorization avoid Python interpreter loop overhead."
    }
  },
  {
    "id": "les_aiml_2",
    "moduleId": "mod_aiml_2",
    "courseId": "crs_ai_ml",
    "title": "Supervised Learning & Evaluation Metrics",
    "orderIndex": 2,
    "durationMinutes": 40,
    "contentMarkdown": "# Machine Learning Models\nTrain/test splits, Logistic Regression, Random Forests, Decision Trees, and metric trade-offs (Precision, Recall, F1, ROC-AUC).",
    "codeExample": "from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nclf = RandomForestClassifier(n_estimators=100)\nclf.fit(X_train, y_train)\nprint(\"Accuracy:\", clf.score(X_test, y_test))",
    "practiceTask": "Train a classifier predicting placement eligibility and print a classification report with precision and recall.",
    "checkQuestion": {
      "question": "On an imbalanced dataset with 99% negative cases, why is accuracy a flawed metric?",
      "options": [
        "Accuracy cannot be computed",
        "A model guessing always negative achieves 99% accuracy without identifying any positive cases",
        "Accuracy is slow",
        "Accuracy requires integers"
      ],
      "correctIndex": 1,
      "explanation": "Accuracy masks complete failure on minority classes in imbalanced distributions."
    }
  },
  {
    "id": "les_aiml_3",
    "moduleId": "mod_aiml_3",
    "courseId": "crs_ai_ml",
    "title": "Large Language Models, Embeddings & RAG Architectures",
    "orderIndex": 3,
    "durationMinutes": 40,
    "contentMarkdown": "# GenAI & RAG Systems\nRetrieval-Augmented Generation indexes documents as high-dimensional vector embeddings, retrieves Top-K chunks via cosine similarity, and feeds them to LLMs for grounded answers.",
    "codeExample": "import numpy as np\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\nresume_emb = np.array([0.1, 0.9, 0.4])\njob_emb = np.array([0.15, 0.85, 0.38])\nprint(\"Match:\", round(cosine_sim(resume_emb, job_emb) * 100, 2), \"%\")",
    "practiceTask": "Calculate cosine similarity between two vector embeddings to find matching job descriptions.",
    "checkQuestion": {
      "question": "What is the primary benefit of Retrieval-Augmented Generation (RAG) over pure LLM prompting?",
      "options": [
        "It makes the model run offline",
        "It grounds responses in verified external knowledge and reduces hallucinations without retraining",
        "It replaces prompt engineering",
        "It makes embeddings 1D"
      ],
      "correctIndex": 1,
      "explanation": "RAG provides live, private, verifiable context to LLMs, dramatically reducing hallucinations."
    }
  }
];
