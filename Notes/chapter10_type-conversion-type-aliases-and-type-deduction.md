# Chapter 10: Type Conversion, Type Aliases, and Type Deduction

---

## What is type conversion?

> 🧠 **In one sentence:** Type conversion is the process of changing a value from one data type into another, either automatically by the compiler (implicit) or manually by the programmer (explicit).

Type conversion changes a value's data type. This happens implicitly (automatically) or explicitly (manually).

### Why conversions are needed?

An object's value is stored as bits. The data type tells the compiler how to translate those bits into meaningful values. If types don't match, the compiler must convert the bits to make sense of them.

```cpp
// C++17
// Added example: implicit type conversion
#include <iostream>

int main() {
    double d = 5; // Implicit conversion from int (5) to double (5.0)
    std::cout << d << '\n';
    return 0;
}
// Output:
// 5
```

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is type conversion?**

A: It's how C++ translates bits of one data type into another data type. It happens implicitly when assigning mismatched types, or explicitly when you cast.

**Q2 [🔧 Product Co | 🟡 2yr]: When should you prefer explicit conversions over implicit ones?**

A: Always prefer explicit conversions (like `static_cast`) when data loss is possible. Implicit conversions to a smaller type might silently discard data, whereas explicit casts clearly document your intent to the reader and the compiler.

