# Chapter 24: Inheritance

---

## Inheritance

> 🧠 **In one sentence:** Inheritance models an "is-a" relationship, allowing a derived class to reuse, extend, or modify the public and protected members of an existing base class.

Basic inheritance lets us reuse classes by having other classes inherit their members.

![alt text](image-74.png)

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Person
{
public:
    std::string m_name{};
    int m_age{};

    Person(std::string_view name = "", int age = 0)
        : m_name{name}, m_age{age}
    {
    }

    const std::string& getName() const { return m_name; }
    int getAge() const { return m_age; }

};

// BaseballPlayer publicly inheriting Person
class BaseballPlayer : public Person
{
public:
    double m_battingAverage{};
    int m_homeRuns{};

    BaseballPlayer(double battingAverage = 0.0, int homeRuns = 0)
       : m_battingAverage{battingAverage}, m_homeRuns{homeRuns}
    {
    }
};

int main()
{
    // Create a new BaseballPlayer object
    BaseballPlayer joe{};
    // Assign it a name (we can do this directly because m_name is public)
    joe.m_name = "Joe";
    // Print out the name
    // use the getName() function we've acquired from the Person base class
    std::cout << joe.getName() << '\n'; 

    return 0;
}
// Output:
// Joe
```

**Benefits of inheritance:**
Inheritance allows us to reuse classes by having other classes inherit their members.

---
#### ❓ Interview Q&A

**Q1: What is the primary purpose of inheritance in C++?**

A: Code reuse and establishing logical "is-a" relationships. It allows a new class to absorb the attributes and behaviors of an existing class, reducing duplication.

**Q2: What is the difference between inheritance and composition?**
A: Inheritance is an "is-a" relationship (e.g., a `BaseballPlayer` is a `Person`). Composition is a "has-a" relationship (e.g., a `Car` has an `Engine`). In composition, the class holds an instance of another class as a member variable.

**Q3: Can a derived class access the private members of its base class?**
A: No. Private members of a base class are inherited, meaning they exist in memory for the derived object, but the derived class has no direct access to them. It must use public or protected getters/setters provided by the base class.
---

> 💡 **Interview tip:** Interviewers often ask "Inheritance vs Composition". The golden rule of modern C++ is "prefer composition over inheritance" unless you explicitly need polymorphism or interface adherence.

---

## Order of construction of derived classes

> 🧠 **In one sentence:** When instantiating a derived class, construction happens top-down: the base class constructor strictly runs first, followed by the derived class constructor.

> 🗣️ **Say it out loud:**
> "When an interviewer asks about construction order, I'd say:
> Construction always goes top-down, from the most fundamental base class to the most derived class. The derived class might need to use the base class's members or methods during its own setup, so C++ guarantees the base class is fully initialized first. If it didn't, using inherited members would be undefined behavior."

When we create an object of a derived class, the base class constructor is called first, followed by the derived class constructor. 

This happens because the derived class may rely on the base class being properly initialized before it can be initialized itself. The base class constructor sets up the base class members, and the derived class constructor sets up the derived class members. 

If the derived class constructor ran first, it wouldn't have safe access to the base class members. C++ guarantees the base class constructor finishes first to prevent undefined behavior.

```cpp
// Added example: Order of construction
#include <iostream>

class Base {
public:
    Base() { std::cout << "Base built\n"; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "Derived built\n"; }
};

