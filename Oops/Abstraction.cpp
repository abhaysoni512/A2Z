#include <iostream>
#include <string>

// This class is an interface for a car. It has pure virtual functions that must be implemented by any class that inherits from it. Basically, it is an abstract class that cannot be instantiated on its own. It serves as a blueprint for other classes that will implement the specific details of a car.
class Car
{
    public:
        virtual void start() = 0; // pure virtual function to start the car
        virtual void stop() = 0;  // pure virtual function to stop the car
        virtual ~Car() = default; // virtual destructor with default implementation
};

class Tesla : public Car
{
    public:
        void start() override // implementation of the start function for Tesla
        {
            std::cout << "Tesla is starting..." << std::endl;
        }
        void stop() override // implementation of the stop function for Tesla
        {
            std::cout << "Tesla is stopping..." << std::endl;
        }
};

int main()
{
    Car* myCar = new Tesla(); // creating a pointer to Car and assigning it a new Tesla object
    myCar->start(); // calling the start function, which will execute the Tesla's implementation
    myCar->stop();  // calling the stop function, which will execute the Tesla's implementation
    delete myCar; // cleaning up the dynamically allocated Tesla object
    return 0;
}