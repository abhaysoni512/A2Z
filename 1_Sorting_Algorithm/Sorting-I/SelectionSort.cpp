#include <bits/stdc++.h>
using namespace std;

#define Swap(a,b) {int temp = a; a = b; b = temp;}

void SelectionSort(int arr[], int n){
    for(int i=0; i<=n-2; i++){
        int min = i;
        for(int j=i+1;j<=n-1; j++){
            if(arr[j]<arr[min]) min = j;
        }
        Swap(arr[i], arr[min]);
    }

    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}
int main(){
    int arr[6] = {13, 46, 24, 52, 20, 9};
    SelectionSort(arr, 6);
    return 0;
}