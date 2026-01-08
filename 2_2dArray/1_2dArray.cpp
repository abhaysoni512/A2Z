#include <bits/stdc++.h>
using namespace std;

void printElement(int arr[][4],int m, int n){
    for(int i=0; i<m; i++){
        for(int j=0; j<n; j++){
            cout<<arr[m][n];
        }
        cout<<endl;
    }
}

int main(){
    int arr[3][4]= {{0}};
    printElement(arr,3,4);
    for(int i=0; i<3; i++){
        for(int j=0; j<4; j++){
            cin>>arr[i][j];
        }
    }
    printElement(arr,3,4);
    return 0;
}