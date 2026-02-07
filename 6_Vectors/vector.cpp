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



    vector <int> v1 ;

    v1.push_back(1);
    v1.push_back(2);
    v1[3] = 3;
    v1[4] = 4;

    v1.push_back(5);
    v1.push_back(6);

    for(int i=0; i<6; i++){
        cout<<v1[i]<<" ";
    }
    cout<<endl;

    return 0;
}