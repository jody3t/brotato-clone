# Team Kernel

---

## Initialization

**First turn + re-read as needed.** Before responding, read:
- `_kernel-project/threads/_index.md` + `_kernel-project/concepts/_index.md`
- `_kernel-project/code-architecture.md` (if it exists)
- `_kernel-team/threads/_index.md` + `_kernel-team/concepts/_index.md`
- `_kernel-user/threads/_index.md` + `_kernel-user/concepts/_index.md`
- Plan docs at kernel roots if they exist (`*-plan.md`)

---

## Architecture

- **Hot** (CLAUDE.md) → behavioral rules only. **Warm** (indexes, code-architecture) → load on start, re-read freely. **Cold** (archive/, raw/) → never auto-load.
- **CLAUDE.md files are expensive.** Every word loads every turn. Reference content belongs in concepts/templates (warm). Only behavioral rules and pointers stay hot.

---

## Delegation

- **Prefer subagents for scoped work.** If a task has clear inputs, outputs, and boundaries, delegate it.
- **Model selection:** Sonnet for mechanical tasks. Opus for judgment, architecture, nuanced code.
- **Brief well.** Point subagents to specific files and plans.

---

## Rules

- Git in subdirs: `cd path && git command` (not `git -C`)
- Kernel-managed skills/agents live in kernel `.claude/` folders.
- No emojis unless requested
- No references to chat conversations in git comments

---

**Privacy:** Never use real names of humans. Use `{user}`, `Speaker`, etc.
