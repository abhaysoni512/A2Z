const curriculum = [
  { id: "c0", chapter: "0", title: "Introduction / Getting Started", track: "core" },
  { id: "c1", chapter: "1", title: "C++ Basics", track: "core" },
  { id: "c2", chapter: "2", title: "Functions and Files", track: "core" },
  { id: "c3", chapter: "3", title: "Debugging C++ Programs", track: "core" },
  { id: "c4", chapter: "4", title: "Fundamental Data Types", track: "core" },
  { id: "c5", chapter: "5", title: "Constants and Strings", track: "core" },
  { id: "c6", chapter: "6", title: "Operators", track: "core" },
  { id: "co", chapter: "O", title: "Bit Manipulation", track: "advanced" },
  { id: "c7", chapter: "7", title: "Scope, Duration, and Linkage", track: "core" },
  { id: "c8", chapter: "8", title: "Control Flow", track: "core" },
  { id: "c9", chapter: "9", title: "Error Detection and Handling", track: "core" },
  { id: "c10", chapter: "10", title: "Type Conversion and Deduction", track: "core" },
  { id: "c11", chapter: "11", title: "Overloading and Function Templates", track: "advanced" },
  { id: "cf", chapter: "F", title: "Constexpr Functions", track: "advanced" },
  { id: "c12", chapter: "12", title: "References and Pointers", track: "advanced" },
  { id: "c13", chapter: "13", title: "Enums and Structs", track: "core" },
  { id: "c14", chapter: "14", title: "Classes", track: "oop" },
  { id: "c15", chapter: "15", title: "More on Classes", track: "oop" },
  { id: "c16", chapter: "16", title: "Dynamic Arrays and std::vector", track: "core" },
  { id: "c17", chapter: "17", title: "Fixed-size Arrays and std::array", track: "core" },
  { id: "c18", chapter: "18", title: "Iterators and Algorithms", track: "advanced" },
  { id: "c19", chapter: "19", title: "Dynamic Allocation", track: "advanced" },
  { id: "c20", chapter: "20", title: "Functions", track: "advanced" },
  { id: "c21", chapter: "21", title: "Operator Overloading", track: "oop" },
  { id: "c22", chapter: "22", title: "Move Semantics and Smart Pointers", track: "advanced" },
  { id: "c23", chapter: "23", title: "Object Relationships", track: "oop" },
  { id: "c24", chapter: "24", title: "Inheritance", track: "oop" },
  { id: "c25", chapter: "25", title: "Virtual Functions", track: "oop" },
  { id: "c26", chapter: "26", title: "Templates and Classes", track: "advanced" },
  { id: "c27", chapter: "27", title: "Exceptions", track: "advanced" },
  { id: "c28", chapter: "28", title: "Input and Output", track: "core" },
  { id: "ca", chapter: "A", title: "Libraries and Miscellaneous Subjects", track: "advanced" },
  { id: "cb", chapter: "B", title: "C++11 through C++23 Updates", track: "advanced" }
];

