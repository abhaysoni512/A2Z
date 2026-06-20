# 🎯 C++ Interview Prep: Smart Pointers & Move Semantics (Chapter 22)

> **Source Files:**
> - [22.1-Introduction-to-smart-pointers-and-move-semantics.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.1-Introduction-to-smart-pointers-and-move-semantics.md)
> - [22.2-R-value-references.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.2-R-value-references.md)
> - [22.3-Move-constructors-and-move-assignment.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.3-Move-constructors-and-move-assignment.md)
> - [22.4-stdmove.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.4-stdmove.md)
> - [22.5-stdunique_ptr.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.5-stdunique_ptr.md)
> - [22.6-stdshared_ptr.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.6-stdshared_ptr.md)
> - [22.7-Circular-dependency-issues-with-stdshared_ptr-and-stdweak_ptr.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.7-Circular-dependency-issues-with-stdshared_ptr-and-stdweak_ptr.md)
> - [22.x-Chapter-22-summary-and-quiz.md](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.x-Chapter-22-summary-and-quiz.md)
>
> **Chapter**: 22 — Move Semantics and Smart Pointers
> **Difficulty**: Intermediate / Advanced
> **Interview Frequency**: 🔥🔥🔥 Very Common

---

## 📘 Topic Overview

Smart pointers are wrapper classes that manage dynamically allocated memory using RAII (Resource Acquisition Is Initialization). They ensure that heap-allocated objects are automatically cleaned up when the smart pointer goes out of scope — preventing memory leaks even when functions exit early via returns or exceptions. Before C++11, raw `new`/`delete` was the norm and was notoriously error-prone; smart pointers are the modern C++ answer to this problem.

Move semantics, introduced in C++11, underpin how smart pointers (especially `std::unique_ptr`) work. Instead of *copying* resources (which is expensive and sometimes impossible), move semantics *transfer ownership* from one object to another. This is enabled by **r-value references** (`&&`), **move constructors**, **move assignment operators**, and the utility function **`std::move()`**. Together, smart pointers and move semantics represent one of the most important paradigm shifts in modern C++ — they make resource management safer, more efficient, and more expressive.

This is one of the **most frequently asked topics** in C++ interviews. Interviewers use smart pointers to gauge whether a candidate understands memory management, ownership semantics, RAII, and modern C++ idioms. You should be able to explain *what* each smart pointer does, *when* to use each one, *how* they work internally, and the common pitfalls.

---

## 🧠 Key Concepts to Remember

- **Smart Pointer**: A composition class that wraps a raw pointer, managing its lifetime via RAII. When the smart pointer is destroyed, the managed resource is automatically deleted.
- **RAII**: Resource Acquisition Is Initialization — acquire resources in the constructor, release them in the destructor. Smart pointers are the textbook example.
- **Move Semantics**: Transferring ownership of resources instead of copying them. Much cheaper than deep copies.
- **R-value Reference (`&&`)**: A reference type that binds only to r-values (temporaries). Enables move semantics by letting you distinguish temporary objects from persistent ones.
- **`std::move()`**: A `static_cast` to an r-value reference. It doesn't actually *move* anything — it just tells the compiler "I'm done with this object, you may move from it."
- **`std::unique_ptr`**: Exclusive-ownership smart pointer. Non-copyable, movable. Use for single-owner resources. Prefer `std::make_unique()`.
- **`std::shared_ptr`**: Shared-ownership smart pointer. Reference-counted. The resource is freed when the last `shared_ptr` is destroyed. Prefer `std::make_shared()`.
- **`std::weak_ptr`**: Non-owning observer of a `shared_ptr`-managed resource. Does not affect reference count. Used to break circular references.
- **`std::auto_ptr`**: Deprecated in C++11, removed in C++17. Used copy semantics to implement move semantics — fundamentally broken. Never use it.
- **Rule of Five**: If you define or delete any of: destructor, copy constructor, copy assignment, move constructor, move assignment — you should define or delete all five.
- **`noexcept`**: Move constructors and move assignment operators should always be marked `noexcept`.
- **Control Block**: `shared_ptr` internally uses a separate dynamically allocated control block to track the reference count. `make_shared` optimizes this into a single allocation.
- **Circular Reference**: When `shared_ptr` objects form a cycle (A→B→A), none of them can be freed. Solution: use `weak_ptr` for back-references.

---

## 💻 Code Examples

### Example 1: Why Raw Pointers Leak Memory

```cpp
#include <iostream>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

void someFunction() {
    Resource* ptr = new Resource();

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        return; // LEAK! ptr never deleted

    delete ptr;
}

int main() {
    someFunction();
    return 0;
}
```

**Output (if x == 0):**
```
Resource acquired
```

**What interviewer looks for:** Understanding of why raw `new`/`delete` is dangerous — early returns, exceptions, and forgotten deletes all cause memory leaks.