int main() {
    Derived d;
}
// Output:
// Base built
// Derived built
```

> ⚠️ **GOTCHA — Calling virtual functions in a constructor:**
> When a base class constructor runs, the object is only a "Base", not yet a "Derived". The vtable points to the base class. If you call a virtual function in a constructor, it will call the base version, not the overridden derived version.
> **What to say in an interview:** "I never call virtual functions inside constructors or destructors because the derived state is either uninitialized or already destroyed, leading to unexpected base-class behavior."

---
#### ❓ Interview Q&A

**Q1: In what exact order are base and derived objects constructed?**
A: Construction happens top-down. The compiler first allocates memory for the entire derived object. Then the base class constructor runs. Finally, the derived class constructor runs.

**Q2: Why does C++ enforce this specific construction order?**
A: Safety and dependencies. A derived class encapsulates its base class and might depend on base class state during its own initialization. The base state must be fully established and valid first.

**Q3: What happens if a base class constructor throws an exception?**
A: The derived class constructor never runs. The memory for the object is cleaned up, and any base-class members successfully created before the throw are destroyed. 
---

> 💡 **Interview tip:** Be prepared to trace the output of a multi-level inheritance chain where each constructor prints a line. Always remember: Top-down construction.

---

## Constructors and initialization of derived classes

> 🧠 **In one sentence:** A derived constructor must explicitly call the base constructor in its initialization list to pass arguments; otherwise, the compiler defaults to the base class's no-arg constructor.

> 🗣️ **Say it out loud:**
> "When handling constructors in inheritance, I'd say:
> A derived class is only responsible for initializing its own specific members. To initialize the base class portion, the derived constructor must call the base constructor inside its member initializer list. If you don't write it explicitly, the compiler attempts to call the default base constructor — and if the base class doesn't have one, it's a compile error."

The derived class constructor initializes derived members, while the base class constructor initializes base members.

The derived constructor can call the base constructor using a member initializer list. This guarantees base members are initialized before derived members. 

If the derived constructor doesn't explicitly call a base constructor, the compiler automatically calls the base's default constructor. If the base lacks a default constructor, or if you need a specific one, you must explicitly call it in the initializer list.

```cpp
#include <iostream>

class Base
{
private: 
    int m_id {};

public:
    Base(int id=0)
        : m_id{ id }
    {
    }

    int getId() const { return m_id; }
};

class Derived: public Base
{
private: 
    double m_cost;

public:
    Derived(double cost=0.0, int id=0)
        : Base{ id } // Call Base(int) constructor with value id!
        , m_cost{ cost }
    {
    }

    double getCost() const { return m_cost; }
};

int main()
{
    Derived derived{ 1.3, 5 }; // use Derived(double, int) constructor
    std::cout << "Id: " << derived.getId() << '\n';
    std::cout << "Cost: " << derived.getCost() << '\n';

    return 0;
}
// Output:
// Id: 5
// Cost: 1.3
```

Execution steps for the example above:
1. Memory for `derived` is allocated.
2. The `Derived(double, int)` constructor is called (`cost = 1.3`, `id = 5`).
3. The compiler sees `Base{ id }` in the initializer list and calls `Base(int)`.
4. Base initializer list sets `m_id` to 5.
5. Base constructor body executes (does nothing) and returns.
6. Derived initializer list sets `m_cost` to 1.3.
7. Derived constructor body executes (does nothing) and returns.

### Inheritance chains

In a multi-level chain (`A` <- `B` <- `C`), constructors still fire top-down.

```cpp
#include <iostream>

class A
{
public:
    A(int a)
    {
        std::cout << "A: " << a << '\n';
    }
    ~A()
    {
        std::cout << "Destroying A\n";
    }
};

class B: public A
{
public:
    B(int a, double b)
    : A{ a }
    {
        std::cout << "B: " << b << '\n';
    }

    ~B()
    {
        std::cout << "Destroying B\n";
    }
};

class C: public B
{
public:
    C(int a, double b, char c)
    : B{ a, b }
    {
        std::cout << "C: " << c << '\n';
    }

    ~C()
    {
        std::cout << "Destroying C\n";
    }
};

int main()
{
    C c{ 5, 4.3, 'R' };

    return 0;
}
// Output:
// A: 5
// B: 4.3
// C: R
// Destroying C
// Destroying B
// Destroying A
```

### Destructors

When a derived class object is destroyed, its destructors run in strict **reverse order** of construction (bottom-up). In the chain above, destruction proceeds: `C` -> `B` -> `A`.

---
#### ❓ Interview Q&A

**Q1: How do you pass arguments to a base class constructor from a derived class?**
A: You make an explicit call to the desired base class constructor inside the derived class's member initializer list.

**Q2: What happens if a base class has no default constructor, and the derived class doesn't explicitly call another base constructor?**
A: It results in a compile error. The compiler attempts to insert a call to the base default constructor implicitly, completely fails to find one, and halts.

**Q3: Can a derived constructor initialize a member variable belonging to the base class directly in its initializer list?**
A: No, that's illegal. A derived constructor's initialization list can only initialize its *own* direct members and call immediate base class constructors. It delegates base-member initialization entirely to the base constructor.
---

> 💡 **Interview tip:** Keep track of the "chain of responsibility". Class C is only responsible for calling Class B's constructor. Class C does not (and cannot) call Class A's constructor directly (unless dealing with virtual inheritance, which is an advanced topic).

---

## Inheritance and access specifiers

> 🧠 **In one sentence:** The inheritance access specifier (public, protected, or private) dictates the maximum accessibility level inherited members will have in the derived class.

### Protected Access Specifier

The `protected` access specifier restricts outside access, but allows derived classes and friends to access the member natively.

```cpp
class Base
{
public:
    int m_public {}; // can be accessed by anybody
protected:
    int m_protected {}; // can be accessed by Base members, friends, and derived classes
private:
    int m_private {}; // can only be accessed by Base members and friends (not derived)
};

