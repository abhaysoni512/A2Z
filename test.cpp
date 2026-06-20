#include <string>
#include <string_view>
#include <iostream>

class Animal // This Animal is an abstract base class
{
protected:
    std::string m_name{};

public:
    Animal(std::string_view name)
        : m_name{name}
    {
    }

    const std::string &getName() const { return m_name; }
    virtual std::string_view speak() const = 0; // note that speak is now a pure virtual function

    virtual ~Animal() = default;
};

class Cow : public Animal
{
public:
    Cow(std::string_view name)
        : Animal{name}
    {
    }

    virtual std::string_view speak() const override // We need to redefine speak
    {
        return "Moo";
    }
};

int main()
{
    Animal dog{"Rover"};
    Cow cow{"Betsy"};
    std::cout << cow.getName() << " says " << cow.speak() << '\n';

    return 0;
}