---

### Example 2: Basic `std::unique_ptr` Usage

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    // Prefer make_unique (C++14)
    auto res = std::make_unique<Resource>();

    // res automatically cleaned up when it goes out of scope
    return 0;
}
```

**Output:**
```
Resource acquired
Resource destroyed
```

**What interviewer looks for:** Familiarity with `make_unique`, RAII guarantees, automatic cleanup.

---

### Example 3: Transferring Ownership with `std::unique_ptr` and `std::move()`

```cpp
#include <iostream>
#include <memory>
#include <utility>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    std::unique_ptr<Resource> res1{ std::make_unique<Resource>() };
    std::unique_ptr<Resource> res2{}; // nullptr

    std::cout << "res1 is " << (res1 ? "not null\n" : "null\n");
    std::cout << "res2 is " << (res2 ? "not null\n" : "null\n");

    // res2 = res1;              // WON'T COMPILE — copy disabled
    res2 = std::move(res1);      // OK — move ownership

    std::cout << "Ownership transferred\n";
    std::cout << "res1 is " << (res1 ? "not null\n" : "null\n");
    std::cout << "res2 is " << (res2 ? "not null\n" : "null\n");

    return 0;
}
```

**Output:**
```
Resource acquired
res1 is not null
res2 is null
Ownership transferred
res1 is null
res2 is not null
Resource destroyed
```

**What interviewer looks for:** Understanding that `unique_ptr` is move-only, correct use of `std::move`, and that moved-from `unique_ptr` becomes `nullptr`.

---

### Example 4: `std::shared_ptr` with Reference Counting

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    auto ptr1{ std::make_shared<Resource>() };
    {
        auto ptr2{ ptr1 }; // copy — both share ownership
        std::cout << "Killing one shared pointer\n";
    } // ptr2 dies, but Resource lives (ptr1 still owns it)

    std::cout << "Killing another shared pointer\n";
    return 0;
} // ptr1 dies, Resource is destroyed
```

**Output:**
```
Resource acquired
Killing one shared pointer
Killing another shared pointer
Resource destroyed
```

**What interviewer looks for:** Understanding of reference counting, shared ownership, and that the resource survives as long as at least one `shared_ptr` owns it.

---

### Example 5: Circular Reference Problem & `std::weak_ptr` Solution

```cpp
#include <iostream>
#include <memory>
#include <string>

class Person {
    std::string m_name;
    std::weak_ptr<Person> m_partner; // weak_ptr breaks the cycle!

public:
    Person(const std::string& name) : m_name(name) {
        std::cout << m_name << " created\n";
    }
    ~Person() {
        std::cout << m_name << " destroyed\n";
    }

    friend bool partnerUp(std::shared_ptr<Person>& p1, std::shared_ptr<Person>& p2) {
        if (!p1 || !p2) return false;
        p1->m_partner = p2;
        p2->m_partner = p1;
        std::cout << p1->m_name << " is now partnered with " << p2->m_name << '\n';
        return true;
    }

    std::shared_ptr<Person> getPartner() const { return m_partner.lock(); }
    const std::string& getName() const { return m_name; }
};

int main() {
    auto lucy{ std::make_shared<Person>("Lucy") };
    auto ricky{ std::make_shared<Person>("Ricky") };

    partnerUp(lucy, ricky);

    auto partner = ricky->getPartner();
    std::cout << ricky->getName() << "'s partner is: " << partner->getName() << '\n';

    return 0;
}
```

**Output:**
```
Lucy created
Ricky created
Lucy is now partnered with Ricky
Ricky's partner is: Lucy
Ricky destroyed
Lucy destroyed
```

**What interviewer looks for:** Understanding of circular dependency, why `shared_ptr` alone causes memory leaks in cycles, and how `weak_ptr` + `lock()` solves it.

---

### Example 6: Move Constructor vs Copy Constructor Performance

```cpp
#include <iostream>
#include <memory>
#include <utility>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

template<typename T>
class Auto_ptr5 {
    T* m_ptr{};
public:
    Auto_ptr5(T* ptr = nullptr) : m_ptr{ptr} {}
    ~Auto_ptr5() { delete m_ptr; }

    // Copy disabled
    Auto_ptr5(const Auto_ptr5& a) = delete;
    Auto_ptr5& operator=(const Auto_ptr5& a) = delete;

    // Move constructor — steal resources
    Auto_ptr5(Auto_ptr5&& a) noexcept : m_ptr{a.m_ptr} {
        a.m_ptr = nullptr;
    }

    // Move assignment — steal resources
    Auto_ptr5& operator=(Auto_ptr5&& a) noexcept {
        if (&a == this) return *this;
        delete m_ptr;
        m_ptr = a.m_ptr;
        a.m_ptr = nullptr;
        return *this;
    }

    T& operator*() const { return *m_ptr; }
    T* operator->() const { return m_ptr; }
    bool isNull() const { return m_ptr == nullptr; }
};

Auto_ptr5<Resource> generateResource() {
    Auto_ptr5<Resource> res{new Resource};
    return res; // move (not copy) into temporary
}

int main() {
    Auto_ptr5<Resource> mainres;
    mainres = generateResource(); // move assignment

    return 0;
}
```