class Derived: public Base
{
public:
    Derived()
    {
        m_public = 1; // allowed
        m_protected = 2; // allowed
        m_private = 3; // COMPILE ERROR: m_private is inaccessible
    }
};

int main()
{
    Base base;
    base.m_public = 1; // allowed
    base.m_protected = 2; // COMPILE ERROR: protected from outside
    base.m_private = 3; // COMPILE ERROR: private from outside

    return 0;
}
```

### Different kinds of inheritance, and their impact on access

```cpp
class Pub: public Base {};    // Public inheritance
class Pro: protected Base {}; // Protected inheritance
class Pri: private Base {};   // Private inheritance
class Def: Base {};           // Defaults to private for 'class', public for 'struct'
```

1. **Public inheritance:**
Inherited public members stay public. Inherited protected members stay protected. Private stays inaccessible. Most common form ("is-a").

![alt text](image-75.png)

```cpp
class Base
{
public:
    int m_public {};
protected:
    int m_protected {};
private:
    int m_private {};
};

class Pub: public Base 
{
public:
    Pub()
    {
        m_public = 1; // okay
        m_protected = 2; // okay
        m_private = 3; // COMPILE ERROR
    }
};

int main()
{
    Base base;
    base.m_public = 1; 

    Pub pub;
    pub.m_public = 1; 
    pub.m_protected = 2; // COMPILE ERROR
    return 0;
}
```

2. **Protected inheritance:**
Rarely used. Public and protected members become protected in the derived class. 

3. **Private inheritance:**
All inherited members become private in the derived class. The public interface of the base class is hidden from the outside world.

```cpp
class Pri: private Base 
{
public:
    Pri()
    {
        m_public = 1; // okay: now private in Pri
        m_protected = 2; // okay: now private in Pri
    }
};

int main()
{
    Pri pri;
    pri.m_public = 1; // COMPILE ERROR: m_public is private in Pri
    return 0;
}
```

**Use case for private inheritance:**
When the derived class uses the base class internally for implementation, but has no actual "is-a" relationship. For example, a `Car` might privately inherit `Engine` to use engine methods, without exposing engine methods publicly on the `Car`.

📊 **Quick comparison:**

| Inheritance Type | Base `public` becomes | Base `protected` becomes | Base `private` becomes | Use case |
|---|---|---|---|---|
| **Public** | Public | Protected | Inaccessible | Standard "is-a" relationship |
| **Protected** | Protected | Protected | Inaccessible | Very rare/niche implementations |
| **Private** | Private | Private | Inaccessible | "Implemented-in-terms-of", hides base API |

---
#### ❓ Interview Q&A

**Q1: What does the `protected` keyword do?**
A: It makes a member variable or function act like `private` to the outside world, but act like `public` to derived classes inheriting from it.

**Q2: If you don't specify the inheritance type (`class A : Base`), what is the default?**
A: For a `class`, the default is `private` inheritance. For a `struct`, the default is `public` inheritance.

**Q3: When would you actually use private inheritance?**
A: When you want to "implement in terms of" a base class. It lets you reuse the base class's code and override its virtual functions internally, without exposing its public API to outside users. Modern C++ usually prefers composition over private inheritance unless overriding virtuals is strictly required. 
---

> 💡 **Interview tip:** 99% of inheritance you write in C++ should be `public` inheritance. If asked about private inheritance, immediately pivot to comparison with Composition ("has-a").

---

## Adding new functionality to a derived class (IMPORTANT)

> 🧠 **In one sentence:** A derived class can reuse existing base class code and inject brand new fields and methods to extend its capabilities.

One of the biggest benefits of using derived classes is the ability to reuse already written code. You inherit the base class functionality and can add new functionality or hide what you don't want.

If we have access to third-party base class code, we *could* modify it directly. But this makes updating the library dangerous — updates overwrite our additions. Instead, inherited derived classes safely isolate our new functionality.

```cpp
#include <iostream>

