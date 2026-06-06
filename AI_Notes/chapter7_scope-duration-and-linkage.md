# Chapter 7: Scope, Duration, and Linkage

---
## Local variables

> 🧠 **In one sentence:** Scope determines where a variable can be seen, duration determines how long it lives, and linkage determines whether it can be shared across files.

- **Scope:** Scope is the region of the program where an identifier can be used. An identifier is said to be in scope from its point of declaration to the end of the block in which it is declared. Scope is a compile-time property, and trying to use an identifier when it is out of scope will result in a compile error.
- **Linkage:** Linkage determines if multiple declarations of an identifier refer to the same identifier or not. Local variables have no linkage, meaning each declaration refers to a unique object.
- **Duration:** Global variables are created when the program starts (before main() begins execution), and destroyed when it ends. This is called static duration. Variables with static duration are sometimes called static variables.
- **Global Linkage:** Global variables have external linkage by default. This means that a declaration of the same identifier in a different scope refers to the same object.

```cpp
    // Original example: local variable linkage
    int main()
    {
        int x { 2 }; // local variable, no linkage

        {
            int x { 3 }; // this declaration of x refers to a different object than the previous x
        }

        return 0;
    }
// Output: none
```

> ⚠️ **GOTCHA — Variable shadowing:**
> If you declare a local variable in an inner block with the same name as one in an outer block (like `x` in the example), it "shadows" the outer variable. The outer variable becomes completely inaccessible until the inner block ends.
> **What to say in an interview:** "I avoid variable shadowing by always compiling with `-Wshadow` to catch these bugs early."

📊 **Quick comparison:**

| | **Scope** | **Duration (Lifetime)** | **Linkage** |
|---|---|---|---|
| **What it rules** | Visibility (compile-time) | Existence (runtime) | Sharing across files (link-time) |
| **Local variables** | Block scope | Automatic | No linkage |
| **Global variables** | File/Global scope | Static | External (usually) |

---
#### ❓ Interview Q&A

**Q1: What is the difference between scope and lifetime?**

A: Scope is a compile-time concept specifying where a name is visible in the code. Lifetime (duration) is a runtime concept specifying how long the object actually sits in memory. A variable can be out of scope but still alive (e.g., dynamically allocated memory or a static local variable).

**Q2: What does it mean for a local variable to have "no linkage"?**

A: It means the name is strictly local. If you have a local variable `int x` in Function A and another `int x` in Function B, the linker never tries to merge them. They are completely independent entities.

**Q3: What happens if I try to use a block-scoped variable outside its block?**

A: You get a compile error. The compiler strictly enforces scope. Once the closing brace `}` of the block is reached, the identifier goes out of scope and cannot be resolved, even if the memory hasn't been overwritten yet.
---
> 💡 **Interview tip:** Interviewers often ask "what's the difference between scope and lifetime?" Don't mix them up: scope is about names (compiler), lifetime is about memory (runtime).

## Internal linkage

> 🧠 **In one sentence:** Internal linkage makes a global variable or function private to the translation unit (source file) it's defined in.

An identifier with internal linkage can be seen and used within a single translation unit, but it is not accessible from other translation units. This means that if two source files have identically named identifiers with internal linkage, those identifiers will be treated as independent (and do not result in an ODR violation for having duplicate definitions).

- Global variables can be given internal linkage by using the `static` keyword: Global variables with internal linkage are sometimes called internal variables.
- Functions can also have internal linkage by using the `static` keyword: Functions with internal linkage are sometimes called internal functions.

> 🗣️ **Say it out loud:**
> "When an interviewer asks why I marked a global variable `static`, I'd say:
> By making it static, I'm giving it internal linkage. This means the symbol isn't exposed to the linker. It prevents naming collisions if someone else writes a global variable with the exact same name in another file. It's essentially a way to create a private global variable for just one file. Here's a quick example to show that..."

```cpp
// Added example: Internal linkage using static
#include <iostream>

// This variable and function are private to this source file
static int internal_counter = 0;

static void increment() {
    internal_counter++;
}

int main() {
    increment();
    std::cout << internal_counter << '\n';
}
// Output:
// 1
```

