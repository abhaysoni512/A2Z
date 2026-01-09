#include <bits/stdc++.h>
using namespace std;

int main(){
    string s = "abc";
    cout<<s<<endl;

    string *sp = new string ;
    *sp = "pqr";
    cout<<sp<<endl<<*sp<<endl;


    // taking input in string
    string s2;
    getline(cin, s2); //
    cout<<s2<<endl;

    string s3 = "pqrabcabc";
    cout<<s3.find("abc")<<endl;

    return 0;
}