class Base
{
protected:
    int m_value {};

public:
    Base(int value)
        : m_value { value }
    {
    }

    void identify() const { std::cout << "I am a Base\n"; }
};

class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    // Adding a completely new method
    int getValue() const { return m_value; }
};

int main()
{
    Derived derived { 5 };
    std::cout << "derived has value " << derived.getValue() << '\n';

    return 0;
}
// Output:
// derived has value 5
```

> **Note:** We created `getValue()` in the `Derived` class because there was no `getValue()` method in the `Base` class to access `m_value`. If there had been a `getValue()` method in the `Base` class, we could have just used that method without needing to add a new one in the `Derived` class.

---
#### ❓ Interview Q&A

**Q1: Why is it preferable to inherit a class to add functionality rather than just modifying the original source code?**
A: Modifying the original source code breaks encapsulation and complicates maintenance. If the original code comes from a third-party library, upgrading the library will overwrite your changes.

**Q2: Can a function expecting a `Base&` call the new `getValue()` method added to the `Derived` class?**
A: No. The compiler only knows about the interface of the type it sees. A `Base` reference only has access to members defined within the `Base` class, even if the underlying object is `Derived`.

**Q3: Is it safe to add new data members to a derived class if base pointers are frequently used?**
A: Yes, as long as you do not delete the derived objects via a base pointer that lacks a `virtual` destructor. Without a virtual destructor, the base pointer deletion will not call the derived destructor, leaking any resources tied to the new data members.
---

> 💡 **Interview tip:** Real-world C++ development often involves writing adapter classes around sealed library code. Deriving to add specific business-logic getters/setters is standard practice.

---

## Calling inherited functions and overriding behavior

> 🧠 **In one sentence:** A derived class can redefine a base class function simply by declaring a function with the exact same signature, hiding the base version.

> 🗣️ **Say it out loud:**
> "When handling redefined functions, I'd say:
> If a derived class defines a function with the exact same name as a base class function, it hides the base version. When called, the compiler resolves to the derived version first. However, we haven't lost the base functionality — inside our derived function, we can explicitly call the base version using the scope resolution operator to piggyback off its logic."

When a member function is called on a derived class target, the compiler looks for a matching name in the derived class first. If it's not found, it steps up the inheritance chain to the parent.

If the base class has a method:
```cpp
#include <iostream>

class Base
{
public:
    Base() { }
    void identify() const { std::cout << "Base::identify()\n"; }
};

class Derived: public Base {};

int main()
{
    Derived derived {};
    derived.identify(); // Finds it in Base
}
// Output:
// Base::identify()
```

### Redefining behaviors
If we define a method with the same name in the derived class, it intercepts the call.

```cpp
class Derived: public Base
{
public:
    Derived() { }
    void identify() const { std::cout << "Derived::identify()\n"; }
};

int main()
{
    Derived derived {};
    derived.identify(); // Finds it in Derived
}
// Output:
// Derived::identify()
```

> **Note:** When you redefine a function in the derived class, the derived function does not inherit the access specifier of the function with the same name in the base class. It uses whatever access specifier it is defined under in the derived class. A private base function can be redefined as public, or vice-versa!

### Adding to existing functionality
Frequently, we want to augment rather than overwrite base class behavior. 

```cpp
class Derived: public Base
{
public:
    Derived() { }

    void identify() const
    {
        std::cout << "Derived::identify()\n";
        Base::identify(); // explicitly calls base version
    }
};

