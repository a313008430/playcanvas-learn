import eventMap from "./core/eventMap";
import GameEntity from "./core/gameEntity";

class App {
  event: pc.EventHandler = new pc.EventHandler();
  app: pc.Application | null = null;
  constructor() {
    const canvas = document.querySelector("#canvas") as HTMLCanvasElement,
      app = new pc.Application(canvas, {
        mouse: new pc.Mouse(document.body),
        touch: new pc.TouchDevice(document.body),
      });
    // app.start();
    this.app = app;
    new pc.MiniStats(app);

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    //
    window.addEventListener("resize", () => {
      app.resizeCanvas(canvas.width, canvas.height);
      this.event.fire(eventMap.resize);
    });

    var assetManifest = [
      //   {
      //     type: "model",
      //     url: "../assets/models/statue/statue.json",
      //   },
      {
        type: "script",
        url: "./lib/orbit-camera.js",
      },
    ];

    // Load all assets and then run the example
    var assetsToLoad = assetManifest.length;
    assetManifest.forEach((entry: any) => {
      app.assets.loadFromUrl(entry.url, entry.type, (err, asset) => {
        if (!err && asset) {
          assetsToLoad--;
          entry.asset = asset;
          if (assetsToLoad === 0) {
            this.run();
          }
        }
      });
    });

    //create box entity
    // let box = new GameEntity("etete");
    // box.addComponent("model", <pc.ModelComponent>{ type: "box" });
    // app.root.addChild(box);

    //create camera entity
    // const camera = new pc.Entity("camera");
    // camera.addComponent("camera", { clearColor: new pc.Color(0.1, 0.1, 0.1) });
    // app.root.addChild(camera);
    // camera.setPosition(0, 0, 3);
    //create directional light entity
    // const light = new pc.Entity("light");
    // light.addComponent("light");
    // app.root.addChild(light);
    // light.setEulerAngles(50, 0, 0);

    // rotate the box according to the delta time since the last frame
    // app.on("update", (dt) => box.rotate(10 * dt, 20 * dt, 30 * dt));
  }

  run() {
    // let box = new GameEntity("etete");
    // box.addComponent("model", <pc.ModelComponent>{ type: "box" });
    let app = this.app!;
    // this.app?.root.addChild(box);
    // // Create a camera with an orbit camera script
    var camera = new pc.Entity();
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.4, 0.45, 0.5),
    });
    camera.addComponent("script");
    camera.script!.create("orbitCamera", {
      attributes: {
        inertiaFactor: 0.2, // Override default of 0 (no inertia)
      },
    });
    camera.script!.create("orbitCameraInputMouse");
    camera.script!.create("orbitCameraInputTouch");
    this.app?.root.addChild(camera);

    // Create a directional light
    var light = new pc.Entity();
    light.addComponent("light", {
      type: "directional",
    });
    this.app?.root.addChild(light);
    light.setLocalEulerAngles(45, 30, 0);

    this.app?.start();

    // glTF scene root that rotates

    // this.app?.assets.loadFromUrl("res/Soldier.glb", "binary", function (err: any, asset: any) {
    //   var json = asset.resource;
    //   // var gltf = JSON.parse(json);
    //   loadGltf(
    //     json,
    //     app.graphicsDevice,
    //     function (err: any, res: any) {
    //       // add the loaded scene to the hierarchy
    //       var gltfRoot = new pc.Entity();
    //       gltfRoot.addComponent("script");
    //       gltfRoot.script?.create("rotate");
    //       // gltfRoot.rotate(10, 20, 30);
    //       app.root.addChild(gltfRoot);
    //       gltfRoot.addComponent("model");
    //       gltfRoot.model!.model = res.model;

    //       // for (let x = 0; x < 20; x++) {
    //       //   gltfRoot = gltfRoot.clone();
    //       //   gltfRoot.rotate(10 * x, 20 * x, 30 * x);
    //       //   app.root.addChild(gltfRoot);
    //       // }
    //     },
    //     {
    //       basePath: "/res/",
    //     }
    //   );
    // });

    // app.assets.loadFromUrl("res/Soldier.glb", "binary", function (err: any, asset: any) {
    //   var glb = asset.resource;
    //   loadGlb(glb, app.graphicsDevice, function (err: any, res: any) {
    //     // Wrap the model as an asset and add to the asset registry
    //     var asset = new pc.Asset("gltf", "model", {
    //       url: "",
    //     });
    //     // console.log(res);
    //     asset.resource = res.model;
    //     asset.loaded = true;
    //     app.assets.add(asset);

    //     // Add the loaded scene to the hierarchy
    //     var gltf = new pc.Entity("gltf");
    //     gltf.addComponent("model", {
    //       asset: asset,
    //     });
    //     console.log(asset);

    //     // var animationClips = res.animations;

    //     // Load any animations
    //     // if (animationClips && animationClips.length > 0) {
    //     // this.animationClips = animationClips;

    //     // If we don't already have an animation component, create one.
    //     // Note that this isn't really a 'true' component like those
    //     // found in the engine...
    //     //   if (!gltf.animation) {
    //     //     gltf.animation = new pc.AnimationComponent(new pc.AnimationComponentSystem(app), gltf);
    //     //   }

    //     //   // Add all animations to the model's animation component
    //     //   for (let i = 0; i < animationClips.length; i++) {
    //     //     animationClips[i].transferToRoot(gltf);
    //     //     gltf.animation?.addClip(animationClips[i]);
    //     //   }
    //     //   ç;
    //     //   gltf.animation?.curClip = animationClips[0].name;

    //     //   console.log(animationClips.length + " animation clips loaded");
    //     // }

    //     // var clip = gltf.animation.getCurrentClip();
    //     // clip.play();

    //     // //   add animation
    //     // let ccc = gltf.addComponent("animation", <pc.AnimationComponent>{
    //     //   // assets: [anim],
    //     //   activate: true,
    //     //   loop: true,
    //     //   currentTime: 1,
    //     //   // animations: res.animations,
    //     //   assets: [res.textures],
    //     //   speed: 0.8,
    //     // }) as pc.AnimationComponent;
    //     // // ccc.assets = res.textures;
    //     // ccc.add
    //     // ccc.play("Run");
    //     // console.log(ccc);

    //     app.root.addChild(gltf);
    //   });
    // });

    app.assets.loadFromUrlAndFilename("res/Soldier.glb", "", "container", function (
      err,
      asset: any
    ) {
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
            ani.play("Soldier.glb/animation/3", 1);
          }, 1);
        }
        app.root.addChild(gltf);
        console.log(gltf)
      }
      
    });
  }
}
export default new App();
