import * as facemesh from '@tensorflow-models/facemesh';
import '@tensorflow/tfjs-backend-webgl';

let model;

async function initialize() {
  model = await facemesh.load({ maxFaces: 1 });
}

async function update(video) {
  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
  // array of detected faces from the MediaPipe graph.
  const predictions = await model.estimateFaces(video);

  if (predictions.length > 0) {
    return predictions[0];
  }
}

export default { initialize, update };
