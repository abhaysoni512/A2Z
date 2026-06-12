# Chapter 11: Introduction to function overloading

---

## How overloaded functions are differentiated

> 🧠 **In one sentence:** Function overloading allows you to define multiple functions with the same name, as long as they differ in the number or types of their parameters.

Overloaded functions are differentiated based on their parameter lists. The compiler looks at three properties: the number of parameters, the types of parameters, and function-level qualifiers (like `const` or `volatile` on member functions). 

> **Note:** For parameters passed by value, the `const` qualifier is ignored during overload resolution. `void print(int);` and `void print(const int);` are considered the same function signature.

```cpp
// Added example: Overloading by type
#include <iostream>

void print(int x) { std::cout << "Integer: " << x << '\n'; }
void print(double x) { std::cout << "Double: " << x << '\n'; }

int main() {
    print(5);     // calls print(int)
    print(5.5);   // calls print(double)
    return 0;
}
// Output:
// Integer: 5
// Double: 5.5
```

> ⚠️ **GOTCHA — Top-level const parameters:**
> Adding a top-level `const` to a pass-by-value parameter does not create a new overload. It causes a redefinition error because the caller passes a copy anyway.
> **What to say in an interview:** "Top-level `const` qualifiers on pass-by-value parameters are ignored for function signatures, so they don't produce a new overload."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is function overloading and why is it useful?**

A: Function overloading lets us define multiple functions with the same name in the same scope, provided their parameter lists differ. It is useful because it allows us to handle different data types using conceptually identical operations without inventing arbitrary names like `printInt` or `printDouble`.

**Q2 [🔧 Product Co | 🟡 2yr]: Does the return type play a role in function overloading?**

A: No, functions cannot be overloaded based solely on return type. Overload resolution happens strictly based on the arguments supplied at the call site, independent of what the caller decides to do with the returned value.

