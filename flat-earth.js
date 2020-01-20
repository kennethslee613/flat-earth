var camera, scene, renderer;
var geometry, material, earth, sun, sunlight;
 
init();
animate();
 
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);

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

    geometry = new THREE.SphereGeometry(10, 32, 32);
    material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    material.needsUpdate = true;
    sun = new THREE.Mesh(geometry, material);
    sun.position.y = 75;
    sun.position.x = 125;
    sun.position.z = 125;
    scene.add(sun);
    
    var sunlight = new THREE.PointLight(0xffffff, 10, 500, 2);
    sunlight.position.set(0, 100, 175);
    scene.add(sunlight);

    camera.position.x = 0;
    camera.position.y = 500;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // camera.position.y = 100;
    // camera.position.z = 500;
}
 
function animate() {
    requestAnimationFrame(animate);
 
    // earth.rotation.x += 0.01;
    // earth.rotation.y += 0.02;
    const vector = new THREE.Vector3(0, 75, 0);
    rotateAboutPoint(sun, vector, vector.normalize(), 0.02, false);
    // rotateAboutPoint(sunlight, vector, vector.normalize(), 0.02, false);

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