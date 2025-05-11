# Git Fundamentals

## Introduction

Git is a distributed version control system that allows you to track changes in your code, collaborate with others, and maintain a history of your project. This lesson covers the essential Git skills you'll need as a software developer.

## Core Concepts

### What is Version Control?

Version control is a system that records changes to files over time so that you can recall specific versions later. Git is one of the most popular version control systems, and it's designed to handle everything from small to very large projects with speed and efficiency.

### Git Workflow

The basic Git workflow consists of these steps:

1. **Initialize** a repository or clone an existing one
2. Make changes to files
3. **Stage** the changes to prepare them for commit
4. **Commit** the changes to save them in the repository
5. **Push** the changes to a remote repository (if applicable)

### Key Git Commands

Here are some of the most important Git commands you'll use:

| Command | Description |
|---------|-------------|
| `git init` | Creates a new Git repository |
| `git clone` | Creates a local copy of a remote repository |
| `git add` | Adds files to the staging area |
| `git commit` | Records changes to the repository |
| `git status` | Shows the status of modified files |
| `git log` | Shows commit history |
| `git branch` | Lists, creates, or deletes branches |
| `git checkout` | Switches branches or restores files |
| `git merge` | Merges changes from different branches |
| `git pull` | Fetches and merges changes from a remote repository |
| `git push` | Uploads local repository content to a remote repository |

## Branching Strategies

Branching is a powerful feature that allows you to diverge from the main line of development and continue to work without affecting the main line.

### Common Branching Models

#### Feature Branching

In this model, each new feature is developed in a dedicated branch. Once the feature is complete, it's merged back into the main branch (often called `main` or `master`).

```
main ---*---*---*---*---*---
         \         /
          *---*---*
         feature branch
```

#### Git Flow

Git Flow is a more comprehensive branching model with dedicated branches for features, releases, and hotfixes.

```
master    ---*-------------------*---
            /                     \
develop   -*---*---*---*---*---*---*---
           \     \         /
            \     *---*---*
             \    feature branch
              \
               *---*---*
              hotfix branch
```

## Best Practices

### Commit Messages

Good commit messages are crucial for maintaining a clear history of your project. Follow these guidelines:

1. Use the imperative mood ("Add feature" not "Added feature")
2. Keep the first line under 50 characters
3. Provide more detailed explanations in subsequent lines if necessary
4. Reference issue numbers if applicable

Example of a good commit message:
```
Add user authentication system

- Implement login and registration forms
- Add password hashing and validation
- Create session management system

Fixes #42
```

### Git Ignore

Use a `.gitignore` file to exclude files that shouldn't be tracked by Git, such as:

- Build artifacts
- Dependencies and packages
- Environment configuration files
- System files and temporary files
- Personal IDE settings

Example `.gitignore` for a Node.js project:
```
# Dependencies
node_modules/
npm-debug.log

# Build output
dist/
build/

# Environment variables
.env
.env.local

# System files
.DS_Store
Thumbs.db

# IDE settings
.idea/
.vscode/
*.sublime-project
```

## Solo Developer Workflow

As a solo developer working on internal tools, your Git workflow might be simpler, but it's still important to follow good practices:

1. **Create specific branches** for features or bug fixes
2. **Commit frequently** with descriptive messages
3. **Review your own code** before merging
4. **Maintain a clean history** by rebasing when appropriate
5. **Tag releases** for easy reference

## Exercises

Complete the following exercises to practice your Git skills:

1. Initialize a Git repository and make your first commit

<details>
<summary>💡 Hint 1</summary>

Use `git init` in your project directory to create a new repository, then `git add .` to stage all files, and `git commit -m "Initial commit"` to create your first commit.
</details>

<details>
<summary>💡 Hint 2</summary>

After initializing, create a simple file (like README.md) so you have something to commit. Don't forget to check status with `git status` to see what's staged.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Forgetting to stage files before committing
- Creating a git repository inside an existing git repository
- Using unclear commit messages
</details>

2. Create and switch between branches

<details>
<summary>💡 Hint 1</summary>

Use `git branch feature-branch` to create a branch and `git checkout feature-branch` to switch to it. Alternatively, use the shortcut `git checkout -b feature-branch` to do both in one command.
</details>

<details>
<summary>💡 Hint 2</summary>

Use `git branch` to list all branches and see which one you're currently on (marked with an asterisk).
</details>

3. Merge branches with and without conflicts

<details>
<summary>💡 Hint 1</summary>

To create a merge without conflicts: make changes in your feature branch, commit them, switch back to main with `git checkout main`, then use `git merge feature-branch`.
</details>

<details>
<summary>💡 Hint 2</summary>

To practice resolving conflicts: modify the same file in both branches, then attempt to merge. Git will show conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) that you'll need to resolve manually.
</details>

<details>
<summary>📝 Solution Guidelines</summary>

A successful merge should:
- Preserve the intended changes from both branches
- Have all conflicts properly resolved
- Include a meaningful merge commit message (if not fast-forwarded)
</details>

4. Use Git diff to review changes

<details>
<summary>💡 Hint 1</summary>

Use `git diff` to see unstaged changes, `git diff --staged` to see staged changes, and `git diff branch1..branch2` to compare branches.
</details>

5. Rebase and squash commits

<details>
<summary>💡 Hint 1</summary>

To rebase your feature branch onto the latest main: `git checkout feature-branch` then `git rebase main`.
</details>

<details>
<summary>💡 Hint 2</summary>

To squash multiple commits into one: `git rebase -i HEAD~3` (for the last 3 commits). In the interactive editor, change `pick` to `squash` or `s` for the commits you want to combine.
</details>

<details>
<summary>⚠️ Warning</summary>

Never rebase commits that have been pushed to shared repositories unless you're absolutely sure no one else is working with them, as it rewrites history.
</details>

## Additional Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [Git Branching Interactive Tutorial](https://learngitbranching.js.org/)
- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)