**Q3 [🌐 All | 🟢 Any]: [❌ Won't compile?] Does this compile? If not, why?**

```cpp
void process(int x) {}
void process(const int x) {}

int main() {
    process(10);
}
```

A: **Compile error.** The second function is a redefinition of the first. Top-level `const` qualifiers on value parameters are ignored by the compiler for signature differentiation. Fix: Remove one of the definitions or change it to pass-by-reference.

**Q4 [🔧 Product Co | 🟡 2yr]: Is overloading on `const` references possible?**

A: Yes, while `void func(int)` and `void func(const int)` clash, `void func(int&)` and `void func(const int&)` are distinct overloads. The compiler chooses the exact match based on whether the argument is a modifiable lvalue or a `const`/temporary.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🌐 All | 🟢 Any]: [❌ Won't compile?] What's wrong here?**

```cpp
int getValue() { return 1; }
double getValue() { return 2.0; }

int main() {
    int x = getValue();
}
```

A: **Compile error.** The functions differ only by return type, which is not allowed. Fix: Rename one function or add parameters to distinguish them.

---
> 💡 **Interview tip:** A classic trick question is asking you to overload a function based on return type, or asking if `void f(int)` and `void f(const int)` can coexist. Remember: signature only depends on parameter types and counts.

---

## Function overload resolution and ambiguous calls

> 🧠 **In one sentence:** Overload resolution is the compiler's process of finding the best matching function for a generic function call, which fails if multiple matches are equally valid.

When a function call is made, the compiler goes through a sequence of steps to find a match:
1. If no matching functions are found, it looks for conversions.
2. If a single matching function is discovered, that function is deemed the best match.
3. If more than one matching function is found after considering conversions, the compiler cannot decide and issues an ambiguous match compile error.

```cpp
// Added example: Ambiguous call
#include <iostream>

void print(long x) { std::cout << "long\n"; }
void print(double x) { std::cout << "double\n"; }

int main() {
    // print(5); // COMPILE ERROR: Ambiguous call, int can convert to both long and double
    print(5L);   // calls print(long)
    return 0;
}
```

> ⚠️ **GOTCHA — Implicit conversions causing ambiguity:**
> Literals like `5` are `int` by default. If your overloads are `long` and `double`, passing an `int` triggers an ambiguous call because both conversions are "standard conversions" with equal priority.
> **What to say in an interview:** "If the compiler finds multiple viable overloads via implicit type conversion and none is strictly better, it results in an ambiguous call error."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What happens if you call an overloaded function but no exact type match exists?**

A: The compiler attempts to apply implicit type promotions (like `float` to `double` or `short` to `int`) and then standard conversions (like `int` to `double`). If it finds exactly one viable candidate after these conversions, it calls it. 

**Q2 [🔧 Product Co | 🟡 2yr]: How does the compiler decide which overloaded function is the "best" match?**

A: The compiler ranks conversions. Exact matches are highest priority. Promotions (e.g., `short` to `int`) are second. Standard conversions (e.g., `int` to `double` or `int` to `unsigned`) are third. User-defined conversions rank lowest. If multiple candidates tie at the highest found level, it's ambiguous.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Does this compile? If not, why?**

```cpp
void display(unsigned int x) {}
void display(float x) {}

int main() {
    display(5); 
}
```

A: **Compile error (Ambiguous call).** The literal `5` is of type `int`. Converting `int` to `unsigned int` and `int` to `float` are both standard conversions of equal rank. The compiler cannot choose. Fix: Call it explicitly like `display(5u)` or `display(5.0f)`.

**Q4 [🔧 Product Co | 🔴 Senior]: If you define `void func(int)` and `void func(int&)`, and call `func(5)`, what happens?**

A: It calls `void func(int)`. The literal `5` is an rvalue (temporary) and cannot bind to a non-const lvalue reference `int&`. Therefore, only the pass-by-value version is a viable candidate.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** When debugging ambiguous calls, look closely at literal types: `5` is `int`, `5.0` is `double` (not float), and `5L` is `long`. 

---

## Deleting functions

> 🧠 **In one sentence:** You can prevent a specific function, or specific overloads of a template, from being called by using the `= delete` specifier.

A function can be marked as deleted using the `= delete` specifier. This stops the function from being used entirely, triggering a compile error upon any attempted call.

You can also use this with function templates to disable unwanted overloads. If a deleted template matches a call better than a standard conversion, compilation halts.

```cpp
#include <iostream>

// This function will take precedence for arguments of type int
void printInt(int x)
{
    std::cout << x << '\n';
}

// This function template will take precedence for arguments of other types.
// Since it is deleted, calls to it will halt compilation.
template <typename T>
void printInt(T x) = delete;

int main()
{
    printInt(97);   // okay
    // printInt('a');  // compile error
    // printInt(true); // compile error
    return 0;
}
// Output: 97
```

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about deleting functions, I'd say:
> By appending `= delete` to a function signature, we explicitly forbid its usage. This is particularly useful in modern C++ to block unwanted implicit conversions. By deleting a template version of a function, we force callers to provide the exact type, preventing the compiler from making arbitrary standard conversions."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What does `= delete` do on a function declaration?**

A: It marks the function as deleted. Any attempt to call that function will result in a hard compile-time error. It explicitly signals to both the compiler and other programmers that this operation is intentionally forbidden.

**Q2 [🔧 Product Co | 🟡 2yr]: When would you prefer deleting a function template over just not writing the overload?**

A: If you just omit an overload, the compiler will attempt standard conversions (like converting a `float` or `char` to `int` to match an `int` parameter). By declaring a deleted template, the template catches all other types as exact matches. When the exact template match is chosen, the `= delete` triggers an error, effectively blocking all implicit conversions.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Why won't this class instantiate?**

```cpp
class NonCopyable {
public:
    NonCopyable() = default;
    NonCopyable(const NonCopyable&) = delete;
    NonCopyable& operator=(const NonCopyable&) = delete;
};

int main() {
    NonCopyable a;
    NonCopyable b = a; 
}
```

A: **Compile error.** By explicitly `= delete`ing the copy constructor and copy assignment operator, we've disabled copying. `b = a` invokes the deleted copy constructor. Fix: Pass by reference or pointers instead of copying it.

**Q4 [⚡ HFT | 🔴 Senior]: Can you `= delete` an overload that takes a pointer to block passing raw macros?**

A: Yes. A common pattern is deleting `void foo(void*) = delete` or `void foo(bool) = delete` to prevent people from accidentally passing pointers to arithmetic parameters, which could otherwise implicitly convert to `bool` or `int` in older C++ versions.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] What does this do?**

```cpp
void onlyDouble(double x) {}
template <typename T> void onlyDouble(T) = delete;

int main() {
    onlyDouble(5.0f);
}
```

A: **Compile error.** Passing `5.0f` (a float) exactly matches the template `template <typename T> void onlyDouble(T)`. Since that template is disabled via `= delete`, the compiler throws an error instead of implicitly converting the float to `double`. Fix: Call `onlyDouble(5.0)`.

