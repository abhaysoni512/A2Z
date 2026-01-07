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

void my_strcpy(char dest[], const char source[]){
    int i;
    for(i=0;source[i]!='\0';i++){
        dest[i] = source[i];
    }
    dest[i] = '\0';
}
int main(){
    // char c[100];
    // cin.getline(c,100);
    //reverseString(c);

    char c1[10] = "Hello";
    char c2[5] = "Ravi";
    my_strcpy(c1,c2);
    cout<<c1<<endl;

    return 0;
}