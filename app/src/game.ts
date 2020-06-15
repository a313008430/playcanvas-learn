import GameEntity from "./core/gameEntity";
import { OrbitCamera, OrbitCameraInputMouse, OrbitCameraInputTouch } from "./lib/orbit-camera";

import glb from "../resouces/Soldier.glb";

export class Game {
	event: pc.EventHandler = new pc.EventHandler();
	app: pc.Application | null = null;
	constructor() {
		console.log(glb);
		const canvas = document.querySelector("#canvas") as HTMLCanvasElement,
			app = new pc.Application(canvas, {
				mouse: new pc.Mouse(document.body),
				touch: new pc.TouchDevice(document.body),
			});
		app.start();
		this.app = app;
		//性能面板，小面板
		new pc.MiniStats(app);
		//创建一个可转动的摄像机
		this.OrbitCamera(app);

		// fill the available space at full resolution
		app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
		app.setCanvasResolution(pc.RESOLUTION_AUTO);
		//
		window.addEventListener("resize", () => {
			app.resizeCanvas(canvas.width, canvas.height);
			//   this.event.fire(eventMap.resize);
		});

		// this.run();

		//create box entity
		// let box = new GameEntity("etete");
		// box.addComponent("model", <pc.ModelComponent>{ type: "box" });
		// app.root.addChild(box);

		// //create camera entity
		// const camera = new pc.Entity("camera");
		// camera.addComponent("camera", { clearColor: new pc.Color(0.1, 0.1, 0.1) });
		// app.root.addChild(camera);
		// camera.setPosition(0, 0, 3);
		// // create directional light entity
		// const light = new pc.Entity("light");
		// light.addComponent("light");
		// app.root.addChild(light);
		// light.setEulerAngles(50, 0, 0);

		// rotate the box according to the delta time since the last frame
		// app.on("update", (dt) => box.rotate(10 * dt, 20 * dt, 30 * dt));
	}

	run() {
		let app = this.app!;
		// Create a directional light
		var light = new pc.Entity();
		light.addComponent("light", {
			type: "directional",
		});
		this.app?.root.addChild(light);
		light.setLocalEulerAngles(45, 30, 0);

		this.app?.start();

		app.assets.loadFromUrlAndFilename(glb, "", "container", function (err, asset: any) {
			for (let x = 0; x < 1; x++) {
				var gltf = new pc.Entity("gltf");
				// // Add the loaded scene to the hierarchy
				gltf.addComponent("model", {
					asset: asset.resource.model,
				});
				if (asset.resource.animations.length > 0) {
					let ani: any = gltf.addComponent("animation", <pc.AnimationComponent>{
						assets: asset.resource.animations,
					});
					setTimeout(() => {
						ani.play(glb + "/animation/3", 1);
					}, 1);
				}
				app.root.addChild(gltf);
				// console.log(gltf);
			}
		});
	}

	/**
	 * 创建一个可转动的摄像机
	 * @description 测试开发环境中用，一个可自由拖动的视图摄像机
	 */
	private OrbitCamera(app: pc.Application) {
		// Create a camera with an orbit camera script
		var camera = new pc.Entity();
		camera.addComponent("camera", { clearColor: new pc.Color(0.5, 0.5, 0.5) });
		camera.addComponent("script");
		pc.registerScript(OrbitCamera, "OrbitCamera");
		camera.script!.create("OrbitCamera");
		pc.registerScript(OrbitCameraInputMouse, "OrbitCameraInputMouse");
		camera.script!.create(OrbitCameraInputMouse);
		pc.registerScript(OrbitCameraInputTouch, "OrbitCameraInputTouch");
		camera.script!.create(OrbitCameraInputTouch);
		app.root.addChild(camera);
	}
}
