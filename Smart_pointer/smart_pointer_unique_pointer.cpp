// smart pointer - memory management
// avoid dangling pointer
// avoid memory leak
// avoid memory corruption
// avoid double free
// avoid use after free
// avoid null pointer dereference

#include <iostream>
#include <memory>
using namespace std;

void f1()
{
    //1st way
    unique_ptr <int> p(new int(10));
    //2nd way
    // unique_ptr <int> p;
    // p.reset(new int(10));

    //transfering of ownership
    unique_ptr <int> q = move(p);
    cout<<*q << endl;
    cout<<"unique_ptr is being called\n";
    return;
}
int main(){
    f1();
    return 0;
}