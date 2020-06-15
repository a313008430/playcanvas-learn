import "./index.scss";

//引用开发测试库，
Object.assign(global, { pc: {} });
import "./lib/config.m.js";
import "./lib/playcanvas.prf.js";

import "./lib/events.js";
import "./lib/playcanvas-extras.js";
import "./lib/fame.js";

import { Game } from "./src/game";

const game = new Game();

window["editor"].emit("load", { app: game.app });
