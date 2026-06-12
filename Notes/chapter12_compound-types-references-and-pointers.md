# Chapter 12: Compound Types : References and pointers

---

## Lvalue and rvalue expressions

> 🧠 **In one sentence:** An lvalue refers to a persistent memory location that can have its address taken, while an rvalue is a temporary value that cannot.

An lvalue is an expression that refers to a specific memory location. You can take the address of an lvalue using the address-of operator (`&`). An rvalue is an expression that does not refer to a persistent memory location and cannot have its address taken. 

Common rvalues include literals (except C-style string literals, which are lvalues) and the return values of functions and operators that return by value. Rvalues aren’t identifiable, meaning they have to be used immediately. They only exist within the scope of the expression in which they are used.

```cpp
int return5()
{
    return 5;
}

int main()
{
    int x{ 5 }; // 5 is an rvalue expression
    const double d{ 1.2 }; // 1.2 is an rvalue expression

    int y { x }; // x is a modifiable lvalue expression
    const double e { d }; // d is a non-modifiable lvalue expression
    int z { return5() }; // return5() is an rvalue expression (result is returned by value)

    int w { x + 1 }; // x + 1 is an rvalue expression
    int q { static_cast<int>(d) }; // result of static casting d to an int is an rvalue expression

    return 0;
}
```

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is the difference between an lvalue and an rvalue in C++?**

A: An lvalue represents an object that occupies an identifiable location in memory, meaning you can take its address. An rvalue is a temporary value, like a literal or the result of an expression, that doesn't have a persistent memory address. In simple terms, lvalues can appear on the left side of an assignment, while rvalues typically appear on the right.

**Q2 [🔧 Product Co | 🟡 2yr]: How did C++11 change the importance of categorizing expressions into lvalues and rvalues?**

A: C++11 introduced rvalue references and move semantics. Before C++11, the distinction was mostly about whether you could assign to something or take its address. Since C++11, the compiler uses rvalues to determine when it can safely "steal" resources from temporary objects instead of copying them, drastically improving performance.

**Q3 [🌐 All | 🟢 Any]: [❌ Won't compile?] Will this code compile? If not, why?**

```cpp
int main() {
    int* ptr = &42;
    return 0;
}
```

A: **Compile error.** You cannot take the address of an rvalue. The literal `42` is a temporary value that does not have a persistent memory location. The address-of operator (`&`) requires an lvalue operand. Fix: Store `42` in an lvalue variable first, then take its address.

**Q4 [🔧 Product Co | 🟡 2yr]: Are string literals lvalues or rvalues?**

A: String literals are lvalues. Unlike other literals (like `42` or `3.14`), string literals are stored as arrays of `const char` in static memory for the duration of the program. Because they have a persistent memory location, you can take their address.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Be prepared to explain how `std::move` relates to lvalues and rvalues: it simply casts an lvalue to an xvalue (a kind of rvalue), enabling move semantics.

## Lvalue references

> 🧠 **In one sentence:** An lvalue reference is an alias that binds exactly once to an existing lvalue object and cannot be reseated.

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about references, I'd say:
> A reference is essentially an alias for another variable. Under the hood, it's often implemented as a const pointer that is automatically dereferenced, but logically, it's not a separate object — it has no identity or address of its own. Once it's bound during initialization, it can never refer to anything else."

An lvalue reference is a reference that can only bind to lvalues. It is declared using the `&` symbol. 

```cpp
int x { 5 }; // x is an lvalue
int& ref { x }; // ref is an lvalue reference to x
```

> **Note:** Any change made to `ref` will also change `x`, since `ref` is just another name for `x`.

> **Note:** Once initialized, a reference in C++ cannot be reseated, meaning it cannot be changed to reference another object. If we try to assign a new value to a reference, we are actually assigning a new value to the object that the reference is bound to, not changing the reference itself.

```cpp
int x { 5 };
int& ref { x }; // ref is an lvalue reference to x
ref = 10; // this changes the value of x to 10, but ref still references x
std::cout << x << '\n'; // Output: 10
```

> **Note:** References aren't objects themselves, but rather aliases for other objects. They don't have their own memory address, and they can't be null. This is why references must be initialized when they are declared, and why they can't be reseated to refer to a different object later on.

> ⚠️ **GOTCHA — Reseating attempt:**
> Attempting to reassign a reference does not bind it to a new object; it just assigns the new object's value to the originally referenced object.
> **What to say in an interview:** "References can never be reseated; assignment through a reference updates the original object's value."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is a reference in C++?**

A: A reference is an alias for an existing object. Once initialized, it acts exactly like the original object. It must be initialized when declared, cannot be null, and cannot be reseated to refer to another object.

**Q2 [🔧 Product Co | 🟡 2yr]: Under the hood, how is a reference typically implemented by the compiler?**

A: Compilers typically implement references as constant pointers that are automatically dereferenced every time you use them. However, standard C++ specifies that references themselves are not objects and don't necessarily take up memory if the compiler can optimize them out entirely.

**Q3 [🌐 All | 🟢 Any]: [🖥️ Output?] What does this code print?**

```cpp
#include <iostream>

int main() {
    int a = 1;
    int b = 2;
    int& ref = a;
    ref = b;
    a = 3;
    std::cout << ref << " " << b << '\n';
}
```

A: Output is `3 2`. The line `ref = b` assigns the value `2` to `a` because `ref` is an alias for `a`. It does *not* make `ref` refer to `b`. When `a` is changed to `3`, `ref` reflects that. `b` remains `2`. Fix: None needed, but understand that references cannot be reseated.

**Q4 [🏢 Service Co | 🟢 Any]: What happens if you declare a reference without initializing it?**

A: It won't compile. A reference must be initialized at the point of declaration because it represents an alias to an existing object. It cannot refer to "nothing" or be null.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🌐 All | 🟢 Any]: [❌ Won't compile?] What's wrong here?**

