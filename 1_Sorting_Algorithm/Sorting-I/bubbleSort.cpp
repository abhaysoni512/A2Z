#include <bits/stdc++.h>
using namespace std;

#define Swap(a, b)    \
    {                 \
        int temp = a; \
        a = b;        \
        b = temp;     \
    }

void BubbleSort(int arr[], int n)
{

    for (int i = n - 1; i >= 1; i--)
    {
        bool Isswap = false;
        for (int j = 0; j <= i - 1; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                Swap(arr[j], arr[j + 1]);
                Isswap = true;
            }
        }

        if (Isswap == false)
            return;
    }

    for (int i = 0; i < n; i++)
    {
        cout << arr[i] << " ";
    }
    cout << endl;
}
int main()
{
    int arr[6] = {13, 46, 24, 52, 20, 9};
    BubbleSort(arr, 6);
    return 0;
}