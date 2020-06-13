var container, stats;

var camera, scene, renderer, splineCamera, cameraHelper, cameraEye;
var earthCloud, earthMesh;
const scale = 5;
var direction = new THREE.Vector3();
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();
var position = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var sampleClosedSpline = new THREE.CatmullRomCurve3([
	new THREE.Vector3(  0 * scale, -2.5, -140 * scale),
	new THREE.Vector3(  0 * scale, -2.5,  -20 * scale),
	new THREE.Vector3(-10 * scale, -2.5,   00 * scale),
	new THREE.Vector3(  0 * scale, -2.5,   20 * scale),
	new THREE.Vector3( 80 * scale, -2.5,  -80 * scale),
	new THREE.Vector3(  0 * scale, -2.5, -200 * scale),
	new THREE.Vector3(  0 * scale, -2.5, -140 * scale),
]);
var parent, tubeGeometry, mesh;
var params = {
	spline: sampleClosedSpline,
	// spline: splineCurve,
	scale: 0.075,
	extrusionSegments: 100,
	radiusSegments: 5,
	closed: true,
	animationView: true,
	lookAhead: false,
	cameraHelper: true,
};
var material = new THREE.MeshLambertMaterial({
	color: 0xffffff
});
var wireframeMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	opacity: 0.3,
	wireframe: true,
	transparent: true
});

function addPlanet() {
	//////////////////////////////////////////////////////////////////////////////////
	//		added starfield							//
	//////////////////////////////////////////////////////////////////////////////////

	var starSphere = THREEx.Planets.createStarfield()
	scene.add(starSphere)

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////

	// var datGUI	= new dat.GUI()

	var containerEarth = new THREE.Object3D()
	containerEarth.rotateZ(-23.4 * Math.PI / 180)
	containerEarth.position.z = 0
	scene.add(containerEarth)

	earthMesh = THREEx.Planets.createEarth(scale)
	earthMesh.receiveShadow = true
	earthMesh.castShadow = true
	earthMesh.scale.multiplyScalar(scale);
	earthMesh.rotateZ(-Math.PI)
	containerEarth.add(earthMesh)

	var geometry = new THREE.SphereGeometry(0.5, 64, 64)
	var material = THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value = 0.8
	material.uniforms.power.value = 2.0
	var mesh = new THREE.Mesh(geometry, material);
	mesh.scale.multiplyScalar(1.01 * scale);
	mesh.rotateZ(-Math.PI)
	containerEarth.add(mesh);

	var geometry = new THREE.SphereGeometry(0.5, 64, 64)
	var material = THREEx.createAtmosphereMaterial()
	material.side = THREE.BackSide
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value = 0.5
	material.uniforms.power.value = 4.0
	var mesh = new THREE.Mesh(geometry, material);
	mesh.scale.multiplyScalar(1.15 * scale);
	mesh.rotateZ(-Math.PI)
	containerEarth.add(mesh);

	earthCloud = THREEx.Planets.createEarthCloud()
	earthCloud.receiveShadow = true
	earthCloud.castShadow = true
	earthCloud.scale.multiplyScalar(scale);
	earthCloud.rotateZ(-Math.PI)
	containerEarth.add(earthCloud)
}

function addGeometry(geometry) {

	// 3D shape

	// mesh = new THREE.Mesh(geometry, material);
	// var wireframe = new THREE.Mesh(geometry, wireframeMaterial);
	// mesh.add(wireframe);

	parent.add(mesh);

}

container = document.getElementById('container');

// camera

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.set(0, 50, 500);

// scene

scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// light

// var light = new THREE.DirectionalLight(0xffffff);
// light.position.set(-1, -1.0, -0.5);
// scene.add(light);

var light = new THREE.AmbientLight(0x222222)
scene.add(light)

var light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-5, -5, -5)
scene.add(light)
light.castShadow = true
light.shadow.camera.near = 0.01
light.shadow.camera.far = 15
light.shadow.camera.fov = 45
light.shadow.camera.left = -1
light.shadow.camera.right = 1
light.shadow.camera.top = 1
light.shadow.camera.bottom = -1
// light.shadowCameraVisible	= true

light.shadow.bias = 0.001
light.shadow.darkness = 0.2

light.shadow.mapSize.Width = 1024
light.shadow.mapSize.height = 1024

// tube

parent = new THREE.Object3D();
scene.add(parent);

splineCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
parent.add(splineCamera);

cameraHelper = new THREE.CameraHelper(splineCamera);
scene.add(cameraHelper);

tubeGeometry = new THREE.TubeBufferGeometry(
	params.spline, params.extrusionSegments, 2,
	params.radiusSegments, params.closed
);
tubeGeometry.rotateZ(Math.random() * Math.PI * 2)
addGeometry(tubeGeometry);
addPlanet()
// debug camera

cameraEye = new THREE.Mesh(new THREE.SphereBufferGeometry(5), new THREE.MeshBasicMaterial({
	color: 0xdddddd
}));
parent.add(cameraEye);

cameraHelper.visible = params.cameraHelper;
cameraEye.visible = params.cameraHelper;

// renderer

renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
// const loader = new THREE.CubeTextureLoader();
// const texture = loader.load([
//   'galaxy/pos-x.png',
//   'galaxy/neg-x.png',
//   'galaxy/pos-y.png',
//   'galaxy/neg-y.png',
//   'galaxy/pos-z.png',
//   'galaxy/neg-z.png',
// ]);
// scene.background = texture;
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 100;
controls.maxDistance = 2000;
var f = 0;
function render() {
	requestAnimationFrame(render)
	// animate camera along spline

  
	var time = f;
	var looptime = 20 * 2000;
  var t = (time % looptime) / looptime;
  if(t > 0.275) {
    f += 100;
  } else {
    f += 10;
  }
  window.onclick = _ => console.log(t)
	tubeGeometry.parameters.path.getPointAt(t, position);
	position.multiplyScalar(params.scale);

	// interpolation

	var segments = tubeGeometry.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor(pickt);
	var pickNext = (pick + 1) % segments;

	binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);

	binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

	tubeGeometry.parameters.path.getTangentAt(t, direction);
	var offset = 1;

	normal.copy(binormal).cross(direction);

	// we move on a offset on its binormal

	position.add(normal.clone().multiplyScalar(offset));

	splineCamera.position.copy(position);
	cameraEye.position.copy(position);

	// using arclength for stablization in look ahead

	tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1, lookAt);
	lookAt.multiplyScalar(params.scale);

	// camera orientation 2 - up orientation via normal

	if (!params.lookAhead) lookAt.copy(position).add(direction);
	splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
	splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);

	cameraHelper.update();
	earthCloud.rotation.y += 0.005;
	earthMesh.rotation.y += 0.0025;
  renderer.render(scene, splineCamera);
  // renderer.render(scene, camera);
}
render()
