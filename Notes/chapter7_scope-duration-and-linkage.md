# Chapter 7: Scope, Duration, and Linkage

---
## Local variables

> 🧠 **In one sentence:** A local variable's scope is purely compile-time, but its linkage rules mean each instance is memory-independent and private to that block.

Scope defines where an identifier is valid in the program. It starts at the point of declaration and ends at the closing brace of its block. Since scope is checked at compile-time, using an identifier outside its block causes a compilation error.

Linkage determines whether multiple declarations of the same name refer to the exact same object in memory. Local variables have **no linkage**, meaning every time you declare a local variable, you get a unique, independent object.

Global variables have static duration. They are created before `main()` executes and destroyed when the program terminates. These are sometimes called static variables. By default, globals have **external linkage**, allowing other scopes to refer to the same object.

```cpp
int main()
{
    int x { 2 }; // local variable, no linkage

    {
        // this declaration of x refers to a different object than the previous x
        int x { 3 }; 
    }

    return 0;
}
```

> ⚠️ **GOTCHA — Shadowing local variables:**
> Declaring a local variable with the same name inside a nested block hides the outer variable. You lose access to the outer one until the inner block ends.
> **What to say in an interview:** "Shadowing is legal but dangerous; I use `-Wshadow` to treat it as an error to prevent silent logic bugs."

📊 **Quick comparison:**

|                      | **Scope** | **Linkage** | **Duration** |
|----------------------|-----------|-------------|--------------|
| **What it means**    | Visibility to the compiler | Identity across translation units | Lifetime in memory |
| **Local variables**  | Block scope | No linkage | Automatic (stack) |
| **Global variables** | Global (file) scope | External (default) | Static |

> 🔗 **See also:** Chapter 10 — Type Conversion (covers duration of temporary types)

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What does it mean for a local variable to have "no linkage"?**

A: It means the variable is completely independent of any other variable with the same name elsewhere in the program. Even if two different functions both declare `int count`, the compiler treats them as two separate objects with distinct memory addresses.

**Q2 [🔧 Product Co | 🟡 2yr]: If a global variable has static duration, why do we care about its linkage?**

A: Static duration just guarantees the variable lives for the life of the program. Linkage guarantees whether two files can *share* that single instance (external linkage) or if each file gets its own hidden copy (internal linkage). Without linkage rules, multi-file programs would constantly fail to link.

**Q3 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this print?**

```cpp
#include <iostream>

int x = 5;

int main() {
    int x = 10;
    {
        int x = 15;
        std::cout << ::x << " " << x << " ";
    }
    std::cout << x;
}
```

A: Prints `5 15 10`. The `::x` explicitly requests the global namespace variable (`5`). Inside the block, the innermost local `x` shadows the outer one (`15`). Once the block ends, the outer local `x` is visible again (`10`). Fix: Avoid variable shadowing altogether.

**Q4 [⚡ HFT | 🔴 Senior]: Can a local variable have internal linkage?**

A: No, local variables can never have internal linkage. They either have *no linkage* (standard local variables) or *no linkage but static duration* (when declared `static` inside a function, meaning they persist across calls but are still only visible inside that function).

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Does this compile?**

```cpp
int main() {
    int val = 10;
    if (val > 5) {
        int result = val * 2;
    }
    return result; 
}
```

A: **Compile error.** `result` is declared inside the `if` block, so its scope ends at the closing brace. Returning it outside the block refers to an undeclared identifier. Fix: Move the declaration of `result` before the `if` statement.

---

> 💡 **Interview tip:** Interviewers often use scope shadowing in dry-run tracing tests. Always keep track of which brace depth you are currently in.

---
## Internal linkage

> 🧠 **In one sentence:** Internal linkage keeps an identifier completely private to its translation unit, hiding it from the rest of the program and preventing linker conflicts.

