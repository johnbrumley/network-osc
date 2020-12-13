let handpose;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    socket.emit('hand', results);
    // console.log(predictions);
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(255, 0, 255);
      noStroke();
      let size = Math.abs(keypoint[2]);
      ellipse(keypoint[0], keypoint[1], size, size);
    }
    bBox = prediction.boundingBox;
    noFill();
    stroke(255,255,255);
    if(bBox){
      // console.log(bBox.topLeft[0]);
      rect(bBox.topLeft[0],bBox.topLeft[1],bBox.bottomRight[0],bBox.bottomRight[1]);
    }
  }
}

// connect back to the server
var socket = io();
