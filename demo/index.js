const { loadImage, createCanvas } = require('canvas');
const GIF = require('../index');
const fs = require('fs');
const path = require('path');

const images = [
  path.join(__dirname, '../test/images/001.png'),
  path.join(__dirname, '../test/images/002.png'),
  path.join(__dirname, '../test/images/003.png'),
];

const gif = new GIF({
  worker: 2,
  quality: 10,
  debug: true
});

let canvas, cxt;

function addFrames(images, index) {
  return new Promise(resolve => {
    let i = index ? index : 0;

    if (!images[i]) {
      resolve();
    }

    loadImage(images[i]).then(image => {
      console.log(image);

      if (!canvas) {
        canvas = createCanvas(image.width, image.height);
        cxt = canvas.getContext('2d');
      }

      cxt.drawImage(image, 0, 0);

      gif.addFrame(cxt.getImageData(0, 0, canvas.width, canvas.height), {
        delay: 500 * (1 + i)
      });

      resolve(addFrames(images, ++i));
    });
  });
}

gif.on('finished', buffer => {
  console.log(buffer);
  fs.writeFileSync('gif.gif', buffer);
});

addFrames(images).then(() => {
  gif.render();
});