---
> 💡 **Interview tip:** Mentioning `= delete` for blocking implicit conversions shows a strong grasp of modern C++ idiom (C++11 onwards). It is vastly superior to the old C++98 hack of making constructors private.

---

## Default arguments

> 🧠 **In one sentence:** Default arguments allow you to omit trailing arguments in a function call, making the compiler automatically fill them in using predefined values.

> **Note:** Default arguments cannot be redeclared, and must be declared before use. The best practice is to define them only in the function declaration (header file), not in the source file definition.

```cpp
#include <iostream>

void print(int x, int y=4); // forward declaration

// If we put '= 4' here too, it's a redefinition of default argument
void print(int x, int y) 
{
    std::cout << "x: " << x << ", y: " << y << '\n';
}

int main() {
    print(2);
    return 0;
}
// Output: x: 2, y: 4
```

> **Note:** The default argument must be visible in the translation unit before it is used. Including the header properly resolves this across multiple files.

> ⚠️ **GOTCHA — Redeclaring default arguments:**
> Putting the default assignment in both the `.h` file and `.cpp` file causes a compile error for redefinition.
> **What to say in an interview:** "Always specify default arguments in the function declaration (the header) and leave them out of the implementation (the cpp file)."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What are default arguments in C++?**

A: Default arguments are values specified in a function signature that the compiler automatically inserts if the caller omits those arguments. They allow a function to be called in multiple ways without needing to write multiple overloads.

**Q2 [🔧 Product Co | 🟡 2yr]: Can you have a default argument for the first parameter but not the second?**

A: No. Default arguments must always be the right-most (trailing) parameters. Once you define a default argument for a parameter, all subsequent parameters to its right must also have default arguments.

**Q3 [🌐 All | 🟢 Any]: [❌ Won't compile?] Does this compile? Why?**

```cpp
void setup(int width = 800, int height); 
void setup(int width, int height) {}

int main() {
    setup(1024);
}
```

A: **Compile error.** Default arguments must be strictly on the right side. `height` lacks a default argument, but `width` (which is to its left) has one. Fix: Add a default to `height` as well, or remove the one from `width`.

**Q4 [🔧 Product Co | 🟡 2yr]: Why should default arguments only be placed in the header file function declaration?**

A: The compiler processes each translation unit (`.cpp` file) individually. For the compiler to substitute the default value at the call site, the default argument must be visible *before* the call. Placing it in the header ensures it is visible wherever the function is called. Placing it in both the header and `.cpp` leads to a redefinition error.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🌐 All | 🟢 Any]: [❌ Won't compile?] What's wrong here?**

```cpp
void log(int x, int y=1);

void log(int x, int y=1) {
    // implementation
}
```

A: **Compile error.** Redeclaration of a default argument. Fix: Remove `=1` from the function definition block.

---

**Snippet 2 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this output?**

```cpp
#include <iostream>

void multiply(int a=2, int b=3) {
    std::cout << (a * b) << " ";
}

int main() {
    multiply();
    multiply(4);
    multiply(4, 5);
}
```

A: Output is `6 12 20`. First uses both defaults (`2*3`). Second uses explicit `4` and default `3` (`4*3`). Third explicitly overrides both (`4*5`). Fix: perfectly valid.

---
> 💡 **Interview tip:** Be aware that virtual functions with default arguments apply the default type of the *static* type of the pointer/reference, not the dynamic type. Interviewers love this trap.

---

## Function templates

> 🧠 **In one sentence:** Function templates provide a flexible blueprint allowing the compiler to generate multiple type-specific functions automatically out of a single definition.

A function template is used to generate one or more overloaded functions, each with different actual types. C++ supports type template parameters, non-type parameters (constexpr values), and template template parameters.

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    // C++11
    return (x < y) ? y : x;
}

int main()
{
    // instantiates and calls max<int>(int, int)
    std::cout << max<int>(1, 2) << '\n'; 
    return 0;
}
// Output: 2
```

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about function templates, I'd say:
> A function template isn't actual code. It's a stencil. When we call the template function, the compiler deduces the types and instantiates— meaning writes and compiles— a precise version of that function for the required data type. This guarantees zero runtime overhead and perfect type safety."

> **Note:** If an exact-match non-template function exists alongside a generic template, the compiler strongly prefers the non-template function unless explicit template brackets `<...>` are used.

```cpp
#include <iostream>