const lessons = [
  {
    id: "hello",
    chapter: "1",
    title: "Statements make the program move",
    track: "core",
    file: "main.cpp",
    intro: "Your first mission is to make a tiny program produce a visible result. Think of each statement as one checkpoint on the route.",
    goals: ["Include iostream", "Write a main function", "Print Hello, C++ lab!"],
    starter: '#include <iostream>\n\nint main()\n{\n    // print the required message here\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    std::cout << "Hello, C++ lab!";\n    return 0;\n}\n',
    output: "Hello, C++ lab!",
    checks: [
      { text: "Program has main", test: code => /int\s+main\s*\(/.test(code) },
      { text: "Uses std::cout", test: code => /std::cout/.test(code) },
      { text: "Prints Hello, C++ lab!", test: code => /Hello,\s*C\+\+\s*lab!/.test(code) }
    ],
    hint: "Place std::cout inside main, before return 0. The exact message matters.",
    visual: "flow"
  },
  {
    id: "variables",
    chapter: "1",
    title: "Put values in named boxes",
    track: "core",
    file: "variables.cpp",
    intro: "Variables are named storage. Create two integers, combine them, and print the result.",
    goals: ["Declare apples and oranges as int", "Create total from both variables", "Print total"],
    starter: '#include <iostream>\n\nint main()\n{\n    int apples { 4 };\n    // add oranges and total\n    std::cout << total;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int apples { 4 };\n    int oranges { 3 };\n    int total { apples + oranges };\n    std::cout << total;\n    return 0;\n}\n',
    output: "7",
    checks: [
      { text: "Declares apples", test: code => /int\s+apples\s*\{?\s*4/.test(code) },
      { text: "Declares oranges", test: code => /int\s+oranges\s*\{?\s*3/.test(code) },
      { text: "Combines into total", test: code => /total[\s\S]*(apples\s*\+\s*oranges|oranges\s*\+\s*apples)/.test(code) }
    ],
    hint: "Use int oranges { 3 }; and int total { apples + oranges };.",
    visual: "memory"
  },
  {
    id: "functions",
    chapter: "2",
    title: "Extract a reusable function",
    track: "core",
    file: "functions.cpp",
    intro: "A function packages a job behind a name. Build add(), call it from main, and let the call stack do the routing.",
    goals: ["Create int add(int x, int y)", "Return x + y", "Call add(2, 5)"],
    starter: '#include <iostream>\n\n// write add here\n\nint main()\n{\n    std::cout << add(2, 5);\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint add(int x, int y)\n{\n    return x + y;\n}\n\nint main()\n{\n    std::cout << add(2, 5);\n    return 0;\n}\n',
    output: "7",
    checks: [
      { text: "Defines add with two int parameters", test: code => /int\s+add\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/.test(code) },
      { text: "Returns a sum", test: code => /return\s+\w+\s*\+\s*\w+\s*;/.test(code) },
      { text: "Calls add(2, 5)", test: code => /add\s*\(\s*2\s*,\s*5\s*\)/.test(code) }
    ],
    hint: "The function must be declared before main or forward-declared.",
    visual: "stack"
  },
  {
    id: "types",
    chapter: "4",
    title: "Choose the right type",
    track: "core",
    file: "types.cpp",
    intro: "C++ types shape how memory is read. Store an age, a price, and a pass/fail result with appropriate fundamental types.",
    goals: ["Use int for age", "Use double for price", "Use bool for passed"],
    starter: '#include <iostream>\n\nint main()\n{\n    // create age, price, and passed\n    std::cout << age << " " << price << " " << passed;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int age { 21 };\n    double price { 19.99 };\n    bool passed { true };\n    std::cout << age << " " << price << " " << passed;\n    return 0;\n}\n',
    output: "21 19.99 1",
    checks: [
      { text: "Uses int age", test: code => /int\s+age/.test(code) },
      { text: "Uses double price", test: code => /double\s+price/.test(code) },
      { text: "Uses bool passed", test: code => /bool\s+passed/.test(code) }
    ],
    hint: "Boolean values print as 1 or 0 unless you use std::boolalpha.",
    visual: "memory"
  },
  {
    id: "strings",
    chapter: "5",
    title: "Work with strings safely",
    track: "core",
    file: "strings.cpp",
    intro: "Use std::string for owning text and produce a greeting without manual character arrays.",
    goals: ["Include string", "Create std::string name", "Print Hello Ada"],
    starter: '#include <iostream>\n// include the string header\n\nint main()\n{\n    // create name\n    std::cout << "Hello " << name;\n    return 0;\n}\n',
    solution: '#include <iostream>\n#include <string>\n\nint main()\n{\n    std::string name { "Ada" };\n    std::cout << "Hello " << name;\n    return 0;\n}\n',
    output: "Hello Ada",
    checks: [
      { text: "Includes string", test: code => /#include\s*<string>/.test(code) },
      { text: "Uses std::string", test: code => /std::string\s+name/.test(code) },
      { text: "Stores Ada", test: code => /"Ada"/.test(code) }
    ],
    hint: "std::string lives in the <string> header.",
    visual: "memory"
  },
  {
    id: "operators",
    chapter: "6",
    title: "Tame operator precedence",
    track: "core",
    file: "operators.cpp",
    intro: "Parentheses make intent explicit. Calculate an average from two scores with floating-point division.",
    goals: ["Use double average", "Group scoreA + scoreB", "Divide by 2.0"],
    starter: '#include <iostream>\n\nint main()\n{\n    int scoreA { 8 };\n    int scoreB { 9 };\n    // calculate average\n    std::cout << average;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int scoreA { 8 };\n    int scoreB { 9 };\n    double average { (scoreA + scoreB) / 2.0 };\n    std::cout << average;\n    return 0;\n}\n',
    output: "8.5",
    checks: [
      { text: "Creates double average", test: code => /double\s+average/.test(code) },
      { text: "Groups addition", test: code => /\(\s*scoreA\s*\+\s*scoreB\s*\)/.test(code) },
      { text: "Uses floating division", test: code => /\/\s*2\.0/.test(code) }
    ],
    hint: "Use (scoreA + scoreB) / 2.0 so the result keeps the .5.",
    visual: "flow"
  },
  {
    id: "scope",
    chapter: "7",
    title: "Respect scope boundaries",
    track: "core",
    file: "scope.cpp",
    intro: "A block creates a smaller neighborhood. Keep the outer value stable while a nested block uses its own local variable.",
    goals: ["Create outer value as 10", "Create inner value as 3 in a nested block", "Print the outer value after the block"],
    starter: '#include <iostream>\n\nint main()\n{\n    int value { 10 };\n    {\n        // create a separate inner value\n    }\n    std::cout << value;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int value { 10 };\n    {\n        int value { 3 };\n    }\n    std::cout << value;\n    return 0;\n}\n',
    output: "10",
    checks: [
      { text: "Outer value is 10", test: code => /int\s+value\s*\{\s*10\s*\}/.test(code) },
      { text: "Nested block exists", test: code => /\{\s*int\s+value\s*\{\s*3\s*\}\s*;?\s*\}/.test(code.replace(/int\s+main\s*\(\)\s*/, "")) },
      { text: "Prints value after block", test: code => /std::cout\s*<<\s*value/.test(code) }
    ],
    hint: "The inner value shadows the outer value only inside its block.",
    visual: "stack"
  },
  {
    id: "control",
    chapter: "8",
    title: "Branch with if and else",
    track: "core",
    file: "control.cpp",
    intro: "Control flow chooses a path at runtime. Print adult when age is at least 18, otherwise minor.",
    goals: ["Write an if statement", "Check age >= 18", "Use an else branch"],
    starter: '#include <iostream>\n\nint main()\n{\n    int age { 19 };\n    // branch here\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int age { 19 };\n    if (age >= 18)\n        std::cout << "adult";\n    else\n        std::cout << "minor";\n    return 0;\n}\n',
    output: "adult",
    checks: [
      { text: "Uses if", test: code => /\bif\s*\(/.test(code) },
      { text: "Checks age >= 18", test: code => /age\s*>=\s*18/.test(code) },
      { text: "Has else branch", test: code => /\belse\b/.test(code) }
    ],
    hint: "The condition belongs inside parentheses after if.",
    visual: "branch"
  },
  {
    id: "errors",
    chapter: "9",
    title: "Guard invalid input",
    track: "core",
    file: "errors.cpp",
    intro: "Defensive code checks assumptions before doing risky work. Refuse division by zero with an early branch.",
    goals: ["Create denominator", "Check denominator == 0", "Print cannot divide"],
    starter: '#include <iostream>\n\nint main()\n{\n    int denominator { 0 };\n    // protect the division\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int denominator { 0 };\n    if (denominator == 0)\n        std::cout << "cannot divide";\n    else\n        std::cout << 10 / denominator;\n    return 0;\n}\n',
    output: "cannot divide",
    checks: [
      { text: "Checks zero", test: code => /denominator\s*==\s*0|0\s*==\s*denominator/.test(code) },
      { text: "Uses if", test: code => /\bif\s*\(/.test(code) },
      { text: "Prints cannot divide", test: code => /cannot divide/.test(code) }
    ],
    hint: "Do the zero check before the division expression can run.",
    visual: "branch"
  },
  {
    id: "auto",
    chapter: "10",
    title: "Let auto deduce the obvious",
    track: "core",
    file: "auto.cpp",
    intro: "Type deduction reduces noise when the initializer already makes the type clear.",
    goals: ["Use auto for count", "Use auto for ratio", "Print both"],
    starter: '#include <iostream>\n\nint main()\n{\n    // create count and ratio using auto\n    std::cout << count << " " << ratio;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    auto count { 4 };\n    auto ratio { 0.5 };\n    std::cout << count << " " << ratio;\n    return 0;\n}\n',
    output: "4 0.5",
    checks: [
      { text: "Uses auto for count", test: code => /auto\s+count/.test(code) },
      { text: "Uses auto for ratio", test: code => /auto\s+ratio/.test(code) },
      { text: "Prints both values", test: code => /std::cout[\s\S]*count[\s\S]*ratio/.test(code) }
    ],
    hint: "auto still needs an initializer so the compiler can deduce a type.",
    visual: "memory"
  },
  {
    id: "templates",
    chapter: "11",
    title: "Make a function template",
    track: "advanced",
    file: "templates.cpp",
    intro: "Templates let one function pattern work with multiple types. Write maxOf so int and double calls can share it.",
    goals: ["Declare template <typename T>", "Return the larger value", "Call maxOf"],
    starter: '#include <iostream>\n\n// write maxOf here\n\nint main()\n{\n    std::cout << maxOf(4, 9);\n    return 0;\n}\n',
    solution: '#include <iostream>\n\ntemplate <typename T>\nT maxOf(T a, T b)\n{\n    return (a > b) ? a : b;\n}\n\nint main()\n{\n    std::cout << maxOf(4, 9);\n    return 0;\n}\n',
    output: "9",
    checks: [
      { text: "Starts with template", test: code => /template\s*<\s*typename\s+\w+\s*>/.test(code) },
      { text: "Defines maxOf", test: code => /\bmaxOf\s*\(/.test(code) },
      { text: "Uses comparison", test: code => />/.test(code) }
    ],
    hint: "A conditional operator works well: return (a > b) ? a : b;.",
    visual: "flow"
  },
  {
    id: "pointers",
    chapter: "12",
    title: "Follow a pointer",
    track: "advanced",
    file: "pointers.cpp",
    intro: "A pointer stores an address. Point at score, dereference it, and print the value behind the address.",
    goals: ["Create int score", "Create int* ptr pointing to score", "Print *ptr"],
    starter: '#include <iostream>\n\nint main()\n{\n    int score { 42 };\n    // create pointer\n    std::cout << value;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nint main()\n{\n    int score { 42 };\n    int* ptr { &score };\n    int value { *ptr };\n    std::cout << value;\n    return 0;\n}\n',
    output: "42",
    checks: [
      { text: "Creates pointer", test: code => /int\s*\*\s*ptr|int\s+\*\s*ptr/.test(code) },
      { text: "Uses address-of", test: code => /&score/.test(code) },
      { text: "Dereferences pointer", test: code => /\*ptr/.test(code) }
    ],
    hint: "Use &score to get the address and *ptr to read the object at that address.",
    visual: "pointer"
  },
  {
    id: "structs",
    chapter: "13",
    title: "Group fields in a struct",
    track: "core",
    file: "structs.cpp",
    intro: "Structs bundle related values into a type. Model a point and read one of its members.",
    goals: ["Define struct Point", "Add x and y members", "Create Point p and print p.x"],
    starter: '#include <iostream>\n\n// define Point\n\nint main()\n{\n    // create p with x 2 and y 5\n    std::cout << p.x;\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nstruct Point\n{\n    int x {};\n    int y {};\n};\n\nint main()\n{\n    Point p { 2, 5 };\n    std::cout << p.x;\n    return 0;\n}\n',
    output: "2",
    checks: [
      { text: "Defines Point", test: code => /struct\s+Point/.test(code) },
      { text: "Has x and y", test: code => /int\s+x[\s\S]*int\s+y|int\s+y[\s\S]*int\s+x/.test(code) },
      { text: "Reads p.x", test: code => /p\.x/.test(code) }
    ],
    hint: "Use member selection with a dot: p.x.",
    visual: "class"
  },
  {
    id: "classes",
    chapter: "14",
    title: "Hide data behind behavior",
    track: "oop",
    file: "classes.cpp",
    intro: "Classes let an object protect its state and expose useful operations. Make Counter increment itself.",
    goals: ["Define class Counter", "Keep value private", "Add public increment and get"],
    starter: '#include <iostream>\n\n// define Counter\n\nint main()\n{\n    Counter clicks;\n    clicks.increment();\n    std::cout << clicks.get();\n    return 0;\n}\n',
    solution: '#include <iostream>\n\nclass Counter\n{\nprivate:\n    int value { 0 };\n\npublic:\n    void increment()\n    {\n        ++value;\n    }\n\n    int get() const\n    {\n        return value;\n    }\n};\n\nint main()\n{\n    Counter clicks;\n    clicks.increment();\n    std::cout << clicks.get();\n    return 0;\n}\n',
    output: "1",
    checks: [
      { text: "Defines class Counter", test: code => /class\s+Counter/.test(code) },
      { text: "Uses private", test: code => /private\s*:/.test(code) },
      { text: "Has increment and get", test: code => /increment\s*\([\s\S]*get\s*\(|get\s*\([\s\S]*increment\s*\(/.test(code) }
    ],
    hint: "Class members are private by default, but an explicit private: and public: make the design clear.",
    visual: "class"
  },
  {
    id: "vector",
    chapter: "16",
    title: "Grow with std::vector",
    track: "core",
    file: "vector.cpp",
    intro: "std::vector owns a dynamic sequence. Push a new value and read the final size.",
    goals: ["Include vector", "Create vector with 1, 2, 3", "push_back 4 and print size"],
    starter: '#include <iostream>\n// include vector\n\nint main()\n{\n    // create nums\n    nums.push_back(4);\n    std::cout << nums.size();\n    return 0;\n}\n',
    solution: '#include <iostream>\n#include <vector>\n\nint main()\n{\n    std::vector<int> nums { 1, 2, 3 };\n    nums.push_back(4);\n    std::cout << nums.size();\n    return 0;\n}\n',
    output: "4",
    checks: [
      { text: "Includes vector", test: code => /#include\s*<vector>/.test(code) },
      { text: "Uses std::vector<int>", test: code => /std::vector\s*<\s*int\s*>/.test(code) },
      { text: "Pushes 4", test: code => /\.push_back\s*\(\s*4\s*\)/.test(code) }
    ],
    hint: "std::vector<int> nums { 1, 2, 3 }; creates the starting sequence.",
    visual: "vector"
  },
  {
    id: "algorithms",
    chapter: "18",
    title: "Let algorithms do the loop",
    track: "advanced",
    file: "algorithms.cpp",
    intro: "The standard algorithms describe intent. Sort the values without writing a manual sorting loop.",
    goals: ["Include algorithm", "Call std::sort", "Sort using begin and end"],
    starter: '#include <algorithm>\n#include <iostream>\n#include <vector>\n\nint main()\n{\n    std::vector<int> nums { 3, 1, 2 };\n    // sort nums\n    std::cout << nums[0];\n    return 0;\n}\n',
    solution: '#include <algorithm>\n#include <iostream>\n#include <vector>\n\nint main()\n{\n    std::vector<int> nums { 3, 1, 2 };\n    std::sort(nums.begin(), nums.end());\n    std::cout << nums[0];\n    return 0;\n}\n',
    output: "1",
    checks: [
      { text: "Includes algorithm", test: code => /#include\s*<algorithm>/.test(code) },
      { text: "Calls std::sort", test: code => /std::sort\s*\(/.test(code) },
      { text: "Uses begin and end", test: code => /\.begin\s*\(\s*\)[\s\S]*\.end\s*\(\s*\)/.test(code) }
    ],
    hint: "std::sort(nums.begin(), nums.end()); sorts in ascending order.",
    visual: "vector"
  },
  {
    id: "smart-pointers",
    chapter: "22",
    title: "Own memory with unique_ptr",
    track: "advanced",
    file: "smart_pointers.cpp",
    intro: "Smart pointers turn ownership into an object with cleanup rules. Create a unique_ptr and dereference it.",
    goals: ["Include memory", "Use std::make_unique<int>", "Print *score"],
    starter: '#include <iostream>\n// include memory\n\nint main()\n{\n    // create score as a unique_ptr<int> holding 12\n    std::cout << *score;\n    return 0;\n}\n',
    solution: '#include <iostream>\n#include <memory>\n\nint main()\n{\n    auto score { std::make_unique<int>(12) };\n    std::cout << *score;\n    return 0;\n}\n',
    output: "12",
    checks: [
      { text: "Includes memory", test: code => /#include\s*<memory>/.test(code) },
      { text: "Uses make_unique", test: code => /std::make_unique\s*<\s*int\s*>/.test(code) },
      { text: "Dereferences score", test: code => /\*score/.test(code) }
    ],
    hint: "Prefer make_unique over new for direct unique ownership.",
    visual: "pointer"
  },
  {
    id: "inheritance",
    chapter: "24",
    title: "Derive a specialized type",
    track: "oop",
    file: "inheritance.cpp",
    intro: "Inheritance models an is-a relationship. Make Dog inherit from Animal and override speak.",
    goals: ["Define Animal with virtual speak", "Define Dog : public Animal", "Return woof from Dog"],
    starter: '#include <iostream>\n#include <string>\n\n// define Animal and Dog\n\nint main()\n{\n    Dog d;\n    std::cout << d.speak();\n    return 0;\n}\n',
    solution: '#include <iostream>\n#include <string>\n\nclass Animal\n{\npublic:\n    virtual std::string speak() const\n    {\n        return "sound";\n    }\n};\n\nclass Dog : public Animal\n{\npublic:\n    std::string speak() const override\n    {\n        return "woof";\n    }\n};\n\nint main()\n{\n    Dog d;\n    std::cout << d.speak();\n    return 0;\n}\n',
    output: "woof",
    checks: [
      { text: "Animal has virtual speak", test: code => /virtual[\s\S]*speak\s*\(/.test(code) },
      { text: "Dog publicly inherits", test: code => /class\s+Dog\s*:\s*public\s+Animal/.test(code) },
      { text: "Uses override", test: code => /\boverride\b/.test(code) }
    ],
    hint: "The derived declaration is class Dog : public Animal.",
    visual: "inheritance"
  },
  {
    id: "exceptions",
    chapter: "27",
    title: "Throw and catch a failure",
    track: "advanced",
    file: "exceptions.cpp",
    intro: "Exceptions move error handling to a catch block when normal return values would make the path noisy.",
    goals: ["Throw std::runtime_error", "Catch std::exception", "Print handled"],
    starter: '#include <exception>\n#include <iostream>\n#include <stdexcept>\n\nint main()\n{\n    try\n    {\n        // throw an error\n    }\n    catch (const std::exception&)\n    {\n        std::cout << "handled";\n    }\n    return 0;\n}\n',
    solution: '#include <exception>\n#include <iostream>\n#include <stdexcept>\n\nint main()\n{\n    try\n    {\n        throw std::runtime_error { "bad path" };\n    }\n    catch (const std::exception&)\n    {\n        std::cout << "handled";\n    }\n    return 0;\n}\n',
    output: "handled",
    checks: [
      { text: "Throws runtime_error", test: code => /throw\s+std::runtime_error/.test(code) },
      { text: "Uses catch", test: code => /\bcatch\s*\(/.test(code) },
      { text: "Prints handled", test: code => /handled/.test(code) }
    ],
    hint: "Throw inside try. The catch block is already waiting.",
    visual: "exception"
  },
  {
    id: "io",
    chapter: "28",
    title: "Write a file stream",
    track: "core",
    file: "io.cpp",
    intro: "File streams use the same insertion style as cout. Create an output file stream and write a word.",
    goals: ["Include fstream", "Create std::ofstream out", "Write saved"],
    starter: '#include <iostream>\n// include fstream\n\nint main()\n{\n    // create out for notes.txt\n    out << "saved";\n    std::cout << "done";\n    return 0;\n}\n',
    solution: '#include <iostream>\n#include <fstream>\n\nint main()\n{\n    std::ofstream out { "notes.txt" };\n    out << "saved";\n    std::cout << "done";\n    return 0;\n}\n',
    output: "done",
    checks: [
      { text: "Includes fstream", test: code => /#include\s*<fstream>/.test(code) },
      { text: "Creates ofstream", test: code => /std::ofstream\s+out/.test(code) },
      { text: "Writes saved", test: code => /out\s*<<\s*"saved"/.test(code) }
    ],
    hint: "std::ofstream out { \"notes.txt\" }; opens a file for output.",
    visual: "io"
  }
];

const state = {
  activeLesson: 0,
  filter: "all",
  completed: new Set(JSON.parse(localStorage.getItem("cppLabCompleted") || "[]")),
  commandHistory: [],
  commandIndex: 0
};

const el = {
  topicList: document.querySelector("#topicList"),
  lessonMeta: document.querySelector("#lessonMeta"),
  lessonTitle: document.querySelector("#lessonTitle"),
  lessonIntro: document.querySelector("#lessonIntro"),
  checklist: document.querySelector("#checklist"),
  codeEditor: document.querySelector("#codeEditor"),
  fileName: document.querySelector("#fileName"),
  visualTitle: document.querySelector("#visualTitle"),
  visualBadge: document.querySelector("#visualBadge"),
  visualCanvas: document.querySelector("#visualCanvas"),
  terminalLog: document.querySelector("#terminalLog"),
  programOutput: document.querySelector("#programOutput"),
  scoreBadge: document.querySelector("#scoreBadge"),
  progressBar: document.querySelector("#progressBar"),
  progressText: document.querySelector("#progressText"),
  completedCount: document.querySelector("#completedCount"),
  learningGraph: document.querySelector("#learningGraph"),
  hintText: document.querySelector("#hintText"),
  commandInput: document.querySelector("#commandInput")
};

function saveProgress() {
  localStorage.setItem("cppLabCompleted", JSON.stringify([...state.completed]));
}

function currentLesson() {
  return lessons[state.activeLesson];
}

function normalizeCode(code) {
  return code.replace(/\s+/g, " ").trim();
}

function renderTopics() {
  const rows = curriculum
    .filter(topic => state.filter === "all" || topic.track === state.filter)
    .map(topic => {
      const lessonIndex = lessons.findIndex(lesson => lesson.chapter === topic.chapter);
      const isActive = lessonIndex === state.activeLesson;
      const lesson = lessons[lessonIndex];
      const done = lesson && state.completed.has(lesson.id);
      const disabled = lessonIndex === -1 ? " aria-disabled=\"true\"" : "";
      const subtitle = lesson ? `Mission: ${lesson.title}` : "Topic mapped; mission coming next";
      return `<button class="topic-button ${isActive ? "active" : ""} ${done ? "done" : ""}" data-lesson="${lessonIndex}" type="button"${disabled}>
        <span class="topic-number">${topic.chapter}</span>
        <span><span class="topic-title">${topic.title}</span><span class="topic-subtitle">${subtitle}</span></span>
        <span class="pill">${topic.track}</span>
      </button>`;
    })
    .join("");
  el.topicList.innerHTML = rows;
}

function renderChecklist(results = []) {
  const lesson = currentLesson();
  el.checklist.innerHTML = lesson.goals.map((goal, index) => {
    const passed = results[index];
    const icon = passed === undefined ? "-" : passed ? "OK" : "!";
    return `<div class="check-item">
      <span class="check-icon">${icon}</span>
      <span>${goal}</span>
    </div>`;
  }).join("");
}

function renderLesson(resetCode = true) {
  const lesson = currentLesson();
  el.lessonMeta.textContent = `chapter ${lesson.chapter} / ${lesson.track}`;
  el.lessonTitle.textContent = lesson.title;
  el.lessonIntro.textContent = lesson.intro;
  el.fileName.textContent = lesson.file;
  el.hintText.hidden = true;
  el.hintText.textContent = lesson.hint;
  if (resetCode) {
    el.codeEditor.value = localStorage.getItem(`cppLabCode:${lesson.id}`) || lesson.starter;
  }
  el.programOutput.textContent = "// Output appears here after Run.";
  el.scoreBadge.textContent = state.completed.has(lesson.id) ? "complete" : "not run";
  renderChecklist();
  renderVisual(lesson.visual, false);
  renderTopics();
  renderGraph();
  renderProgress();
}

function renderProgress() {
  const total = lessons.length;
  const complete = state.completed.size;
  const percent = total ? Math.round((complete / total) * 100) : 0;
  el.progressBar.style.width = `${percent}%`;
  el.progressText.textContent = `${complete} of ${total} missions complete`;
  el.completedCount.textContent = `${complete}/${total}`;
}

function renderGraph() {
  el.learningGraph.innerHTML = lessons.map((lesson, index) => {
    const className = [
      "graph-dot",
      state.completed.has(lesson.id) ? "done" : "",
      index === state.activeLesson ? "active" : ""
    ].join(" ");
    return `<button class="${className}" data-graph="${index}" type="button" title="${lesson.title}" aria-label="${lesson.title}"></button>`;
  }).join("");
}

function visualTemplate(type, running) {
  const pulse = running ? "active" : "";
  const templates = {
    flow: `<div class="node-lane"></div>
      <div class="node active" style="left: 8%; top: 70px;">start</div>
      <div class="node ${pulse}" style="left: 40%; top: 70px;">stmt</div>
      <div class="node" style="left: 72%; top: 70px;">return</div>`,
    memory: `<div class="memory-grid">
      <div class="memory-cell"><strong>name</strong>apples</div>
      <div class="memory-cell"><strong>value</strong>4</div>
      <div class="memory-cell"><strong>name</strong>oranges</div>
      <div class="memory-cell"><strong>value</strong>3</div>
      <div class="memory-cell"><strong>name</strong>total</div>
      <div class="memory-cell"><strong>value</strong>${running ? "7" : "?"}</div>
    </div>`,
    stack: `<div class="stack-grid">
      <div class="stack-frame"><strong>main()</strong>owns the current local variables</div>
      <div class="stack-frame"><strong>called function / block</strong>${running ? "active frame resolves and returns" : "waiting for a call"}</div>
      <div class="stack-frame"><strong>result</strong>control returns to main</div>
    </div>`,
    branch: `<div class="node active" style="left: 40%; top: 32px;">if</div>
      <div class="node ${running ? "active" : ""}" style="left: 18%; top: 145px;">true</div>
      <div class="node" style="left: 64%; top: 145px;">false</div>
      <svg width="100%" height="220" viewBox="0 0 420 220" aria-hidden="true">
        <path d="M210 82 C160 110 120 130 98 154" stroke="currentColor" fill="none" stroke-width="3"/>
        <path d="M210 82 C260 110 300 130 322 154" stroke="currentColor" fill="none" stroke-width="3"/>
      </svg>`,
    pointer: `<div class="arrow-row">
      <div class="pointer-card"><strong>ptr</strong><span>0xA12</span></div>
      <div class="arrow"></div>
      <div class="pointer-card"><strong>score</strong><span>${running ? "42" : "?"}</span></div>
    </div>`,
    class: `<div class="class-grid">
      <div class="class-box"><strong>type</strong>Point / Counter</div>
      <div class="class-box"><strong>data</strong>x, y, value</div>
      <div class="class-box"><strong>behavior</strong>get(), increment()</div>
    </div>`,
    vector: `<div class="vector-grid">
      <div class="vector-cell"><strong>[0]</strong>1</div>
      <div class="vector-cell"><strong>[1]</strong>2</div>
      <div class="vector-cell"><strong>[2]</strong>3</div>
      <div class="vector-cell"><strong>[3]</strong>${running ? "4" : ""}</div>
      <div class="vector-cell"><strong>size</strong>${running ? "4" : "3"}</div>
    </div>`,
    inheritance: `<div class="class-grid">
      <div class="class-box"><strong>Animal</strong>virtual speak()</div>
      <div class="class-box"><strong>Dog</strong>inherits public Animal</div>
      <div class="class-box"><strong>dispatch</strong>${running ? "Dog::speak()" : "waiting"}</div>
    </div>`,
    exception: `<div class="stack-grid">
      <div class="stack-frame"><strong>try</strong>normal path starts</div>
      <div class="stack-frame"><strong>throw</strong>${running ? "runtime_error travels" : "no exception yet"}</div>
      <div class="stack-frame"><strong>catch</strong>handler prints handled</div>
    </div>`,
    io: `<div class="io-grid">
      <div class="stream-box"><strong>std::ofstream</strong>opens notes.txt</div>
      <div class="stream-box"><strong>&lt;&lt;</strong>writes saved</div>
      <div class="stream-box"><strong>std::cout</strong>prints done</div>
    </div>`
  };
  return templates[type] || templates.flow;
}

function renderVisual(type, running) {
  const labels = {
    flow: "Execution route",
    memory: "Memory model",
    stack: "Call stack",
    branch: "Branch path",
    pointer: "Address model",
    class: "Object layout",
    vector: "Sequence model",
    inheritance: "Inheritance map",
    exception: "Exception path",
    io: "Stream model"
  };
  el.visualTitle.textContent = labels[type] || "Runtime model";
  el.visualBadge.textContent = running ? "running" : "ready";
  el.visualCanvas.innerHTML = visualTemplate(type, running);
}

function runCode() {
  const lesson = currentLesson();
  const code = el.codeEditor.value;
  const results = lesson.checks.map(check => check.test(code));
  const passed = results.every(Boolean);
  renderChecklist(results);
  renderVisual(lesson.visual, true);
  if (passed) {
    state.completed.add(lesson.id);
    saveProgress();
    el.programOutput.textContent = lesson.output;
    el.scoreBadge.textContent = "passed";
    log(`mission passed: ${lesson.title}`);
  } else {
    const missing = lesson.checks
      .filter((check, index) => !results[index])
      .map(check => `- ${check.text}`)
      .join("\n");
    el.programOutput.textContent = `Build failed in the trainer checks.\n${missing}`;
    el.scoreBadge.textContent = "try again";
    log("trainer checks need another pass", "error");
  }
  renderTopics();
  renderGraph();
  renderProgress();
}

function log(message, type = "info") {
  const line = document.createElement("p");
  line.className = `log-line ${type === "command" ? "log-command" : ""} ${type === "error" ? "log-error" : ""}`;
  line.textContent = message;
  el.terminalLog.appendChild(line);
  el.terminalLog.scrollTop = el.terminalLog.scrollHeight;
}

function gotoLesson(index) {
  if (index < 0 || index >= lessons.length) {
    log("No mission exists at that index.", "error");
    return;
  }
  state.activeLesson = index;
  renderLesson();
  log(`switched to ${lessons[index].id}`);
}

function executeCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;
  state.commandHistory.push(command);
  state.commandIndex = state.commandHistory.length;
  log(`$ ${command}`, "command");

  const [name, ...args] = command.split(/\s+/);
  if (name === "help") {
    log("Commands: help, topics, goto <id|number>, next, prev, run, hint, answer, reset");
  } else if (name === "topics") {
    log(lessons.map((lesson, index) => `${index + 1}. ${lesson.id} - ${lesson.title}`).join("\n"));
  } else if (name === "goto") {
    const target = args.join(" ");
    const numeric = Number(target);
    const index = Number.isFinite(numeric) && target !== "" ? numeric - 1 : lessons.findIndex(lesson => lesson.id === target);
    gotoLesson(index);
  } else if (name === "next") {
    gotoLesson(Math.min(lessons.length - 1, state.activeLesson + 1));
  } else if (name === "prev") {
    gotoLesson(Math.max(0, state.activeLesson - 1));
  } else if (name === "run") {
    runCode();
  } else if (name === "hint") {
    el.hintText.hidden = false;
    log(currentLesson().hint);
  } else if (name === "answer") {
    el.codeEditor.value = currentLesson().solution;
    log("Loaded the reference answer into the editor.");
  } else if (name === "reset") {
    el.codeEditor.value = currentLesson().starter;
    log("Reset this mission starter code.");
  } else {
    log(`Unknown command: ${name}. Try help.`, "error");
  }
}

document.querySelector("#runButton").addEventListener("click", runCode);
document.querySelector("#hintButton").addEventListener("click", () => {
  el.hintText.hidden = !el.hintText.hidden;
});
document.querySelector("#resetCode").addEventListener("click", () => {
  el.codeEditor.value = currentLesson().starter;
});
document.querySelector("#showAnswer").addEventListener("click", () => {
  el.codeEditor.value = currentLesson().solution;
});
document.querySelector("#prevLesson").addEventListener("click", () => {
  gotoLesson(Math.max(0, state.activeLesson - 1));
});
document.querySelector("#nextLesson").addEventListener("click", () => {
  gotoLesson(Math.min(lessons.length - 1, state.activeLesson + 1));
});
document.querySelector("#resetProgress").addEventListener("click", () => {
  state.completed.clear();
  saveProgress();
  renderLesson(false);
  log("Progress reset.");
});
document.querySelector("#themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("cppLabTheme", document.documentElement.classList.contains("dark") ? "dark" : "light");
});
document.querySelector("#commandForm").addEventListener("submit", event => {
  event.preventDefault();
  executeCommand(el.commandInput.value);
  el.commandInput.value = "";
});
el.commandInput.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    state.commandIndex = Math.max(0, state.commandIndex - 1);
    el.commandInput.value = state.commandHistory[state.commandIndex] || "";
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.commandIndex = Math.min(state.commandHistory.length, state.commandIndex + 1);
    el.commandInput.value = state.commandHistory[state.commandIndex] || "";
  }
});
el.codeEditor.addEventListener("input", () => {
  localStorage.setItem(`cppLabCode:${currentLesson().id}`, el.codeEditor.value);
});
el.topicList.addEventListener("click", event => {
  const button = event.target.closest("[data-lesson]");
  if (!button) return;
  const index = Number(button.dataset.lesson);
  if (index >= 0) gotoLesson(index);
});
el.learningGraph.addEventListener("click", event => {
  const button = event.target.closest("[data-graph]");
  if (button) gotoLesson(Number(button.dataset.graph));
});
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    state.filter = tab.dataset.filter;
    renderTopics();
  });
});

if (localStorage.getItem("cppLabTheme") === "dark") {
  document.documentElement.classList.add("dark");
}

renderLesson();
log("C++ Branching Lab ready. Type help or press Run code.");
