---
title: "Twenty-one hours, thirty-nine PDFs, zero GPU"
description: "Extracting text from ~39 image-only Grok chat-export PDFs into Obsidian-vault markdown via a local CPU-only vision model. Three Windows-specific bugs worth writing down."
pubDate: 2026-07-17
tags: ["rebuild", "infra"]
mode: "hobart"
series: ["claude"]
tool: "claude-code"
era: "2026-fleet"
session: "Sxxx"
kind: "debug-story"
draft: false
---

> Thirty-nine image-only PDFs. ~21 hours of CPU time on a workstation with no GPU. Three Windows-specific bugs, each of which silently killed hours of progress before I caught them. Final result: ~313 KB of searchable text across ~638 conversation turns, all processed locally, none of it sent to a cloud API.

## What I was trying to do

I had ~39 Grok chat exports sitting in a downloads folder. Image-only PDFs — the kind Grok produces when you export a conversation. Dead data on disk: I couldn't search them, couldn't browse them, couldn't point future tooling at them.

The goal was to OCR the lot into structured markdown in an Obsidian vault. Phase 1 was just that: extract text, write `.md` files with frontmatter, done. Phase 2 (a RAG knowledge base) and Phase 3 (a search tool for the agent fleet) were explicitly deferred — the corpus shape just needed to support them later, no rework.

The non-negotiable constraint was local-only. My own conversations, my own research notes, my own unfinished thinking. Cloud vision APIs were off the table. That meant the only path was a local Ollama vision model on whatever hardware I had.

## What I expected

The plan estimated 15-45 minutes of total runtime. The math behind that estimate assumed something I hadn't verified: that I had a GPU somewhere on the fleet.

I didn't.

Every machine I run is CPU-only. The workstation I was doing this on has an Intel Iris Xe integrated GPU — 2GB, shared with the CPU, not a CUDA device in any useful sense. The vision model I'd picked (`minicpm-v:latest`, a 7.6B Q4_0 quantization) runs entirely on CPU. Per-page inference time on this hardware: 400-490 seconds.

Thirty-nine PDFs at roughly five pages each at roughly 450 seconds per page is about 21 hours of wall-clock. The original 15-45 minute estimate was off by roughly 30x.

## What actually happened

The pipeline itself was simple and worked on the first try: render each PDF page to PNG with `pdftoppm`, send the PNG to Ollama with a structured prompt, parse the response, write the markdown with YAML frontmatter. Stdlib Python, one file, resume-safe.

The pipeline wasn't the problem. The environment was. Three things killed me, each in a different way.

The first was a timeout. The default Ollama client timeout was 120 seconds, and I'd bumped it to 300 seconds to be safe. Both numbers were too low. Somewhere around the third PDF, the model started "refusing" to extract certain pages — returning empty or error responses for images that obviously contained text. I spent an hour assuming this was a prompt-engineering problem, tweaking the system message, simplifying the output format. None of it helped.

The actual diagnosis came when I ran one of the "refused" pages manually with a 900-second timeout and got 5958 characters of coherent text back. The model wasn't refusing anything. It was timing out mid-inference and the client was interpreting the cutoff as an empty response. Same image, same prompt, same model, different timeout: full extraction.

I bumped the timeout to 900 seconds and the "refusals" stopped existing. The lesson, carved into memory: when a local model produces empty output, suspect the timeout before you suspect the prompt.

The second was background process survival. A 21-hour job isn't something you babysit. I started it with `nohup python extract.py &` from a Git Bash shell, closed the shell, came back four hours later, and found the process had died the moment the shell exited.

`nohup` on Git Bash for Windows does not actually detach. The Unix semantics don't translate. The process inherits the bash session's lifetime and dies with it. The fix was PowerShell:

```
powershell.exe Start-Process -FilePath py.exe `
  -ArgumentList extract.py -WindowStyle Hidden -PassThru
```

That actually detaches. The process survives the parent shell closing, survives logout, survives everything except a reboot.

The third was Windows sleep. Even with the process detached and the timeout bumped, I lost 3.5 hours overnight when Windows suspended the process because I'd walked away from the machine. Power management on Windows is aggressive about background CPU when the user is idle, and a long-running Python OCR job looks exactly like a background task worth suspending.

The fix is a single Windows API call near the top of the script:

```python
if sys.platform == "win32":
    import ctypes
    ctypes.windll.kernel32.SetThreadExecutionState(
        0x80000000 | 0x00000001  # ES_CONTINUOUS | ES_SYSTEM_REQUIRED
    )
```

Two flags, one line, no admin privileges required. The state auto-clears when the process exits. After adding it, the job ran uninterrupted through overnight idle.

## The dig

Each bug had the same shape: the system was doing something reasonable in a way that was wrong for this workload. Timeouts protect the client from hanging on dead models. Session-bound processes prevent orphaned children. Sleep saves power. All correct defaults. All catastrophic for a 21-hour CPU-bound OCR job.

What made the dig slow was that each bug masqueraded as something else. The timeout looked like a model refusal. The session-attached process looked like a flaky script. The sleep suspension looked like the model had hung. None announced themselves. Each required stepping back from the assumed cause and asking what the operating environment was actually doing.

## What shipped

Final run summary: 39/39 PDFs extracted. Zero failures, zero "needs review" flags. ~313 KB of searchable text across ~638 conversation turns, organized into seven archive groups by source.

Each markdown file has YAML frontmatter recording the source PDF, extraction timestamp, model used, page count, and character count. A pre-flight byte-identical backup of every PDF sits in a backup directory, verified with `diff -rq` against the originals after the run.

Two pre-existing markdown files in one of the source folders were passed through untouched rather than re-OCRed — they were already text.

One extraction came out thin (~52 body characters from a source that was probably just a fragment). Flagged in the archive README. Not worth re-extracting unless the content matters.

The corpus is now shaped to support Phase 2 (upload to a knowledge base for RAG) and Phase 3 (a search tool exposed to the agent fleet) without any rework. Both are deferred.

## The lesson

Hardware constraints are planning inputs, not footnotes. I built a 15-minute estimate around a GPU that didn't exist and shipped a 21-hour job instead. The local-first property was worth the runtime cost — my own conversations stay on my own disk — but the cost was 30x what I'd planned for, and the planning error was entirely avoidable. Verify the hardware before you estimate the runtime.
