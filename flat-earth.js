var camera, scene, renderer, controls;
var geometry, material, earth, sun, moon, sunlight;
 
init();
animate();
 
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 50000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    geometry = new THREE.CylinderGeometry(300, 300, 1, 100);
    var texture = new THREE.TextureLoader().load('img/earth.jpg');
    texture.crossOrigin = true;
    material = new THREE.MeshPhongMaterial({
        map: texture
    });
    material.needsUpdate = true;
    material.map.minFilter = THREE.LinearFilter;

    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    geometry = new THREE.SphereGeometry(5, 20, 20);
    material = new THREE.MeshPhongMaterial( {color: 0xffff00, emissive: 0xffff00} );
    material.needsUpdate = true;
    sun = new THREE.Mesh(geometry, material);
    sun.position.y = 100;
    sun.position.x = 150;
    sun.position.z = 0;
    scene.add(sun);

    material = new THREE.MeshPhongMaterial( {color: 0xf5f3ce} );
    moon = new THREE.Mesh(geometry, material);
    moon.position.y = 125;
    moon.position.x = -150;
    moon.position.z = 0;
    scene.add(moon);
    
    var sunlight = new THREE.PointLight(0xffffff, 3, 500, 2);
    sunlight.position.set(0, 75, 0);
    sun.add(sunlight);

    camera.position.x = 0;
    camera.position.y = 350;
    camera.position.z = 350;
    camera.lookAt(new THREE.Vector3(0, -100, 0));
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.update();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
 
function animate() {
    requestAnimationFrame(animate);

    const vector = new THREE.Vector3(0, 75, 0);
    rotateAboutPoint(sun, vector, vector.normalize(), Math.PI * 2 / 365, false);
    rotateAboutPoint(moon, vector, vector.normalize(), 6.07042967 / 365, false);

    controls.update();

    renderer.render(scene, camera);
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
