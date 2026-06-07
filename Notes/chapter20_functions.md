# Chapter 20: Functions

---

## Function Pointers

> 🧠 **In one sentence:** A **function pointer** is a variable that holds the memory address of a function rather than a data value, allowing you to call that function abstractly.

Function pointers are like regular pointers, except instead of pointing to variables, they point to executable function code in memory.

> 🗣️ **Say it out loud:**
> "When an interviewer asks me about function pointers, I'd say:
> A function pointer stores the memory address where a function's instructions are located. Just like you can pass a variable to a function, you can pass a function pointer to another function. This is incredibly useful for implementing callback mechanisms or strategy patterns, like passing a custom comparison function to a sorting algorithm. Here is a quick example of getting a function's address..."

```cpp
#include <iostream>

int foo() // code for foo starts at memory address 0x002717f0
{
    return 5;
}

int main()
{
    foo(); // jump to address 0x002717f0
    std::cout << foo << '\n'; // it will print 1 (true)
    return 0;
}
// Output:
// 1
```

> **Note:** When a function is referred to by name (without parenthesis), C++ converts the function into a function pointer (holding the address of the function). Then `operator<<` tries to print the function pointer, which it fails at because `operator<<` does not know how to print function pointers. The standard says that in this case, `foo` should be converted to a `bool` (which `operator<<` does know how to print). And since the function pointer for `foo` is a non-null pointer, it should always evaluate to Boolean `true` (printing `1`).

### Pointers to functions

> 🧠 **In one sentence:** A pointer to a function is declared by specifying the function's return type, an asterisk and the pointer name in parentheses, followed by the parameter list.

```cpp
// fcnPtr is a pointer to a function that takes no arguments and returns an integer
int (*fcnPtr)();
```

To make it `const`:
```cpp
int (*const fcnPtr)();
```

### Assigning a function to a function pointer

> 🧠 **In one sentence:** You can assign the address of a matching function to a function pointer, but the return type and parameter types must match exactly.

```cpp
int foo()
{
    return 5;
}

int goo()
{
    return 6;
}

int main()
{
    int (*fcnPtr)(){ &foo }; // fcnPtr points to function foo
    fcnPtr = &goo;           // fcnPtr now points to function goo

    return 0;
}
```

> **Note:** The return type and parameters must match exactly. For example:
```cpp
// function prototypes
int foo();
double goo();
int hoo(int x);

// function pointer initializers
int (*fcnPtr1)(){ &foo };    // OK
int (*fcnPtr2)(){ &goo };    // Error: return types don't match!
double (*fcnPtr4)(){ &goo }; // OK
fcnPtr1 = &hoo;              // Error: fcnPtr1 has no parameters, but hoo() does
int (*fcnPtr3)(int){ &hoo }; // OK
```

### Calling a function using a function pointer

> 🧠 **In one sentence:** You can invoke the function a pointer points to either by explicitly dereferencing the pointer or by calling it directly like a normal function.

```cpp
int foo(int x)
{
    return x;
}

int main()
{
    int (*fcnPtr)(int){ &foo }; // Initialize fcnPtr with function foo
    
    (*fcnPtr)(5); // Explicit dereference: call function foo(5) through fcnPtr
    fcnPtr(5);    // Implicit dereference: call function foo(5) through fcnPtr

    return 0;
}
```

### Passing functions as arguments to other functions

> 🧠 **In one sentence:** Function pointers allow you to pass functions as arguments (callbacks) to other functions, injecting custom behavior into generic algorithms.

One of the most useful things to do with function pointers is passing them to other functions. Functions used as arguments to another function are often called **callback functions**.

<details>
<summary>Original (complex) example</summary>