template <typename T>
T max(T x, T y) {
    std::cout << "template\n";
    return (x < y) ? y : x;
}

int max(int x, int y) {
    std::cout << "non-template\n";
    return (x < y) ? y : x;
}

int main() {
    max<int>(1, 2); // calls max<int>(int, int)
    max<>(1, 2);    // forces template instantiation / deduction
    max(1, 2);      // calls standard max(int, int)
    return 0;
}
// Output: 
// template
// template
// non-template
```

> ⚠️ **GOTCHA — Static local variables in templates:**
> Be aware that templates with modifiable `static` local variables produce a distinct static variable for *each instantiated type*. 
> **What to say in an interview:** "If you put a static variable in a function template, `foo<int>` and `foo<double>` will each get their own separate copy of that static variable, they don't share it."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What are function templates?**

A: Function templates define a family of functions. Rather than writing ten overloaded functions for `int`, `double`, `float`, etc., you write one template. The compiler reads your calls and generates the exact overloads required during compile time.

**Q2 [🔧 Product Co | 🟡 2yr]: If a non-template function and a specialized template function both perfectly match a call, which one runs?**

A: The compiler always prefers the non-template function. Normal functions are prioritized in overload resolution. To force the compiler to use the template version, you must append empty angle brackets like `myFunc<>(args)`.

**Q3 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this print?**

```cpp
#include <iostream>

template <typename T>
void count() {
    static int x = 0;
    std::cout << ++x << " ";
}

int main() {
    count<int>();
    count<int>();
    count<double>();
}
```

A: Output is `1 2 1`. The static variable `x` is instantiated once per type. The `int` version tracks its own count, and the `double` version gets an entirely distinct static `x` initialized to 0. 

**Q4 [⚡ HFT | 🔴 Senior]: What is code bloat in the context of templates, and how does it happen?**

A: Code bloat occurs because each distinct type instantiation of a template generates an entire separate copy of the function in the final binary. If you call `std::vector::push_back` on 15 different data types, the compiler writes 15 different implementations of `vector` code, significantly increasing executable size.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this call?**

```cpp
#include <iostream>
template <typename T> void print(T val) { std::cout << "A"; }
void print(int val) { std::cout << "B"; }

int main() {
    print(5);
    print<>(5);
}
```

A: Output is `BA`. `print(5)` strongly matches the non-template `B`. `print<>(5)` invokes explicit template deduction, bypassing the non-template function to instantiate and call `A`. Fix: working as intended.

---

**Snippet 2 [⚡ HFT | 🔴 Senior]: [🖥️ Output?] Static state isolation**

```cpp
#include <iostream>
template <typename T> void append() {
    static int v = 0;
    std::cout << ++v;
}

int main() {
    append<char>();
    append<short>();
}
```

A: Output is `11`. Type `char` and `short` represent distinct template instantiations, meaning the static variable `v` exists twice in memory, independently tracked.

---
> 💡 **Interview tip:** Interviewers testing templates almost always ask about static variables inside them. Remind them: one static per type.

---

## Function templates with multiple template types

> 🧠 **In one sentence:** Function templates can define multiple template parameters to accommodate operations across contrasting data types.

```cpp
#include <iostream>

template <typename T1, typename T2>
void printMatchingPair(T1 x, T2 y) {
    std::cout << x << " and " << y << '\n';
}

int main() {
    printMatchingPair(2, 3.5);  // okay: deduces int and double
    return 0;
}
// Output: 2 and 3.5
```

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about multiple template types, I'd say:
> If we strictly use one template parameter, passing mixed types (like an `int` and a `double`) creates an ambiguity because the compiler doesn't know which type `T` should be. By introducing two template parameters `T1` and `T2`, we permit heterogeneous arguments, allowing the compiler to deduce each type independently."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Why would a function template need multiple `typename` parameters?**

A: When a function accepts multiple arguments that might be of differing types, a single `typename T` forces both arguments to belong to the exact same type. If you mix an `int` and a `double`, deduction fails. Multiple template types allow each parameter to be typed distinctly by the compiler.

**Q2 [🔧 Product Co | 🟡 2yr]: How does the compiler deduce multiple types from a single function call?**

A: The compiler analyzes the arguments provided in the function call chronologically. It matches the first argument's type to `T1`, and the second argument's type to `T2`. No type coercion or casting occurs; the generated template directly acts on the specific combination.

**Q3 [🌐 All | 🟢 Any]: [❌ Won't compile?] Does this compile? If not, why?**

```cpp
template <typename T>
T max(T x, T y) {
    return (x < y) ? y : x;
}