An identifier with internal linkage can only be seen and used within the source file (translation unit) where it is defined. If you use internal linkage, two different files can define a variable or function with the exact same name, and the linker will treat them as independent objects. This is a common way to avoid One Definition Rule (ODR) violations.

You give global variables and free functions internal linkage by marking them with the `static` keyword. These are referred to as internal variables or internal functions.

```cpp
// Added example: Internal linkage
// File1.cpp
static int g_internal_count = 10; // Private to File1.cpp

// File2.cpp
static int g_internal_count = 50; // Private to File2.cpp, no conflict with File1

int main() {
    return 0;
}
```
// Output: none (compiles smoothly without ODR errors)

> ⚠️ **GOTCHA — Misusing `static` on globals in headers:**
> If you put a `static` global variable in a header file and `#include` it in 5 source files, you create 5 independent copies of that variable. Modifying one copy won't update the others.
> **What to say in an interview:** "I never put `static` data in headers; it creates hidden duplicates across translation units. I prefer unnamed namespaces or `inline` variables."

📊 **Quick comparison:**

|                      | **Internal Linkage (`static` global)** | **External Linkage (default global)** |
|----------------------|----------------------------------------|---------------------------------------|
| **Visibility**       | One translation unit                   | Entire program                        |
| **Linker Conflicts** | Impossible                             | Happens if defined multiple times     |
| **Use case**         | Helper functions, file-local data      | Shared application state              |

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What does the `static` keyword do when applied to a global variable?**

A: It changes the variable's linkage from external (the default) to internal. This means the variable name is not exported to the linker, keeping the variable strictly private to the `.cpp` file it was defined in.

**Q2 [🔧 Product Co | 🟡 2yr]: If both internal linkage and unnamed namespaces provide translation-unit privacy, why prefer unnamed namespaces?**

A: Unnamed namespaces are the modern C++ standard. `static` only works for variables and functions, while unnamed namespaces can also hide types (like classes and structs) from the global namespace. It provides a single, uniform way to encapsulate file-local implementation details.

**Q3 [🔧 Product Co | 🟡 2yr]: [🐛 Bug?] What is the logical bug here?**

```cpp
// math_utils.h
static int helper_counter = 0;

inline void add_counter() {
    helper_counter++;
}
```

A: **Hidden duplication.** Every `.cpp` file that includes `math_utils.h` gets its own private copy of `helper_counter`. If two different files call `add_counter()`, they are incrementing completely different variables. Fix: Use `inline` for the variable (C++17) or declare it `extern` and define it in exactly one `.cpp` file.

**Q4 [⚡ HFT | 🔴 Senior]: What happens to the symbol table when you use internal linkage?**

A: The compiler generates local symbols instead of global exported symbols in the object file. When the linker combines the object files, it ignores these local symbols during cross-file resolution, which is why naming collisions are avoided and link times can slightly improve.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---

> 💡 **Interview tip:** When asked about the `static` keyword, explicitly clarify that you know its three different meanings: inside a function (duration), on a global (linkage), and in a class (shared member).

---
## External linkage and variable forward declarations

> 🧠 **In one sentence:** External linkage allows an identifier to be shared across the entire program by defining it exactly once and forward-declaring it everywhere else using `extern`.

An identifier with external linkage is visible everywhere. Non-constant global variables have external linkage by default. However, to use that global variable in *another* file, you must tell the compiler it exists by using a forward declaration with the `extern` keyword. 

The `extern` keyword tells the compiler the variable's type and name, but it doesn't allocate memory or create a new object. It promises the linker that the object will be found elsewhere.

> **Note:** Constant global variables (`const`) have internal linkage by default. To share a `const` global across files, you must explicitly declare it as `extern` during its actual definition, not just in its forward declaration. 

```cpp
// File1.cpp
int g_x { 2 };                          // non-constant, external by default

extern const int g_y { 3 };             // const global forced to be external
extern constexpr int g_z { 3 };         // constexpr global forced to be external

// File2.cpp
extern int g_x;                         // Forward declaration to access g_x
extern const int g_y;                   // Forward declaration to access g_y

int main()
{
    return 0;
}
```

