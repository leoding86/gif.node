<h1>gif.node</h1>

<p>
  <a href="https://circleci.com/gh/leoding86/gif.node"><img src="https://img.shields.io/circleci/build/github/leoding86/gif.node/master?logo=circleci&token=82fba3024df29ac68636b3c79bc7d5cf3fece579"></a>
  <a href="https://www.npmjs.com/package/gif.node"><img src="https://img.shields.io/npm/v/gif.node?color=brightgreen"></a>
</p>

Full-featured GIF encoder that runs in node. Based on [jnordberg/gif.js](https://github.com/jnordberg/gif.js) which is a Javascript GIF encoder runs in browser.

## Installation

Before install this module, you need to install [node-canvas](https://github.com/Automattic/node-canvas) first.

After you installed node-canvas, then install this.

```
$ npm install gif.node
```

## Testing

```
$ npm run test
```

## Run Demo

```
$ npm run demo
```

Then a gif.gif file will be placed in the root directory.

## Sample usage

```javascript
const { loadImage, createCanvas } = require('canvas');
const GIF = require('gif.node');
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
  fs.writeFileSync('gif.gif', buffer);
});

addFrames(images).then(() => {
  gif.render();
});
```

## Options

Please see [here](https://github.com/jnordberg/gif.js#options)