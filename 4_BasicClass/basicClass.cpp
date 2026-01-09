#include <bits/stdc++.h>
using namespace std;
class student{
public:
    int rollNo;
    int age;
};
int main(){
    student *s1 = new student;
    s1->age = 11;
    s1->rollNo = 22;
    cout<<s1->age<<" , "<<s1->rollNo<<endl;

    return 0;
}