**Output:**
```
Resource acquired
Resource destroyed
```

**What interviewer looks for:** Ability to implement a move constructor/assignment from scratch, understanding of `noexcept`, nulling out the source pointer, and seeing the performance benefit (1 create + 1 destroy vs 3 create + 3 destroy with copies).

---

### Example 7: Passing `unique_ptr` to Functions

```cpp
#include <iostream>
#include <memory>
#include <utility>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
    void sayHi() const { std::cout << "Hi!\n"; }
};

// Takes ownership
void takeOwnership(std::unique_ptr<Resource> res) {
    if (res) res->sayHi();
} // Resource destroyed here

// Just uses it — no ownership transfer
void useResource(const Resource* res) {
    if (res) res->sayHi();
}

int main() {
    auto ptr{ std::make_unique<Resource>() };

    useResource(ptr.get());       // pass raw pointer via get()
    takeOwnership(std::move(ptr)); // transfer ownership

    std::cout << "ptr is " << (ptr ? "not null\n" : "null\n");
    return 0;
}
```

**Output:**
```
Resource acquired
Hi!
Hi!
Resource destroyed
ptr is null
```

**What interviewer looks for:** Knowing when to pass by value (ownership transfer) vs raw pointer/reference (borrowing), and correct use of `get()` and `std::move()`.

---

## 🗣️ How to Explain in an Interview

### "What is a smart pointer?"

> **Your Answer:** "A smart pointer is a class that wraps a raw pointer and manages its lifetime using RAII. When the smart pointer goes out of scope, it automatically deletes the dynamically allocated object it's managing. This prevents memory leaks even when functions exit early due to returns or exceptions. Think of it as a raw pointer with an auto-delete safety net. C++ provides three: `unique_ptr` for exclusive ownership, `shared_ptr` for shared ownership, and `weak_ptr` for non-owning observation."

### "What is the difference between `unique_ptr` and `shared_ptr`?"

> **Your Answer:** "`unique_ptr` models exclusive ownership — exactly one `unique_ptr` owns the resource at any time. It's non-copyable but movable, so you transfer ownership with `std::move()`. It has zero overhead compared to raw pointers.
>
> `shared_ptr` models shared ownership — multiple `shared_ptr`s can point to the same resource, and the resource is freed when the last one is destroyed. Internally it uses a reference-counted control block, so there's a small overhead for the control block allocation and atomic reference count updates. Use `unique_ptr` by default, and only reach for `shared_ptr` when you genuinely need shared ownership."

### "What is `std::weak_ptr` and when do you use it?"

> **Your Answer:** "`weak_ptr` is a non-owning observer of a `shared_ptr`-managed resource. It can see the resource but doesn't participate in the reference count, so it won't keep the resource alive. The main use case is breaking circular references — if two objects hold `shared_ptr`s to each other, neither will ever be freed. By making one of those a `weak_ptr`, you break the cycle. To use the resource, you call `lock()` which returns a `shared_ptr` — if the resource is still alive, you get a valid `shared_ptr`; if it's been destroyed, you get `nullptr`. You can also check `expired()` to see if the resource is still valid."

### "What are move semantics and why do we need them?"

> **Your Answer:** "Move semantics let us transfer ownership of resources instead of copying them. The key insight is: if an object is a temporary (an r-value) that's about to be destroyed anyway, why waste time deep-copying its data? Instead, we 'steal' its internal resources — swap pointers, zero out the source — which is O(1) instead of O(n). This is enabled by r-value references (`&&`), move constructors, and move assignment operators. For example, returning a `std::vector` by value in C++11+ triggers a move (not a copy), which is essentially free regardless of the vector's size."

### "What does `std::move()` actually do?"

> **Your Answer:** "`std::move()` is a misnomer — it doesn't actually move anything. It's just a `static_cast` to an r-value reference. It tells the compiler: 'I'm done with this object, treat it as a temporary so that move constructors and move assignment operators get invoked instead of copy versions.' After calling `std::move()` on an object, that object is in a valid but unspecified state — you shouldn't rely on its value. You can assign it a new value or let it be destroyed."

### "What is the Rule of Five?"

> **Your Answer:** "The Rule of Five says that if you define or delete any of these five special member functions — destructor, copy constructor, copy assignment operator, move constructor, move assignment operator — you should define or delete all five. This is because defining any of them usually means your class manages some resource (like dynamic memory), and you need to handle all the ways that resource could be copied, moved, or destroyed. If you miss one, you can get subtle bugs like double-free or memory leaks."

