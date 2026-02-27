#include <iostream>
#include <memory>
using namespace std;

void f1()
{
    //1st way
    shared_ptr <int> p1(new int(10));
    weak_ptr <int> p2=p1;
    cout<<p1.use_count()<<endl;
    cout<<p2.use_count()<<endl;
    cout<<*p1<<endl;
    cout<<*p2.lock()<<endl;
    p2.reset();
    cout<<p1.use_count()<<endl;
    cout<<p2.use_count()<<endl;
    return;
}
int main(){
    f1();
    return 0;
}