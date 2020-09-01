import setupThree from './three';

async function setupCamera() {
  const video = document.createElement('video');

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: 640,
      height: 640
    }
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play();
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      resolve(video);
    };
  });
}

async function init() {
  const video = await setupCamera();
  await setupThree(video);
}

window.onload = () => {
  console.log('init');
  init();
};