### "Why should we prefer `make_unique` and `make_shared`?"

> **Your Answer:** "Three reasons. First, it's simpler — `auto p = std::make_unique<Foo>(args)` is cleaner than `std::unique_ptr<Foo> p(new Foo(args))`. Second, it prevents a subtle exception safety issue in C++14 where, if you pass `new` directly in a function argument, the allocation could leak if another argument's evaluation throws. Third, specifically for `make_shared`, it's more performant because it allocates the control block and the managed object in a single memory allocation instead of two."

---

## ❓ Theory Interview Questions

### Beginner Level

1. What is a smart pointer and why do we need them in C++?
   <details><summary>✅ Answer</summary>
   A smart pointer is a class that wraps a raw pointer and manages dynamically allocated memory using RAII. When the smart pointer goes out of scope, it automatically deletes the managed object. We need them because raw `new`/`delete` is error-prone — memory leaks can occur due to early returns, exceptions, or simply forgetting to call `delete`.
   </details>

2. Name the three smart pointer types in modern C++ and briefly describe each.
   <details><summary>✅ Answer</summary>
   - `std::unique_ptr`: Exclusive ownership. Non-copyable, movable. Use when only one owner is needed.
   - `std::shared_ptr`: Shared ownership via reference counting. Resource freed when last `shared_ptr` is destroyed.
   - `std::weak_ptr`: Non-owning observer of a `shared_ptr`-managed resource. Does not affect reference count. Used to break circular references.
   </details>

3. What was `std::auto_ptr` and why was it removed?
   <details><summary>✅ Answer</summary>
   `std::auto_ptr` was C++98's first smart pointer. It implemented move semantics through the copy constructor and copy assignment operator, which was fundamentally broken. Passing an `auto_ptr` by value would silently transfer ownership, leaving the original with a null pointer. It also didn't work with arrays (always used non-array `delete`) and was incompatible with STL containers. It was deprecated in C++11 and removed in C++17.
   </details>

4. What is the difference between an l-value and an r-value?
   <details><summary>✅ Answer</summary>
   An l-value is an expression that has an identity (a name or address) and persists beyond a single expression — like a variable. An r-value is a temporary value that doesn't persist beyond the expression that creates it — like a literal (`5`) or a temporary object (`Foo{}`). L-value references (`&`) bind to l-values; r-value references (`&&`) bind to r-values.
   </details>

5. What header do you need to include for smart pointers?
   <details><summary>✅ Answer</summary>
   `#include <memory>` — this provides `std::unique_ptr`, `std::shared_ptr`, `std::weak_ptr`, `std::make_unique` (C++14), and `std::make_shared` (C++11).
   </details>

6. Can you copy a `std::unique_ptr`? Why or why not?
   <details><summary>✅ Answer</summary>
   No. `std::unique_ptr`'s copy constructor and copy assignment operator are `= delete`. This enforces exclusive ownership — only one `unique_ptr` can own a resource at a time. To transfer ownership, you must use `std::move()`, which invokes the move constructor/assignment.
   </details>

7. What does `std::move()` actually do internally?
   <details><summary>✅ Answer</summary>
   `std::move()` is essentially a `static_cast` to an r-value reference (`T&&`). It doesn't move anything — it simply casts its argument to an r-value so that move constructors/assignment operators are selected during overload resolution instead of their copy counterparts.
   </details>

### Intermediate Level

1. What is the difference between `std::make_unique` / `std::make_shared` and directly using `new`? Why are the `make_*` functions preferred?
   <details><summary>✅ Answer</summary>
   `make_unique` and `make_shared` wrap the `new` call inside the smart pointer creation. Benefits:
   - **Exception safety** (C++14): In `foo(unique_ptr<T>(new T), bar())`, if `bar()` throws after `new T` but before the `unique_ptr` is constructed, you leak. `make_unique` prevents this by combining both operations. (Fixed in C++17.)
   - **Performance** (`make_shared` only): Allocates the control block and the managed object in one memory allocation instead of two.
   - **Cleaner syntax**: `auto p = std::make_unique<Foo>(args)` is simpler to read and write.
   </details>

2. Explain the internal structure of `std::shared_ptr`. What is a control block?
   <details><summary>✅ Answer</summary>
   `shared_ptr` internally uses two pointers: one to the managed object and one to a **control block**. The control block is a dynamically allocated object that stores: the reference count (how many `shared_ptr`s own the resource), the weak count (how many `weak_ptr`s observe it), and a deleter. When created via `make_shared`, both the object and control block are allocated in a single memory block. When two independent `shared_ptr`s are created from the same raw pointer (a bug), each creates its own control block — leading to double-free.
   </details>

