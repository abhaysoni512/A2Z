# Topic 1: What is structural padding and packing in C++?

It is a way of arranging data in memory to optimize access and reduce memory usage. padding is done by compiler that adds extra bytes to the structure to align the data members on specific memory boundaries while packing is used to disable padding and pack the structure members together without any extra bytes.


```cpp
#include <iostream>
using namespace std;

struct Base{
    char a;
    char b;
    int c;
    char d;
};

int main{
    cout<<sizeof(Base)<<endl; // Output: 12 (due to padding)
    return 0;
}
```
