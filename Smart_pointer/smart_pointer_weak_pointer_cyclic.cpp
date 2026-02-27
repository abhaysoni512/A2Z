#include <iostream>
#include <memory>
using namespace std;
class B;
class A
{
    public:
    weak_ptr<B>p1;
    void set_ptr(shared_ptr<B> &ptr1){
        p1=ptr1;
    }
    ~A(){
        cout<<"Destructor:A"<<endl;
    }
};
class B
{
    public:
    weak_ptr<A>p2;
    void set_ptr(shared_ptr<A> &ptr2){
        p2=ptr2;
    }
    ~B(){
        cout<<"Destructor:B "<<endl;
    }
};
void f1()
{
    shared_ptr <A>objptra(new A()); 
    shared_ptr <B>objptrb(new B());
    objptra->set_ptr(objptrb); 
    objptrb->set_ptr(objptra);
    cout<<objptrb.use_count()<<endl;
    cout<<objptra.use_count()<<endl;
    

}
int main(){
    f1();
    return 0;
}