```cpp
#include <utility> // for std::swap
#include <iostream>

// Note our user-defined comparison is the third parameter
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int))
{
    if (!array || !comparisonFcn)
        return;

    // Step through each element of the array
    for (int startIndex{ 0 }; startIndex < (size - 1); ++startIndex)
    {
        // bestIndex is the index of the smallest/largest element we've encountered so far.
        int bestIndex{ startIndex };

        // Look for smallest/largest element remaining in the array (starting at startIndex+1)
        for (int currentIndex{ startIndex + 1 }; currentIndex < size; ++currentIndex)
        {
            // If the current element is smaller/larger than our previously found smallest
            if (comparisonFcn(array[bestIndex], array[currentIndex])) // COMPARISON DONE HERE
            {
                // This is the new smallest/largest number for this iteration
                bestIndex = currentIndex;
            }
        }

        // Swap our start element with our smallest/largest element
        std::swap(array[startIndex], array[bestIndex]);
    }
}

// Here is a comparison function that sorts in ascending order
// (Note: it's exactly the same as the previous ascending() function)
bool ascending(int x, int y)
{
    return x > y; // swap if the first element is greater than the second
}

// Here is a comparison function that sorts in descending order
bool descending(int x, int y)
{
    return x < y; // swap if the second element is greater than the first
}

// This function prints out the values in the array
void printArray(int* array, int size)
{
    if (!array)
        return;

    for (int index{ 0 }; index < size; ++index)
    {
        std::cout << array[index] << ' ';
    }

    std::cout << '\n';
}

int main()
{
    int array[9]{ 3, 7, 9, 5, 6, 1, 8, 2, 4 };

    // Sort the array in descending order using the descending() function
    selectionSort(array, 9, descending);
    printArray(array, 9);

    // Sort the array in ascending order using the ascending() function
    selectionSort(array, 9, ascending);
    printArray(array, 9);

    return 0;
}
```
</details>

```cpp
// Simpler alternative: shows passing a callback to a generic function
#include <iostream>

// A generic function that takes a callback
void executeWithLogging(int x, void (*callback)(int)) {
    std::cout << "Starting execution...\n";
    callback(x);
    std::cout << "Finished execution.\n";
}

void printDouble(int value) {
    std::cout << "Doubled: " << (value * 2) << '\n';
}

int main() {
    executeWithLogging(5, printDouble);
    return 0;
}
// Output:
// Starting execution...
// Doubled: 10
// Finished execution.
```

> **Note:** You can provide a default value for a function pointer parameter, just like any other parameter:
```cpp
bool ascending(int, int);
// Default the sort to ascending sort
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int) = ascending);
```

### Using std::function instead of function pointers

> 🧠 **In one sentence:** `std::function` is a safer, more readable C++ standard library wrapper for any callable object, including function pointers and lambdas.

An alternate method of defining and storing function pointers is to use `std::function`, which is part of the `<functional>` header.

```cpp
#include <functional>
// std::function method that returns a bool and takes two int parameters
bool validate(int x, int y, std::function<bool(int, int)> fcn); 
```

```cpp
#include <functional>
#include <iostream>

int foo() { return 5; }
int goo() { return 6; }

int main() {
    std::function<int()> fcnPtr{ foo }; // fcnPtr points to function foo
    fcnPtr = goo;                       // fcnPtr now points to function goo

    // Call the function pointed to by fcnPtr
    std::cout << fcnPtr() << '\n'; 

    return 0;
}
// Output:
// 6
```

📊 **Quick comparison:**

| | **Raw Function Pointer** | **`std::function`** |
|---|---|---|
| Syntax | Clunky: `int (*fcn)(int)` | Clean: `std::function<int(int)>` |
| Versatility | Only regular free functions | Can hold lambdas, functors, `std::bind` |
| Overhead | Zero (just a pointer) | Tiny abstraction overhead |
| When to use | C APIs, ultra-low-level code | Modern C++ where generic callables are expected |

> ⚠️ **GOTCHA — Empty std::function:**
> If you create a `std::function` object without assigning a callable to it and try to invoke it, it throws a `std::bad_function_call` exception.
> **What to say in an interview:** "Unlike raw pointers which just UB on null dereference, a default-constructed `std::function` safely throws an exception if you try to call it while empty, though it's best to check it as a boolean first."

---
#### ❓ Interview Q&A

**Q1: What are function pointers and why do we use them?**

A: A function pointer is a variable that stores the memory address of executable code. We use them primarily to implement callbacks, allowing us to pass one function into another. This makes our code highly modular—for instance, we can write one sorting algorithm and let the caller dictate the ordering logic by passing in a function.

**Q2: Should you prefer raw function pointers or `std::function` in modern C++?**

A: In modern C++, you should prefer `std::function` or template type parameters. Raw function pointers are faster and don't require allocations, but they can only point to standalone functions. `std::function` can store closures (lambdas with state), class member functions, and functor objects seamlessly.

**Q3: What happens if a function pointer parameter has the wrong signature?**

A: It will cause a compile-time error. C++ is strictly typed, and the compiler verifies that the return type and the parameter list of the referenced function exactly match the function pointer’s type declaration.
---

