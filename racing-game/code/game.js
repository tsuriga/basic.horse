var loader, container, camera, controls, scene, renderer, car;


init();

setInterval(function(){
    animate();
    render();
}, 0.06);

function init() {
    loader = new THREE.JSONLoader();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

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
    camera.position.y = 7;

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setClearColor(0xEEEEEE);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    loader.load('assets/models/track01.js', function (geometry) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial('0xffffff'));
        mesh.position.set(9, 0, 0);
        mesh.scale.set(3, 3, 3);
        mesh.overdraw = true;
        mesh.material.side = THREE.DoubleSide;
        scene.add(mesh);
    });

    light = new THREE.AmbientLight(0xffffff);
    scene.add( light );

    carTexture = THREE.ImageUtils.loadTexture( "assets/sprite_sheets/p1.png");
    material = new THREE.MeshLambertMaterial({ map : carTexture, transparent: true });

    car = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.46), material);
    car.material.side = THREE.DoubleSide;
    car.position.set(0, 5, 0);

    scene.add( car );
}

function animate() {
    requestAnimationFrame( animate );

    if (car.position.y > 0) {
        car.position.y = car.position.y - 0.00005;
    }

    controls.update();
}

function render() {
    renderer.render( scene, camera );
}