int main() {
    max(2, 3.5); 
}
```

A: **Compile error.** The compiler tries to deduce `T`. From `2`, it deduces `int`. From `3.5`, it deduces `double`. Since `T` cannot be both, deduction fails. Fix: Use `<typename T1, typename T2>` or explicitly cast arguments `max<double>(2, 3.5)`.

**Q4 [🔧 Product Co | 🟡 2yr]: If we specify `<typename T1, typename T2>`, what challenges exist around the return type?**

A: If your function requires returning one of the two parameters (like in a `max` function), you have to figure out whether to return `T1` or `T2`. Returning the wrong one might invoke a narrowing conversion/data loss. This demands advanced features like `auto` return type deduction or `decltype`.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Template type mismatch is mostly a stepping stone question. The interviewer is leading you to the real problem: how to deduce the *return type* of a multi-template function, which brings in `auto` and `decltype`.

---

## Function templates with multiple template types and template argument deduction

> 🧠 **In one sentence:** Modern C++ simplifies multi-type template return signatures by using `auto` to let the compiler safely deduce the resulting return type of mixed-type expressions.

When dealing with mixed template types (`T1` and `T2`), identifying the common return type manually is tricky. C++ resolves this via auto type deduction.

```cpp
// Before C++14 using decltype
template <typename T1, typename T2>
auto max(T1 x, T2 y) -> decltype((x < y) ? y : x)
{
    return (x < y) ? y : x;
}

// After C++14
template <typename T1, typename T2>
auto max(T1 x, T2 y)
{
    return (x < y) ? y : x;
}
```

> **Note:** `decltype` queries the exact type of an expression. However, the syntax matters. `decltype(x)` retrieves the type, while `decltype((x))` retrieves a reference to the type.

`decltype(auto)` lets the compiler perfectly deduce the returned type using exact `decltype` rules without you having to explicitly re-write the expression.

📊 **Quick comparison:**

|                      | **auto** | **decltype(auto)** |
|----------------------|----------|--------------------|
| **Mechanics**        | Returns by value (decays references and const) | Exact type preservation (keeps refs/const) |
| **When to use**      | General functions where returning a copy is fine | Wrapper functions forwarding perfectly what they call |
| **Pitfall**          | Stripping reference inadvertently | Returning a dangling local reference |

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What does `decltype` do in C++?**

A: `decltype` is an operator that inspects the declared type of an entity or the type of an expression without actually evaluating the expression at runtime. It's heavily used in template metaprogramming to establish correct types when combining heterogeneous parameters.

**Q2 [🔧 Product Co | 🟡 2yr]: Why does `auto` as a return type differ from `decltype(auto)`?**

A: `auto` strips reference and top-level `const` qualifiers when deducing the return type—it always attempts to return by value (a copy). `decltype(auto)` retains perfect fidelity. If the expression yields an `int&`, `decltype(auto)` will return `int&`.

**Q3 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What is the type of `b` here?**

```cpp
int x = 10;
decltype(x) a = x;  
decltype((x)) b = x; 
```

A: `b` is `int&` (a reference to `int`), preventing memory reallocation. The extra parentheses convert the name `x` into an lvalue expression. By standard rules, `decltype` on an lvalue expression evaluates to an lvalue reference. (`a` is simply `int`).

**Q4 [⚡ HFT | 🔴 Senior]: What is the severe danger of using `decltype(auto)` carelessly as a return type?**

A: Returning a dangling reference. If the function returns a local variable, `auto` safely returns a copy. `decltype(auto)` might perfectly deduce and return an lvalue reference directly to the local stack variable, causing undefined behavior when accessed.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🐛 Bug?] Will this safely compile and run?**

```cpp
auto getVal() {
    int val = 42;
    return val;
}
decltype(auto) getRef() {
    int val = 42;
    return (val);
}
```

A: **Bug/UB.** `getVal` is safe and returns a copy (deduces `int`). However, `getRef` uses `(val)` meaning `decltype(auto)` deduces it as an lvalue reference (`int&`). It returns a dangling reference to a destroyed local variable, leading to Undefined Behavior. Fix: never wrap returned local variables in parentheses when using `decltype(auto)`.

---

**Snippet 2 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What is the result?**

```cpp
#include <iostream>

