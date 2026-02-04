// C++ code here
#include <bits/stdc++.h>
using namespace std;
int main()
{
    vector<int> v;

    for (int i=0; i<10; i++){
        cout<<"capacity before pushback: "<<v.capacity()<<endl;
        cout << " Size  after pushback : " << v.size() << endl;
        v.push_back(i+1);
        
    }


    return 0;
}