---
#### ❓ Interview Q&A

**Q1: What does the `static` keyword do to a global variable?**

A: At the global scope, `static` changes the variable's default external linkage to internal linkage. The variable is still allocated for the entire duration of the program, but its name is invisible outside the source file it was defined in.

**Q2: Why is internal linkage important for large projects?**

A: It prevents linker errors. In a large codebase, multiple files might use a common helper function name like `init()` or a variable like `max_retries`. If they have external linkage, the linker throws a multiple-definition error. Internal linkage isolates them.

**Q3: Is there a modern alternative to using `static` for internal linkage?**

A: Yes, unnamed namespaces. Modern C++ heavily favors wrapping private translation-unit globals and functions in `namespace { }` instead of marking them all `static`.
---
> 💡 **Interview tip:** "Static" is the most overloaded keyword in C++. If an interviewer asks what it does, clarify *where* it's being used: inside a function (changes duration), inside a class (changes association), or in global scope (changes linkage).

## External linkage and variable forward declarations

> 🧠 **In one sentence:** External linkage allows an identifier to be shared across multiple translation units, usually accessed via a forward declaration using the `extern` keyword.

An identifier with external linkage can be seen and used both from the file in which it is defined, and from other code files (via a forward declaration). Global variables with external linkage are sometimes called external variables.

> **Note:** `const` global variables have internal linkage by default. Therefore, to make a `const` global variable accessible from other translation units, we must explicitly declare it as `extern`.

> **Note:** To use a global variable defined in another translation unit, we must provide a forward declaration for it using the `extern` keyword. A variable forward declaration tells the compiler about the variable's type and name, but does not create a new instance of the variable.

```cpp
    // Original example: External linkage and extern
    int g_x { 2 }; // non-constant globals are external by default (no need to use extern)

    extern const int g_y { 3 }; // const globals can be defined as extern, making them external
    extern constexpr int g_z { 3 }; // constexpr globals can be defined as extern, making them external (but this is pretty useless, see the warning in the next section)

    int main()
    {
        return 0;
    }
// Output: none
```

```cpp
// Added example: Forward declaration
#include <iostream>

// Forward declaration of a variable defined in another file
extern int global_app_state; 

int main() {
    // We can use it here because the compiler trusts the linker will find it
    std::cout << global_app_state << '\n';
}
```

> ⚠️ **GOTCHA — ODR Violations with External Linkage:**
> If you define (`int g_x = 5;`) an external variable in a header file, and include that header in multiple `.cpp` files, every file gets its own definition of `g_x`. The linker will fail with a "multiple definition" error.
> **What to say in an interview:** "I never define external variables in headers. I declare them with `extern` in the header, and define them in exactly one `.cpp` file."

📊 **Quick comparison:**

| | **Internal Linkage (`static`)** | **External Linkage (`extern`)** |
|---|---|---|
| **Visibility** | One source file | Entire program |
| **Linker behavior** | Symbol hidden | Symbol exported |
| **Typical use** | Private helpers/state | Shared application state |
| **Header file safety** | Safe (but duplicates memory) | Causes ODR violations if defined |

---
#### ❓ Interview Q&A

**Q1: How do you share a global variable across multiple files?**

A: You define the variable in exactly one `.cpp` file. Then, you place a forward declaration using the `extern` keyword in a header file, and include that header wherever you need access to the variable.

**Q2: Why do `const` global variables default to internal linkage?**

A: C++ assumes that `const` values are likely to be used for compile-time optimization. If it had external linkage, defining a `const int max = 10;` in a header would cause multiple definition linker errors when included in multiple files. Internal linkage allows you to safely place `const` variables in headers.

**Q3: What happens if you declare something `extern` but forget to define it anywhere?**

A: Your code will compile cleanly, because the compiler trusts your `extern` promise. However, the build will fail at the link stage with an "unresolved external symbol" error.
---
> 💡 **Interview tip:** Be prepared to explain the difference between a declaration (telling the compiler a name exists) and a definition (actually allocating memory). `extern int x;` is a declaration. `int x;` is a definition.