template <typename T1, typename T2>
auto add(T1 a, T2 b) {
    return a + b;
}

int main() {
    std::cout << sizeof(add(4, 5.5));
}
```

A: Output is usually `8` (size of a `double`). The compiler sees `a + b` combining an `int` and a `double`. Common type promotion kicks in, mapping the expression to `double`. The `auto` return type accurately deduces `double`.

---
> 💡 **Interview tip:** `decltype((x))` is considered advanced trivia. Understand it, but practically demonstrate you know that `auto` always defaults to pass-by-value unless appended exactly.

---

## Abbreviated function templates (C++20)

> 🧠 **In one sentence:** In C++20, writing parameters as `auto` creates an abbreviated shorthand for defining a function template without spelling out the verbose `template <typename T>` block.

C++20 introduces the capability to use `auto` directly in normal function parameter lists.

```cpp
// C++20 Abbreviated Template
auto max(auto x, auto y)
{
    return (x < y) ? y : x;
}

// Is exactly identical to explicitly declaring:
template <typename T, typename U>
auto max(T x, U y)
{
    return (x < y) ? y : x;
}
```

> **Note:** Each parameter declared with `auto` yields an independent, distinct template type parameter. You cannot enforce that `x` and `y` are identical types exclusively with just `auto`.

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What happens if you define a function parameter type as `auto` in C++20?**

A: The compiler secretly transforms it into a function template. It is known as an "abbreviated function template". The `auto` acts as a placeholder triggering independent parameter type deduction.

**Q2 [🔧 Product Co | 🟡 2yr]: Can you enforce both parameters to be the exact same type using C++20 abbreviated templates?**

A: No. Declaring `void process(auto x, auto y)` is strictly synonymous with `template<typename T, typename U>`. If you must mandate that both parameters share the exact same generated type `T`, you must use traditional template syntax `template<typename T> void process(T x, T y)`.

**Q3 [🌐 All | 🟢 Any]: [🖥️ Output?] What gets called here in C++20?**

```cpp
#include <iostream>

void doMath(auto a, auto b) {
    std::cout << "generic";
}

int main() {
    doMath(2, 3.5);
}
```

A: Output is `generic`. `doMath` automatically acts as a template taking `<int, double>`, so no implicit data loss matching happens, the execution proceeds safely natively.

**Q4 [⚡ HFT | 🔴 Senior]: How do you specify concepts alongside abbreviated function templates?**

A: You can prefix the `auto` keyword with a C++20 Concept name. For example `void func(std::integral auto x)`. This implicitly restricts the template generation to types that satisfy the integral concept, avoiding massive SFINAE hackery.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Knowing abbreviation limits shows true C++20 competency. While abbreviated templates save keystrokes, they rob you of naming the type explicitly if you need to use the deduced `T` later to declare a local variable. You'd have to fall back to `decltype(x)`.

---

## Non-type template parameters

> 🧠 **In one sentence:** A non-type template parameter allows placing literal constant values directly into the template angular brackets instead of data types.

A non-type template parameter acts as a placeholder for a `constexpr` value passed at compile time. Allowed types include integers, enums, `std::nullptr_t`, pointers, and (since C++20) floating points and literal class types.

```cpp
#include <bitset>
#include <iostream>

// declare a non-type template parameter of type int named N
template <int N> 
void printSize()
{
    std::cout << N << '\n'; // use value of N entirely at compile time
}