> ⚠️ **GOTCHA — ODR Violation missing `extern`:**
> If you put `int global_state = 0;` in a header file, every `.cpp` file gets a definition. The linker will throw an "ODR violation / multiple definition" error.
> **What to say in an interview:** "Globals should be declared `extern` in a header, but defined (initialized) in exactly one `.cpp` file to satisfy the One Definition Rule."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: How do you share a single global variable across multiple source files?**

A: In a header file, write a forward declaration using `extern type name;`. Include that header in files that need it. In exactly one `.cpp` file, provide the actual definition `type name = value;`. 

**Q2 [🔧 Product Co | 🟡 2yr]: Why do `const` globals default to internal linkage while regular globals default to external linkage?**

A: C++ heavily relies on replacing `const` variables with direct constant values at compile time. By making them internally linked by default, the compiler can safely optimize them without worrying about another file modifying or relying on the exact memory address. To override this, you must explicitly use `extern const`.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Will this link successfully?**

```cpp
// config.h
const int max_connections = 100;

// server.cpp
#include "config.h"

// client.cpp
#include "config.h"
extern const int max_connections;
```

A: Yes, it links, but it usually behaves unexpectedly. Because `const` implies internal linkage, `server.cpp` and `client.cpp` get two different variables named `max_connections`. The `extern` in `client.cpp` promises an external symbol, which fails to match the internal one from the header. Fix: Declare it `inline const int` (C++17) or `static constexpr`.

**Q4 [⚡ HFT | 🔴 Senior]: Is declaring `extern constexpr` ever useful?**

A: It is generally useless and discouraged. `constexpr` implies the value must be known at compile time for constant expression evaluation. If you use `extern constexpr`, the compiler in other files cannot see the value, so it can't use it in contexts that require compile-time constants (like template parameters or array sizes). 

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [💀 UB?] What linker issue occurs here?**

```cpp
// globals.h
int g_counter = 0;

// a.cpp
#include "globals.h"

// b.cpp
#include "globals.h"

int main() {}
```

A: **Multiple definition error.** `int g_counter = 0` is a definition. Including it in two `.cpp` files breaks the One Definition Rule (ODR). The linker will fail. Fix: Add `inline` (in C++17) or declare it `extern` and define it in one `.cpp` file.

---

