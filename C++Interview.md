# Day1

1. Resource Acquisition Is Initialization it means that resource allocation is tied to object lifetime. When an object is created, it acquires the necessary resources (like memory, file handles, etc.) in its constructor, and when the object goes out of scope or is destroyed, it automatically releases those resources in its destructor. This helps to ensure that resources are properly managed and prevents memory leaks or other resource-related issues.

Let's explain this with an example:
   
```cpp
#include <iostream>
using namespace std;

class Buffer{
private:
    int *m_data;
public:
    Buffer(s_size t){
        m_data = new char[t];
        cout<<"Resource accquired\n";
    }
    ~Buffer(){
        cout<<"Resource Destroyed\n";
    }
}

int main() {
    Buffer b;
}
```

* Why RAII Is Powerful?

Without RAII:

    manual cleanup everywhere
    leaks during exceptions
    leaks during early return
    complicated ownership tracking

With RAII:

    automatic cleanup
    exception safety
    predictable lifetime
    safer code

In production systems, RAII simplifies ownership management and guarantees cleanup even during exceptions or early returns. For example, in multithreaded systems we use std::lock_guard to ensure mutexes are always released safely. Similarly, smart pointers use RAII internally to manage heap memory without manual delete.

# Day 2

1. Why Smart Pointers Exist

Raw pointers have problems:

    memory leaks
    double delete
    dangling pointers
    unclear ownership


2. What Are Smart Pointers?

Smart pointers are C++ classes that manage dynamic memory automatically. They provide automatic memory management by ensuring that the memory they point to is properly released when it is no longer needed. The most common smart pointers in C++ are std::unique_ptr, std::shared_ptr, and std::weak_ptr.




