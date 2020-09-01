import * as THREE from 'three';

let camera;
let renderer;
let scene;
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
  document.body.appendChild(renderer.domElement);

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

export default init;