**Snippet 2 [🏢 Service Co | 🟢 Any]: [❌ Won't compile?] What's wrong with this forward declaration?**

```cpp
// file1.cpp
extern int value = 5;

// file2.cpp
extern int value = 10;
```

A: **Compile/Link error.** Adding an initialization (`= 5` or `= 10`) turns an `extern` declaration back into a full definition. This results in multiple definitions of `value`. Fix: Provide initialization in only one file, and use `extern int value;` without initialization in the other.

---
> 💡 **Interview tip:** External globals are often considered bad practice due to initialization order fiascos. Always mention singletons, dependency injection, or `inline` variables as safer alternatives.

---
## Inline functions and variables

> 🧠 **In one sentence:** The `inline` keyword allows you to define a function or a variable in a header file without causing a multiple-definition linker error when included in multiple translation units.

Historically, inline expansion was an optimizer hint replacing a function call with the actual function body to save call-overhead. However, inline expansion can cause executable bloat if overused.

In modern C++, `inline` means "multiple definitions are allowed." An inline function or variable can be defined in multiple translation units without violating the One Definition Rule (ODR). The linker simply merges all identical definitions into one. This is exactly what lets us define functions or variables directly inside header files.

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about inline, I'd say:
> Originally, `inline` was just a hint for the compiler to embed the function body directly. Today, compilers ignore that hint for optimization. Instead, the real purpose of `inline` is linkage—it relaxes the One Definition Rule, letting us define functions and variables directly in header files without angering the linker."

The compiler must see the full definition of an inline function in each translation unit where it is used. Similar to functions, C++17 introduced inline variables, allowing global variables to be defined in headers trivially.

> **Note:** Inline expansion has its own potential cost: if the body takes more instructions than the function call itself, expanding it everywhere increases binary size, hurting memory cache performance.

```cpp
// Added example: Inline Variables (C++17)
// constants.h
#pragma once
// Defined directly in the header, merged gracefully by the linker.
inline constexpr double gravity = 9.81;

// main.cpp
#include "constants.h"
#include <iostream>

int main() {
    std::cout << gravity; 
    return 0;
}
// Output: 9.81
```

> ⚠️ **GOTCHA — ODR Violation across inline definitions:**
> If you define an `inline` function differently in two different translation units, the linker will arbitrarily pick one to use everywhere. This is undefined behavior.
> **What to say in an interview:** "If I use inline, I make sure the definitions are strictly identical by placing it in a header file, rather than manually typing it in multiple source files."

📊 **Quick comparison:**

|                      | **Traditional function**               | **Inline function/variable** |
|----------------------|----------------------------------------|------------------------------|
| **Header placement** | Generates ODR linker errors            | Perfectly safe               |
| **Linker behavior**  | Expects exactly one definition         | Collapses duplicates into one|

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Does the `inline` keyword guarantee that a function will be inlined for performance?**

A: No. It is merely a suggestion to the optimizer, which modern compilers typically ignore in favor of their own cost heuristics. Its primary modern role is simply to allow definitions in headers without violating the ODR.

**Q2 [🔧 Product Co | 🟡 2yr]: What is the difference between a `static` global variable in a header and an `inline` global variable in a header?**

A: A `static` variable creates a separate, independent copy of the variable for every `.cpp` file that includes the header. An `inline` variable (introduced in C++17) ensures there is only one shared instance across the entire program. `inline` is almost always what you actually want.

**Q3 [🔧 Product Co | 🟡 2yr]: [💀 UB?] What happens here when the program runs?**

```cpp
// A.cpp
inline int getValue() { return 10; }
int callA() { return getValue(); }

// B.cpp
inline int getValue() { return 20; }
int callB() { return getValue(); }
```

A: **Undefined Behavior.** The C++ standard dictates that all definitions of an `inline` function across the program must be identical. If they are different, no diagnostic is required, and the linker will silently choose one. Calling `callA()` and `callB()` might both return `10`, or both `20`. Fix: Only define inline functions once in a shared header.

**Q4 [⚡ HFT | 🔴 Senior]: Does an inline function exist at a specific memory address?**

A: Yes, if its address is taken anywhere in the program, the compiler must emit out-of-line code for it. The linker guarantees that taking the address of an inline function in different translation units will yield the exact same memory address.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Will this link?**

```cpp
// Header.h
inline int process_data(); 

// App.cpp
#include "Header.h"
int main() { process_data(); }

// Utils.cpp
#include "Header.h"
int process_data() { return 0; }
```

A: **Linker error (usually).** The compiler must see the *full definition* of an inline function in every translation unit where it is called. `App.cpp` only saw the declaration, making the compiler skip emitting a call and assume it would expand the body. Fix: Move the body of `process_data` into `Header.h`.

---

**Snippet 2 [🚀 HFT | 🔴 Senior]: [🖥️ Output?] What is the output address check?**

```cpp
// utils.h
inline int shared_var = 42;  // C++17

// file1.cpp
#include "utils.h"
int* getFile1Ptr() { return &shared_var; }

// file2.cpp
#include "utils.h"
int* getFile2Ptr() { return &shared_var; }

// main.cpp
#include <iostream>
extern int* getFile1Ptr();
extern int* getFile2Ptr();

int main() {
    std::cout << (getFile1Ptr() == getFile2Ptr());
}
```

A: `1` (true). The linker resolves all inline variables to point to the exact same unique object in memory. This is why `inline` variables perfectly replace the old `extern` forward declaration pattern for global state.

---
> 💡 **Interview tip:** If asked "How do you define a singleton in modern C++?", defining the static instance as an `inline` variable in the class declaration itself (C++17) is the cleanest answer.

---
## Qualified and unqualified names

> 🧠 **In one sentence:** A qualified name explicitly states its namespace using the `::` operator, while an unqualified name relies on the current scope and `using` directives to figure out what it refers to.

Names most often get qualified with a namespace using the scope resolution operator (`::`). For example, `std::cout` explicitly asks for `cout` from the `std` namespace, while `::foo` requests `foo` from the global namespace.

A using-directive (`using namespace MyNamespace;`) brings all the names from a namespace into the current scope, allowing you to use unqualified names. However, this easily causes name conflicts if two namespaces contain identically named variables or functions.

```cpp
#include <iostream>

namespace A {
    int x { 10 };
}

namespace B {
    int x { 20 };
}

int main() {
    using namespace A;
    using namespace B;

    // COMPILE ERROR: Ambiguous access to 'x'
    // std::cout << x << '\n';

    // Fix: explicitly qualify the name
    std::cout << A::x << '\n';

    return 0;
}
// Output: 10
```

> ⚠️ **GOTCHA — `using namespace` in header files:**
> Putting a `using namespace` directive in a header forces that namespace on every single file that includes the header. It irreversibly pollutes the global scope and guarantees collisions.
> **What to say in an interview:** "I never put `using namespace` in a header. If I need it, I restrict it to a narrow block scope inside a `.cpp` file, or explicitly use `namespace::identifier`."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What happens if you define a local variable with the same name as a global variable, and you need to access the global one?**

A: The local variable shadows the global one. To access the global variable, use the global scope resolution operator: `::variable_name`.

**Q2 [🔧 Product Co | 🟡 2yr]: What is the difference between a using-declaration and a using-directive?**

A: A using-declaration brings exactly one specific identifier into scope (e.g., `using std::cout;`). A using-directive dumps every single identifier from the entire namespace into the current scope (e.g., `using namespace std;`). The former is significantly safer.

**Q3 [🏢 Service Co | 🟢 Any]: [❌ Won't compile?] Why won't this code compile?**

```cpp
#include <iostream>

namespace data { int count = 5; }

int main() {
    int count = 10;
    using namespace data;
    std::cout << count;
}
```

A: **Trick question—it DOES compile.** It prints `10`. The local variable `count` takes precedence over the `data::count` brought in by `using namespace data;`. There is no ambiguity error until you actually try to define a conflicting name in the identical scope level. Fix to print `5`: change to `data::count`.

**Q4 [⚡ HFT | 🔴 Senior]: What is argument-dependent lookup (ADL / Koenig lookup)?**

A: ADL allows unqualified function calls to find functions defined in the namespaces of their arguments. For example, `std::cout << "Hi"` calls `std::operator<<` without full qualification because `"Hi"` and `std::cout` are evaluated, and the compiler searches `std::` to find the matching operator.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] What's the error?**

```cpp
#include <vector>

namespace math {
    int max(int a, int b) { return a > b ? a : b; }
}

using namespace std;
using namespace math;

int main() {
    int x = max(10, 20);
}
```

A: **Ambiguous call to overloaded function.** `std::max` is brought in from `<vector>` (via `<algorithm>` usually) and `math::max` is brought in from `namespace math`. Because both are matched and unqualified, the compiler halts. Fix: `math::max(10, 20)`.

---

**Snippet 2 [🌐 All | 🟢 Any]: [🖥️ Output?] What prints?**

```cpp
#include <iostream>

int val = 99;

int main() {
    int val = 5;
    {
        int val = 1;
        std::cout << ::val;
    }
}
```

A: `99`. The `::` scope resolution operator with nothing before it forces the compiler to look in the global namespace, entirely ignoring all local variables named `val`.

---

> 💡 **Interview tip:** The standard advice for `#include <bits/stdc++.h>` combined with `using namespace std;` in competitive programming is heavily penalized in production coding interviews. Warn against it.

---
## Unnamed namespaces

> 🧠 **In one sentence:** Wrapping functions and variables in an unnamed namespace restricts their linkage to that single translation unit, safely replacing the old C-style `static` keyword.

An unnamed namespace is an anonymous block that implicitly ensures everything inside it has internal linkage. Any variables, functions, or classes declared in it can only be accessed by the specific `.cpp` file containing that namespace.

Both unnamed namespaces and `static` symbols provide internal linkage, but in different ways. `static` must be applied individually to variables or functions. Unnamed namespaces group related identifiers together and can also encapsulate custom structure/class definitions—something `static` cannot do.

```cpp
// Added example: Unnamed namespace
#include <iostream>

namespace {
    // Both variables and classes are strictly private to this file
    const int MAX_USERS = 50;

    class InternalConnection {
    public:
        void start() { std::cout << "Started " << MAX_USERS; }
    };
}

int main() {
    InternalConnection conn;
    conn.start();
    return 0;
}
// Output: Started 50
```

> ⚠️ **GOTCHA — Unnamed namespaces in headers:**
> If you put an unnamed namespace in a `.h` file, every `.cpp` file that includes it gets a completely duplicated, independent set of those symbols.
> **What to say in an interview:** "Unnamed namespaces belong exclusively in `.cpp` files to hide implementation details. Putting them in headers silently bloats the binary with duplicated dead code."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is the modern C++ alternative to `static` global functions?**

A: The unnamed namespace (or anonymous namespace). Any identifier inside it gets internal linkage automatically.

**Q2 [🔧 Product Co | 🟡 2yr]: If `static` works fine for hiding global integers, why did C++ add unnamed namespaces?**

A: `static` only works for variables and functions. It cannot give internal linkage to user-defined types (like classes or structs). An unnamed namespace unifies this—giving internal linkage to types, variables, and functions alike.

**Q3 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] Will this link?**