## Inline functions and variables

> 🧠 **In one sentence:** Inline expansion is a compiler optimization that replaces a function call with the actual body of the function to save the overhead of jumping to another memory address.

Inline expansion is a process where a function call is replaced by the code from the called function’s definition. This can improve performance by eliminating the overhead of a function call, especially for small functions that are called frequently.

> **Note:** Inline expansion has its own potential cost: if the body of the function being expanded takes more instructions than the function call being replaced, then each inline expansion will cause the executable to grow larger. Larger executables tend to be slower (due to not fitting as well in memory caches).

```cpp
// Added example: Inline expansion concept
#include <iostream>

// A good candidate for inlining
inline int square(int x) {
    return x * x;
}

int main() {
    // Compiler might replace this with: int result = 5 * 5;
    int result = square(5); 
    std::cout << result << '\n';
}
// Output:
// 25
```

---
#### ❓ Interview Q&A

**Q1: Does the `inline` keyword guarantee the compiler will inline the function?**

A: No. It is merely a suggestion or hint to the compiler. Modern compilers are very smart and will often inline small functions even without the keyword, and might refuse to inline a massive function even if the keyword is present.

**Q2: What is the trade-off of aggressive inlining?**

A: Code bloat. Replacing every function call with the function's body increases the compiled binary size. If the binary spills out of the CPU's L1 instruction cache, the cache misses will negate all the speed gained by avoiding the function call.

**Q3: Can you inline a recursive function?**

A: A compiler might manually unroll a few levels of recursion if the depth is known at compile time, but it cannot infinitely inline a recursive function, as that would result in an infinitely sized executable.
---
> 💡 **Interview tip:** Don't just say `inline` makes code faster. Top candidates always mention the danger of instruction cache misses caused by code bloat.

### Modern inline functions and variables

> 🧠 **In one sentence:** In modern C++, `inline` means "multiple identical definitions of this entity are allowed across translation units without violating the One Definition Rule."

In modern C++, the term `inline` has evolved to mean “multiple definitions are allowed”. Thus, an inline function is one that is allowed to be defined in multiple translation units (without violating the ODR). This is particularly useful for functions defined in header files, which are typically included in multiple source files.

Inline functions have two primary requirements:
- The compiler needs to be able to see the full definition of an inline function in each translation unit where the function is used.

> 🗣️ **Say it out loud:**
> "When asked why we need inline functions in headers, I'd say:
> If you put a normal function definition in a header file, and include it in three different cpp files, the compiler produces three definitions. The linker will throw a multiple-definition error. But if you mark it `inline`, you're telling the linker 'I know there are duplicates, just pick one and drop the rest.' That's why class member functions defined inside the class body are implicitly inline."

```cpp
// Added example: Modern inline usage
// helper.h
#pragma once

// Can be safely included in multiple .cpp files
inline int get_default_port() {
    return 8080;
}
```

---
#### ❓ Interview Q&A

**Q1: Why are member functions defined inside a class definition considered inline?**

A: Because class definitions are placed in header files and included in multiple translation units. If those member functions weren't implicitly `inline`, they would cause ODR violations as soon as two files included the header.

**Q2: What is the One Definition Rule (ODR)?**

A: The ODR states that within any given translation unit, a variable, function, class, etc. can be defined only once. Across the entire program, normal variables and non-inline functions can also strictly have only one definition.

**Q3: What happens if two files have different definitions for the same inline function?**

A: It is Undefined Behavior. The linker is allowed to randomly pick one of them without warning you. Both files must see the exact same token sequence for the inline definition.
---
> 💡 **Interview tip:** The modern, standard-compliant answer for "what does inline do?" is almost entirely about the One Definition Rule (ODR) and header files, not performance.

### inline variables

> 🧠 **In one sentence:** Introduced in C++17, `inline` variables allow global variables to be defined directly in header files without causing multiple-definition linker errors.

Similar to inline functions, inline variables are allowed to be defined in multiple translation units without violating the ODR. This is useful for defining global variables in header files.

