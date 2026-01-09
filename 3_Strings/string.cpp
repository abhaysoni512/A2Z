#include <bits/stdc++.h>
using namespace std;

int main()
{
    string s = "abc";
    cout << s << endl;

    string *sp = new string;
    *sp = "pqr";
    cout << sp << endl
         << *sp << endl;

    // taking input in string
    string s2;
    getline(cin, s2); //
    cout << s2 << endl;

    string s3 = "pqrabcabc";
    cout << s3.find("abc") << endl;

    int a = 134;
    string s4 = to_string(a);

    cout << typeid(s4).name() << endl;

    s4[0] = '9';
    a = atoi(s4.c_str());
    cout << a << endl;

    return 0;
}