```cpp
// File1.cpp
namespace { int priority = 1; }
int getPriority() { return priority; }

// File2.cpp
namespace { int priority = 2; }
int fetchPriority() { return priority; }

// main.cpp
#include <iostream>
extern int getPriority();
extern int fetchPriority();
int main() {
    std::cout << getPriority() << fetchPriority();
}
```

A: Yes, it links and prints `12`. Because each `priority` is wrapped in an unnamed namespace, they both get internal linkage. They do not conflict, allowing each translation unit to maintain its own independent unexported state.

**Q4 [⚡ HFT | 🔴 Senior]: Technically, an unnamed namespace gives external linkage to the namespace itself but unique identity per translation unit. Why does this matter?**

A: Because the namespace identifier is globally unique per translation unit, the templates instantiated using types from an unnamed namespace get unique instantiations. In C++11, types with internal linkage became legal template parameters specifically because unnamed namespaces behave this way.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Can another file access this struct?**

```cpp
// Database.cpp
namespace {
    struct SecretKey {
        int id = 42;
    };
}

void process() { SecretKey k; }
```

A: **No, compile/link error for others.** Even outside files that declare `extern struct SecretKey;` or try to resolve it will fail. The compiler mangles the name of `SecretKey` using a uniquely generated namespace token for `Database.cpp`, making it impossible for the linker to match it anywhere else.