```cpp
// Added example: Inline variables (C++17)
#include <iostream>

// config.h (imagine this is a header included in many files)
struct Config {
    // C++17 inline variable: safe to define in a header
    static inline int max_connections = 100;
};

int main() {
    std::cout << Config::max_connections << '\n';
}
// Output:
// 100
```

---
#### ❓ Interview Q&A

**Q1: Before C++17, how did we handle static class variables?**

A: We had to declare them `static` inside the class definition in the header, and then provide a single out-of-line definition in exactly one `.cpp` file to allocate the memory.

**Q2: How do `inline` variables solve the static class variable problem?**

A: By marking the variable `inline` in the header, C++17 allows you to declare and define the variable in one step. The linker handles merging all the duplicate symbols into a single memory location.

**Q3: Can `inline` variables be used for global namespace variables too?**

A: Yes. You can define `inline int global_state = 0;` directly in a header file. It is the modern replacement for the old `extern` declaration plus `.cpp` definition dance for global variables.
---
> 💡 **Interview tip:** Mentioning C++17 inline variables shows you write modern C++. It completely obsoletes a very annoying pre-C++17 boilerplate pattern.

## Qualified and unqualified names

> 🧠 **In one sentence:** A qualified name explicitly states which scope or namespace an identifier belongs to by using the scope resolution operator (`::`).

A qualified name is a name that includes an associated scope. Most often, names are qualified with a namespace using the scope resolution operator (`::`).
An unqualified name is used without any explicit scope prefix.

```cpp
// Added example: Qualified vs Unqualified
#include <iostream>

int value = 10; // Global namespace

namespace App {
    int value = 20; // App namespace
}

int main() {
    int value = 30; // Local scope

    std::cout << value << '\n';       // Unqualified: Local (30)
    std::cout << App::value << '\n';  // Qualified: App namespace (20)
    std::cout << ::value << '\n';     // Qualified: Global namespace (10)
}
// Output:
// 30
// 20
// 10
```

---
#### ❓ Interview Q&A

**Q1: What does `::name` with no left-hand side mean?**

A: It explicitly forces the compiler to look in the global namespace for `name`, completely bypassing any local scopes or member variables that might be shadowing it.

**Q2: Why do we use namespaces to qualify names?**

A: To prevent naming collisions. If you write a physics library with a `Vector` class, and link a graphics library with its own `Vector` class, they would clash. Namespaces (`Physics::Vector` vs `Graphics::Vector`) completely isolate them.

**Q3: When referencing a class member inside another member function, is it qualified or unqualified?**

A: It is usually written as an unqualified name (just `my_var`), but the C++ compiler automatically qualifies it under the hood (treating it as `this->my_var` or `MyClass::my_var`).
---
> 💡 **Interview tip:** Using `::` explicitly for the global namespace is a great trick to solve deep shadowing issues in large, legacy codebases.

### Using-directives

> 🧠 **In one sentence:** A using-directive dumps all the names from a specified namespace directly into the current scope, allowing you to use unqualified names.

A using-directive (`using namespace MyNamespace;`) brings all the names from a namespace into the current scope.

**Problems with using-directives:** Using-directives can lead to name conflicts if two namespaces contain identically named identifiers.

```cpp
    // Original example: using-directive conflicts
    #include <iostream>

    namespace A
    {
        int x { 10 };
    }

    namespace B
    {
        int x{ 20 };
    }

    int main()
    {
        using namespace A;
        using namespace B;

        // COMPILE ERROR: Reference to 'x' is ambiguous
        // std::cout << x << '\n';

        return 0;
    }
// Output: none
```

> ⚠️ **GOTCHA — `using namespace std` in headers:**
> Putting `using namespace std;` in a header file forces that directive on every single `.cpp` file that includes your header. This pollutes the global namespace of the entire project and is universally considered a terrible practice.
> **What to say in an interview:** "I never put using-directives in header files. I type out the fully qualified `std::` names there to keep the global namespace clean."

---
#### ❓ Interview Q&A

**Q1: Why is `using namespace std;` discouraged in professional C++?**

