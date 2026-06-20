import os
import re
import sys

def normalize_text_keep_spaces(text):
    # Remove markdown styling and links/formatting characters
    text = re.sub(r'[\*\_`#\[\]\(\)\-\>\:\;\,\.\?\!\'\"]', ' ', text)
    text = re.sub(r'[“”‘’]', ' ', text)
    # Replace any whitespace sequence with a single space
    text = re.sub(r'\s+', ' ', text)
    return text.lower().strip()

def normalize_text_strict(text):
    # Remove all markdown tags and all whitespace
    text = re.sub(r'[\*\_`#\[\]\(\)\-\>\:\;\,\.\?\!\'\"\s]', '', text)
    text = re.sub(r'[“”‘’]', '', text)
    return text.lower()

def strip_backticks(text):
    text = text.strip()
    if text.startswith('`'):
        text = text[1:]
    if text.endswith('`'):
        text = text[:-1]
    return text

def strip_fenced_delimiters(text):
    text = text.strip()
    # Remove leading ```cpp or ```
    text = re.sub(r'^```\w*\n', '', text)
    # Remove trailing ```
    if text.endswith('```'):
        text = text[:-3]
    return text.strip()

def normalize_code(code_text):
    # Remove comments (single line // and multi line /* */)
    code_text = re.sub(r'//.*', '', code_text)
    code_text = re.sub(r'/\*.*?\*/', '', code_text, flags=re.DOTALL)
    # Remove all whitespace
    code_text = re.sub(r'\s+', '', code_text)
    return code_text

def to_blocks(text):
    lines = text.splitlines()
    blocks = []
    current_block = []
    
    in_fenced_code = False
    
    for line in lines:
        stripped = line.strip()
        
        # Fenced code block handling: group everything inside ``` as one code block
        if stripped.startswith("```"):
            in_fenced_code = not in_fenced_code
            current_block.append(line)
            if not in_fenced_code:
                blocks.append(("\n".join(current_block), "code"))
                current_block = []
            continue
            
        if in_fenced_code:
            current_block.append(line)
            continue
            
        if not line.strip():
            if current_block:
                blocks.append(("\n".join(current_block), "text"))
                current_block = []
        else:
            current_block.append(line)
            
    if current_block:
        blocks.append(("\n".join(current_block), "text"))
        
    return blocks

def clean_block_text(text):
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        # Remove Show Solution / Show Hint buttons
        if 'javascript:void(0)' in line:
            continue
        # Remove lines that are just '\'
        if line.strip() == '\\':
            continue
        # Strip trailing backslash from the end of the line
        stripped_line = line.rstrip()
        if stripped_line.endswith('\\'):
            stripped_line = stripped_line[:-1].rstrip()
        cleaned_lines.append(stripped_line)
    return "\n".join(cleaned_lines)

def is_single_inline_element(line):
    line = line.strip()
    if not line:
        return False
    # Bold
    if re.match(r'^(\*\*|__)(.*?)\1$', line):
        return True
    # Italic
    if re.match(r'^(\*|_)(.*?)\1$', line):
        return True
    # Inline code
    if re.match(r'^`(.*?)`$', line):
        return True
    # Link
    if re.match(r'^\[(.*?)\]\((.*?)\)$', line):
        return True
    return False

def get_plain_text(line):
    line = line.strip()
    m = re.match(r'^(\*\*|__)(.*?)\1$', line)
    if m:
        return m.group(2)
    m = re.match(r'^(\*|_)(.*?)\1$', line)
    if m:
        return m.group(2)
    m = re.match(r'^`(.*?)`$', line)
    if m:
        return m.group(1)
    m = re.match(r'^\[(.*?)\]\((.*?)\)$', line)
    if m:
        return m.group(1)
    return line

def clean_isolated_terms(block_text, preceding_blocks):
    lines = block_text.splitlines()
    cleaned_lines = []
    
    # Combine normalized text from the last 3 preceding blocks
    preceding_text_normalized = ""
    for pb in preceding_blocks[-3:]:
        preceding_text_normalized += " " + normalize_text_keep_spaces(pb[0])
        
    for line in lines:
        if is_single_inline_element(line):
            plain = get_plain_text(line)
            norm_plain = normalize_text_keep_spaces(plain)
            if norm_plain:
                # Custom word boundary search
                if not re.search(r'\w', norm_plain):
                    # Only non-alphanumeric characters, do simple substring check
                    if norm_plain in preceding_text_normalized:
                        continue
                else:
                    # Construct regex pattern with boundaries only on alphanumeric start/end
                    pattern = ""
                    if re.match(r'^\w', norm_plain):
                        pattern += r'\b'
                    pattern += re.escape(norm_plain)
                    if re.match(r'.*\w$', norm_plain):
                        pattern += r'\b'
                    if re.search(pattern, preceding_text_normalized):
                        continue
        cleaned_lines.append(line)
        
    return "\n".join(cleaned_lines)

