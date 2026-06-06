#include <iostream>
class Base
{
public:
    Base()
    {
        std::cout << "Calling Base()\n";
    }
    virtual ~Base() // note: virtual
    {
        std::cout << "Calling ~Base()\n";
    }
};

class Derived : public Base
{
private:
    int *m_array{};

public:
    Derived(int length)
        : m_array{new int[length]}
    {
        std::cout << "Calling Derived()\n";
    }

    virtual ~Derived() // note: virtual
    {
        std::cout << "Calling ~Derived()\n";
        delete[] m_array;
    }
};

int main()
{
    Derived *derived{new Derived(5)};
    Base *base{derived};

    delete base;

    return 0;
}