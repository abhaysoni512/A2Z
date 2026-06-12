---
name: cpp-interview-fetcher
description: >
  Real-time C++ interview question fetcher keyed to chapter/topic structure in the user's notes.
  Trigger this skill whenever the user says "go to Chapter X", "fetch questions for Chapter X",
  "get interview questions on Chapter X", "Chapter X questions", or any phrase combining a chapter
  number/name with "questions", "interview", "practice", or "fetch". Also trigger when the user
  mentions a specific C++ topic (e.g., "fetch questions on smart pointers", "interview Qs on
  templates") even without a chapter reference. This skill parses the note's heading hierarchy
  (# Chapter, ## Topic, ### Sub-topic), constructs targeted web search queries per topic, fetches
  real interview questions from authoritative sources, and returns a structured, ready-to-study
  Q&A block. Use this aggressively — if there's any mention of C++ interview questions and a
  chapter or topic, this skill should fire.
---

# C++ Interview Question Fetcher — SKILL

## What This Skill Does

Given a chapter number or topic name from your C++ notes (structured as `# Chapter N: Title` /
`## Topic` / `### Sub-topic`), this skill:

1. **Locates** the relevant chapter section in your notes.
2. **Extracts** every `##` topic and `###` sub-topic under that chapter.
3. **Fires targeted web searches** for each topic — pulling real, up-to-date interview questions
   from authoritative C++ sources.
4. **Aggregates and deduplicates** questions across sources.
5. **Returns a structured Q&A block** in a format that mirrors your notes, ready to paste back in.

---

## Trigger Phrases (Examples)

| What the user says | What this skill does |
|---|---|
| `go to Chapter 10` | Fetches Qs for all topics in Chapter 10 |
| `fetch questions for Chapter 7` | Same — full chapter sweep |
| `Chapter 15: Templates interview questions` | Focused on that chapter + title hint |
| `get me questions on move semantics` | Topic-level fetch (no chapter number needed) |
| `interview questions on smart pointers and RAII` | Multi-topic fetch |
| `what are common questions on Chapter 12?` | Interprets as chapter-level fetch |

---

## Step 0 — Parse the Trigger

Extract from the user's message:

- `CHAPTER_NUM` — the integer (e.g., `10` from "Chapter 10"), if present.
- `CHAPTER_TITLE` — the title string after the colon in the `#` heading, if determinable.
- `EXPLICIT_TOPICS` — any topics named directly in the trigger (e.g., "move semantics", "templates").

If `CHAPTER_NUM` is present, proceed to Step 1.
If only `EXPLICIT_TOPICS` are present (no chapter number), skip to Step 3 using those topics directly.

---

## Step 1 — Locate the Chapter in the Notes

Open the user's notes file (ask for the path if unknown; default: `notes.md` or
`cpp_notes.md` in the repo root).

Scan for the heading:

```
# Chapter <CHAPTER_NUM>: <CHAPTER_TITLE>
```

**Regex pattern to match:**
```
^# Chapter\s+<CHAPTER_NUM>\s*[:\-–]?\s*(.*)
```

**If not found:**
- Report: `⚠️ Chapter <CHAPTER_NUM> not found in notes. Verify the file path or chapter number.`
- Offer to search by title keyword instead.
- Stop.

**If found:**
- Capture `CHAPTER_TITLE` (from the heading text, to the right of `:`)
- Capture the full chapter block: from this `#` heading to the next `#` heading (or EOF).

---

## Step 2 — Extract Topics and Sub-topics

Within the captured chapter block, extract in order:

```
TOPICS    = all lines matching  ^## (.+)
SUBTOPICS = all lines matching  ^### (.+)
```

Build a structured map:

```
Chapter N: <CHAPTER_TITLE>
  ├── Topic: <##-heading-1>
  │     ├── Sub-topic: <###-heading-a>
  │     └── Sub-topic: <###-heading-b>
  ├── Topic: <##-heading-2>
  ...
```

**If no `##` topics exist:**
- Use `CHAPTER_TITLE` alone as the single search target.
- Warn: `ℹ️ No ## topics found in Chapter <N> — searching by chapter title only.`

---

## Step 3 — Construct Web Search Queries

For **each topic** (and its sub-topics), generate the following search queries.
Run all queries concurrently where the tool supports it; otherwise run sequentially.

### Query Templates

Replace `{T}` with the topic/sub-topic name, `{CT}` with chapter title.

```
1. C++ {T} interview questions and answers
2. {T} C++ interview questions GeeksForGeeks
3. {T} C++ tricky interview questions 2024
4. {T} C++ frequently asked interview questions
5. {CT} {T} C++ interview questions site:interviewbit.com OR site:geeksforgeeks.org OR site:educative.io
```

For **sub-topics**, also fire:
```
6. C++ {T} {sub-topic} interview questions
7. {sub-topic} C++ interview questions
```

### Priority Sources (in order of trust)

1. `geeksforgeeks.org`
2. `interviewbit.com`
3. `educative.io`
4. `cppreference.com` (conceptual depth)
5. `stackoverflow.com` (Q&A threads tagged `[c++]`)
6. `learncpp.com` (where applicable)
7. GitHub discussion threads / awesome-cpp lists

### Sources to Deprioritize / Skip

- Random blog posts with no author attribution
- Sites with paywalled content (Udemy, LinkedIn Learning articles)
- Results older than 2020 unless the topic is fundamental (pre-C++11 basics)

---

## Step 4 — Fetch and Extract Questions

For each search result URL:

1. Fetch the page content.
2. Extract **question strings** — lines or items that:
   - End with `?`
   - Are preceded by a number or bullet in a list
   - Contain phrasing like "What is", "Explain", "How does", "Difference between",
     "What happens when", "Write a program to", "Output of this code"
3. Discard:
   - Duplicate questions (fuzzy-match: treat questions as duplicate if >80% word overlap)
   - Non-C++ questions (e.g., general OOP questions attributed to Java/Python)
   - Questions about deprecated pre-C++11 features *unless* chapter is explicitly about legacy C++

---

## Step 5 — Classify Each Question

Tag every question with:

| Tag | Criteria |
|---|---|
| `[CONCEPTUAL]` | Tests understanding of a concept, not code |
| `[CODE]` | Asks to write, trace, or debug code |
| `[OUTPUT]` | "What is the output of this snippet?" |
| `[COMPARE]` | "Difference between X and Y" |
| `[TRICK]` | Relies on subtle undefined behavior, edge case, or common misconception |
| `[DESIGN]` | System design or LLD angle on the topic |

Assign difficulty:

| Level | Criteria |
|---|---|
| `★☆☆` | Fundamental — expected from 0–1 year experience |
| `★★☆` | Intermediate — 1–3 years, requires nuanced understanding |
| `★★★` | Advanced — 3+ years, HFT/systems/embedded depth |

---

## Step 6 — Format the Output

Emit a fenced markdown block in the following structure.
**Mirror the user's existing heading hierarchy** so it can be pasted directly into their notes.

````markdown
---

## 🔍 Interview Questions Fetched: Chapter <N> — <CHAPTER_TITLE>
> Fetched: <ISO date>  |  Sources: GFG, InterviewBit, StackOverflow, Educative

---

### 📌 Topic: <## Topic Name>

#### Sub-topic: <### Sub-topic Name> _(if applicable)_

| # | Question | Type | Difficulty | Source |
|---|----------|------|------------|--------|
| 1 | What is ...? | `[CONCEPTUAL]` | ★☆☆ | GFG |
| 2 | Write a program that ... | `[CODE]` | ★★☆ | InterviewBit |
| 3 | What is the output of ...? | `[OUTPUT]` | ★★★ | StackOverflow |
| ... | | | | |

**💡 Key Concepts to Reinforce (from sources):**
- Bullet summary of recurring themes across all fetched questions for this topic

---

### 📌 Topic: <next ## topic>
...

---

## 📊 Chapter Summary
| Metric | Count |
|---|---|
| Total Questions Fetched | N |
| Conceptual | n |
| Code / Tracing | n |
| Output Prediction | n |
| Trick / Edge Case | n |
| ★☆☆ Easy | n |
| ★★☆ Medium | n |
| ★★★ Hard | n |
| Unique Sources Used | n |

> ⚠️ **Topics with no questions found:** <list any ## topics that returned 0 results>
> 💡 **Suggested manual search:** `C++ <topic> interview 2024 site:geeksforgeeks.org`
````

---

## Step 7 — Offer Follow-up Actions

After outputting the Q&A block, always append this action menu:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 What next?
  [A] Save this block into my notes under Chapter <N>
  [B] Drill me on these questions interactively (flashcard mode)
  [C] Fetch answers for all [CODE] questions
  [D] Fetch questions for another chapter
  [E] Filter: show only ★★★ questions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Handling

| Situation | Response |
|---|---|
| Chapter number not found in notes | Report clearly, offer to search by title keyword |
| No `##` topics in chapter | Use chapter title as sole search target; warn user |
| All searches return 0 results | Report which topics failed; suggest manual query |
| Source fetch blocked / rate-limited | Skip that source; note it in output; continue with others |
| Duplicate-heavy results (>60% overlap) | Deduplicate and report how many were collapsed |
| Notes file not found | Ask user to specify the file path explicitly |

---

## Configuration Block (Paste Into Your Notes File or `.github/copilot-instructions.md`)

Embed this block at the top of your notes file so the skill auto-detects your structure:

```yaml
# SKILL CONFIG: cpp-interview-fetcher
notes_structure:
  chapter_heading: "# Chapter {N}: {title}"
  topic_heading: "## {topic}"
  subtopic_heading: "### {subtopic}"

# ── Paths ──────────────────────────────────────────────────────────────────
notes_file:    "Notes/notes.md"             # source notes file
output_folder: "InterviewQuestions/"        # where fetched Q files are saved
output_naming: "Chapter_{N}_{title_slug}_Questions.md"
  # e.g.  Chapter_12_Smart_Pointers_Questions.md

# ── Search ─────────────────────────────────────────────────────────────────
search_sources:
  - geeksforgeeks.org
  - interviewbit.com
  - educative.io
  - stackoverflow.com
  - cppreference.com
  - learncpp.com
min_questions_per_topic: 5
max_questions_per_topic: 20
dedup_threshold: 0.80                        # 80% word-overlap = duplicate
include_code_snippets: true
difficulty_filter: "all"                     # Options: all | easy | medium | hard
```

---

## Full Worked Example

### User says:
```
go to Chapter 12
```

### Notes contain:
```markdown
# Chapter 12: Smart Pointers and Memory Management

## unique_ptr
### Ownership semantics
### Custom deleters

## shared_ptr
### Reference counting
### Circular reference problem

## weak_ptr
### Breaking cycles
```

### Skill executes:

**Extracted topics:**
- `unique_ptr` → sub-topics: `Ownership semantics`, `Custom deleters`
- `shared_ptr` → sub-topics: `Reference counting`, `Circular reference problem`
- `weak_ptr` → sub-topics: `Breaking cycles`

**Queries fired (sample):**
```
C++ unique_ptr interview questions and answers
unique_ptr C++ interview questions GeeksForGeeks
C++ unique_ptr ownership semantics interview questions
C++ shared_ptr interview questions and answers
shared_ptr circular reference C++ interview questions
C++ weak_ptr interview questions
```

**Output (truncated):**

```markdown
## 🔍 Interview Questions Fetched: Chapter 12 — Smart Pointers and Memory Management
> Fetched: 2025-08-14  |  Sources: GFG, InterviewBit, StackOverflow

---

### 📌 Topic: unique_ptr

#### Sub-topic: Ownership semantics

| # | Question | Type | Difficulty | Source |
|---|----------|------|------------|--------|
| 1 | What is `std::unique_ptr` and how does it differ from a raw pointer? | `[CONCEPTUAL]` | ★☆☆ | GFG |
| 2 | Can you copy a `unique_ptr`? Why or why not? | `[CONCEPTUAL]` | ★☆☆ | InterviewBit |
| 3 | How do you transfer ownership of a `unique_ptr`? | `[CODE]` | ★★☆ | GFG |
| 4 | What is the output of this code? `auto p = make_unique<int>(5); auto q = p;` | `[OUTPUT]` | ★★☆ | StackOverflow |

...

### 📊 Chapter Summary
| Metric | Count |
|---|---|
| Total Questions Fetched | 34 |
| Conceptual | 14 |
| Code / Tracing | 11 |
| Output Prediction | 6 |
| Trick / Edge Case | 3 |
| ★☆☆ Easy | 10 |
| ★★☆ Medium | 18 |
| ★★★ Hard | 6 |
```

---

## Placement in Your Repo

```
your-repo/
├── Notes/
│   └── notes.md                                      ← your C++ notes (source)
├── InterviewQuestions/
│   ├── Chapter_10_<title>_Questions.md               ← auto-created per chapter
│   ├── Chapter_12_Smart_Pointers_Questions.md
│   └── ...
├── skills/
│   └── cpp_interview_fetcher_SKILL.md                ← THIS FILE
└── .github/
    └── copilot-instructions.md                       ← wires everything together
```

---

*Skill version: 1.0.0 | Designed for: GitHub Copilot (with web search) + Claude Sonnet 4*