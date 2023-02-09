## Play here: http://loganbussell.com/global-game-jam-2023/

Branching out into the world of the dirt, in Become Tree, you'll grow roots how you see fit to get the most nutrients you can. With every successful gathering of nutrients, you'll trade them in for not only root upgrades, but above-world tree improvements too. Find out what it takes to be a tree for the forest and grow the best tree you can. Available in your browser (http://loganbussell.com/global-game-jam-2023/). How to play: Use your MOUSE to direct your roots in any direction you want. LEFT CLICK to confirm and grow the root. Reach for NUTRIENTS like Water, Potassium, and Glucose while idly gathering Sunlight as your tree thrives. When your root is touching a nutrient, it will gather it and add to your total resources, shown on the right of the screen. During the day, your sunlight levels will go up, while you water and all other levels will go down. At night, your sunlight levels will also go down. Keep up with your rapidly reducing nutrients by growing your root quickly and splitting it off in different directions to reach more nutrients. Survive until WINTER to win!

https://globalgamejam.org/2023/games/good-things-come-trees-8

## Credits: 
![image](https://user-images.githubusercontent.com/6265129/217702069-58999dbc-b4bb-49b4-898d-d56edaf8d8f1.png)

**Logan Bussell:** Engineering

**Eli Goldin:**    Game Design

**Hollis Lehv:**   Art, Engineering

**Brian Ma:**      Music, Engineering

**Nina Navazio:**  Writing

**Shane Rhoads:**  Engineering

**Jason Thiel:**   Engineering, Game Design



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
