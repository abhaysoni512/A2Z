// C++ code here
#include <bits/stdc++.h>
using namespace std;
int main()
{
    vector<int> v;

    for (int i=0; i<10; i++){
        cout<<"capacity before pushback: "<<v.capacity()<<endl;
        v.push_back(i+1);
        cout<<" Size  after pushback : "<<v.size()<<endl;
    }


    return 0;
}