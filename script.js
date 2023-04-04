const video1 = document.getElementById('video1');
video1.load();
video1.play();

const video2 = document.getElementById('video2');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector('.right').appendChild(canvas);

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video2.srcObject = stream,
    err => console.error(err)
  );
}

video2.addEventListener('play', () => {
  const videoWidth = video2.videoWidth;
  const videoHeight = video2.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  setInterval(async () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const detections = await faceapi.detectAllFaces(video2, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, { width: videoWidth, height: videoHeight });
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: 'Face' });
      drawBox.draw(canvas);
    });
  }, 100);
});