#include <iostream>
#include <string>
#include <string_view>
#include <chrono>

// Remove I/O to measure actual parameter passing
int processValue(std::string_view y)
{
    return y.length();
}

int processValue1(const std::string_view& y)
{
    return y.length();
}

int main()
{
    std::string x = "Hello, World!";
    const int iterations = 1000000;
    
    // Warm-up
    for (int i = 0; i < 1000; ++i) {
        processValue(x);
        processValue1(x);
    }
    
    // Test pass-by-value
    auto start = std::chrono::high_resolution_clock::now();
    volatile int result = 0;
    for (int i = 0; i < iterations; ++i) {
        result += processValue(x);
    }
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
    std::cout << "Pass-by-value: " << duration / iterations << " ns per call" << std::endl;

    // Test pass-by-reference
    start = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < iterations; ++i) {
        result += processValue1(x);
    }
    end = std::chrono::high_resolution_clock::now();
    duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
    std::cout << "Pass-by-reference: " << duration / iterations << " ns per call" << std::endl;
    
    std::cout << "Result (to prevent optimization): " << result << std::endl;
}