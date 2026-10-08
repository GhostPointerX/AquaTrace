# Contributing to AquaTrace

First off, thank you for considering contributing to AquaTrace! It's people like you that make AquaTrace such a powerful tool for maritime attribution and environmental safety.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/GhostPointerX/AquaTrace/issues) first to see if someone else has already created it. If not, feel free to open a new issue using one of our templates!

## Fork & create a branch

If this is something you think you can fix, then fork AquaTrace and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-attribution-feature
```

## Get the test suite running

Make sure all services are working locally:
1. Ensure the Node.js server runs via `npm start`.
2. Ensure the Python engine executes without error via `python run_attribution.py`.
3. Check the frontend for console errors.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with AquaTrace's master branch:

```sh
git remote add upstream https://github.com/GhostPointerX/AquaTrace.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-new-attribution-feature
git rebase master
git push --set-upstream origin 325-add-new-attribution-feature
```

Finally, go to GitHub and make a Pull Request! Please use the provided PR template to explain your changes.
