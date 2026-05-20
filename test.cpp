#include <iostream>
#include <memory>

class Resource2; // forward declaration of Resource2

class Resource1
{
public:
    std::shared_ptr<Resource2> m_ptr2; // shared_ptr to Resource2
    Resource1() { std::cout << "Resource1 acquired\n"; }
    ~Resource1() { std::cout << "Resource1 destroyed\n"; }
};

class Resource2
{
public:
    std::weak_ptr<Resource1> m_ptr1; // weak_ptr to Resource1
    Resource2() { std::cout << "Resource2 acquired\n"; }
    ~Resource2() { std::cout << "Resource2 destroyed\n"; }
};

int main()
{
    std::shared_ptr<Resource1> p1{new Resource1}; // create a shared_ptr to Resource1
    std::shared_ptr<Resource2> p2{new Resource2}; // create a shared_ptr to Resource2

    p1->m_ptr2 = p2; // p1's m_ptr2 is a shared_ptr to p2, so Resource1 has a shared_ptr to Resource2
    p2->m_ptr1 = p1; // p2's m_ptr1 is a weak_ptr to p1, so Resource2 has a weak_ptr to Resource1, breaking the circular reference

    return 0;
}