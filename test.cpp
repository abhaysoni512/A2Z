#include <iostream>

class Fraction
{
private:
    int m_numerator;
    int m_denominator;

public:
    // Default constructor
    Fraction(int numerator = 0, int denominator = 1) : m_numerator{numerator}, m_denominator{denominator} {}

    // Copy constructor
    Fraction(const Fraction &other) : m_numerator{other.m_numerator}, m_denominator{other.m_denominator}
    {
        std::cout << "Copy constructor called\n";
    }

    // Copy assignment operator
    Fraction &operator=(const Fraction &other);

    friend std::ostream &operator<<(std::ostream &out, const Fraction &f);
};
std::ostream &operator<<(std::ostream &out, const Fraction &f)
{
    out << f.m_numerator << '/' << f.m_denominator;
    return out;
}

Fraction &Fraction::operator=(const Fraction &other)
{
    std::cout << "Copy assignment operator called\n";
    if (this == &other)
    {                 // check for self-assignment
        return *this; // return the current object to allow chaining of assignment operations
    }
    m_numerator = other.m_numerator;     // copy the numerator from the other object
    m_denominator = other.m_denominator; // copy the denominator from the other object
    return *this;                        // return the current object to allow chaining of assignment operations
}

int main()
{
    Fraction f1{5, 3};
    Fraction f2{7, 2};
    Fraction f3{9, 5};

    f1 = f2 = f3; // chained assignment

    return 0;
}



