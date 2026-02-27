//

#include <iostream>
#include <memory>
using namespace std;

void f1()
{
    //1st way
    shared_ptr <int> p1(new int(10));
    shared_ptr <int> p2;
    p2=p1;
    cout<<p1.use_count()<<endl;
    cout<<p2.use_count()<<endl;
    cout<<p2.get()<<endl;
    cout<<p1.get()<<endl;
    p1.reset();
    cout<<p1.use_count()<<endl;
    cout<<p2.use_count()<<endl;

    //getting address
    cout<<p2.get()<<endl;
    cout<<p1.get()<<endl;
    
    return;
}
int main(){
    f1();
    return 0;
}