def is_multiline_backtick_block(block_text):
    stripped = block_text.strip()
    # It must start and end with backticks, have newlines, and contain exactly 2 backticks in total.
    return (stripped.startswith('`') and 
            stripped.endswith('`') and 
            '\n' in stripped and 
            stripped.count('`') == 2)

def blocks_are_similar(b1, b2):
    norm1 = normalize_text_strict(b1[0])
    norm2 = normalize_text_strict(b2[0])
    if not norm1 or not norm2:
        return norm1 == norm2
    if norm1 == norm2:
        return True
    # Substring check for long blocks (handles mangled duplicates)
    if len(norm1) > 80 and len(norm2) > 80:
        if norm1 in norm2 or norm2 in norm1:
            return True
    return False

def sequences_are_similar(seq1, seq2):
    if len(seq1) != len(seq2):
        return False
    for b1, b2 in zip(seq1, seq2):
        if not blocks_are_similar(b1, b2):
            return False
    return True

def pass1_clean(blocks):
    cleaned_blocks = []
    last_fenced_code = None
    
    i = 0
    while i < len(blocks):
        block_text, block_type = blocks[i]
        
        # Clean basic formatting issues
        block_text = clean_block_text(block_text)
        if not block_text.strip():
            i += 1
            continue
            
        # Track last fenced code block
        if block_type == "code" and block_text.strip().startswith("```"):
            last_fenced_code = block_text
            cleaned_blocks.append((block_text, "code"))
            i += 1
            continue
            
        # Handle multi-line backtick block
        if is_multiline_backtick_block(block_text):
            code_inside = strip_backticks(block_text)
            
            is_dup = False
            if last_fenced_code:
                fenced_code = strip_fenced_delimiters(last_fenced_code)
                if normalize_code(code_inside) == normalize_code(fenced_code):
                    is_dup = True
                    
            if is_dup:
                i += 1
                continue
            else:
                fenced_block = f"```cpp\n{code_inside}\n```"
                cleaned_blocks.append((fenced_block, "code"))
                last_fenced_code = fenced_block
                i += 1
                continue
                
        # Clean isolated terms
        block_text = clean_isolated_terms(block_text, cleaned_blocks)
        if not block_text.strip():
            i += 1
            continue
            
        current_block = (block_text, block_type)
        
        # Deduplicate consecutive identical blocks
        if cleaned_blocks and blocks_are_similar(cleaned_blocks[-1], current_block):
            i += 1
            continue
            
        cleaned_blocks.append(current_block)
        i += 1
        
    return cleaned_blocks

def pass2_sequence_dedup(blocks):
    cleaned_blocks = []
    i = 0
    while i < len(blocks):
        current_block = blocks[i]
        
        dup_found = False
        # Check for sequence duplicates of length L from 1 to 15
        for L in range(1, 16):
            if i + 2 * L <= len(blocks):
                seq1 = blocks[i : i + L]
                seq2 = blocks[i + L : i + 2 * L]
                if sequences_are_similar(seq1, seq2):
                    cleaned_blocks.extend(seq1)
                    i += 2 * L
                    dup_found = True
                    break
        
        if not dup_found:
            cleaned_blocks.append(current_block)
            i += 1
            
    return cleaned_blocks

def clean_file(file_path):
    print(f"Cleaning file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    blocks = to_blocks(content)
    
    # Run two passes
    blocks_p1 = pass1_clean(blocks)
    final_blocks = pass2_sequence_dedup(blocks_p1)
    
    # Write back the cleaned blocks
    output_content = ""
    for j, (block_text, _) in enumerate(final_blocks):
        output_content += block_text
        if j < len(final_blocks) - 1:
            output_content += "\n\n"
            
    if not output_content.endswith("\n"):
        output_content += "\n"
        
    return output_content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python clean_markdown.py <file_or_directory>")
        sys.exit(1)
        
    target = sys.argv[1]
    if os.path.isfile(target):
        cleaned = clean_file(target)
        test_output = target + ".test.md"
        with open(test_output, "w", encoding="utf-8") as f:
            f.write(cleaned)
        print(f"Cleaned version written to: {test_output}")
    elif os.path.isdir(target):
        for root, dirs, files in os.walk(target):
            for file in files:
                if file.endswith(".md") and not file.endswith(".test.md") and file != "clean_markdown.py":
                    file_path = os.path.join(root, file)
                    cleaned = clean_file(file_path)
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(cleaned)
        print("All markdown files cleaned successfully.")
