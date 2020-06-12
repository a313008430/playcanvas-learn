var config = {
  self: {
    id: 220277,
    username: "xsmaile",
    branch: { id: "65ce8bea-723e-4b67-808c-1fa2179ccb21" },
    locale: "en-US",
  },
  project: {
    id: 644197,
    repositoryUrl: "/api/projects/644197/repositories/directory/sourcefiles",
    scriptPrefix: "/api/files/code/644197/directory",
    settings: {
      id: "project_644197",
      itemId: "project_644197",
      antiAlias: true,
      fillMode: "FILL_WINDOW",
      resolutionMode: "AUTO",
      width: 1280,
      height: 720,
      use3dPhysics: false,
      preferWebGl2: true,
      preserveDrawingBuffer: false,
      transparentCanvas: false,
      useDevicePixelRatio: false,
      useLegacyScripts: false,
      vr: false,
      scripts: [24085909, 24085910, 24085911, 24085912],
      loadingScreenScript: null,
      externalScripts: [],
      batchGroups: {},
      layers: {
        "0": { name: "World", opaqueSortMode: 2, transparentSortMode: 3 },
        "1": { name: "Depth", opaqueSortMode: 2, transparentSortMode: 3 },
        "2": { name: "Skybox", opaqueSortMode: 0, transparentSortMode: 3 },
        "3": { name: "Immediate", opaqueSortMode: 0, transparentSortMode: 3 },
        "4": { name: "UI", opaqueSortMode: 1, transparentSortMode: 1 },
      },
      layerOrder: [
        { layer: 0, transparent: false, enabled: true },
        { layer: 1, transparent: false, enabled: true },
        { layer: 2, transparent: false, enabled: true },
        { layer: 0, transparent: true, enabled: true },
        { layer: 3, transparent: false, enabled: true },
        { layer: 3, transparent: true, enabled: true },
        { layer: 4, transparent: true, enabled: true },
      ],
      i18nAssets: [],
      useKeyboard: true,
      useMouse: true,
      useTouch: true,
      useGamepads: false,
    },
    hasReadAccess: true,
  },
  scene: { uniqueId: "845665" },
  scenes: [{ name: "game", url: "845665.json" }],
  url: {
    api: "https://playcanvas.com/api",
    home: "https://playcanvas.com",
    realtime: { http: "wss://rt.playcanvas.com/realtime" },
    messenger: { http: "https://msg.playcanvas.com/", ws: "wss://msg.playcanvas.com/messages" },
    engine: "https://code.playcanvas.com/playcanvas-stable.prf.js",
    physics: "https://code.playcanvas.com/ammo.dcab07b.js",
    webvr: "https://code.playcanvas.com/webvr-polyfill.bad0c71.js",
    scriptsBeforeEngine: [],
    scriptsAfterEngine: [],
  },
  schema: {
    scene: {
      name: { $type: "string" },
      settings: {
        physics: {
          gravity: { $length: 3, $type: ["number"], $mergeMethod: "stop_and_report_conflict" },
        },
        render: {
          fog: { $type: "string" },
          fog_start: { $type: "number" },
          fog_end: { $type: "number" },
          fog_density: { $type: "number" },
          fog_color: {
            $length: 3,
            $type: ["number"],
            $editorType: "rgba",
            $mergeMethod: "stop_and_report_conflict",
          },
          global_ambient: {
            $length: 4,
            $type: ["number"],
            $editorType: "rgba",
            $mergeMethod: "stop_and_report_conflict",
          },
          gamma_correction: { $type: "number" },
          lightmapSizeMultiplier: { $type: "number" },
          lightmapMaxResolution: { $type: "number" },
          lightmapMode: { $type: "number" },
          tonemapping: { $type: "number" },
          exposure: { $type: "number" },
          skybox: { $type: "number", $editorType: "asset" },
          skyboxIntensity: { $type: "number" },
          skyboxMip: { $type: "number" },
        },
        priority_scripts: { $type: ["string"] },
      },
      entities: {
        $type: "map",
        $of: {
          name: { $type: "string" },
          resource_id: { $type: "string" },
          enabled: { $type: "boolean" },
          template: { $type: "number" },
          tags: { $type: ["string"] },
          labels: { $type: ["string"] },
          parent: { $type: "string", $editorType: "entity" },
          children: {
            $type: ["string"],
            $editorType: "array:entity",
            $mergeMethod: "merge_conflict_if_array_reorder",
          },
          position: { $length: 3, $type: ["number"], $mergeMethod: "stop_and_report_conflict" },
          rotation: { $length: 3, $type: ["number"], $mergeMethod: "stop_and_report_conflict" },
          scale: { $length: 3, $type: ["number"], $mergeMethod: "stop_and_report_conflict" },
          template_id: { $type: "number" },
          template_ent_ids: { $type: "map", $of: "string" },
          components: {
            audiolistener: { enabled: { $type: "boolean", $default: true } },
            animation: {
              enabled: { $type: "boolean", $default: true },
              assets: { $type: ["number"], $editorType: "array:asset", $default: [] },
              speed: { $type: "number", $default: 1 },
              loop: { $type: "boolean", $default: true },
              activate: { $type: "boolean", $default: true },
            },
            audiosource: {
              enabled: { $type: "boolean", $default: true },
              assets: { $type: ["number"], $editorType: "array:asset", $default: [] },
              volume: { $type: "number", $default: 1 },
              pitch: { $type: "number", $default: 1 },
              loop: { $type: "boolean", $default: false },
              activate: { $type: "boolean", $default: true },
              "3d": { $type: "boolean", $default: true },
              minDistance: { $type: "number", $default: 1 },
              maxDistance: { $type: "number", $default: 10000 },
              rollOffFactor: { $type: "number", $default: 1 },
            },
            sound: {
              enabled: { $type: "boolean", $default: true },
              volume: { $type: "number", $default: 1 },
              pitch: { $type: "number", $default: 1 },
              positional: { $type: "boolean", $default: true },
              refDistance: { $type: "number", $default: 1 },
              maxDistance: { $type: "number", $default: 10000 },
              rollOffFactor: { $type: "number", $default: 1 },
              distanceModel: { $type: "string", $default: "linear" },
              slots: {
                $type: "map",
                $of: {
                  name: { $type: "string" },
                  volume: { $type: "number" },
                  pitch: { $type: "number" },
                  asset: { $type: "number", $editorType: "asset" },
                  startTime: { $type: "number" },
                  duration: { $type: "number" },
                  loop: { $type: "boolean" },
                  autoPlay: { $type: "boolean" },
                  overlap: { $type: "boolean" },
                },
                $default: {
                  "1": {
                    name: "Slot 1",
                    loop: false,
                    autoPlay: false,
                    overlap: false,
                    asset: null,
                    startTime: 0,
                    duration: null,
                    volume: 1,
                    pitch: 1,
                  },
                },
              },
            },
            camera: {
              enabled: { $type: "boolean", $default: true },
              clearColorBuffer: { $type: "boolean", $default: true },
              clearColor: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [0.118, 0.118, 0.118, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              clearDepthBuffer: { $type: "boolean", $default: true },
              projection: { $type: "number", $default: 0 },
              fov: { $type: "number", $default: 45 },
              frustumCulling: { $type: "boolean", $default: true },
              orthoHeight: { $type: "number", $default: 4 },
              nearClip: { $type: "number", $default: 0.1 },
              farClip: { $type: "number", $default: 1000 },
              priority: { $type: "number", $default: 0 },
              rect: {
                $length: 4,
                $type: ["number"],
                $default: [0, 0, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              offscreen: { $type: "boolean" },
              layers: { $type: ["number"], $default: [0, 1, 2, 3, 4], $editorType: "array:layer" },
            },
            collision: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "box" },
              halfExtents: {
                $length: 3,
                $type: ["number"],
                $default: [0.5, 0.5, 0.5],
                $mergeMethod: "stop_and_report_conflict",
              },
              radius: { $type: "number", $default: 0.5 },
              axis: { $type: "number", $default: 1 },
              height: { $type: "number", $default: 2 },
              asset: { $type: "number", $editorType: "asset", $default: null },
            },
            rigidbody: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "static" },
              mass: { $type: "number", $default: 1 },
              linearDamping: { $type: "number", $default: 0 },
              angularDamping: { $type: "number", $default: 0 },
              linearFactor: {
                $length: 3,
                $type: ["number"],
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              angularFactor: {
                $length: 3,
                $type: ["number"],
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              friction: { $type: "number", $default: 0.5 },
              restitution: { $type: "number", $default: 0.5 },
            },
            light: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "directional" },
              bake: { $type: "boolean", $default: false },
              bakeDir: { $type: "boolean" },
              affectDynamic: { $type: "boolean", $default: true },
              affectLightmapped: { $type: "boolean", $default: false },
              color: {
                $length: 3,
                $type: ["number"],
                $editorType: "rgb",
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              intensity: { $type: "number", $default: 1 },
              castShadows: { $type: "boolean", $default: false },
              shadowUpdateMode: { $type: "number" },
              shadowType: { $type: "number", $default: 0 },
              vsmBlurMode: { $type: "number", $default: 1 },
              vsmBlurSize: { $type: "number", $default: 11 },
              vsmBias: { $type: "number", $default: 0.01 },
              shadowDistance: { $type: "number", $default: 16 },
              shadowResolution: { $type: "number", $default: 1024 },
              shadowBias: { $type: "number", $default: 0.2 },
              normalOffsetBias: { $type: "number", $default: 0.05 },
              range: { $type: "number", $default: 8 },
              falloffMode: { $type: "number", $default: 0 },
              innerConeAngle: { $type: "number", $default: 40 },
              outerConeAngle: { $type: "number", $default: 45 },
              cookieAsset: { $type: "number", $editorType: "asset", $default: null },
              cookie: { $type: "number" },
              cookieIntensity: { $type: "number", $default: 1 },
              cookieFalloff: { $type: "boolean", $default: true },
              cookieChannel: { $type: "string", $default: "rgb" },
              cookieAngle: { $type: "number", $default: 0 },
              cookieScale: {
                $length: 2,
                $type: ["number"],
                $default: [1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              cookieOffset: {
                $length: 2,
                $type: ["number"],
                $default: [0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              isStatic: { $type: "boolean", $default: false },
              layers: { $type: ["number"], $default: [0], $editorType: "array:layer" },
            },
            model: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "asset" },
              asset: { $type: "number", $editorType: "asset", $default: null },
              materialAsset: { $type: "number", $editorType: "asset", $default: null },
              castShadows: { $type: "boolean", $default: true },
              castShadowsLightmap: { $type: "boolean", $default: true },
              receiveShadows: { $type: "boolean", $default: true },
              static: { $type: "boolean" },
              lightmapped: { $type: "boolean", $default: false },
              lightmapSizeMultiplier: { $type: "number", $default: 1 },
              castShadowsLightMap: { $type: "boolean", $default: true },
              lightMapped: { $type: "boolean", $default: false },
              lightMapSizeMultiplier: { $type: "number", $default: 1 },
              mapping: { $type: "map", $of: { $type: "number", $editorType: "asset" } },
              isStatic: { $type: "boolean", $default: false },
              layers: { $type: ["number"], $default: [0], $editorType: "array:layer" },
              batchGroupId: { $type: "number", $editorType: "batchGroup", $default: null },
            },
            particlesystem: {
              enabled: { $type: "boolean", $default: true },
              autoPlay: { $type: "boolean", $default: true },
              numParticles: { $type: "number", $default: 30 },
              lifetime: { $type: "number", $default: 5 },
              rate: { $type: "number", $default: 0.1 },
              rate2: { $type: "number", $default: 0.1 },
              startAngle: { $type: "number", $default: 0 },
              startAngle2: { $type: "number", $default: 0 },
              loop: { $type: "boolean", $default: true },
              preWarm: { $type: "boolean", $default: false },
              lighting: { $type: "boolean", $default: false },
              halfLambert: { $type: "boolean", $default: false },
              intensity: { $type: "number", $default: 1 },
              depthWrite: { $type: "boolean", $default: false },
              depthSoftening: { $type: "number", $default: 0 },
              sort: { $type: "number", $default: 0 },
              blendType: { $type: "number", $default: 2 },
              stretch: { $type: "number", $default: 0 },
              alignToMotion: { $type: "boolean", $default: false },
              emitterShape: { $type: "number", $default: 0 },
              emitterExtents: {
                $length: 3,
                $type: ["number"],
                $default: [0, 0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              emitterExtentsInner: {
                $length: 3,
                $type: ["number"],
                $default: [0, 0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              orientation: { $type: "number", $default: 0 },
              particleNormal: {
                $length: 3,
                $type: ["number"],
                $default: [0, 1, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              emitterRadius: { $type: "number", $default: 0 },
              emitterRadiusInner: { $type: "number", $default: 0 },
              initialVelocity: { $type: "number", $default: 0 },
              animTilesX: { $type: "number", $default: 1 },
              animTilesY: { $type: "number", $default: 1 },
              animStartFrame: { $type: "number", $default: 0 },
              animNumFrames: { $type: "number", $default: 1 },
              animNumAnimations: { $type: "number", $default: 1 },
              animIndex: { $type: "number", $default: 0 },
              randomizeAnimIndex: { $type: "boolean", $default: false },
              animSpeed: { $type: "number", $default: 1 },
              animLoop: { $type: "boolean", $default: true },
              wrap: { $type: "boolean", $default: false },
              wrapBounds: {
                $length: 3,
                $type: ["number"],
                $default: [0, 0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              colorMapAsset: { $type: "number", $editorType: "asset", $default: null },
              normalMapAsset: { $type: "number", $editorType: "asset", $default: null },
              mesh: { $type: "number", $editorType: "asset", $default: null },
              localSpace: { $type: "boolean", $default: false },
              localVelocityGraph: {
                $editorType: "curveset",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: {
                  type: 1,
                  keys: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  betweenCurves: false,
                },
                $mergeMethod: "stop_and_report_conflict",
              },
              localVelocityGraph2: {
                $editorType: "curveset",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: {
                  type: 1,
                  keys: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                },
                $mergeMethod: "stop_and_report_conflict",
              },
              velocityGraph: {
                $editorType: "curveset",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: {
                  type: 1,
                  keys: [
                    [0, -1],
                    [0, -1],
                    [0, -1],
                  ],
                  betweenCurves: true,
                },
                $mergeMethod: "stop_and_report_conflict",
              },
              velocityGraph2: {
                $editorType: "curveset",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: {
                  type: 1,
                  keys: [
                    [0, 1],
                    [0, 1],
                    [0, 1],
                  ],
                },
                $mergeMethod: "stop_and_report_conflict",
              },
              rotationSpeedGraph: {
                $editorType: "curve",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0], betweenCurves: false },
                $mergeMethod: "stop_and_report_conflict",
              },
              rotationSpeedGraph2: {
                $editorType: "curve",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0] },
                $mergeMethod: "stop_and_report_conflict",
              },
              radialSpeedGraph: {
                $editorType: "curve",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0], betweenCurves: false },
                $mergeMethod: "stop_and_report_conflict",
              },
              radialSpeedGraph2: {
                $editorType: "curve",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0] },
                $mergeMethod: "stop_and_report_conflict",
              },
              scaleGraph: {
                $editorType: "curve",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0.1], betweenCurves: false },
                $mergeMethod: "stop_and_report_conflict",
              },
              scaleGraph2: {
                $editorType: "curve",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 0.1] },
                $mergeMethod: "stop_and_report_conflict",
              },
              colorGraph: {
                $editorType: "curveset",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: {
                  type: 4,
                  keys: [
                    [0, 1],
                    [0, 1],
                    [0, 1],
                  ],
                  betweenCurves: false,
                },
                $mergeMethod: "stop_and_report_conflict",
              },
              alphaGraph: {
                $editorType: "curve",
                type: { $type: "number" },
                betweenCurves: { $type: "boolean" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 1], betweenCurves: false },
                $mergeMethod: "stop_and_report_conflict",
              },
              alphaGraph2: {
                $editorType: "curve",
                type: { $type: "number" },
                keys: { $type: ["number"] },
                $default: { type: 1, keys: [0, 1] },
                $mergeMethod: "stop_and_report_conflict",
              },
              layers: { $type: ["number"], $default: [0], $editorType: "array:layer" },
            },
            script: {
              enabled: { $type: "boolean", $default: true },
              order: { $type: ["string"], $default: [] },
              scripts: {
                $type: "map",
                $of: {
                  enabled: { $type: "boolean" },
                  attributes: {
                    $type: "map",
                    $of: { $type: "mixed", $mergeMethod: "merge_entity_script_attributes" },
                  },
                },
                $default: {},
              },
            },
            zone: {
              enabled: { $type: "boolean", $default: true },
              size: {
                $length: 3,
                $type: ["number"],
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
            },
            screen: {
              enabled: { $type: "boolean", $default: true },
              screenSpace: { $type: "boolean", $default: true },
              scaleMode: { $type: "string", $default: "blend" },
              scaleBlend: { $type: "number", $default: 0.5 },
              resolution: {
                $length: 2,
                $type: ["number"],
                $default: [1280, 720],
                $mergeMethod: "stop_and_report_conflict",
              },
              referenceResolution: {
                $length: 2,
                $type: ["number"],
                $default: [1280, 720],
                $mergeMethod: "stop_and_report_conflict",
              },
            },
            element: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "text" },
              anchor: {
                $length: 4,
                $type: ["number"],
                $default: [0.5, 0.5, 0.5, 0.5],
                $mergeMethod: "stop_and_report_conflict",
              },
              pivot: {
                $length: 2,
                $type: ["number"],
                $default: [0.5, 0.5],
                $mergeMethod: "stop_and_report_conflict",
              },
              text: { $type: "string", $default: "" },
              key: { $type: "string", $default: null },
              fontAsset: { $type: "number", $editorType: "asset", $default: null },
              fontSize: { $type: "number", $default: 32 },
              minFontSize: { $type: "number", $default: 8 },
              maxFontSize: { $type: "number", $default: 32 },
              autoFitWidth: { $type: "boolean", $default: false },
              autoFitHeight: { $type: "boolean", $default: false },
              maxLines: { $type: "number", $default: null },
              lineHeight: { $type: "number", $default: 32 },
              wrapLines: { $type: "boolean", $default: true },
              spacing: { $type: "number", $default: 1 },
              color: {
                $length: 3,
                $type: ["number"],
                $editorType: "rgb",
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              opacity: { $type: "number", $default: 1 },
              textureAsset: { $type: "number", $editorType: "asset", $default: null },
              spriteAsset: { $type: "number", $editorType: "asset", $default: null },
              spriteFrame: { $type: "number", $default: 0 },
              pixelsPerUnit: { $type: "number", $default: null },
              width: { $type: "number", $default: 32 },
              height: { $type: "number", $default: 32 },
              margin: {
                $length: 4,
                $type: ["number"],
                $default: [-16, -16, -16, -16],
                $mergeMethod: "stop_and_report_conflict",
              },
              alignment: {
                $length: 2,
                $type: ["number"],
                $default: [0.5, 0.5],
                $mergeMethod: "stop_and_report_conflict",
              },
              outlineColor: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [0, 0, 0, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              outlineThickness: { $type: "number", $default: 0 },
              shadowColor: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [0, 0, 0, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              shadowOffset: {
                $length: 2,
                $type: ["number"],
                $default: [0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              rect: {
                $length: 4,
                $type: ["number"],
                $default: [0, 0, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              materialAsset: { $type: "number", $editorType: "asset", $default: null },
              autoWidth: { $type: "boolean", $default: false },
              autoHeight: { $type: "boolean", $default: false },
              useInput: { $type: "boolean", $default: false },
              batchGroupId: { $type: "number", $editorType: "batchGroup", $default: null },
              mask: { $type: "boolean", $default: false },
              layers: { $type: ["number"], $default: [4], $editorType: "array:layer" },
              enableMarkup: { $type: "boolean", $default: false },
            },
            button: {
              enabled: { $type: "boolean", $default: true },
              active: { $type: "boolean", $default: true },
              imageEntity: { $type: "string", $editorType: "entity", $default: null },
              hitPadding: {
                $length: 4,
                $type: ["number"],
                $default: [0, 0, 0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              transitionMode: { $type: "number", $default: 0 },
              hoverTint: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [1, 1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              pressedTint: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [1, 1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              inactiveTint: {
                $length: 4,
                $type: ["number"],
                $editorType: "rgba",
                $default: [1, 1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              fadeDuration: { $type: "number", $default: 0 },
              hoverSpriteAsset: { $type: "number", $editorType: "asset", $default: null },
              hoverSpriteFrame: { $type: "number", $default: 0 },
              pressedSpriteAsset: { $type: "number", $editorType: "asset", $default: null },
              pressedSpriteFrame: { $type: "number", $default: 0 },
              inactiveSpriteAsset: { $type: "number", $editorType: "asset", $default: null },
              inactiveSpriteFrame: { $type: "number", $default: 0 },
              hoverTextureAsset: { $type: "number", $editorType: "asset", $default: null },
              pressedTextureAsset: { $type: "number", $editorType: "asset", $default: null },
              inactiveTextureAsset: { $type: "number", $editorType: "asset", $default: null },
            },
            scrollview: {
              enabled: { $type: "boolean", $default: true },
              horizontal: { $type: "boolean", $default: true },
              vertical: { $type: "boolean", $default: true },
              scrollMode: { $type: "number", $default: 1 },
              bounceAmount: { $type: "number", $default: 0.1 },
              friction: { $type: "number", $default: 0.05 },
              horizontalScrollbarVisibility: { $type: "number", $default: 1 },
              verticalScrollbarVisibility: { $type: "number", $default: 1 },
              viewportEntity: { $type: "string", $editorType: "entity", $default: null },
              contentEntity: { $type: "string", $editorType: "entity", $default: null },
              horizontalScrollbarEntity: { $type: "string", $editorType: "entity", $default: null },
              verticalScrollbarEntity: { $type: "string", $editorType: "entity", $default: null },
            },
            scrollbar: {
              enabled: { $type: "boolean", $default: true },
              orientation: { $type: "number", $default: 0 },
              value: { $type: "number", $default: 0 },
              handleSize: { $type: "number", $default: 0.5 },
              handleEntity: { $type: "string", $editorType: "entity", $default: null },
            },
            sprite: {
              enabled: { $type: "boolean", $default: true },
              type: { $type: "string", $default: "simple" },
              width: { $type: "number", $default: 1 },
              height: { $type: "number", $default: 1 },
              color: {
                $length: 3,
                $type: ["number"],
                $editorType: "rgb",
                $default: [1, 1, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              opacity: { $type: "number", $default: 1 },
              flipX: { $type: "boolean", $default: false },
              flipY: { $type: "boolean", $default: false },
              spriteAsset: { $type: "number", $editorType: "asset", $default: null },
              frame: { $type: "number", $default: 0 },
              speed: { $type: "number", $default: 1 },
              batchGroupId: { $type: "number", $editorType: "batchGroup", $default: null },
              layers: { $type: ["number"], $default: [0], $editorType: "array:layer" },
              drawOrder: { $type: "number", $default: 0 },
              autoPlayClip: { $type: "string", $default: null },
              clips: {
                $type: "map",
                $of: {
                  name: { $type: "string" },
                  fps: { $type: "number" },
                  loop: { $type: "boolean" },
                  autoPlay: { $type: "boolean" },
                  spriteAsset: { $type: "number", $editorType: "asset" },
                },
                $default: {},
              },
            },
            layoutgroup: {
              enabled: { $type: "boolean", $default: true },
              orientation: { $type: "number", $default: 0 },
              reverseX: { $type: "boolean", $default: false },
              reverseY: { $type: "boolean", $default: true },
              alignment: {
                $length: 2,
                $type: ["number"],
                $default: [0, 1],
                $mergeMethod: "stop_and_report_conflict",
              },
              padding: {
                $length: 4,
                $type: ["number"],
                $default: [0, 0, 0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              spacing: {
                $length: 2,
                $type: ["number"],
                $default: [0, 0],
                $mergeMethod: "stop_and_report_conflict",
              },
              widthFitting: { $type: "number", $default: 0 },
              heightFitting: { $type: "number", $default: 0 },
              wrap: { $type: "boolean", $default: false },
            },
            layoutchild: {
              enabled: { $type: "boolean", $default: true },
              minWidth: { $type: "number", $default: 0 },
              minHeight: { $type: "number", $default: 0 },
              maxWidth: { $type: "number", $default: null },
              maxHeight: { $type: "number", $default: null },
              fitWidthProportion: { $type: "number", $default: 0 },
              fitHeightProportion: { $type: "number", $default: 0 },
              excludeFromLayout: { $type: "boolean", $default: false },
            },
          },
        },
      },
    },
    settings: {
      ide: {
        fontSize: { $type: "number" },
        continueComments: { $type: "boolean" },
        autoCloseBrackets: { $type: "boolean" },
        highlightBrackets: { $type: "boolean" },
      },
      editor: {
        howdoi: { $type: "boolean" },
        iconSize: { $type: "number" },
        showSkeleton: { $type: "boolean" },
        cameraNearClip: { $type: "number" },
        cameraFarClip: { $type: "number" },
        cameraClearColor: { $length: 4, $type: ["number"], $editorType: "rgba" },
        lastSelectedFontId: { $type: "number" },
        locale: { $type: "string" },
        gridDivisions: { $type: "number" },
        gridDivisionSize: { $type: "number" },
        snapIncrement: { $type: "number" },
        localServer: { $type: "string" },
        launchDebug: { $type: "boolean" },
        pipeline: {
          autoRun: { $type: "boolean" },
          texturePot: { $type: "boolean" },
          textureDefaultToAtlas: { $type: "boolean" },
          searchRelatedAssets: { $type: "boolean" },
          preserveMapping: { $type: "boolean" },
          overwriteModel: { $type: "boolean" },
          overwriteAnimation: { $type: "boolean" },
          overwriteMaterial: { $type: "boolean" },
          overwriteTexture: { $type: "boolean" },
          useGlb: { $type: "boolean" },
          defaultAssetPreload: { $type: "boolean" },
        },
      },
      favoriteBranches: { $type: ["string"] },
      antiAlias: { $type: "boolean" },
      batchGroups: {
        $type: "map",
        $of: {
          id: { $type: "number" },
          name: { $type: "string" },
          maxAabbSize: { $type: "number" },
          dynamic: { $type: "boolean" },
          layers: { $type: ["number"], $editorType: "array:layer" },
        },
      },
      fillMode: { $type: "string" },
      resolutionMode: { $type: "string" },
      height: { $type: "number" },
      width: { $type: "number" },
      use3dPhysics: { $type: "boolean" },
      preferWebGl2: { $type: "boolean" },
      preserveDrawingBuffer: { $type: "boolean" },
      scripts: {
        $type: ["number"],
        $editorType: "array:asset",
        $mergeMethod: "merge_conflict_if_array_reorder",
      },
      transparentCanvas: { $type: "boolean" },
      useDevicePixelRatio: { $type: "boolean" },
      useModelV2: { $type: "boolean" },
      useKeyboard: { $type: "boolean" },
      useMouse: { $type: "boolean" },
      useGamepads: { $type: "boolean" },
      useTouch: { $type: "boolean" },
      vr: { $type: "boolean" },
      loadingScreenScript: { $type: "string", $editorType: "asset" },
      externalScripts: { $type: ["string"] },
      plugins: { $type: ["string"] },
      layers: {
        $type: "map",
        $of: {
          name: { $type: "string" },
          opaqueSortMode: { $type: "number" },
          transparentSortMode: { $type: "number" },
        },
      },
      layerOrder: {
        $type: [
          {
            enabled: { $type: "boolean" },
            transparent: { $type: "boolean" },
            layer: { $type: "number" },
          },
        ],
        $mergeMethod: "stop_and_report_conflict",
      },
      i18nAssets: { $type: ["number"], $editorType: "array:asset" },
      useLegacyAudio: { $type: "boolean" },
    },
    asset: {
      branch_id: { $type: "string" },
      checkpoint_id: { $type: "string" },
      data: "assetDataSelector",
      has_thumbnail: { $type: "boolean" },
      file: {
        filename: "string",
        hash: "string",
        size: "number",
        variants: {
          dxt: {
            filename: "string",
            hash: "string",
            size: "number",
            sizeGzip: "number",
            opt: "number",
          },
          etc1: {
            filename: "string",
            hash: "string",
            size: "number",
            sizeGzip: "number",
            opt: "number",
          },
          etc2: {
            filename: "string",
            hash: "string",
            size: "number",
            sizeGzip: "number",
            opt: "number",
          },
          pvr: {
            filename: "string",
            hash: "string",
            size: "number",
            sizeGzip: "number",
            opt: "number",
          },
          basis: {
            filename: "string",
            hash: "string",
            size: "number",
            sizeGzip: "number",
            opt: "number",
          },
        },
      },
      immutable_backup: {},
      item_id: { $type: "string" },
      i18n: { $type: "map", $of: { $type: "number", $editorType: "asset" } },
      meta: "assetMetaSelector",
      name: { $type: "string" },
      path: { $type: ["number"], $mergeMethod: "stop_and_report_conflict" },
      preload: { $type: "boolean" },
      region: { $type: "string" },
      revision: { $type: "number" },
      same_as_backup: { $type: "number" },
      scope: { type: { $type: "string" }, id: { $type: "number" } },
      source: { $type: "boolean" },
      source_asset_id: { $type: "string", $editorType: "asset" },
      tags: { $type: ["string"] },
      task: { $type: "string" },
      taskInfo: { $type: "string" },
      type: { $type: "string" },
      user_id: { $type: "number" },
    },
  },
  wasmModules: [
    {
      moduleName: "Ammo",
      glueUrl: "lib/ammo.wasm.js",
      wasmUrl: "lib/ammo.wasm.wasm",
      fallbackUrl:
        "api/assets/files/Ammo/ammo.js?id=24085951&branchId=65ce8bea-723e-4b67-808c-1fa2179ccb21&t=3dd96bd0f83420f2732b009b092b3bea",
      preload: true,
    },
  ],
};