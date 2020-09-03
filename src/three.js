import * as THREE from 'three';
import { OBJLoader } from './OBJLoader';
import fm from './facemesh';

let baseMesh;
let camera;
let raycaster;
let renderer;
let scene;
let threeEl;
let video;
let videoTexture;

async function init(videoStream) {
  video = videoStream;
  const width = video ? video.width : 640;
  const height = video ? video.height : 640;

  const fov = 50;
  const aspect = width / height;
  const near = 1;
  const far = 5000;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = height;
  camera.position.x = -width / 2;
  camera.position.y = -height / 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  threeEl = renderer.domElement;
  threeEl.classList.add('three-canvas');
  document.querySelector('.container').prepend(threeEl);

  renderer.domElement.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  // Init Raycaster.
  // raycaster = new THREE.Raycaster();

  addVideoSprite(video);
  await loadFaceObj();
  await fm.initialize(video);
  animate();
}

async function animate() {
  const face = await fm.update(video);

  if (face) {
    updateFaceObj(face.scaledMesh);
  }

  if (videoTexture) {
    videoTexture.needsUpdate = true;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updateFaceObj(facemesh) {
  for (let i = 0; i < facemesh.length; i++) {
    const [x, y, z] = facemesh[i];
    baseMesh.geometry.vertices[i].set(x - 640, -y, -z);
  }

  baseMesh.geometry.verticesNeedUpdate = true;
  baseMesh.geometry.normalsNeedUpdate = true;
  baseMesh.geometry.computeBoundingSphere(); // exists
  baseMesh.geometry.computeFaceNormals();
  baseMesh.geometry.computeVertexNormals(); // exists
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
  videoSprite.position.copy(camera.position);
  videoSprite.position.z = 0;
  scene.add(videoSprite);
}

function draw(point) {
  const x = (point.x / renderer.domElement.clientWidth) * 2 - 1;
  const y = -(point.y / renderer.domElement.clientHeight) * 2 + 1;
  console.log('point, x, y', point, x, y);
}

async function loadFaceObj() {
  const loader = new OBJLoader();
  return new Promise((resolve) => {
    loader.load('face.obj', (obj) => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
          });
          // if (!params.debug) {
          //   mat.transparent = true;
          //   mat.opacity = 0;
          // }

          baseMesh = new THREE.Mesh(child.geometry, mat);
          scene.add(baseMesh);
          resolve();
        }
      });
    });
  });
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
