## Prerequisites
- Node.js ([v20.1.0](https://nodejs.org/dist/v20.1.0/) or later; v20.1.0 is currently used for development)
- [Git](https://git-scm.com/downloads) (any version should work)

## Fork and Clone the Repository
1. [Fork AutoHotPie](https://github.com/dumbeau/AutoHotPie/fork) on GitHub.
2. Clone your fork of the repository to your local machine.
   - You could check the [GitHub documentation](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) for more information.

## Install Dependencies
Open a terminal in the root directory of the repository and run the following command:
```npm install```, this will install all the necessary dependencies in your local folder.

## Compile and Run
For development purposes, you can run the following command in the root directory of the repository:
```npm run electron:local```, this will compile and run the application.

For production purposes, you can run the following command in the root directory of the repository:
```npm run electron:build```, this will compile the application and create an executable file in the `dist` folder.
