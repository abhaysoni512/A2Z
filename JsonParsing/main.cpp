#include <iostream>
#include <fstream>
#include "include/json.hpp"

using namespace std;

using json = nlohmann::json;

int main(){
    // s1. Read JSON from a file
    ifstream f("db.json");

    // s2. Parse JSON
    const auto j = json::parse(f);
    
    for (const auto& item : j) {
        cout<<"Title:"<<item["title"]<<" Discription:"<<item["description"]<<"content:"<<item["content"]<<endl;
    }
}