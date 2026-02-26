#include <iostream>

class Foo {
public:
    int m_x;

    Foo(int x) : m_x(x) {}  // Parameterized constructor declared → no implicit default ctor.

    // Foo() {}  // This would be user-provided (non-trivial).
    //Foo() = default;  // Explicitly defaulted: Compiler generates it (trivial if possible).

    void print() const {
        std::cout << "Foo(" << m_x << ")\n";
    }
};

int main() {
    Foo f1;      // OK: Calls the defaulted default ctor (m_x default-initialized to indeterminate value).
    f1.print();  // May print an indeterminate value for m_x.
    Foo f2(42);  // OK: Calls the parameterized ctor.
    return 0;
}