---
> 💡 **Interview tip:** Mentioning that you use unnamed namespaces for helper classes inside your `.cpp` source files shows strong adherence to encapsulation and clean dependency architecture.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|------|---------------------|
| **Scope** | The compile-time region where a variable name is visible |
| **Duration (lifetime)**| How long a variable survives in memory (automatic, static, dynamic) |
| **Linkage** | Linker-level identity: allows identical names in different scopes to refer to the same object |
| **No Linkage** | Independent variable; isolated from all other variables of the same name (e.g., local vars) |
| **Internal Linkage**| Symbol is visible only in its own translation unit (file) |
| **External Linkage**| Symbol can be shared across the entire program via the linker |
| **`static` (Linkage)** | Applied to globals, restricts them to internal linkage |
| **`extern`** | Forward-declares a variable, telling the linker to find the definition elsewhere |
| **`inline` (Modern)** | Allows identical full definitions in multiple translation units without violating ODR |
| **ODR** | One Definition Rule: every variable/function must have exactly one definition program-wide |
| **Using-directive** | Brings all identifiers of a namespace into the current scope (e.g., `using namespace std;`) |
| **Using-declaration** | Brings specifically one identifier into scope (e.g., `using std::cout;`) |
| **Unnamed namespace** | An anonymous block giving everything inside it internal linkage automatically |
| **Translation Unit** | A single `.cpp` file along with all the headers it includes |