```cpp
int main() {
    int& ref;
    int a = 5;
    ref = a;
}
```

A: **Compile error.** References must be initialized upon declaration. Fix: Write `int& ref = a;`.

---
> 💡 **Interview tip:** Interviewers often test your understanding of "reseating." If you see `ref = otherVar`, it's an assignment of value, not a change of identity.

## Lvalue references to const

> 🧠 **In one sentence:** A reference to const is a reference that cannot be used to modify the object it binds to, and unlike non-const references, it can bind to rvalues and const lvalues.

```cpp
const int x { 5 }; // x is a non-modifiable (const) lvalue
// int& ref { x }; // error: ref can not bind to non-modifiable lvalue
```
To fix this, we can declare `ref` as a reference to `const`:
```cpp
const int& ref { x }; // ref is a reference to const, and can bind to x
```

Also, a reference to const can bind to a non-const lvalue:

```cpp
int x { 5 }; // x is a modifiable lvalue
const int& ref { x }; // ref is a reference to const, and can bind to x
```

In this case, we cannot use `ref` to modify the value of `x`, even though `x` itself is modifiable. Any attempt to do so will result in a compile error.

> **Note:** Unlike a reference to non-const (which can only bind to modifiable lvalues), a reference to const can bind to modifiable lvalues, non-modifiable lvalues, and rvalues. Therefore, if we make a reference parameter `const`, then it will be able to bind to any type of argument passed to the function.

> ⚠️ **GOTCHA — Lifetime extension:**
> When a const reference binds to a temporary object (an rvalue), the lifetime of that temporary is extended to match the lifetime of the reference.
> **What to say in an interview:** "Binding an rvalue to a const lvalue reference safely extends the rvalue's lifetime, avoiding a dangling reference."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is special about an lvalue reference to `const`?**

A: Unlike a regular lvalue reference which can only bind to a modifiable lvalue, a `const` reference can bind to modifiable lvalues, non-modifiable lvalues, and rvalues (temporaries). It's widely used for function parameters to accept any object without copying it.

**Q2 [🔧 Product Co | 🟡 2yr]: If a `const` reference is bound to a non-const variable, can the variable's value change?**

