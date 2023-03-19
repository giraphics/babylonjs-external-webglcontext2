import { Engine } from "@babylonjs/core/Engines/engine";
 import { Scene } from "@babylonjs/core/scene";
 import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
 import { Vector3 } from "@babylonjs/core/Maths/math.vector";
 import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
 import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
 import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
 import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { CreateBox } from "@babylonjs/core";
 let engine: Engine;
 let scene: Scene; 
const createScene = (engine: Engine, canvas: HTMLCanvasElement): Scene => {
    // This creates a basic Babylon Scene object (non-mesh)
    scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera(
        "my first camera",
        0,
        Math.PI / 3,
        10,
        new Vector3(0, 0, 0),
        scene
    );

    camera.setTarget(Vector3.Zero()); 
    camera.attachControl(canvas, true);

    // Our built-in 'sphere' shape.
    const box = CreateBox("box", { width: 2, height: 2, depth: 2 }, scene);
    box.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = CreateGround("ground", { width: 6, height: 6 }, scene);

    // Load a texture to be used as the ground material
    const groundMaterial = new StandardMaterial("ground material", scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    const light = new DirectionalLight("light", new Vector3(0, -1, 1), scene);
    light.intensity = 0.5;
    light.position.y = 10;

    return scene;
};

const externalGlContext = (gl: WebGL2RenderingContext) => {
    function drawRect(x:number, y:number, width:number, height:number, r:number, g: number, b: number) {
      // gl.scissor(x, y, width, height);
      gl.clearColor(r, g, b, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    
    for (let i = 0; i < 100; ++i) {
        const w = 500;
        const h = 500;
        const x = rand(0, w);
        const y = rand(0, h);
        const width = rand(0, w - x);
        const height = rand(0, h - y);
        drawRect(x, y, width, height, rand(0, 200)/ 255,rand(0, 120)/ 255,rand(0, 100)/ 255, );
    }

    function rand(min:number, max:number) {
        if (max === undefined) {
        max = min;
        min = 0;
        }
        return Math.random() * (max - min) + min;
    }    
}

export const babylonInit = async (): Promise<void> => {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const context = canvas.getContext('webgl2');

    // Generate the BABYLON 3D engine
    engine = new Engine(context, true);

    // Create the scene
    const scene = createScene(engine, canvas);
    scene.autoClear = false;

    let avvis = context;
    let callback = function () {
        if (avvis) {
            externalGlContext(avvis)
        }
        
        scene.render();
    }

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(callback);


    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
};

babylonInit().then(() => {
    // scene started rendering, everything is initialized
});
