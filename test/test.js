const assert = require('assert');
const GIF = require('../index');
const { loadImage, createCanvas } = require('canvas');
const path = require('path');

function addFrames(gif, images, canvas, index) {
  return new Promise(resolve => {
    let i = index || 0;

    if (!images[i]) {
      resolve();
    }

    loadImage(images[i]).then(image => {
      let _canvas = canvas;
      
      if (!_canvas) {
        _canvas = createCanvas(image.width, image.height);
      }

      let cxt = _canvas.getContext('2d');
      cxt.drawImage(image, 0, 0);

      gif.addFrame(cxt.getImageData(0, 0, _canvas.width, _canvas.height), {
        delay: 500 * (i + 1)
      });

      resolve(addFrames(gif, images, _canvas, ++i));
    });
  });
}

describe('encode local images to gif', function() {
  describe('encode png images', function() {
    it('Check GIF header', done => {
      let images = [
        path.join(__dirname, './images/001.png'),
        path.join(__dirname, './images/002.png'),
        path.join(__dirname, './images/003.png')
      ];
  
      let gif = new GIF({
        worker: 2,
        quality: 10,
        debug: true
      });
  
      gif.on('finished', buffer => {
        assert.equal(buffer.toString().indexOf('GIF8'), 0);
        done();
        gif = null;
      });
  
      addFrames(gif, images).then(() => {
        gif.render();
      });
    });
  });

  describe('encode jpg images', function() {

    it('Check GIF header', done => {
      let images = [
        path.join(__dirname, './images/001.jpg'),
        path.join(__dirname, './images/002.jpg'),
        path.join(__dirname, './images/003.jpg')
      ];
  
      let gif = new GIF({
        worker: 2,
        quality: 10,
        debug: true
      });
  
      gif.on('finished', buffer => {
        assert.equal(buffer.toString().indexOf('GIF8'), 0);
        done();
        gif = null;
      });
  
      addFrames(gif, images).then(() => {
        gif.render();
      });
    });
  });
});