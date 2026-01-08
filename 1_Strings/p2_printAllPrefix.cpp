#include <bits/stdc++.h>
using namespace std;
void prefixPrint(char c[]){
    size_t l = strlen(c)-1; //3
    size_t i = 0;
    for(int i = 0; i<l; i++){
        for(int j = 0; j<=i;j++){
            cout<<c[j];
        }
        cout<<endl;
    }
}

int main()
{
    char a[5] = "abcd";
    prefixPrint(a);
    return 0;
}