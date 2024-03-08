function getImageSize(imgSrc, callback) {
  const img = new Image();
  img.src = imgSrc;

  img.onload = function () {
    callback({ width: this.width, height: this.height });
  };
}

export {getImageSize}