A: The C++ Standard Library is massive. Dumping thousands of names (like `count`, `distance`, `vector`) into the global namespace guarantees that eventually one of your own local variables or functions will conflict with an STL name, causing confusing compiler errors.

**Q2: Is there a safe way to use `using` instead of fully qualifying names?**

A: Yes, use a *using-declaration* instead of a *using-directive*. Writing `using std::cout;` only brings in that one specific symbol, rather than the entire `std` library. Furthermore, you can restrict it to function scope rather than global scope.

**Q3: If a collision happens due to a using-directive, can you still access the variables?**

A: Yes. Even if `x` is ambiguous, you can explicitly qualify them as `A::x` and `B::x` to resolve the ambiguity.
---
> 💡 **Interview tip:** Interviewers almost always react positively to the phrase "I avoid namespace pollution." It shows maturity and experience with large codebases.

## Unnamed namespaces

> 🧠 **In one sentence:** Wrapping code in a `namespace {}` without a name gives all the identifiers inside it internal linkage, making them invisible outside the current translation unit.

An unnamed namespace is a namespace that does not have a name. Identifiers declared in an unnamed namespace have internal linkage by default. This means that they can only be accessed within the same translation unit.

**Difference between unnamed namespaces and static variables/functions:** Both unnamed namespaces and static variables/functions provide internal linkage, but they do so in different ways. Unnamed namespaces group related identifiers together, while static variables/functions are declared individually.

> 🗣️ **Say it out loud:**
> "When asked how to hide implementation details in a `.cpp` file, I'd say:
> I'd put them in an unnamed namespace. It's the modern, preferred C++ equivalent of using the `static` keyword on C-style global variables. It ensures that any helper types, functions, or variables I write are stripped of external linkage so they don't pollute the linker table or cause ODR violations with other files."

📊 **Quick comparison:**

| | **Unnamed Namespace `namespace {}`** | **`static` keyword** |
|---|---|---|
| **Effect on linkage** | Internal linkage | Internal linkage |
| **Applies to** | Variables, Functions, Classes, Types | Variables, Functions only |
| **C++ Standard** | Modern C++ preference | Inherited from C |
| **Convenience** | Groups multiple items cleanly | Requires tagging every item |

---
#### ❓ Interview Q&A

**Q1: Can you put a class definition inside an unnamed namespace?**

A: Yes. This is a massive advantage over `static`. You cannot mark a class or struct definition as `static`, but putting it in an unnamed namespace ensures the type itself is strictly internal to the `.cpp` file.

**Q2: Should you put an unnamed namespace in a header file?**

A: Absolutely not. If you do, every `.cpp` file that includes the header gets its own unique, invisible copy of everything in the namespace. This causes massive code bloat.

**Q3: How does the compiler actually implement unnamed namespaces under the hood?**

A: It acts as if it generated a unique namespace name for that specific translation unit (like `namespace __XYZ_123 { }`) and implicitly added a `using namespace __XYZ_123;` right after it so you can access the contents easily.
---
> 💡 **Interview tip:** "Unnamed space in a header file" is a classic trap question. The result is the exact opposite of what header files are meant to do (sharing). Know why it's a bad idea.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|---|---|
| Scope | The region of source code where an identifier is visible and valid |
| Linkage | The linker's rules for merging or keeping identifiers isolated across files |
| Duration / Lifetime | The runtime period during which a variable holds memory |
| ODR (One Definition Rule) | Rule stating you can only define a variable/function once per program (with few exceptions) |
| Internal linkage | Symbol is completely private to its translation unit |
| External linkage | Symbol is accessible across the entire program via the linker |
| Translation unit | A single `.cpp` file along with all the headers it `#include`s |
| Forward declaration | Telling the compiler a name exists before it is defined (`extern`) |
| Inline expansion | Compiler optimization that replaces a call with the function's actual body |
| `inline` variable/function | Allows multiple identical definitions across translation units (avoids ODR errors) |
| Qualified name | An identifier accessed specifically via its scope (`std::cout`) |
| Using-directive | Pollutes current scope with all identifiers from a namespace (`using namespace X`) |
| Unnamed namespace | Creates a block of code with internal linkage, preferred over `static` |

---
