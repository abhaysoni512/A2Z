#include <bits/stdc++.h>
using namespace std;

struct M_Array{
    int *A; // pointer to array in heap
    int size; // size of array (capacity)
    int length; // number of elements in array (currently present)
};

void display(const M_Array &m){
    int i = 0;
    cout<<"Elements in array:- ";
    for(;i<m.length;i++){
        cout<<m.A[i]<<" ";
    }
    cout<<endl;
}

int main(){
    M_Array arr;
    int n,i;
    cout<<"Enter the size of array :\n";
    cin>>arr.size;
    arr.A = new int[arr.size];
    arr.length = 0;

    cout<<"Enter all the elements"<<endl;
    for(i=0;i<arr.size;i++){
        cin>>arr.A[i];
        arr.length++;
    }

    display(arr);
    


    return 0;
}