3. What is a circular reference? How do you detect and fix it?
   <details><summary>✅ Answer</summary>
   A circular reference occurs when objects hold `shared_ptr`s to each other, forming a cycle (A→B→A or A→B→C→A). Since each object's reference count never reaches zero (the other object keeps it alive), none of them are ever freed — causing a memory leak. The fix is to use `std::weak_ptr` for one of the references in the cycle — `weak_ptr` doesn't contribute to the reference count, so the cycle is broken.
   </details>

4. Can an r-value reference variable be an l-value? Explain.
   <details><summary>✅ Answer</summary>
   Yes! A named r-value reference variable is itself an l-value. The type of a variable and its value category are independent concepts. For example: `int&& ref = 5;` — `ref` has type `int&&`, but when used in an expression, `ref` is an l-value (because it has a name and identity). So `fun(ref)` would call `fun(const int&)`, not `fun(int&&)`.
   </details>

5. Why should move constructors and move assignment operators be marked `noexcept`?
   <details><summary>✅ Answer</summary>
   STL containers like `std::vector` will only use move operations during reallocation (e.g., `push_back` causing a resize) if the move constructor is `noexcept`. If the move could throw, the container falls back to copying to maintain the strong exception guarantee. Marking moves as `noexcept` is critical for performance with STL containers.
   </details>

6. What happens to an object after it has been moved from? Can you still use it?
   <details><summary>✅ Answer</summary>
   After being moved from, a C++ standard library object is in a "valid but unspecified state." You should NOT rely on its value. However, you CAN: assign it a new value, call `clear()` or `reset()`, check its state with `empty()`, or let it be destroyed. You should NOT call functions that depend on its contents (like `operator[]` or `front()`).
   </details>