int main()
{
    std::bitset<8> bits{ 0b0000'0101 }; // <8> is a non-type template parameter
    printSize<5>(); // 5 is our non-type template argument
    return 0;
}
// Output: 5
```

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about non-type parameters, I'd say:
> Templates aren't restricted merely to arbitrary types. They can ingest concrete limits or sizes. Standard library containers like `std::array<int, 5>` leverage non-type template parameters. Because `5` is burned directly into the type signature, the compiler optimizes aggressive assumptions about size at perfect zero-overhead."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What differentiates a non-type template parameter from a normal function parameter?**

A: A non-type template parameter must be known at compile time because it produces a distinct binary type instantiation. Normal function parameters are evaluated dynamically at runtime.

**Q2 [🔧 Product Co | 🟡 2yr]: Is `std::array<int, 5>` the same type as `std::array<int, 6>`?**

A: No, absolutely not. The non-type parameter (`5` vs `6`) fundamentally changes the type signature. You cannot assign an `array<int, 5>` into an `array<int, 6>` or pass them interoperably to a generic reference without resorting to templating the function taking the array.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Will this compile?**

```cpp
template <int N>
void doTask() {}

int main() {
    int length = 10;
    doTask<length>();
}
```

A: **Compile error.** `length` is a runtime variable, it is not a constant expression. Non-type template parameters strictly mandate `constexpr` values. Fix: Declare it `constexpr int length = 10;`.

**Q4 [⚡ HFT | 🔴 Senior]: Why did previous C++ versions ban floating-point non-type parameters, and what changed in C++20?**

A: Historically, they were banned because bit-level representation of floating points is complex and compiler-dependent (rendering template equivalence checking a nightmare). C++20 standardizes precision comparison, unlocking operations that mandate floating constants right at compile phase limits.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Be extremely precise: an `std::array<int, 10>` belongs to a completely different type class than `std::array<int, 11>`. The arrays share no polymorphism.

---

## 11.10 — Using function templates in multiple files

> 🧠 **In one sentence:** Function template implementations must be visible wherever they are invoked; otherwise, code compiles successfully but links fail with unresolved external symbols.

If you forward-declare a template in a `.h` file but implement it in a `.cpp` file, compiling is mostly fine, but the linker crashes. The compiler can't generate the specific overload (e.g. `add<int>`) when scanning the implementation file because it requires visibility of both the implementation and the exact requested type simultaneously.

> **Note:** The traditional and universally accepted solution is to insert the completely defined function template explicitly within the header file ensuring it stays visible to all translating nodes.

```cpp
// math.h
#ifndef MATH_H
#define MATH_H

template <typename T>
T addOne(T x) // FULL DEFINITION placed entirely in header
{
    return x + 1;
}

#endif
```

> ⚠️ **GOTCHA — LNK2019 Unresolved External Symbols:**
> Separating template definitions cleanly into `.cpp` files triggers notoriously catastrophic missing symbol linker errors because the template hasn't instantiated yet.
> **What to say in an interview:** "Unlike regular functions, a template isn't code until invoked with a type. If you hide its body in a `.cpp` file, it can't instantiate. We resolve this by putting template bodies directly in the headers."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Where should you define function templates in your project structure?**

A: Inside the header (`.h` or `.hpp`) files. Unlike normal functions, separating declaration into `.h` and definition into `.cpp` causes severe linking failures.

**Q2 [🔧 Product Co | 🟡 2yr]: Why does separating template definition to a `.cpp` file fail at link time?**

A: Templates only generate actual binary sequences when instantiated with concrete types. When compiling the `main.cpp` translation unit, it sees the forward declaration but doesn't have the body to instantiate the generated type. When compiling the `.cpp` template translation unit, it holds the blueprint but has no clue which concrete types the caller requested, leaving nothing exported for the linker to find.

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] How do you fix the linker error caused when utilizing a template defined inside a pure `.cpp` file without extracting it to a header?**

```cpp
// Implementation.cpp
template<typename T>
void execute(T x) { /* ... */ }

// Expected main.cpp call: execute(42);
```

A: **Fix via Explicit Instantiation.** Without moving it to a header, you must manually pre-instantiate the type at the very end of your `.cpp` file specifically where the generic template currently lives by appending explicitly: `template void execute<int>(int);`.

**Q4 [⚡ HFT | 🔴 Senior]: Putting complete function code in a header frequently triggers "multiple definition" errors across translation units. Why doesn't placing template functions in headers trigger these errors?**

A: Function templates inherently include `inline` linkage characteristics by default behavior when instantiated. The compiler guarantees that if multiple translation units synthesize the exact same generic type variation, the linker folds them uniformly into one deduplicated identity, safely ignoring Ordinary Definition Rules constraints.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Explicit instantiation inside the `.cpp` file is a fantastic ace to pull if the interviewer restricts header expansion. Mentioning "explicit instantiation" tells them you inherently understand how the linker maps symbols.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|------|---------------------|
| Function overload | Designing heterogeneous functions sharing an identical signature name but varied types |
| Signature | The specific composition of parameters identifying function identity (ignores return type/top-level const) |
| Ambiguous call | Failure triggered when compiler identifies contrasting viable overloading operations concurrently |
| Standard conversion | Built-in fallback casting path the compiler tries linearly prior to resorting to ambiguous calls |
| `= delete` | Hard compile-specifier used systematically to ban undesired operations entirely |
| Default argument | Constant implicitly attached allowing partial invocation trailing at signatures end |
| Function template | A meta-code stencil evaluated explicitly to synthesize precise programmatic overloads |
| Type template parameter | `typename T`; designates standard objects, containers, variable entities during instantiation |
| Non-type template parameter | Evaluated compile arguments (`constexpr int`, values rather than distinct classes) |
| Abbreviated function template | Automatically generates template variations merely placing `auto` alongside function inputs |
| `decltype` | Operator checking precisely referenced states omitting traditional copying stripping defaults |
| Explicit Instantiation | Bypassing header mapping by explicitly declaring a `.cpp` file instantiates generic templates |

---

## 🖥️ Snippet Patterns — Full Coverage

> Complete snippet coverage for this chapter.
> Includes Q3 from every section AND every additional pattern from the
> Snippet Drill blocks. This table is the full exam paper for this chapter.
> Cover the Answer column, predict the result, then reveal.

| # | Section | Snippet summary | Type | Tag | Answer |
|---|---------|-----------------|------|-----|--------|
| 1 | Overloaded functions | Top-level const on value parameters | ❌ | 🌐 | Compile error — redefinition |
| 2 | Overloaded functions | Overloading solely based on return type | ❌ | 🌐 | Compile error — return types ignored |
| 3 | Overload resolution | Identical magnitude conversion ranks on numbers | ❌ | 🔧 | Compile error — Ambiguous call |
| 4 | Deleting functions | Deleting copy assignment / construction | ❌ | 🔧 | Compile error — use of deleted function |
| 5 | Deleting functions | Overriding floating point to block conversions | ❌ | 🔧 | Compile error — blocked template match |
| 6 | Default arguments | Ordering omitted parameter incorrectly explicitly | ❌ | 🌐 | Compile error — defaults must be rightmost |
| 7 | Default arguments | Redefining default identically across implementation | ❌ | 🌐 | Compile error — redefinition missing declaration |
| 8 | Default arguments | Computing standard parameters against default traces | 🖥️ | 🔧 | Evaluates strictly following override or inherited sequence |
| 9 | Function templates | Instantiating independent tracked static variables | 🖥️ | 🔧 | Distributes unique isolated instantiations explicitly |
| 10| Function templates | Bypassing standard precedence via angular bracket | 🖥️ | 🔧 | Disregards simple non-generic call explicitly targeting templates |
| 11| Function templates | Multiple consecutive instantiated identical parameters | 🖥️ | ⚡ | Static integers incremented universally across identical instantiated types |
| 12| Multiple templates | Implicit conflicting conversions using one typename | ❌ | 🌐 | Compile error — Deductions contradict identifying parameter type |
| 13| Template deduction | Wrapping returned variables producing references | 🐛 | 🔧 | Bug/UB — Undefined behavior referencing popped variable space |
| 14| Template deduction | Extrapolating `auto` evaluating sizes across mixed bounds | 🖥️ | 🔧 | Standard mapping sizes converting implicit numeric logic universally |
| 15| Abbreviated templates | Standard parameter matching output mapping implicitly | 🖥️ | 🌐 | Resolves natively instantiating correct output |
| 16| Non-type parameters | Inserting runtime variables limiting compile space | ❌ | 🔧 | Compile error — Runtime values prohibited defining templates |
| 17| 11.10 templates | Template implementation masked externally | ❌ | 🔧 | Linker external exception failure resolving |

**Top 3 fail points for 2-year engineers in this chapter:**
1. Assuming top-level `const` on pass-by-value creates a distinct signature (it doesn't, it causes a redefinition compile error).
2. Implementing templates in a `.cpp` file without realizing it completely guarantees a catastrophic linker failure due to absent instantiations.
3. Defining default arguments in a `.cpp` body alongside a header declaration instead of centralizing exclusively utilizing the header mapping path.

**Sections with only one testable snippet pattern:**
- Function overload resolution and ambiguous calls — Q3 is complete coverage; confirmed by Snippet Drill block.
- Function templates with multiple template types — Q3 is complete coverage; confirmed by Snippet Drill block.
- Abbreviated function templates (C++20) — Q3 is complete coverage; confirmed by Snippet Drill block.
- Non-type template parameters — Q3 is complete coverage; confirmed by Snippet Drill block.
- 11.10 — Using function templates in multiple files — Q3 is complete coverage; confirmed by Snippet Drill block.