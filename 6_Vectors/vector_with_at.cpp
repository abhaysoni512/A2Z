// C++ code here
#include <bits/stdc++.h>
using namespace std;
int main()
{
    vector<int> v;

    v.push_back(0);
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);

    v.at(3); // valid index
    v.at(4); // invalid index

    return 0;
}