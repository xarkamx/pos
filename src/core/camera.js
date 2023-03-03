export class Camera {
  constructor({ video, canvas }) {
    this.video = video;
    this.canvas = canvas;
    this.tracks = null;
  }
  start() {
    const { video } = this;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        video.srcObject = stream;
        this.tracks = stream.getTracks();
        video.play();
      })
      .catch(function(err) {
        console.log("An error occured! " + err);
      });
  }
  stop() {
    if (this.tracks == null) {
      return false;
    }
    this.tracks.forEach(function(track) {
      track.stop();
    });
    return true;
  }
  takePicture(width, height) {
    const { video, canvas } = this;
    const redux = video.clientWidth / width;
    height = video.clientHeight / redux;
    var context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL("image/jpeg");
    return data;
  }
  prepareHtml(target) {
    var video = document.createElement("video");
    var canvas = document.createElement("canvas");
    var button = document.createElement("div");
    var camera = document.createElement("div");
    var cameraDom = document.createElement("div");
    video.id = "video";
    canvas.id = "canvas";
    button.innerHTML = '<i class="fa fa-camera"></i>';
    button.classList.add("btn");
    button.classList.add("btn-success");
    camera.classList.add("camera");
    camera.appendChild(video);
    camera.appendChild(button);
    cameraDom.appendChild(camera);
    cameraDom.appendChild(canvas);
    target.insertAdjacentElement("afterbegin", cameraDom);
    return {
      video,
      canvas,
      button,
      cameraDom
    };
  }
}
