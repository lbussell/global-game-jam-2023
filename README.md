Live site: http://loganbussell.com/global-game-jam-2023/

## Setup

### Option 1: Native

1. Install Node: https://nodejs.org
    - Windows 11: `winget install OpenJS.NodeJS.LTS`
    - Mac/Linux/Older Windows: [Follow instructions here](https://nodejs.org/en/download/package-manager/)
2. Install yarn

    `npm install -g yarn`

3. Install Dependencies

    `yarn install`

4. Run dev server

    `yarn dev`

### Option 2: Dev Container

1. Install Docker: https://www.docker.com/products/docker-desktop/
2. Install VS Code: https://code.visualstudio.com/
3. Install Dev Container extension: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
4. Press CTRL-SHIFT-P or F1 and type and select "Dev Containers: Reopen in Container". It will take a while but eventually you will have a fully configured environment with an auto-reloading server.


| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `yarn install` | Install project dependencies                             |
| `yarn dev`     | Builds project and open web server, watching for changes |
| `yarn build`   | Builds code bundle with production settings              |
| `yarn serve`   | Run a web server to serve built code bundle              |
| `yarn clean`   | Clean up dependencies (do this when switching between local and container dev environments)              |

## Production

After running `yarn build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `yarn serve` and navigate to http://localhost:5000
