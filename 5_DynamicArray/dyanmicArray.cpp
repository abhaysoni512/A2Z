// C++ code here
#include <bits/stdc++.h>
using namespace std;
class DynamicArray{
private:
    int *data{nullptr};
    int nextIndex{}; // number of elements added
    int size{}; // capacity of the array
public:
    DynamicArray(){
        data = new int[5];
    }
    DynamicArray(int s): size(s){
        data = new int[size];
    }
    ~DynamicArray(){
        delete []data;
    }

    void addElement(int v) {
        if (nextIndex == size) {
            int *temp = new int[size * 2];
            for(size_t i =0; i<size; i++){
                temp[i] = data[i];
            }
            delete []data;
            size *= 2;
            data = temp;    
        }
        data[nextIndex++] = v;
    }

    void Display(){
        cout<<"Elements: ";
        for(int i = 0;i< nextIndex; i++){
            cout<<data[i]<<" ";
        }
        cout<<endl;
    }

    int getData(int i){
        if(i>=0 && i<nextIndex){
            return data[i];
        }else{
            return -1;
        }
    }
};
int main() {
    DynamicArray d;
    for(int i = 1;i<=5;i++){
        d.addElement(i);
    }
    d.Display();
    d.addElement(6);
    d.Display();

    cout<<d.getData(2)<<endl;
    return 0;
}