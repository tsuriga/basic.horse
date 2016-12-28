var loader, container, camera, controls, scene, renderer;

init();
animate();

function init() {
    loader = new THREE.JSONLoader();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 500;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    scene = new THREE.Scene();

    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setClearColor(0xEEEEEE);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    loader.load('assets/models/track01.js', function (geometry) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial('0xaaafff'));
        mesh.position.set(0, 0, 0);
        mesh.scale.set(3, 3, 3);
        mesh.overdraw = true;
        mesh.material.side = THREE.DoubleSide;
        scene.add(mesh);
    });

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    render();
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
}

function render() {
    renderer.render( scene, camera );
}
