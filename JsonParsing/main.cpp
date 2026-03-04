#include <iostream>
#include <fstream>
#include "include/json.hpp"
#include <map>

using namespace std;

using json = nlohmann::json;

int main(){
    // s1. Read JSON from a file
    ifstream f("db.json");

    // s2. Parse JSON
    const auto j = json::parse(f);
    
    // let create search query for title
    const string search_title = "Hello";

    map<string, int> hash_map; 

    for (const auto& item : j) {
        int score = 0;
        auto title = item["title"].get<string>();
        auto discription = item["description"].get<string>();
        auto content = item["content"].get<string>();

        if(title.find(search_title) != string::npos) {
            score += 30; // Higher score for title match
        }
        if(discription.find(search_title) != string::npos) {
            score += 20; // Medium score for description match
        }
        if (content.find(search_title) != string::npos) {
            score += 10; // Lower score for content match
        }


        hash_map.insert({title, score});

    }

    for(const auto& pair : hash_map) {
        cout << "Title: " << pair.first << ", Score: " << pair.second << endl;
    }
}