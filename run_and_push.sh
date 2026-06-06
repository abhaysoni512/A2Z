#!/bin/bash

# Get the file path passed as argument
FILE_PATH="$1"
FILE_DIR=$(dirname "$FILE_PATH")
FILE_NAME=$(basename "$FILE_PATH")
FILE_BASE="${FILE_NAME%.cpp}"

# Navigate to the file directory
cd "$FILE_DIR"

# Compile and run the C++ program
echo "Compiling and running $FILE_NAME"
echo "-------------------------------------------------------------------------------"
# take input from input.txt if it exists and output to output.txt
if [ -f "../input.txt" ]; then
    g++ -std=c++20 "$FILE_NAME" -o "$FILE_BASE" && ./"$FILE_BASE" < ../input.txt > ../output.txt && rm -f "$FILE_BASE"
else
    g++ -std=c++20 "$FILE_NAME" -o "$FILE_BASE" && ./"$FILE_BASE" && rm -f "$FILE_BASE"
fi
echo "-------------------------------------------------------------------------------"