int main()
{
    Derived derived {};
    derived.identify();
}
// Output:
// Derived::identify()
// Base::identify()
```

> ⚠️ **GOTCHA — Recursive overflow without scope resolution:**
> If you omit the `Base::` scope resolution prefix inside `Derived::identify()` and write `identify();`, the compiler binds to the current scope. The function calls itself directly, resulting in an infinite recursive loop and a stack overflow.
> **What to say in an interview:** "If I want to reuse the parent's logic in an overridden method, I must explicitly qualify the call with `BaseClassName::` to avoid accidental infinite recursion."

---
#### ❓ Interview Q&A

**Q1: How do you call a base class implementation of a function from within an overridden derived class function?**
A: Prefix the function call with the name of the base class and the scope resolution operator, like `Base::functionName()`.

**Q2: Does redefining a function in a derived class automatically make it polymorphic (virtual)?**
A: No. Redefining just hides the base class name statically. If you point a base class pointer at the derived object and call the function, the base class version will still execute. You must use the `virtual` keyword for runtime polymorphism.

**Q3: If a base class has overloaded versions of `print(int)` and `print(double)`, and the derived class redefines ONLY `print(int)`, what happens if you call `derivedObj.print(5.5)`?**
A: The derived object will call `Derived::print(int)` and implicitly cast the double to an int. The `print` name in the derived class entirely hides *all* overloaded versions of that name from the base class. (This is called Name Hiding). 
---

> 💡 **Interview tip:** Knowing the difference between "Redefining/Hiding" (static) and "Overriding" (dynamic/virtual) is crucial. Non-virtual functions are statically bound based on the pointer/reference type, not the object type.

---

## Hiding inherited functionality

> 🧠 **In one sentence:** You can modify the access level of an inherited member (even making a public member private) by placing a `using` declaration under a different access specifier in the derived class.

In C++, you cannot actually delete inherited functionality. However, you can effectively "hide" it so instances of the derived class cannot use it.

### Changing an inherited member's access level
You can expose a protected member from the base class as public in the derived class.

```cpp
#include <iostream>

class Base
{
protected:
    int m_value {};
    void printValue() const { std::cout << m_value; }
public:
    Base(int value) : m_value { value } {}
};

class Derived: public Base
{
public:
    Derived(int value) : Base { value } {}

    // Expose protected printValue as public
    using Base::printValue; 
};

int main()
{
    Derived derived { 5 };
    derived.printValue(); // okay 

    return 0;
}
```

### Hiding functionality
We can do the reverse: decrease the access level. Pull a public base member into the private section.

```cpp
#include <iostream>

class Base
{
public:
	int m_value{};
};

class Derived : public Base
{
private:
	using Base::m_value; // Hides it for Derived objects

public:
	Derived(int value) : Base { value } {}
};

int main()
{
	Derived derived{ 7 };
	// std::cout << derived.m_value; // COMPILE ERROR: private in Derived

	// BUT it is still public if accessed through a Base reference!
	Base& base{ derived };
	std::cout << base.m_value; // okay

	return 0;
}
```

> **Note:** ![alt text](image-76.png)

---
#### ❓ Interview Q&A

**Q1: How can you prevent users of a derived class from calling a method inherited as public?**
A: Place a `using Base::methodName;` declaration inside the `private` block of the derived class definition.

**Q2: Is making an inherited public method private a good design practice?**
A: Generally, no. It completely breaks the "is-a" relationship (Liskov Substitution Principle). If a derived class needs to hide base behaviors, `private` inheritance or Composition is usually the correct architectural fix.

**Q3: What's the loophole in hiding a public function using `private` access specifiers like this?**
A: Since the object is publicly inherited, a user can just cast the derived object to a reference of the base class type, and suddenly the "hidden" function becomes perfectly accessible and legal to call.
---

> 💡 **Interview tip:** If you mention "hiding a base method", be ready for the interviewer to ask "What happens if I cast it back to a Base pointer?" The answer is that static access control always respects the static type of the pointer doing the calling.

---

## Multiple inheritance

> 🧠 **In one sentence:** Multiple inheritance lets a class inherit from more than one base class, combining multiple properties, but introducing severe ambiguity risks.

> 🗣️ **Say it out loud:**
> "When discussing multiple inheritance, I'd say:
> C++ allows a class to inherit from multiple bases. While powerful — for example, implementing multiple pure virtual interfaces — it's famous for adding maintenance complexity. If both base classes have a function with the exact same name, the compiler can't automatically know which one you want, resulting in ambiguity errors. And if both base classes share a common ancestor, you encounter the dreaded 'Diamond Problem'."

Multiple inheritance enables a derived class to inherit members from more than one parent. Commas divide the base classes in the declaration.

![alt text](image-77.png)

```cpp
#include <string>
#include <string_view>

class Person {
// ... members ...
public:
    Person(std::string_view name, int age) {}
};

class Employee {
// ... members ...
public:
    Employee(std::string_view employer, double wage) {}
};

