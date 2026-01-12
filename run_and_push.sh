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

# Check if compilation and execution were successful
if [ $? -eq 0 ]; then
    echo "\n✓ Program executed successfully"
    
    # Navigate to git root
    cd "/root/Abhay/A2Z"
    #cd "/Users/abhaysoni512/Desktop/A2Z"
    
    # Check if the file is new (untracked) or has changes
    if git ls-files --error-unmatch "$FILE_PATH" &>/dev/null; then
        # File is tracked, check for changes
        git diff --quiet "$FILE_PATH"
        HAS_CHANGES=$?
    else
        # File is untracked (new file)
        HAS_CHANGES=1
    fi
    
    if [ $HAS_CHANGES -eq 1 ]; then
        # File has changes or is new, proceed with commit and push
        echo "\nChanges detected in $FILE_NAME"
        
        # Add the file to git
        git add "$FILE_PATH"
        
        # Commit with a timestamp message
        COMMIT_MSG="Update $(basename "$FILE_PATH") - $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG"
        # Detect OS and ensure we're in the correct repo root
        OS_NAME="$(uname -s)"
        if [ "$OS_NAME" = "Linux" ]; then
            GIT_ROOT="/root/Abhay/A2Z"
        elif [ "$OS_NAME" = "Darwin" ]; then
            GIT_ROOT="/Users/abhaysoni512/Desktop/A2Z"
        else
            echo "Unsupported OS: $OS_NAME"
            exit 1
        fi

        cd "$GIT_ROOT" || { echo "Failed to cd to repo root: $GIT_ROOT"; exit 1; }

        # Pull latest from cloud while preserving local-only paths
        PRESERVE_PATHS=(".vscode" "input.txt" "output.txt")
        TMP_PRESERVE_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t a2z_preserve)"

        for p in "${PRESERVE_PATHS[@]}"; do
            if [ -e "$p" ]; then
            mkdir -p "$TMP_PRESERVE_DIR/$(dirname "$p")"
            cp -a "$p" "$TMP_PRESERVE_DIR/$p" 2>/dev/null || true
            fi
        done

        echo "Syncing with remote (preserving .vscode, input.txt, output.txt)..."
        git fetch origin main && git pull --rebase origin main
        PULL_STATUS=$?

        # Restore preserved paths (keep local versions)
        for p in "${PRESERVE_PATHS[@]}"; do
            if [ -e "$TMP_PRESERVE_DIR/$p" ]; then
            rm -rf "$p"
            mkdir -p "$(dirname "$p")"
            cp -a "$TMP_PRESERVE_DIR/$p" "$p" 2>/dev/null || true
            fi
        done
        rm -rf "$TMP_PRESERVE_DIR"

        if [ $PULL_STATUS -ne 0 ]; then
            echo "✗ git pull failed. Resolve conflicts and try again."
            exit 1
        fi

        # If this is an existing (tracked) file, confirm before pushing
        if git ls-files --error-unmatch "$FILE_PATH" &>/dev/null; then
            read -r -p "This modifies an existing file. Push to GitHub? [y/N] " CONFIRM_PUSH
            case "$CONFIRM_PUSH" in
            y|Y|yes|YES) ;;
            *) echo "→ Skipping push."; exit 0 ;;
            esac
        fi
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
