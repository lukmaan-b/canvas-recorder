const canvas = document.querySelector('canvas');
const width = 1280;
const height = 720;
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext('2d');
const scaleX = width / window.innerWidth;
const scaleY = height / window.innerHeight;
const video = document.querySelector('video');
const videoStream = canvas.captureStream();
const mediaRecorder = new MediaRecorder(videoStream);

let chunks = [];
mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

mediaRecorder.onstop = (e) => {
  const blob = new Blob(chunks, { type: 'video/webm' });
  chunks = [];
  const videoURL = URL.createObjectURL(blob);
  video.src = videoURL;
};

let mouseDown = false;
let lastX, lastY;

let timer;
let isRecording = false;

canvas.addEventListener('mousedown', (e) => {
  clearTimeout(timer);
  !isRecording && mediaRecorder.start();
  isRecording = true;
  mouseDown = true;
  Draw(
    (e.clientX - canvas.getBoundingClientRect().left) * scaleX,
    (e.clientY - canvas.getBoundingClientRect().top) * scaleY,
    false
  );
});

canvas.addEventListener('mousemove', (e) => {
  mouseDown &&
    Draw(
      (e.clientX - canvas.getBoundingClientRect().left) * scaleX,
      (e.clientY - canvas.getBoundingClientRect().top) * scaleY,
      true
    );
});

canvas.addEventListener('mouseup', (e) => {
  timer = setTimeout(() => {
    mediaRecorder.stop();
    isRecording = false;
  }, 2000);
  mouseDown = false;
});

function Draw(x, y, isDown) {
  if (isDown) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
  }
  lastX = x;
  lastY = y;
}