> 💡 **Interview tip:** Interviewers often ask about callbacks to check if you understand how to write extensible code. Understanding the syntax for `std::function` shows you know modern C++ practices better than using raw C-style pointers.

---

## Command line arguments

> 🧠 **In one sentence:** Command line arguments allow you to pass configuration strings or input data to a program dynamically right when it starts from the terminal.

When a C++ program is executed, the operating system passes information to the program, including any arguments provided when the program was launched. 

These are received via two parameters in `main()`:
1. `argc` (argument count)
2. `argv` (argument values)

```cpp
int main(int argc, char* argv[])

// or equivalently
int main(int argc, char** argv)
```

Suppose our program is called `myprogram`, and we run it from the command line like this:
```text
myprogram arg1 arg2 arg3
```

In this case, `argc` will be equal to 4 (the number of arguments, including the program name). `argv` will be an array of C-style strings containing the values:

```cpp
#include <iostream>

int main(int argc, char* argv[])
{
    std::cout << "Number of command line arguments: " << argc << '\n';

    for (int i = 0; i < argc; ++i)
    {
        std::cout << "Argument " << i << ": " << argv[i] << '\n';
    }

    return 0;
}
```

When run with `myprogram arg1 arg2 arg3`, the output is:
```text
// Output:
// Number of command line arguments: 4
// Argument 0: myprogram
// Argument 1: arg1
// Argument 2: arg2
// Argument 3: arg3
```

> ⚠️ **GOTCHA — Treating argv[1] as guaranteed:**
> Accessing `argv[1]` without first checking if `argc > 1` is undefined behavior (usually a segfault) if the user didn't pass an argument.
> **What to say in an interview:** "Always validate `argc` before trying to read specific indexes in `argv`. Never assume the user provided the arguments your program expects."

---
#### ❓ Interview Q&A

**Q1: How do command-line arguments work in C++?**

A: C++ handles command-line arguments via the `main` function's parameters: an integer `argc` for the count, and an array of C-strings `argv` for the actual values. The operating system parses the terminal string and fills these transparently upon execution.

**Q2: What is always stored at `argv[0]`?**

A: The name of the executed program (or its path) is always the first argument at `argv[0]`. Thus, `argc` is always at least 1 when running normally, and user-provided arguments start at `argv[1]`.

**Q3: How do you parse an integer safely from a command line argument?**

A: Since `argv` provides C-strings (`char*`), you must convert them manually. You should use functions like `std::stoi` enclosed in a try-catch block to handle exceptions if the user inputs invalid text instead of a number.
---

> 💡 **Interview tip:** A common string-parsing task in an interview will ask you to read values safely. Always mention validating `argc` before accessing `argv` indices.

---

## Lambda functions

> 🧠 **In one sentence:** A **lambda function** is a concise, anonymous function that you define right at the place you need to use it, often passed directly into STL algorithms.

### Lambdas are anonymous functions

A lambda expression (also called a lambda or closure) allows us to define an anonymous function inside another function.

**Syntax of a lambda expression:**
```cpp
[captureclause](parameters) -> returntype { body }
```

> 🗣️ **Say it out loud:**
> "When an interviewer asks about lambdas, I'd say:
> A lambda is just an unnamed function that you can quickly write inline. They are incredibly useful for standard library algorithms like `std::count_if` where you need a short custom predicate but don't want to clutter the file with a separate function definition. Under the hood, the compiler just generates a unique, unnamed functor class for each lambda..."

> **Note:** 
> - The capture clause `[]` can be empty if no captures are needed.
> - The parameter list `()` can be empty or omitted entirely unless a return type is specified.
> - The return type `-> type` is optional, and if omitted, `auto` is inferred from the return statement.

```cpp
#include <iostream>
#include <array>
#include <string_view>
#include <algorithm>

int main(){
    std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "apricot" };

    // Lambda to find if string contains "nut"
    auto found{
        std::find_if(arr.begin(), arr.end(), [](std::string_view str){
            // std::string_view::npos is returned by find if the substring is not found.
            return str.find("nut") != std::string_view::npos;
        })
    };

    if (found == arr.end()) {
        std::cout << "No nuts\n";
    } else {
        std::cout << "Found " << *found << '\n';
    }
}
// Output:
// Found walnut
```

### Type of a lambda

> 🧠 **In one sentence:** A lambda's type is a unique, compiler-generated, unnamed closure type, so it usually needs to be caught using `auto`.

If we assign a lambda to a variable, the lambda takes the type of that variable.

