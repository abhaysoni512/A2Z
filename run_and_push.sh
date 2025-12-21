#!/bin/zsh

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
g++ -std=c++20 "$FILE_NAME" -o "$FILE_BASE" && ./"$FILE_BASE" && rm -f "$FILE_BASE"
echo "-------------------------------------------------------------------------------"

# Check if compilation and execution were successful
if [ $? -eq 0 ]; then
    echo "\n✓ Program executed successfully"
    
    # Navigate to git root
    cd "/Users/abhaysoni512/Desktop/A2Z"
    
    # Check if there are any changes to the file
    git diff --quiet "$FILE_PATH"
    
    if [ $? -eq 1 ]; then
        # File has changes, proceed with commit and push
        echo "\nChanges detected in $FILE_NAME"
        
        # Add the file to git
        git add "$FILE_PATH"
        
        # Commit with a timestamp message
        COMMIT_MSG="Update $(basename "$FILE_PATH") - $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG"
        
        # Push to GitHub
        echo "Pushing to GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✓ Successfully pushed to GitHub"
        else
            echo "✗ Failed to push to GitHub"
        fi
    else
        echo "\n→ No changes detected in $FILE_NAME. Skipping commit."
    fi
else
    echo "\n✗ Compilation or execution failed. Not pushing to GitHub."
fi