7. How do you pass a `std::unique_ptr` to a function? What are the different approaches and when would you use each?
   <details><summary>✅ Answer</summary>
   - **Transfer ownership**: Pass by value — `void foo(std::unique_ptr<T> p)`. Caller must use `std::move()`. The function now owns the resource.
   - **Just use the resource**: Pass the raw pointer via `get()` — `void foo(const T* p)` or pass by reference `void foo(const T& t)`. The function borrows the resource. This keeps the function agnostic about how the caller manages memory.
   - **Never** pass `unique_ptr` by const reference unless you have a specific reason (it's misleading and unnecessary).
   </details>

### Advanced Level

1. Implement a simplified `unique_ptr` from scratch with move semantics.
   <details><summary>✅ Answer</summary>

   ```cpp
   template<typename T>
   class UniquePtr {
       T* m_ptr{};
   public:
       explicit UniquePtr(T* ptr = nullptr) : m_ptr{ptr} {}
       ~UniquePtr() { delete m_ptr; }

       // Disable copy
       UniquePtr(const UniquePtr&) = delete;
       UniquePtr& operator=(const UniquePtr&) = delete;

       // Move constructor
       UniquePtr(UniquePtr&& other) noexcept : m_ptr{other.m_ptr} {
           other.m_ptr = nullptr;
       }

       // Move assignment
       UniquePtr& operator=(UniquePtr&& other) noexcept {
           if (this != &other) {
               delete m_ptr;
               m_ptr = other.m_ptr;
               other.m_ptr = nullptr;
           }
           return *this;
       }

       T& operator*() const { return *m_ptr; }
       T* operator->() const { return m_ptr; }
       T* get() const { return m_ptr; }
       explicit operator bool() const { return m_ptr != nullptr; }

       T* release() {
           T* tmp = m_ptr;
           m_ptr = nullptr;
           return tmp;
       }

       void reset(T* ptr = nullptr) {
           delete m_ptr;
           m_ptr = ptr;
       }
   };
   ```

   Key points: disable copy, implement move with `noexcept`, null out source in move, `delete` existing resource in move assignment before stealing.
   </details>

2. Why can't you use `std::swap` inside a move constructor? What's the workaround?
   <details><summary>✅ Answer</summary>
   `std::swap` is implemented using move construction and move assignment. If you call `std::swap` inside your move constructor, it recursively calls the move constructor → infinite recursion → stack overflow. The workaround is to write a custom `swap` friend function that swaps individual members directly using `std::swap` on each member (not on the whole object).
   </details>

3. Can a `std::unique_ptr` be converted to a `std::shared_ptr`? What about the reverse?
   <details><summary>✅ Answer</summary>
   Yes, `unique_ptr` → `shared_ptr` is allowed. `shared_ptr` has a constructor that accepts a `unique_ptr` r-value, moving ownership from the `unique_ptr` to the `shared_ptr`. However, `shared_ptr` → `unique_ptr` is **NOT** allowed and cannot be done safely (because other `shared_ptr`s may still reference the resource). Best practice: return `unique_ptr` from factory functions and let callers convert to `shared_ptr` if needed.
   </details>

4. What happens if you create two independent `shared_ptr`s from the same raw pointer?
   <details><summary>✅ Answer</summary>
   Each `shared_ptr` creates its own control block, each believing it is the sole manager. When one goes out of scope, it deletes the resource. When the second goes out of scope, it tries to delete the already-freed resource → **double-free → undefined behavior (crash)**. This is why you should always copy from an existing `shared_ptr` (not from a raw pointer) and prefer `make_shared`.
   </details>

5. Explain the exception safety issue with `std::unique_ptr<T>(new T)` in function arguments (pre-C++17).
   <details><summary>✅ Answer</summary>
   In `foo(std::unique_ptr<T>(new T), bar())`, the compiler could evaluate in this order: (1) `new T`, (2) `bar()`, (3) construct `unique_ptr`. If `bar()` throws at step 2, the memory from `new T` is leaked because the `unique_ptr` was never constructed to manage it. `std::make_unique<T>()` solves this because the `new` and the `unique_ptr` construction happen together inside `make_unique`. C++17 fixed the underlying issue by requiring function arguments to be fully evaluated before the next begins.
   </details>

6. When does the compiler generate implicit move constructors/assignment? When does it NOT?
   <details><summary>✅ Answer</summary>
   The compiler generates implicit move constructor and move assignment operator only if ALL of the following are true:
   - No user-declared copy constructor or copy assignment operator
   - No user-declared move constructor or move assignment operator
   - No user-declared destructor

   If any of these are user-declared, the compiler does NOT generate implicit moves. Note: implicit moves do memberwise moves — for pointers, this means **copy** (not move), so you typically need to write custom move operations for classes managing raw pointers.
   </details>

7. What happens if you delete the move constructor but keep the copy constructor?
   <details><summary>✅ Answer</summary>
   A deleted move constructor is still a *declared* function and participates in overload resolution. When the compiler needs to move (e.g., returning a local variable by value), it finds the deleted move constructor, selects it, and produces a compilation error — even though a valid copy constructor exists. This makes the class not returnable by value in cases where mandatory copy elision doesn't apply. It's a subtle and counterintuitive pitfall.
   </details>

---

## 🧑‍💻 Coding Interview Questions

### Question 1: Convert Raw Pointers to Smart Pointers
**Difficulty:** Easy
**What it tests:** Basic `unique_ptr` usage, `make_unique`, `get()`

**Problem:**
Convert this program from raw pointers to use `std::unique_ptr` properly:

```cpp
#include <iostream>

class Fraction {
    int m_num{0}, m_den{1};
public:
    Fraction(int n = 0, int d = 1) : m_num{n}, m_den{d} {}
    friend std::ostream& operator<<(std::ostream& out, const Fraction& f) {
        out << f.m_num << '/' << f.m_den;
        return out;
    }
};

void printFraction(const Fraction* ptr) {
    if (ptr) std::cout << *ptr << '\n';
    else std::cout << "No fraction\n";
}

int main() {
    auto* ptr{ new Fraction{3, 5} };
    printFraction(ptr);
    delete ptr;
    return 0;
}
```

**Expected Solution:**

```cpp
#include <iostream>
#include <memory>

class Fraction {
    int m_num{0}, m_den{1};
public:
    Fraction(int n = 0, int d = 1) : m_num{n}, m_den{d} {}
    friend std::ostream& operator<<(std::ostream& out, const Fraction& f) {
        out << f.m_num << '/' << f.m_den;
        return out;
    }
};

// Keep the function signature — it doesn't need to know about smart pointers
void printFraction(const Fraction* ptr) {
    if (ptr) std::cout << *ptr << '\n';
    else std::cout << "No fraction\n";
}

int main() {
    auto ptr{ std::make_unique<Fraction>(3, 5) };
    printFraction(ptr.get()); // Use get() to extract raw pointer
    return 0; // No delete needed!
}
```

**Explanation:** Use `make_unique` instead of `new`, use `get()` to pass the raw pointer to functions that don't need ownership, and remove the `delete`.

---

### Question 2: Fix the Circular Reference
**Difficulty:** Medium
**What it tests:** `shared_ptr`, `weak_ptr`, circular dependency detection

**Problem:**
The following program leaks memory. Fix it without changing `main()`:

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    std::shared_ptr<Resource> m_ptr{};
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    auto ptr1{ std::make_shared<Resource>() };
    ptr1->m_ptr = ptr1; // self-referencing cycle!
    return 0;
}
```

**Expected Solution:**

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    std::weak_ptr<Resource> m_ptr{}; // Change to weak_ptr!
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    auto ptr1{ std::make_shared<Resource>() };
    ptr1->m_ptr = ptr1;
    return 0;
}
```

