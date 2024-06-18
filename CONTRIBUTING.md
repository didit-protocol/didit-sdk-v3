# Contributing to Didit-SDK

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with Github

We use Github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)

So all code changes happen through pull requests. Pull requests are the best way to propose changes to the codebase.

## All code changes are checked by CI

Ensure the test suite passes before you submit your changes. If you add new code, add tests.

## Setup for Development

(start listing the steps to setup the project for development here)

## Committing Changes

We use `commitlint` and `git-cz` to enforce a consistent commit style. This helps to keep the git history clean and readable.

### Commitlint

Our project uses the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) configuration with some additional types. The commit message should follow this format:

- `type`: This represents the kind of change that you're committing. It must be one of the following:

  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `build`: Changes that affect the build system or external dependencies
  - `ci`: Changes to our CI configuration files and scripts
  - `chore`: Other changes that don't modify src or test files
  - `revert`: Reverts a previous commit
  - `format`: Changes to code formatting (prettier etc.)

- `scope`: This is optional and can be anything specifying the place of the commit change.

- `subject`: A brief description of the change.

- `body`: A detailed description of the change.

- `footer`: Any additional information or metadata about the change (e.g., breaking changes, issues closed).

### git-cz

We use [git-cz](https://www.npmjs.com/package/@commitlint/cz-commitlint) to make creating commits that follow this format easier. we added a npm script to run `git-cz` you can use it.

Then, instead of `git commit`, you can use
`pnpm commit` or `pnpm git-cz`
to commit your changes. `git-cz` will prompt you to fill out any required commit fields at commit time.

### Code Formatting with Prettier

We use [Prettier](https://prettier.io/) to enforce a consistent code style across the project. This helps to avoid unnecessary formatting changes in commits and keeps the codebase clean and readable.

To ensure that all code is formatted according to our Prettier configuration before it's committed, we use a tool called [Husky](https://typicode.github.io/husky/) to add a `pre-commit` hook to our repository. This hook automatically runs Prettier on all staged files whenever you make a commit.

This means that you don't need to worry about manually running Prettier on your code before you commit it - Husky will take care of that for you. However, if you want to manually run Prettier on the entire codebase, you can do so with the following command:

`pnpm prettier:format`

> **NOTE:** Please make sure to install all dependencies including devDependencies to ensure Husky and Prettier are set up correctly.

## Publishing a New Version to npm

If you've made changes that require publishing a new version of the package, you'll need to follow these steps:

1. Make sure your changes are on a new branch created from the `v{latest}` branch, where `{latest}` is the latest version (e.g., `v1`, `v2`, `v3`, etc.).

2. Add a changeset by running `pnpm changeset`. This will prompt you to select the packages that should have a new version. After you've selected the packages, it will prompt you to decide if the new version should be `patch`, `minor`, or `major`. Finally, it will ask for a summary of the changes, which will be added to the changelog.

3. Commit the changeset. This will create a `.changeset` directory with your changeset files. Make sure to commit these files.

4. Create a new pull request to the `v{latest}` branch with your changes. (usually this pr should be created from `development` branch after pushlishing a test version and testing it)

Once the pull request is merged into the `v{latest}` branch, this will trigger the publishing workflow. The workflow will then create a release pull request or publish the package to npm, depending on the changes that have been made.

## How to propose changes

1. Create your branch from `v{latest}`, where `{latest}` is the latest version (e.g., `v1`, `v2`, `v3`, etc.).
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints.
5. Issue that pull request!

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