// Teacher publicly inherits Person and Employee
class Teacher : public Person, public Employee
{
private:
    int m_teachesGrade{};

public:
    Teacher(std::string_view name, int age, std::string_view employer, double wage, int teachesGrade)
        : Person{ name, age }, Employee{ employer, wage }, m_teachesGrade{ teachesGrade }
    {
    }
};
```

### Problems with multiple inheritance

Complexity ramps up drastically. 

```cpp
class USBDevice {
public:
    long getID() const { return 1; }
};

class NetworkDevice {
public:
    long getID() const { return 2; }
};

class WirelessAdapter: public USBDevice, public NetworkDevice {};

int main()
{
    WirelessAdapter c54G;
    // c54G.getID(); // COMPILE ERROR: Ambiguous!
    
    // Explicit workaround:
    std::cout << c54G.USBDevice::getID(); 
    std::cout << c54G.NetworkDevice::getID(); 
}
```
Because the object contains TWO `getID()` functions, calling it normally fails.

Another serious problem is the **"Diamond Problem"**. 
This occurs when a class multiply inherits from two classes which each inherit from a single base class.

![alt text](image-78.png)

> ⚠️ **GOTCHA — The Diamond Problem:**
> In a diamond hierarchy (e.g. `Device` -> `USBDevice` and `NetworkDevice` -> `WirelessAdapter`), the `WirelessAdapter` object will actually contain *two separate distinct copies* of the root `Device` base class. Updating members of `Device` down one path leaves the other path completely stale.
> **What to say in an interview:** "To solve the diamond problem duplication, you must use `virtual` inheritance for the intermediate base classes. This guarantees only one shared copy of the ancestral base class exists in memory."

📊 **Quick comparison:**

| | **Single Inheritance** | **Multiple Inheritance** |
|---|---|---|
| Complexity | Low | High |
| Ambiguity risk | Zero | High (Name collisions) |
| Diamond problem | Impossible | Possible |
| Best use case | Concrete behavioral extension | Composing multiple abstract interfaces |

> 🔗 **See also:** Chapter 25 — Virtual Functions (covers virtual inheritance to solve the diamond problem)

---
#### ❓ Interview Q&A

**Q1: What is multiple inheritance?**
A: It is a C++ language feature allowing a single, derived class to have multiple distinct direct base classes, combining their states and interfaces.

**Q2: What is the "Diamond Problem"?**
A: The diamond problem arises when a class inherits from two base classes, both of which share a common grandparent base class. The final derived object ends up with two unconnected internal duplicates of the grandparent class.

**Q3: In the real world, when is multiple inheritance considered acceptable?**
A: It is widely accepted when inheriting from multiple "Interfaces" (classes containing strictly pure virtual functions and no state). It is heavily discouraged when inheriting from multiple concrete classes that hold state.
---

> 💡 **Interview tip:** Languages like Java and C# explicitly banned multiple inheritance of classes (only allowing multiple interfaces) specifically because of the ambiguity and Diamond Problem in C++. Mentioning this cross-language history point shows maturity.

---

## 📖 Chapter Vocabulary

| Term | One-line definition |
|---|---|
| Inheritance | An object-oriented feature creating an "is-a" relationship yielding code reuse. |
| Is-a relationship | A hierarchy where a derived class acts as a specialized version of a base class. |
| Base class | The existing parent class that properties are inherited from. |
| Derived class | The child class that inherits properties from the base class. |
| Constructor chaining | The sequence of implicit or explicit base class constructor calls made during object creation. |
| Initializer list | The colon-separated list where a constructor assigns initial values and executes base constructors. |
| Public inheritance | Exposes base public/protected members correspondingly; respects the "is-a" architectural relationship. |
| Private inheritance | Reassigns all inherited members to private, effectively limiting their visibility to "implemented in terms of". |
| Name hiding | When a derived class declares a function with the same name as a base class function, masking it entirely within standard scopes. |
| Multiple inheritance | When a class simultaneously inherits from two or more immediate base classes. |
| Overriding | (Preview) Dynamically substituting a virtual method implementation; contrasted against static name rewriting/hiding. |
| Diamond problem | State duplication caused by multiple bases sharing an identical root parent. |
| Virtual inheritance | Used exclusively inside the diamond problem to consolidate shared ancestral bases into a single instance in memory. |

---
*Refined from personal notes · Chapter 24 of C++ series*
*Original content 100% preserved · Language and examples simplified for
C++ interview preparation · v2 format*