```cpp
// isEven has the type of the lambda (a unique, unnamed type generated by the compiler)
auto isEven = [](int x) { return x % 2 == 0; }; 

// we can pass isEven to algorithms expecting a callable
std::all_of(arr.begin(), arr.end(), isEven); 
```

`std::all_of` returns true if the predicate returns true for all elements.

If the lambda has an empty capture clause (nothing between `[]`), it can decay into a regular function pointer. `std::function` or `auto` will also work.

```cpp
#include <functional>

int main()
{
  // A regular function pointer. Only works with an empty capture clause (empty []).
  double (*addNumbers1)(double, double){
    [](double a, double b) {
      return a + b;
    }
  };
  addNumbers1(1, 2);

  // Using std::function. (Pre-C++17, you use std::function<double(double, double)>)
  std::function addNumbers2{ 
    [](double a, double b) {
      return a + b;
    }
  };
  addNumbers2(3, 4);

  // Using auto. Stores the lambda with its actual unique type.
  auto addNumbers3{
    [](double a, double b) {
      return a + b;
    }
  };
  addNumbers3(5, 6);

  return 0;
}
```

### Generic lambdas

> 🧠 **In one sentence:** Generic lambdas use `auto` in their parameter lists, acting like templates which instruct the compiler to deduce the types based on how you call it.

Since C++14, we are allowed to use `auto` for lambda parameters. The compiler infers the parameter types from the subsequent calls.

```cpp
// C++14
#include <iostream>
#include <string>

int main()
{
    // A generic lambda that adds two values of any type that supports operator+
    auto add = [](auto a, auto b) {
        return a + b;
    };

    std::cout << add(1, 2) << '\n';                                         // ints
    std::cout << add(1.5, 2.5) << '\n';                                     // doubles
    std::cout << add(std::string("Hello, "), std::string("world!")) << '\n'; // strings

    return 0;
}
// Output:
// 3
// 4
// Hello, world!
```

---
#### ❓ Interview Q&A

**Q1: What exactly is a lambda in C++?**

A: A lambda is an anonymous, inline function. Behind the scenes, the compiler implements it by generating a unique, unnamed struct (a functor) with a custom `operator()` that holds the required code and state.

**Q2: What type does a lambda expression actually return?**

A: It returns a compiler-generated, unnamed closure type. Because the exact type is unknown and impossible to spell, we must use `auto` or templates to store it natively. It can decay to a function pointer only if it captures no variables.

**Q3: Is it possible for a lambda to run slower than a regular function pointer?**

A: Actually, it’s usually *faster*. If you give an algorithm a function pointer, the compiler struggles to inline it because the address is evaluated at runtime. A lambda, however, generates a unique type known fully at compile time, making it trivial for the compiler to inline perfectly.
---

> 💡 **Interview tip:** Emphasize that lambdas are functionally just syntactic sugar for functor classes (structs with an overloaded `operator()`), and that this compile-time type generation gives them great performance through inlining.

---

## Lambda captures

> 🧠 **In one sentence:** A **capture clause** allows a lambda to securely access (or copy) local variables from its outer surrounding scope.

### Capture clauses and capture by value

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>
#include <string>

int main()
{
  std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };
  std::string search{ "nut" };

  // COMPILE ERROR: missing capture
  // auto found{ std::find_if(arr.begin(), arr.end(), [](std::string_view str) {
  //   return str.find(search) != std::string_view::npos; 
  // }) };
}
```

The lambda doesn't inherently have access to `search`. To give it access, list it in the capture clause brackets `[]`:

```cpp
// Capture @search by value
auto found{ std::find_if(arr.begin(), arr.end(), [search](std::string_view str) {
  return str.find(search) != std::string_view::npos;
}) };
```

When captured by value, a clone of the variable is created inside the lambda object and initialized at the moment the lambda is defined.

> **Note:** Captures are treated as `const` by default. If you want to modify a captured variable *inside* the lambda without modifying the original, you must make the lambda `mutable`.

```cpp
#include <iostream>

int main()
{
  int ammo{ 10 };

  auto shoot{
    [ammo]() mutable { // now mutable
      --ammo; // allowed to modify lambda's internal copy
      std::cout << "Pew! " << ammo << " shot(s) left.\n";
    }
  };

  shoot(); // 9
  shoot(); // 8

  std::cout << ammo << " shot(s) left\n"; // Still 10!
  return 0;
}
// Output:
// Pew! 9 shot(s) left.
// Pew! 8 shot(s) left.
// 10 shot(s) left
```

**Capture by reference:**
To make the lambda affect the original variable, capture it by reference using `&`. We don't need `mutable` here because we are modifying the original external variable, not the lambda’s `const` copy.

```cpp
int ammo{ 10 };