**Explanation:** The self-referencing `shared_ptr` creates a cycle of size 1. When `ptr1` goes out of scope, the reference count drops to 1 (not 0), so the Resource is never freed. Changing `m_ptr` to `weak_ptr` breaks the cycle because `weak_ptr` doesn't contribute to the reference count.

---

### Question 3: Implement a Factory Function
**Difficulty:** Medium
**What it tests:** Returning `unique_ptr` from functions, move semantics

**Problem:**
Write a `createResource()` factory function that returns a `std::unique_ptr<Resource>`. The caller should be able to optionally convert it to a `shared_ptr`.

**Expected Solution:**

```cpp
#include <iostream>
#include <memory>

class Resource {
    std::string m_name;
public:
    Resource(const std::string& name) : m_name{name} {
        std::cout << m_name << " acquired\n";
    }
    ~Resource() { std::cout << m_name << " destroyed\n"; }
    const std::string& getName() const { return m_name; }
};

// Return unique_ptr — most flexible
std::unique_ptr<Resource> createResource(const std::string& name) {
    return std::make_unique<Resource>(name);
}

int main() {
    // Use as unique_ptr
    auto res1 = createResource("UniqueRes");
    std::cout << res1->getName() << '\n';

    // Convert to shared_ptr if shared ownership needed
    std::shared_ptr<Resource> res2 = createResource("SharedRes");
    auto res3 = res2; // now shared
    std::cout << res2->getName() << " (shared)\n";

    return 0;
}
```

**Output:**
```
UniqueRes acquired
UniqueRes
SharedRes acquired
SharedRes (shared)
SharedRes destroyed
UniqueRes destroyed
```

**Explanation:** Returning `unique_ptr` from factory functions is idiomatic because the caller has maximum flexibility — they can keep it as `unique_ptr` or convert to `shared_ptr`. The reverse (returning `shared_ptr`) would force shared ownership on all callers.

---

### Question 4: Write a Move-Only Wrapper Class
**Difficulty:** Hard
**What it tests:** Move constructor, move assignment, Rule of Five, `noexcept`

**Problem:**
Implement a `DynamicArray<T>` class that manages a heap-allocated array. It should support move but NOT copy. Include: constructor, destructor, move constructor, move assignment, `operator[]`, and `getLength()`.

**Expected Solution:**

```cpp
#include <iostream>
#include <cstddef>

template<typename T>
class DynamicArray {
    T* m_array{};
    int m_length{};
public:
    DynamicArray(int length) : m_array{new T[static_cast<std::size_t>(length)]{}}, m_length{length} {}

    ~DynamicArray() { delete[] m_array; }

    // Disable copy
    DynamicArray(const DynamicArray&) = delete;
    DynamicArray& operator=(const DynamicArray&) = delete;

    // Move constructor
    DynamicArray(DynamicArray&& other) noexcept
        : m_array{other.m_array}, m_length{other.m_length} {
        other.m_array = nullptr;
        other.m_length = 0;
    }

    // Move assignment
    DynamicArray& operator=(DynamicArray&& other) noexcept {
        if (this != &other) {
            delete[] m_array;       // free existing resource
            m_array = other.m_array;
            m_length = other.m_length;
            other.m_array = nullptr; // null out source
            other.m_length = 0;
        }
        return *this;
    }

    T& operator[](int index) { return m_array[index]; }
    const T& operator[](int index) const { return m_array[index]; }
    int getLength() const { return m_length; }
};

DynamicArray<int> createArray() {
    DynamicArray<int> arr(5);
    for (int i = 0; i < 5; ++i) arr[i] = i * 10;
    return arr; // moved (or elided)
}

int main() {
    auto arr = createArray();
    for (int i = 0; i < arr.getLength(); ++i)
        std::cout << arr[i] << ' ';
    std::cout << '\n';
    return 0;
}
```

**Output:**
```
0 10 20 30 40
```

**Explanation:** The move constructor steals the pointer and length, then nulls out the source. The move assignment first frees any existing resource, then steals. Both are `noexcept`. Copy operations are explicitly deleted.

---

### Question 5: Debug a `shared_ptr` Crash
**Difficulty:** Hard
**What it tests:** Understanding of `shared_ptr` internals, independent control blocks

