var canvas, engine, scene, camera, score, rotation, sphere = 0;

document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initScene();

        engine.runRenderLoop(function(){
            //sphere.rotation.y = sphere.rotation.y + 0.002;
            scene.render();
        });
    }
}, false);

function initScene() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);

    scene.clearColor = BABYLON.Color3.Black();

    camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
    camera.setTarget(new BABYLON.Vector3(25,25,10));
    camera.attachControl(canvas);

    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);

    for (i = 0; i < 700; i++) {
        sphere = BABYLON.Mesh.CreateSphere("sphere" + i, 20, 7, scene);
        var sphereMaterial = new BABYLON.StandardMaterial("texture", scene);
        sphereMaterial.diffuseTexture = new BABYLON.Texture("texture.jpg", scene);
        sphere.material = sphereMaterial;

        var posX = Math.floor((Math.random() * 5000) + 1);
        var posY = Math.floor((Math.random() * 5000) + 1);
        var posZ = Math.floor((Math.random() * 5000) + 1);

        sphere.position = new BABYLON.Vector3(posX, posY, posZ);
    }
}