**Q3 [🌐 All | 🟢 Any]: [❌ Won't compile?] Does this compile?**

```cpp
// C++17
int main() {
    int* ptr = 5;
    return 0;
}
```

A: **Compile error.** Implicit conversion from `int` to `int*` is not allowed. To treat an integer as an address, you must explicitly use `reinterpret_cast`, though doing so with arbitrary integers is almost always undefined behaviour.

**Q4 [🔧 Product Co | 🟡 2yr]: What happens if you assign a floating-point number to an integer type?**

A: The fractional part is truncated (discarded), not rounded. For example, `3.9` becomes `3`. This is a narrowing conversion that silently loses data if done implicitly.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---

> 💡 **Interview tip:** Interviewers use implicit conversion rules (e.g., float to int truncation) as traps in "predict the output" questions.

## Narrowing conversions :

> 🧠 **In one sentence:** A narrowing conversion is a potentially unsafe operation where the destination type cannot hold all possible values of the source type, leading to data loss.

A narrowing conversion is an unsafe numeric conversion. The new type might not hold all the values of the old type. Converting a float to an int loses the decimal part. Converting a large int to a smaller int causes overflow if the value is too large.

```cpp
// C++17
// Added example: narrowing conversion overflow
#include <iostream>

int main() {
    int large = 256;
    char c = large; // Narrowing: 256 overflows typical 8-bit char (max 127)
    std::cout << static_cast<int>(c) << '\n';
    return 0;
}
// Output:
// 0
```

> ⚠️ **GOTCHA — Narrowing Silently Discards Data:**
> Implicit narrowing (like `int x = 3.14;`) compiles without failure in older styles but silently drops data.
> **What to say in an interview:** "Implicit narrowing throws away data without warning; we should use brace initialization to catch this at compile-time."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is a narrowing conversion?**

A: It's converting a value to a type that cannot fully represent the original value. Examples include converting `double` to `int` (dropping decimals) or `long long` to `short` (potential overflow).

**Q2 [🔧 Product Co | 🟡 2yr]: How can you prevent accidental narrowing conversions in modern C++?**

A: Use uniform initialization (brace initialization). Initializing with braces like `int x {3.14};` will trigger a compile-time error if a narrowing conversion is attempted, preventing silent data loss.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Will this compile?**

```cpp
// C++17
int main() {
    double d = 4.5;
    int x { d };
    int y(d);
    return 0;
}
```

A: **Compile error on line 4.** Brace initialization (`int x { d };`) rigorously forbids narrowing conversions and fails compilation. Line 5 (`int y(d);`) using parenthesis initialization permits the narrowing and would compile, initializing `y` to 4.

**Q4 [⚡ HFT | 🔴 Senior]: Is converting `unsigned int` to signed `int` considered a narrowing conversion?**

A: Yes. A signed `int` cannot represent the upper half of the values supported by an `unsigned int` of the same width. If the unsigned value exceeds the maximum signed value, mapping occurs (often wrapping into negatives).

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [💀 UB?] What is the result of this narrowing conversion?**

```cpp
// C++17
#include <iostream>

int main() {
    long long huge = 2147483648; // 2^31
    int small(huge);             // assuming 32-bit int
    std::cout << small;
}
```

A: **Implementation-defined behaviour (often wrapping to a negative value or `INT_MIN`).** Converting an out-of-range value to a signed integer type in C++ (prior to C++20) falls to implementation-defined mapping. It's unsafe. Fix: use `std::clamp` or boundary checks before converting.

---

> 💡 **Interview tip:** Mentioning "brace initialization prevents narrowing" instantly proves you write modern C++ (C++11 and beyond).

## Explicit type conversion (casting) and static_cast

> 🧠 **In one sentence:** `static_cast` is the safe, compile-time checked way to perform explicit type conversions in C++, replacing dangerous C-style casts.

There are 5 type casting operators in C++:
1. `static_cast`
2. `dynamic_cast`
3. `const_cast`
4. `reinterpret_cast`
5. C-style cast

The first four are C++ style "named casts". The last is the legacy C-style cast.

> **Note:** Avoid `const_cast` and `reinterpret_cast` unless we have a very good reason to use them.

### C-style cast

The syntax is `(NewType)expression`.

```cpp
int x { 5 };
double y = (double)x; // C-style cast from int to double
```

> **Note:** C++ also provides an alternative functional form: `NewType(expression)`.

```cpp
double y = double(x); // C-style cast alternative
```

> **Note:** C-style casts are less safe than C++ casts. They blindly try multiple conversions (`static`, `dynamic`, `const`, `reinterpret`) without telling you which one succeeds. This invites bugs and hides intent.

### static_cast

The syntax is `static_cast<NewType>(expression)`.

```cpp
int x { 5 };
double y = static_cast<double>(x); // static_cast from int to double
```

**Properties of static_cast:**
1. It provides compile-time type checking. If the compiler cannot convert the type, it throws an error.
2. It is strictly less powerful than a C-style cast, safely preventing reinterpretations or discarding `const`.

> **Note:** `static_cast` uses direct initialization internally. Use it to make narrowing conversions explicit and intentional.

Workaround for brace initialization narrowing errors:

```cpp
int i { 48 };
// explicit conversion from int to char assigns character to ch safely
char ch { static_cast<char>(i) };
```

> ⚠️ **GOTCHA — C-style Casts Bypass Safety:**
> C-style casts will silently drop `const` or reinterpret pointers if a `static_cast` fails, masking horrible bugs.
> **What to say in an interview:** "I ban C-style casts in code reviews because they can secretly act as a `reinterpret_cast` or `const_cast` without warning."

📊 **Quick comparison:**

|                      | **C-style cast** | **static_cast** |
|----------------------|------------------|-----------------|
| **Safety**           | None (blindly forces cast) | Checked at compile-time |
| **Intent**           | Ambiguous | Clear |
| **Can drop const?**  | Yes | No |
| **When to use**      | Never in modern C++ | Standard explicit conversions |

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Why should you avoid C-style casts in C++?**

A: C-style casts are a sledgehammer. If a safe conversion isn't possible, they automatically fall back to unsafe conversions like `reinterpret_cast` or `const_cast` without warning. They are also hard to search for in code.

**Q2 [🔧 Product Co | 🟡 2yr]: When do you use `static_cast`?**

A: Use `static_cast` for well-defined, explicit type conversions like converting `float` to `int`, an `enum` class to its underlying integer type, or a `void*` pointer to a specific typed pointer.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Will these casts compile?**

```cpp
// C++17
int main() {
    const int val = 10;
    int* p1 = (int*)&val;
    int* p2 = static_cast<int*>(&val);
    return 0;
}
```

A: **Compile error on line 5.** `static_cast` safely refuses to cast away `const`. You must use `const_cast` explicitly for that intent. However, line 4 compiles silently because the C-style cast secretly falls back to `const_cast`, proving why C-style casts are dangerous.

**Q4 [⚡ HFT | 🔴 Senior]: Can `static_cast` be used to downcast pointers in an inheritance hierarchy?**

A: Yes, `static_cast` can downcast from a base pointer to a derived pointer. However, it does **no runtime checking**. If the object isn't actually of the derived type, accessing it triggers undefined behaviour. Use `dynamic_cast` if you need runtime type safety.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What happens here?**

```cpp
#include <iostream>

int main() {
    int i = 65; // ASCII 'A'
    char c { static_cast<char>(i) };
    std::cout << c;
}
```

A: **Prints `A`.** By explicitly using `static_cast`, we bypass the narrowing compiler error normally triggered by brace initialization. The programmer explicitly certified the narrowing conversion is safe.

---

> 💡 **Interview tip:** When asked about casting, immediately mention that named casts (`static_cast`, etc.) are easily searchable in codebases using `grep`, a major practical advantage over C-style casts.

## Type deduction for objects using the auto keyword

> 🧠 **In one sentence:** The `auto` keyword tells the compiler to automatically determine the type of a variable directly from its initializer expression.

Type deduction lets the compiler figure out a variable's type based on its initializer.

```cpp
auto d { 5.0 }; // 5.0 is a double literal, so d is deduced as double
```

> **Note:** Prior to C++17, `auto d{ 5.0 };` would incorrectly deduce `d` as `std::initializer_list<double>`. For C++14 or older, use copy initialization to avoid this:

```cpp
auto d = 5.0; // d is safely deduced as double in C++14
```

> **Note:** The `u` suffix makes integers unsigned.

```cpp
auto b {5u}; // b is unsigned int
```

> **Note:** Type deduction automatically drops top-level `const` qualifiers.

```cpp
const int a { 5 }; // a is const int
auto b { a };      // b is int (const dropped)
```

> ⚠️ **GOTCHA — `auto` Stripping Qualifiers:**
> `auto` drops both `const` and reference (`&`) qualifiers by default, unexpectedly copying data.
> **What to say in an interview:** "`auto` gives you a new, un-const value copy. If you want a reference or to keep it constant, you must explicitly write `auto&` or `const auto&`."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: How does the `auto` keyword work for variables?**

A: `auto` deduces the type of a variable at compile-time by looking at the type of the expression used to initialize it. It does not incur any runtime overhead.

**Q2 [🔧 Product Co | 🟡 2yr]: Why does `auto` strip `const` and references?**

A: Because `auto` prioritizes giving you an independent, modifiable value by default. If it preserved references implicitly, simply assigning `auto x = my_ref;` would create an unexpected alias instead of a copy, breaking typical assignment expectations.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Does `b`'s modification alter `x`?**

```cpp
// C++17
#include <iostream>

int main() {
    int x = 10;
    int& ref = x;
    auto b = ref;
    b = 20;
    std::cout << x;
}
```

A: **Prints `10`.** `auto` drops the reference qualifier (`&`). Therefore, `b` is deduced purely as `int` and contains a complete copy. Modifying `b` does not modify `x`. Fix: use `auto& b = ref;` if you want `b` to also be a reference to `x`.

**Q4 [⚡ HFT | 🔴 Senior]: What was the defect with `auto x {1};` before C++17, and how was it fixed?**

A: Before C++17, `auto` with direct-list-initialization deduced a `std::initializer_list`. C++17 fixed this rule (N3922): `auto x {1};` now deduces `int`, but `auto x = {1};` still deduces `std::initializer_list<int>`.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Does this compile?**

```cpp
#include <iostream>

int main() {
    const int val = 100;
    auto val2 = val;
    val2 = 200;
    std::cout << val2;
}
```

A: **Prints `200` (It compiles).** `auto` strips the top-level `const` from `val`. Thus, `val2` is deduced purely as an `int` (not `const int`), so assigning it to `200` is perfectly legal.

---

> 💡 **Interview tip:** AAA (Almost Always Auto) is a popular philosophy, but clarify you know when NOT to use it: when the deduced type hides essential clarity or risks accidental expensive copies.

## Type deduction for functions 

> 🧠 **In one sentence:** Since C++14, the compiler can automatically deduce a function's return type by inspecting its `return` statements.

In C++14, functions can use `auto` as a return type.

```cpp
// C++14
auto add(int a, int b) {
    return a + b; // deduces as int
}
```

> **Note:** For type deduction to work with function parameters (like `auto param`), C++20 is required.

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Can a function return type be `auto`?**

A: Yes, since C++14. The compiler deduces the return type from the `return` statement's expression.

**Q2 [🔧 Product Co | 🟡 2yr]: What happens if a function with an `auto` return type has multiple different return statements?**

A: All return statements must evaluate to exactly the same type. If they do not, the compiler will fail to deduce the type and throw an error.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Does this C++14 code compile?**

```cpp
// C++14
auto get_value(bool flag) {
    if (flag) return 5;
    else return 5.5;
}
```

A: **Compile error.** The compiler sees two different types: `int` (from 5) and `double` (from 5.5). When deducing the `auto` return type, all return statements must resolve to the identical type. Fix: cast the `int` or return `5.0`.

**Q4 [⚡ HFT | 🔴 Senior]: What type of return deduction does `decltype(auto)` enable that plain `auto` does not?**

A: Plain `auto` uses template type deduction rules (drops `const` and `&`). `decltype(auto)` perfectly preserves the exact type, including `const` and reference qualifiers, which is essential for forwarding functions returning references.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---

> 💡 **Interview tip:** Know the difference between C++11 (trailing return type needed) and C++14 (fully automatic return type deduction) as interviewers often test your timeline knowledge.

## Downsides of using auto for function return types :

> 🧠 **In one sentence:** Functions returning `auto` must be completely defined before they are called, making forward declarations insufficient.

Functions returning `auto` must be fully defined before you can use them (a forward declaration is not sufficient).

### Trailing return type syntax

The `auto` keyword can also be used to declare functions using a trailing return syntax, where the return type is specified after the rest of the function prototype.

For functions with complex return types, a trailing return type can make the function easier to read:

```cpp
#include <type_traits> // for std::common_type

// harder to read (where is the name of the function in this mess?)
std::common_type_t<int, double> compare(int, double); 

// easier to read (we don't have to read the return type unless we care)
auto compare(int, double) -> std::common_type_t<int, double>; 
```

> ⚠️ **GOTCHA — `auto` return breaks forward-declared ABIs:**
> You cannot put `auto func();` in a header file and define it in a `.cpp` file if external users call it, because they won't see the definition for deduction.
> **What to say in an interview:** "`auto` return types must be fully defined in the header where they are used, limiting their viability for public API boundaries."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is the main downside of a function returning `auto`?**

A: Since the compiler needs to see the internal `return` statement to deduce the type, the function body must be fully defined before it is called. Forward declarations without bodies will fail when invoked.

**Q2 [🔧 Product Co | 🟡 2yr]: What is trailing return type syntax and why is it useful?**

A: It puts the return type after the parameter list (e.g., `auto func() -> int`). It's useful when the return type depends on the parameters (via `decltype`), or just to make visually heavy return types (like long template expressions) easier to read.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Why won't this compile across files?**

```cpp
// header.h
auto compute(); // Forward declare

// main.cpp
#include "header.h"
int main() { return compute(); }

// math.cpp
#include "header.h"
auto compute() { return 42; }
```

A: **Compile error in main.cpp.** When `main.cpp` calls `compute()`, the compiler only sees the forward declaration `auto compute();`. Without seeing the body (which sits in `math.cpp`), the compiler cannot deduce the output type, causing compilation to fail.

**Q4 [⚡ HFT | 🔴 Senior]: How does trailing return type explicitly help with `decltype` template functions?**

A: Without trailing return types, parameter variables aren't firmly in scope yet. By placing the type *after* the parameter list `(T1 a, T2 b) -> decltype(a + b)`, the compiler can freely use `a` and `b` to deduce the resultant type of their addition.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---

> 💡 **Interview tip:** Mentioning that "auto returns force header-only implementations" is an excellent way to show you understand compilation and linker models.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|------|---------------------|
| Implicit type conversion | Automatic translation of one data type to another by the compiler. |
| Explicit type conversion | Manual programmer-forced cast changing a value's interpreted data type. |
| Narrowing conversion | Casting to a smaller or less precise type, causing potential data loss. |
| `static_cast` | C++'s standard, safe, compile-time inspected casting operator. |
| C-style cast | Legacy `(Type)val` cast blindly attempting multiple cast types without safety. |
| `auto` (type deduction) | Compiler infers the variable's type from its initialization expression. |
| Uniform initialization | `Type val {x};` brace initialization that safely prohibits narrowing. |
| Trailing return type | Moving the return type definition after the parameters: `auto f() -> int`. |
| Forward declaration | Declaring a function signature before its full body definition is provided. |

---

## 🖥️ Snippet Patterns — Full Coverage

> Complete snippet coverage for this chapter.
> Includes Q3 from every section AND every additional pattern from the Snippet Drill blocks. This table is the full exam paper for this chapter.
> Cover the Answer column, predict the result, then reveal.

| # | Section | Snippet summary | Type | Tag | Answer |
|---|---------|-----------------|------|-----|--------|
| 1 | What is type conversion? | Implicit `int` to `int*` pointer assignment | ❌ | 🌐 | Compile error — implicit cast not allowed |
| 2 | Narrowing conversions | Brace init with narrowing `double` to `int` | ❌ | 🔧 | Compile error — braces strictly forbid narrowing |
| 3 | Narrowing conversions | Long long out of bounds forced to 32 int | 💀 | 🔧 | UB/implementation-defined overflow |
| 4 | Explicit type conversion | C-style cast dropping `const` qualifier | ❌ | 🔧 | Compile error on `static_cast`, but C-cast secretly drops const |
| 5 | Explicit type conversion | `static_cast` explicitly allowing narrowing | 🖥️ | 🔧 | Prints char — `static_cast` overrides brace restrictions |
| 6 | Type deduction for auto | Deduce type of a copied reference | ❌ | 🔧 | Compiles; modifications to copy don't affect original source |
| 7 | Type deduction for auto | Auto stripping `const` modifier | ❌ | 🔧 | Compiles; modifying `auto` val is legal |
| 8 | Type deduction for func | `auto` return but multiple differing types | ❌ | 🔧 | Compile error — exact matching types required |
| 9 | Downsides of auto return | Forward declaration `auto` called from `main` | ❌ | 🔧 | Compile error — needs visible definition body |

**Top 3 fail points for 2-year engineers in this chapter:**
1. Using C-style casts because "they are shorter", accidentally removing `const` or performing an invalid memory reinterpretation.
2. Forgetting that `auto` strips `const` and `&`, resulting in massive memory copies when iterating over large collections.
3. Using `auto` for a return type and placing the definition in a `.cpp` file, causing mysterious compilation errors for users of the header.

**Sections with only one testable snippet pattern:**
- What is type conversion? — Q3 is complete coverage; confirmed by Snippet Drill block.
- Type deduction for functions  — Q3 is complete coverage; confirmed by Snippet Drill block.
- Downsides of using auto for function return types : — Q3 is complete coverage; confirmed by Snippet Drill block.