---

## 🖥️ Snippet Patterns — Full Coverage

> Complete snippet coverage for this chapter.
> Includes Q3 from every section AND every additional pattern from the
> Snippet Drill blocks. This table is the full exam paper for this chapter.
> Cover the Answer column, predict the result, then reveal.

| #  | Section | Snippet summary | Type | Tag | Answer |
|----|---------|-----------------|------|-----|--------|
| 1 | Local variables | Nested shadow variable scope reset | 🖥️ | 🔧 | Prints global `::x`, inner `x`, outer `x` |
| 2 | Local variables | Returning variable out of block scope | ❌ | 🔧 | Compile error — undeclared identifier |
| 3 | Internal linkage | `static` counter in header duplicated | 🐛 | 🔧 | Duplicated memory — each translation unit increments its own |
| 4 | External linkage | `const` globals linking across files | ❌ | 🔧 | Link error or unexpected shadowing — const implies internal linkage |
| 5 | External linkage | Multiple definitions in header | 💀 | 🔧 | Link error — ODR violation |
| 6 | External linkage | `extern` with initialization | ❌ | 🏢 | Compile/Link error — initialization forces definition |
| 7 | Inline | ODR violation with different inline bodies | 💀 | 🔧 | Undefined behavior — compiler silently picks one |
| 8 | Inline | Missing inline body in same TU | ❌ | 🔧 | Link error — compiler expects inline body to be visible |
| 9 | Inline | Inline global variable address eq | 🖥️ | 🚀 | True — linker shares one instance uniquely |
| 10 | Qualified names | Shadowing with `using namespace` | ❌ | 🏢 | Output `10` — no ambiguity unless same scope depth |
| 11 | Qualified names | Ambiguous `std::max` vs `math::max` | ❌ | 🔧 | Compile err — ambiguous overloaded function call |
| 12 | Qualified names | Global resolution `::val` | 🖥️ | 🌐 | Output global overriding local shadow |
| 13 | Unnamed namespaces| Same vars inside unnamed ns across files | 🖥️ | 🔧 | Output `12` — internally linked so safely private |
| 14 | Unnamed namespaces| Accessing unnamed ns struct externally | ❌ | 🔧 | Link error — uniquely mangled namespace barrier |

**Top 3 fail points for 2-year engineers in this chapter:**
1. Using `static` on globals in `.h` files: They think it hides the state, but it secretly creates memory-isolated duplicates of the variable in every file.
2. Forgetting `extern`: Realizing that `const int` defaults to internal linkage, causing silent failures when sharing configuration files. 
3. Understanding `inline` variables: Not knowing that C++17 `inline` eliminates the need for `.cpp` singleton boilerplate. 

**Sections with only one testable snippet pattern:**
- Internal linkage — Q3 is complete coverage; confirmed by Snippet Drill block.