**Problem:**
This program crashes. Explain why and fix it:

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    auto* res = new Resource{};
    std::shared_ptr<Resource> ptr1{res};
    std::shared_ptr<Resource> ptr2{res}; // BUG!

    return 0;
}
```

**Expected Solution:**

```cpp
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main() {
    auto ptr1{ std::make_shared<Resource>() };
    auto ptr2{ ptr1 }; // Copy from existing shared_ptr!

    return 0;
}
```

**Explanation:** The bug is creating two independent `shared_ptr`s from the same raw pointer. Each creates its own control block, each thinking it's the sole owner. When `ptr2` goes out of scope, it deletes the Resource. When `ptr1` goes out of scope, it tries to delete the already-freed Resource → double-free → undefined behavior (crash). Fix: always create additional `shared_ptr`s by copying from an existing one, and prefer `make_shared`.

---

## ⚠️ Common Mistakes & Pitfalls

- ❌ **Mistake**: Creating two independent `shared_ptr`s from the same raw pointer
  ✅ **Correct**: Always copy from an existing `shared_ptr` or use `make_shared`

- ❌ **Mistake**: Using `std::auto_ptr` (deprecated/removed)
  ✅ **Correct**: Use `std::unique_ptr` as the direct replacement

- ❌ **Mistake**: Passing `unique_ptr` by value without `std::move()`
  ✅ **Correct**: Use `std::move()` to transfer ownership, or pass the raw pointer via `get()` if just borrowing

- ❌ **Mistake**: Dynamically allocating smart pointers (`new std::unique_ptr<T>(...)`)
  ✅ **Correct**: Always allocate smart pointers on the stack (as local variables or class members)

- ❌ **Mistake**: Using `shared_ptr` for bidirectional references (parent ↔ child)
  ✅ **Correct**: Use `shared_ptr` for the owning direction, `weak_ptr` for the back-reference

- ❌ **Mistake**: Forgetting `noexcept` on move constructor/assignment
  ✅ **Correct**: Always mark moves as `noexcept` — STL containers depend on this for performance

- ❌ **Mistake**: Using a moved-from object's value
  ✅ **Correct**: After moving, only assign a new value, `reset()`, or destroy — don't read the old value

- ❌ **Mistake**: Calling `std::swap` inside a move constructor (infinite recursion)
  ✅ **Correct**: Write a custom `swap` that swaps individual members

- ❌ **Mistake**: Returning `unique_ptr` by reference from a function
  ✅ **Correct**: Return `unique_ptr` by value — move semantics or copy elision handles it efficiently

- ❌ **Mistake**: Deleting the raw pointer that a smart pointer is managing
  ✅ **Correct**: Let the smart pointer handle the deletion — never manually `delete` a managed resource

---

## 🔗 Related Topics

- [22.1 - Introduction to smart pointers and move semantics](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.1-Introduction-to-smart-pointers-and-move-semantics.md) — The motivation: why raw pointers fail
- [22.2 - R-value references](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.2-R-value-references.md) — Foundation for move semantics
- [22.3 - Move constructors and move assignment](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.3-Move-constructors-and-move-assignment.md) — How to write move-enabled classes
- [22.4 - std::move](file:///Users/abhaysoni512/Desktop/A2Z/learnCPPData/22.4-stdmove.md) — Casting l-values to r-values for move semantics
- RAII and Destructors (Chapter 19) — The design pattern that smart pointers implement
- Value categories: l-values and r-values (Chapter 12) — Essential foundation for understanding references
- Exception specifications and `noexcept` (Chapter 27) — Why moves should be `noexcept`
- `std::move_if_noexcept` (27.10) — Conditional moving for exception safety

---

## 📝 Quick Revision Cheat Sheet

| Concept | Key Point |
|---------|-----------|
| **Smart Pointer** | RAII wrapper for raw pointers — auto-deletes on scope exit |
| **`unique_ptr`** | Exclusive ownership. Non-copyable, movable. Zero overhead. **Default choice.** |
| **`shared_ptr`** | Shared ownership. Reference-counted control block. Use only when needed. |
| **`weak_ptr`** | Non-owning observer. Doesn't affect ref count. Breaks circular refs. Use `lock()` to access. |
| **`make_unique`** | Preferred way to create `unique_ptr` (C++14). Exception-safe, clean syntax. |
| **`make_shared`** | Preferred way to create `shared_ptr` (C++11). Single allocation optimization. |
| **`std::move()`** | `static_cast` to `T&&`. Doesn't move — just enables move semantics. |
| **R-value ref (`&&`)** | Binds to temporaries. Enables move overloads. Named r-value refs are l-values! |
| **Move constructor** | `T(T&& other) noexcept` — steal resources, null out source. |
| **Move assignment** | `T& operator=(T&& other) noexcept` — free existing, steal, null out source. |
| **Rule of Five** | Define/delete all 5: dtor, copy ctor, copy assign, move ctor, move assign. |
| **Circular reference** | `shared_ptr` cycle → memory leak. Fix with `weak_ptr`. |
| **`auto_ptr`** | ❌ Dead. Removed in C++17. Never use. |
| **`expired()`** | `weak_ptr` method — check if managed resource still exists. |
| **`get()`** | `unique_ptr`/`shared_ptr` method — returns raw pointer without releasing ownership. |
| **`release()`** | `unique_ptr` only — returns raw pointer AND releases ownership. |
| **`reset()`** | Replaces managed object (deletes old one). |