auto shoot{
  [&ammo]() { // capture by reference
    --ammo;
  }
};
shoot(); 
// ammo is now 9
```

### Default captures

> 🧠 **In one sentence:** You can instruct a lambda to automatically capture all variables it uses in its body by specifying a default capture rule (`=` for value, `&` for reference).

To implicitly capture all mentioned variables:
- `[=]` captures by value.
- `[&]` captures by reference.

```cpp
#include <algorithm>
#include <array>
#include <iostream>

int main()
{
  std::array areas{ 100, 25, 121, 40, 56 };
  int width{ 10 };
  int height{ 10 };

  // Default capture by value
  auto found{ std::find_if(areas.begin(), areas.end(),
                           [=](int knownArea) { 
                             return width * height == knownArea; 
                           }) };

  return 0;
}
```

### Defining new variables in the lambda-capture

> 🧠 **In one sentence:** C++14 generalized captures allow you to initialize completely new variables or explicitly move objects directly into the lambda's closure scope.

In C++14, you can declare completely new variables inside the capture clause. They are initialized when the lambda object is created.

```cpp
// C++14
#include <iostream>

int main()
{
  int width{ 10 };
  int height{ 5 };

  auto area{ [w = width, h = height]() { 
    return w * h; 
  }() }; // invoked immediately

  std::cout << "Area is: " << area << '\n';
  return 0;
}
// Output:
// Area is: 50
```

📊 **Quick comparison:**

| | **[=] (By value)** | **[&] (By reference)** |
|---|---|---|
| Side effects | Body modifies copies | Body modifies original variable |
| Object overhead | Size increases per copied variable | Stores pointers/references under the hood |
| Lifecycle danger | Safe | **High risk** of dangling references |
| `mutable` keyword | Required if modifying copies | Never required |

> ⚠️ **GOTCHA — Dangling reference in lambdas:**
> If you capture by reference (`[&]`) and the lambda outlives the scope of the captured variables (for instance, by returning the lambda from a function), executing it causes a dangling reference and undefined behavior.
> **What to say in an interview:** "If I'm returning a lambda from a function or storing it for asynchronous access, I always explicitly capture by value to avoid lifetime bugs."

---
#### ❓ Interview Q&A

**Q1: Explain the difference between capturing by value and by reference in a lambda.**

A: Capturing by value constructs a local copy of the variable inside the lambda object's state at the moment the lambda is defined. Modifying it doesn't affect the outer scope (and requires `mutable`). Capturing by reference accesses the original memory location, affecting the outer scope when altered.

**Q2: What is the risk of using `[&]` as a default capture?**

A: The main risk is lifetime issues causing dangling references. If the lambda gets executed asynchronously on another thread, or is returned from a function, the local variables it refers to might fall out of scope and be destroyed before the lambda runs, leading to undefined behavior.

**Q3: When would you use a generalized capture `[var = expression]` introduced in C++14?**

A: It is frequently used for move-only objects like `std::unique_ptr`. Because you cannot capture a `unique_ptr` by value (it deletes its copy constructor), you use `[ptr = std::move(myPtr)]` to cleanly transfer ownership directly into the lambda's state.
---

> 💡 **Interview tip:** Be explicitly cautious about `[&]`. Emphasize that default capturing `[&]` hides what dependencies a lambda is using, which can mask potential dangling reference bugs if the scope lifetime is unclear.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|---|---|
| Function pointer | A variable containing the memory address of executable function code |
| Callback function | A function passed as an argument to another function to customize behavior |
| `std::function` | A standard library wrapper that can polymorphicly hold any callable object |
| `argc` | The count of arguments supplied on the command line |
| `argv` | An array of C-strings containing the command line arguments |
| Lambda function | An anonymous, locally-defined inline function |
| Closure | The runtime object generated by a lambda expression holding its captured state |
| Capture clause | The `[]` brackets dictating which outer scope variables a lambda can use |
| `mutable` | A keyword allowing a lambda body to change variables captured by value |
| Functor | An object (struct/class) that overloads `operator()` behaving like a function |

---
*Refined from personal notes · Chapter 20 of C++ series*
*Original content 100% preserved · Language and examples simplified for
C++ interview preparation format*
