#include <bits/stdc++.h>
using namespace std;

int len(char c[]) ;

void reverseString(char c[])
{
    int s=0;
    int l=len(c)-1;

    while (s<l)
    {
        swap(c[s],c[l]);
        s++;
        l--;
    }
    
}

int len(char c[]){
    int count=0;
    for(int i=0;c[i]!='\0';i++ ){
        count++;
    }
    return count;
}
int main(){
    char c[100];
    cin.getline(c,100);
    reverseString(c);

    return 0;
}