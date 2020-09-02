import * as THREE from 'three';

let camera;
let raycaster;
let renderer;
let scene;
let threeEl;
let videoTexture;

function init(video) {
  const width = video ? video.width : 640;
  const height = video ? video.height : 640;

  const fov = 50;
  const ration = width / height;
  const near = 1;
  const far = 5000;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, ration, near, far);
  camera.position.z = height;
  // camera.position.x = -width / 2;
  // camera.position.y = -height / 2;

  renderer = new THREE.WebGLRenderer();
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  threeEl = renderer.domElement;
  document.querySelector('.container').prepend(threeEl);

  renderer.domElement.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  // Init Raycaster.
  raycaster = new THREE.Raycaster();

  addVideoSprite(video);

  function animate() {
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

function addVideoSprite(video) {
  videoTexture = new THREE.Texture(video);
  // videoTexture.minFilter = THREE.LinearFilter;
  const videoSprite = new THREE.Sprite(
    new THREE.MeshBasicMaterial({
      map: videoTexture,
      depthWrite: false
    })
  );
  const width = video.width;
  const height = video.height;
  // videoSprite.center.set(0.5, 0.5);
  videoSprite.scale.set(width, height, 1);
  // videoSprite.position.copy(camera.position);
  // videoSprite.position.z = 0;
  scene.add(videoSprite);
}

function draw(point) {
  const x = (point.x / renderer.domElement.clientWidth) * 2 - 1;
  const y = -(point.y / renderer.domElement.clientHeight) * 2 + 1;
  console.log('point, x, y', point, x, y);
}

function onMouseDown() {
  window.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(evt) {
  const rect = threeEl.getBoundingClientRect();
  const x = rect.width - (evt.clientX - rect.x);
  const y = evt.clientY - rect.y;
  draw({ x, y });
}

function onMouseUp() {
  // end();
  window.removeEventListener('mousemove', onMouseMove);
}

export default init;