A: Yes. The variable itself can still be modified directly. The `const` qualifier on the reference only means you cannot modify the object *through that specific reference path*. It's a read-only view.

**Q3 [🔧 Product Co | 🔴 Senior]: [❌ Won't compile?] Why does `f2` fail?**

```cpp
void f1(const int& a) {}
void f2(int& b) {}

int main() {
    f1(42); 
    f2(42);
}
```

A: **Compile error.** `42` is an rvalue. A `const` lvalue reference (`f1`) can bind to an rvalue, but a non-const lvalue reference (`f2`) cannot because it expects an object it can modify, and temporaries shouldn't be implicitly modified. Fix: Pass a variable to `f2`.

**Q4 [⚡ HFT | 🔴 Senior]: What happens when a `const` reference binds to a temporary value, like the return value of a function?**

A: The lifetime of the temporary object is extended to match the scope of the `const` reference. This is a special C++ rule. When the reference goes out of scope, the temporary object's destructor is finally called.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this print?**

```cpp
#include <iostream>

int main() {
    int x = 10;
    const int& ref = x;
    x = 20;
    std::cout << ref << '\n';
}
```

A: Output is `20`. The reference provides a read-only alias, but the underlying object `x` is modifiable. When `x` changes, reading through `ref` shows the updated value. Fix: None.

---
> 💡 **Interview tip:** "pass by const reference" is the default standard for passing class types and `std::string` in C++ to avoid copies while preventing modification.

## Pointers

> 🧠 **In one sentence:** A pointer is an object that holds the memory address of another variable or resource.

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about pointers vs references, I'd say:
> A pointer is a distinct object that holds a memory address. Unlike references, a pointer can be uninitialized, it can be null, it can be reassigned to point somewhere else, and you can do arithmetic on it. Because it's an object itself, it has its own identity and address."

A pointer is an object that holds a memory address (typically of another variable) as its value. This allows us to store the address of some other object to use later.

> **Note:** The address-of operator (`&`) returns a pointer.

```cpp
#include <iostream>
#include <typeinfo>

int main()
{
	int x{ 4 };
	std::cout << typeid(x).name() << '\n';  // print the type of x (int)
	std::cout << typeid(&x).name() << '\n'; // print the type of &x (int*)

	return 0;
}
```

### Dangling pointers

A dangling pointer is a pointer that is holding the address of an object that is no longer valid (e.g., because it has been destroyed).

> ⚠️ **GOTCHA — Dangling Pointer:**
> Dereferencing a pointer that points to deallocated memory or a local variable that has gone out of scope causes undefined behavior.
> **What to say in an interview:** "If you hold a pointer to an object, you must guarantee that the pointer's lifetime does not exceed the object's lifetime."

### Pointers and const

```cpp
int main()
{
    const int x { 5 }; // x is now const
    // int* ptr { &x };   // compile error: cannot convert from const int* to int*
    return 0;
}
```

#### Pointer to const

A pointer to const is a pointer that points to a const object. We cannot use the pointer to modify the value, but we can change the pointer itself.

```cpp
int main()
{
    const int x { 5 };
    const int* ptr { &x }; // ptr is a pointer to const int
    // *ptr = 10; // compile error: cannot modify value through ptr
    
    const int y { 6 };
    ptr = &y; // okay: ptr now points at y
    return 0;
}
```

> **Note:** We can also have pointers to const that point to modifiable objects. 

```cpp
int main()
{
    int x{ 5 }; // modifiable int
    const int* ptr { &x }; // points to const int
    // *ptr = 10; // compile error 
    return 0;
}
```

#### Const pointer

A const pointer is a pointer that is itself const, meaning we cannot change the pointer to point to a different object. We can modify the value it points to (if the object isn't const).

```cpp
int main()
{
    int x{ 5 };
    int* const ptr { &x }; // ptr is a const pointer to int
    *ptr = 10; // okay: modify value
    
    int y{ 6 };
    // ptr = &y; // compile error: cannot change where ptr points
    return 0;
}
```

📊 **Quick comparison:**

| Syntax | What is const? | Can reassign pointer? | Can modify underlying value? |
|----------------------|----------------|----------------|----------------|
| `const T* ptr` | Data is const | Yes | No |
| `T* const ptr` | Pointer is const | No | Yes |
| `const T* const ptr` | Both are const | No | No |

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is a dangling pointer, and why is it dangerous?**

A: A dangling pointer is a pointer that holds the memory address of an object that has been deallocated or has gone out of scope. It's dangerous because dereferencing it causes undefined behavior—it might crash, or worse, silently corrupt unrelated data that now occupies that memory location.

**Q2 [🔧 Product Co | 🟡 2yr]: How do you read declarations like `const int* p` vs `int* const p`?**

A: Read declarations right-to-left. `const int* p` means `p` is a pointer to an `int` that is `const` (can't modify value, can change pointer). `int* const p` means `p` is a `const` pointer to an `int` (can modify value, can't change pointer). 

**Q3 [🔧 Product Co | 🟡 2yr]: [❌ Won't compile?] Which line fails to compile?**

```cpp
int main() {
    int v1 = 10;
    int v2 = 20;
    const int* p1 = &v1;
    int* const p2 = &v2;

    p1 = &v2;   // line A
    *p1 = 30;   // line B
    p2 = &v1;   // line C
    *p2 = 40;   // line D
}
```

A: **Lines B and C fail to compile.** `p1` is a pointer to `const`, so you cannot modify the value it points to (Line B). `p2` is a `const` pointer, so you cannot reassign it to point to a different address (Line C). Fix: Change logically based on design intent.

**Q4 [⚡ HFT | 🔴 Senior]: What is the difference between a null pointer and a dangling pointer?**

A: A null pointer holds a specific, well-defined value (like `nullptr` or `0`) indicating it points to "nothing". You can safely check if a pointer is null. A dangling pointer holds a garbage address where an object used to live. You cannot computationally check if a pointer is dangling; dereferencing it is UB.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [💀 UB?] Is this code safe?**

```cpp
#include <iostream>

int* getLocal() {
    int local = 5;
    return &local;
}

int main() {
    int* p = getLocal();
    std::cout << *p << '\n';
}
```

A: **Undefined behaviour.** The function returns a pointer to a local variable. `local` is destroyed when the function exits, making `p` a dangling pointer. Dereferencing it in `main` is UB. Fix: Return by value, or allocate on the heap (and manage it).

---
> 💡 **Interview tip:** Remembering `const` pointer syntax via "read right to left" is a classic trick. `int * const p` reads as "p is a const pointer to int".

## Pass by address

> 🧠 **In one sentence:** Pass by address involves passing the memory address of an object (via a pointer) so the function can access or modify the original object.

> 🗣️ **Say it out loud:**
> "When an interviewer asks why use pass by address, I'd say:
> While pass by reference is usually safer and cleaner in modern C++, pass by address is still useful when you explicitly want to allow the argument to be 'null', or when interfacing with C APIs that expect pointers."

With pass by address, instead of providing an object as an argument, the caller provides an object’s address. 

```cpp
void printByValue(std::string val) { /* ... */ }
void printByReference(const std::string& ref) { /* ... */ }
void printByAddress(const std::string* ptr) { /* ... */ }

int main()
{
    std::string str { "Hello, world!" };

    printByValue(str); 
    printByReference(str); 
    printByAddress(&str); // pass the address of str

    return 0;
}
```

We can also pass pointers by reference, allowing us to modify the pointer itself (change where it points) within the function.

```cpp
void modifyPointer(int*& ptr) // ptr is a reference to a pointer
{
    static int y { 10 }; 
    ptr = &y; // modify the pointer to point to y
}

int main()
{
    int x { 5 };
    int* ptr { &x }; 

    modifyPointer(ptr); 
    std::cout << *ptr << '\n'; // Output: 10
}
```

> ⚠️ **GOTCHA — Null checks:**
> A pointer passed by address can be null. Dereferencing it without checking causes UB.
> **What to say in an interview:** "Whenever taking parameters by pointer, assert or check for null before dereferencing."

📊 **Quick comparison:**

| Feature | Pass by Reference | Pass by Address (Pointer) |
|----------------------|----------------|----------------|
| **Syntax** | `void foo(int& x)` | `void foo(int* x)` |
| **Can be null?** | No | Yes |
| **Caller syntax** | `foo(var)` | `foo(&var)` |
| **Usage** | Default choice for C++ | Legacy C code or when "optional" is needed |

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: When would you prefer pass by address over pass by reference?**

A: In modern C++, pass by reference is the default for passing objects efficiently. Pass by address is preferred when the argument is conceptually optional (meaning `nullptr` is valid input), when transferring ownership in older code, or when interfacing with C libraries.

**Q2 [🔧 Product Co | 🟡 2yr]: What is the signature `int*& ptr` doing?**

A: It is passing a pointer by reference. `ptr` is a reference to a pointer to an `int`. This allows the function to not only modify the integer being pointed to, but also modify the caller's pointer variable itself to point to a completely different memory address.

**Q3 [🔧 Product Co | 🟡 2yr]: [💀 UB?] What's wrong with this function?**

```cpp
void updateValue(int* p) {
    *p = 42;
}

int main() {
    int* ptr = nullptr;
    updateValue(ptr);
}
```

A: **Undefined behaviour.** The function dereferences the pointer without checking if it's null. Passing a null pointer and dereferencing it is UB (typically a segfault). Fix: Add `if (p != nullptr)` inside `updateValue`.

**Q4 [🏢 Service Co | 🟢 Any]: If you pass a pointer by address (`void f(int* p)`), can the function change where the original pointer in the caller points?**

A: No. `p` is passed by value (a copy of the pointer address is passed). The function can modify the `int` that `p` points to, but if it reassigns `p = &some_other_var`, it's only modifying the local copy of the pointer. The caller's pointer remains unchanged. 

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🖥️ Output?] What does this print?**

```cpp
#include <iostream>

void tryReassign(int* p) {
    static int val = 99;
    p = &val;
}

int main() {
    int x = 10;
    int* myPtr = &x;
    tryReassign(myPtr);
    std::cout << *myPtr << '\n';
}
```

A: Output is `10`. The pointer `myPtr` is passed by value. `tryReassign` gets a copy of the pointer. Changing where the copy points does not affect `myPtr` in `main`. Fix: Pass by reference `int*& p` or return the new pointer.

---
> 💡 **Interview tip:** If an interviewer asks to modify a C-string's pointer to advance through the string, ensure you take a `char**` or `char*&`.

## Return by reference and return by address

> 🧠 **In one sentence:** Returning by reference or address avoids copying data out of a function, but you must ensure the object outlives the function call.

A function can return a reference to an object, allowing the caller to access and modify the object directly. 

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() 
{
    static const std::string s_programName { "Calculator" }; 
    return s_programName;
}
```

> **Note:** The object being returned by reference must exist after the function returns, otherwise we would be returning a reference to an object that has been destroyed, which would lead to undefined behavior.

> ⚠️ **GOTCHA — Returning local variables by reference:**
> Returning a reference to a non-static local variable results in a dangling reference.
> **What to say in an interview:** "Never return references or pointers to local stack variables, as they are destroyed when the function frame pops."

> **Note:** Don’t return non-const static local variables by reference
> If you return a non-const static variable by reference, consecutive calls might step on each other or have confusing semantics.

> **Note:** It’s okay to return reference parameters by reference. Since the parameter was passed in from the caller, it's guaranteed to live at least as long as the function execution.

```cpp
// Returns reference to whichever string comes first
const std::string& firstAlphabetical(const std::string& a, const std::string& b) {
	return (a < b) ? a : b; 
}
```

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: Why would you return by reference instead of by value?**

A: Returning by reference avoids making a deep copy of a large object (like a container or complex class). It's also necessary when implementing operator overloads like `operator[]` or `operator=` where the caller needs to assign a new value directly to the object being returned.

**Q2 [🔧 Product Co | 🟡 2yr]: What is the biggest danger when returning by reference or by pointer?**

A: Returning a reference or pointer to a local variable allocated on the stack. Once the function returns, the stack frame is destroyed, and the reference/pointer becomes dangling. Accessing it leads to undefined behavior.

**Q3 [🔧 Product Co | 🟡 2yr]: [💀 UB?] What's the bug in this function?**

```cpp
#include <vector>

std::vector<int>& makeArray() {
    std::vector<int> v = {1, 2, 3};
    return v;
}
```

A: **Undefined behaviour.** `v` is a local stack variable. When the function returns, `v` is destroyed. Returning a reference to it creates a dangling reference. Fix: Return by value (compilers will optimize the copy via RVO) or pass an out-parameter.

**Q4 [⚡ HFT | 🔴 Senior]: If you return a reference parameter by reference, is it always safe?**

A: Generally yes, the argument passed into the function must exist in the caller's scope. However, if the caller passed a temporary object (an rvalue) bound to a `const` reference, and you return that reference, the temporary might be destroyed immediately after the statement in the caller finishes, leading to a lingering dangling reference if stored.

#### 🖥️ Snippet Drill — All Patterns

> Every testable snippet pattern for this topic.
> Cover the Answer, predict the result, then reveal.

---

**Snippet 1 [🔧 Product Co | 🟡 2yr]: [🐛 Bug?] Why might this be problematic?**

```cpp
#include <iostream>

const int& getNextId() {
    static int s_x = 0;
    ++s_x;
    return s_x;
}

int main() {
    const int& id1 = getNextId();
    const int& id2 = getNextId();
    std::cout << id1 << " " << id2 << '\n';
}
```

A: **Logical bug / bad design.** Because both `id1` and `id2` are references to the exact same static variable, they will both reflect the latest value. Output is `2 2`, not `1 2`. Fix: Return `s_x` by value.

---
**Snippet 2 [🔧 Product Co | 🟡 2yr]: [💀 UB?] Is this safe?**

```cpp
std::string* getString() {
    std::string s = "hello";
    return &s;
}

int main() {
    std::string* p = getString();
}
```

A: **Undefined behaviour.** Returning a pointer to a local variable. `s` goes out of scope and is destroyed. `p` is a dangling pointer. Fix: Return by value.

---
> 💡 **Interview tip:** Modern C++ relies heavily on Return Value Optimization (RVO) and move semantics. Suggesting "return large objects by value" rather than pointers often shows maturity with modern standards.

## In and Out parameters

> 🧠 **In one sentence:** Function parameters can be categorized conceptually as 'in' parameters (providing data to the function) or 'out' parameters (used by the function to return data to the caller).

**In parameters**
In most cases, a function parameter is used only to receive an input from the caller. Parameters that are used only for receiving input are called *in parameters*. Pass by value and pass by const reference are used for in parameters.

**Out parameters**
In some cases, a function parameter is used only to send an output back to the caller. Parameters that are used only for sending output back are *out parameters*. Pass by non-const reference or pointer is used for out parameters.

> ⚠️ **GOTCHA — Out Parameters Design:**
> Out parameters are awkward to use and composability suffers (you can't chain function calls).
> **What to say in an interview:** "In modern C++, returning multiple values using a `std::tuple` or aggregate `struct` is often preferred over out parameters."

---
#### ❓ Interview Q&A

**Q1 [🌐 All | 🟢 Any]: What is the difference between an in parameter and an out parameter?**

A: An in parameter is data supplied by the caller for the function to read. An out parameter is a modifiable variable provided by the caller so the function can write results back into it.

**Q2 [🔧 Product Co | 🟡 2yr]: How do you declare an out parameter in C++?**

A: You typically declare it using a non-const lvalue reference (e.g., `void func(int& result)`). Alternatively, you can use a pointer if the output is optional (e.g., `void func(int* result)`).

**Q3 [🔧 Product Co | 🟡 2yr]: [🔧 Fix it] Improve this code without using out parameters.**

```cpp
void divide(int numerator, int denominator, int& quotient, int& remainder) {
    quotient = numerator / denominator;
    remainder = numerator % denominator;
}
```

A: Out parameters hinder composition. Return a struct instead:
```cpp
struct DivResult { int quotient; int remainder; };
DivResult divide(int num, int den) {
    return {num / den, num % den};
}
```

**Q4 [🏢 Service Co | 🟡 2yr]: What is an `in-out` parameter?**

A: An in-out parameter behaves as both. The caller provides initial data, the function reads it, alters it, and the modified value is kept in the same variable for the caller to observe. Like `out` parameters, they use non-const references.

#### 🖥️ Snippet Drill — All Patterns

> ✅ Q3 covers the only testable snippet pattern for this section.

---
> 💡 **Interview tip:** Mentioning `std::pair`, `std::tuple`, or structured bindings (C++17) as alternatives to out parameters signals you're up to date with modern C++.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|------|---------------------|
| Lvalue | An expression indicating a persistent memory location that can have its address taken. |
| Rvalue | A temporary expression, value, or literal that does not possess an address. |
| Reference | An alias that binds to an existing object and cannot be reseated. |
| Pointer | An object holding a memory address, which can be manipulated, reassigned, or null. |
| Dangling Pointer / Reference | A pointer/reference pointing to memory that has been deallocated or gone out of scope. |
| Pass by Address | Passing the memory pointer of an object to a function as an argument. |
| RVO | Return Value Optimization; eliding the copy operation when returning by value. |

---

## 🖥️ Snippet Patterns — Full Coverage

> Complete snippet coverage for this chapter.
> Includes Q3 from every section AND every additional pattern from the Snippet Drill blocks. This table is the full exam paper for this chapter. Cover the Answer column, predict the result, then reveal.

| # | Section | Snippet summary | Type | Tag | Answer |
|---|---------|-----------------|------|-----|--------|
| 1 | Lvalue and rvalue | Address-of operator on literal (`&42`) | ❌ | 🌐 | Compile error — cannot take address of rvalue |
| 2 | Lvalue references | Assign to reference alias (`ref = b`) | 🖥️ | 🌐 | Reassigns target value, `ref` not reseated |
| 3 | Lvalue references | Uninitialized reference | ❌ | 🌐 | Compile error — reference requires initialization |
| 4 | Lvalue references to const | Non-const reference to rvalue literal (`f2(42)`) | ❌ | 🔧 | Compile error — non-const ref cannot bind to rvalue |
| 5 | Lvalue references to const | Value changes out-of-band behind const ref | 🖥️ | 🔧 | Prints updated value since it's a read-only alias |
| 6 | Pointers | Const pointer vs pointer to const reassignments | ❌ | 🔧 | Compile errors based on specific const restraints |
| 7 | Pointers | Pointer returned to local function variable | 💀 | 🔧 | UB — local variable dies, pointer dangles |
| 8 | Pass by address | Dereferencing without `nullptr` check | 💀 | 🔧 | UB on null deref (segfault) |
| 9 | Pass by address | Pointer copied by value reassigned locally | 🖥️ | 🔧 | Original points same place; pass-by-val copy updated |
| 10 | Return by ref / addr | Reference returned to local stack variable | 💀 | 🔧 | UB — variable dies, reference dangles |
| 11 | Return by ref / addr | Two references to mutated static internal value | 🐛 | 🔧 | References report same most-recent static state |
| 12 | Return by ref / addr | Pointer returned to local stack string | 💀 | 🔧 | UB — pointer dangles immediately |
| 13 | In and Out params | Convert out-parameters to standard return struct | 🔧 | 🔧 | Compose struct return; out-params cause side-effects |

**Top 3 fail points for 2-year engineers in this chapter:**
1. Returning references or pointers to local stack variables, leading to undefined behaviour dangling references.
2. Assuming `int * const p` and `const int * p` mean the same thing, failing the "pointer to const" reassignment tests.
3. Confusion about "reseating" references—candidates assume `ref = new_target;` changes what the reference points to, when it actually overwrites the original object's data.

**Sections with only one testable snippet pattern:**
- Lvalue and rvalue expressions — Q3 is complete coverage; confirmed by Snippet Drill block.
- In and Out parameters — Q3 is complete coverage; confirmed by Snippet Drill block.
