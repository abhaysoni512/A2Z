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

    try {
    v->at(4) = 40;   // will throw std::out_of_range because size is 3
} catch (const out_of_range& e) {
    cout << "out_of_range: " << e.what() << "\n";
}
    cout<<(*v)[4]<<endl;

    cout<<"size = "<<v->size()<<endl;


    return 0;
}