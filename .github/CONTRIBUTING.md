# Contributing

First off, thank you for taking the time to contribute to the Stacks ecosystem ❤️

> **Note**
> The likelihood is high that the repo you are working on is either a Stack or Stacks itself. In both cases, you will be exposed to a meshup of technologies, like [Vue][vue], [Vite][vite], [Tauri][tauri], [Nitro][nitro], and [Bun][bun].

## 💭 Knowledge

### TypeScript

It's important to note early on that these projects are written with [TypeScript][typescript]. If you're unfamiliar with it (or any strongly typed languages such as Java) then this may feel like a slight roadblock. However, there's never a truly perfect time to start learning it, so ... why not today using well-written codebases as your playground?

_Don't be discouraged. You will get by learning TypeScript on-the-fly as you review some of the examples within the codebase. It's easy to get started—the code is, we hope, very approachable (and readable)._

### Architecture

An understanding of the framework architecture and design will help if you're looking to contribute long-term, or if you are working on a "more complex" PR. Browse the source and read our documentation to get a better sense of how it is structured. The documentation is very thorough and can be used as your progressive guide as you're learning more about Stacks.

Feel free to ask any question _(Twitter, Discord, or GitHub Discussions)_, we would love to elaborate & collaborate.

### Stacks/Core Setup

Are you interested in contributing to the Stacks codebase?

**Working on your first Pull Request?** You can learn how from this free series [How to Contribute to an Open Source Project on GitHub][pr-beginner-series].

Head over to the [repository][stacks] on GitHub and click the Fork button in the top right corner. After the project has been forked, run the following commands in your terminal:

```bash
# Replace {github-username} with your GitHub username.
git clone https://github.com/{github-username}/stacks --depth=1

cd stacks

# Create a branch for your PR, replace {issue-no} with the GitHub issue number.
git checkout -b issue-{issue-no}
```

Now it'll help if we keep our `main` branch pointing at the original repository and make
pull requests from the forked branch.

```bash
# Add the original repository as a "remote" called "upstream".
git remote add upstream git@github.com:stacksjs/stacks.git

# Fetch the git information from the remote.
git fetch upstream

# Set your local main branch to use the upstream main branch whenever you run `git pull`.
git branch --set-upstream-to=upstream/main main

# Run this when we want to update our version of main.
git pull
```

_You may also use GitHub Desktop or any other GUI—if that is your preference._

## 🧪 Testing

Tests are stored within the `./tests` project folder. You can run the tests using the following command:

```bash
bun run test
```

Please make sure tests are added for all added & changed functionalties.

## ✍️ Commit

Stacks uses [semantic commit messages][semantic-commit-style] to automate package releases. No worries, you may not be aware what this is or how it works—just let Buddy guide you.  Stacks automated the commit process for you, simply run `buddy commit` in your terminal and follow the instructions.

For example,

```bash
# Add all changes to staging to be committed.
git add .

# Commit changes.
buddy commit

# Push changes up to GitHub.
git push
```

_By following these minor steps, Stacks is able to automatically release new versions & generate relating local & remote changelogs._

## 🎉 Pull Request

When you're all done, head over to the [repository][stacks], and click the big green `Compare & Pull Request` button that should appear after you've pushed changes to your fork.

Don't expect your PR to be accepted immediately or even accepted at all. Give the community time to vet it and see if it should be merged. Please don't be disheartened if it's not accepted. Your contribution is appreciated more than you can imagine, and even a unmerged PR can teach us a lot ❤️

[typescript]: https://www.typescriptlang.org
[vue]: https://vuejs.org/
[vite]: https://vitejs.dev/
[tauri]: https://tauri.app/
[nitro]: https://nitro.unjs.io/
[bun]: https://bun.sh/
[stacks]: https://github.com/stacksjs/stacks
[semantic-commit-style]: https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
[pr-beginner-series]: https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
