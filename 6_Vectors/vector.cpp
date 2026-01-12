// C++ code here
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector <int> *v = new vector<int>();
    v->push_back(10);
    v->push_back(20);
    v->push_back(30);
    
    cout<<(*v)[0]<<endl;
    cout<<v->at(1)<<endl;
    cout<<v->at(2)<<endl;

    (*v)[4] = 40;
    cout<<(*v)[4]<<endl;

    return 0;
}