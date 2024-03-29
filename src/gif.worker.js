process.on('message', function(data) {
  return renderFrame(data);
});

var GIFEncoder, renderFrame;

GIFEncoder = require('./GIFEncoder.js');

renderFrame = function(frame) {
  var encoder, page, stream, transfer;
  encoder = new GIFEncoder(frame.width, frame.height);
  if (frame.index === 0) {
    encoder.writeHeader();
  } else {
    encoder.firstFrame = false;
  }
  encoder.setTransparent(frame.transparent);
  encoder.setDispose(frame.dispose);
  encoder.setRepeat(frame.repeat);
  encoder.setDelay(frame.delay);
  encoder.setQuality(frame.quality);
  encoder.setDither(frame.dither);
  encoder.setGlobalPalette(frame.globalPalette);
  encoder.addFrame(frame.data);
  if (frame.last) {
    encoder.finish();
  }
  if (frame.globalPalette === true) {
    frame.globalPalette = encoder.getGlobalPalette();
  }
  stream = encoder.stream();
  frame.data = stream.pages;
  frame.cursor = stream.cursor;
  frame.pageSize = stream.constructor.pageSize;
  if (frame.canTransfer) {
    // The code below is never run, because the frame.cantTransfer is false constantly
    transfer = (function() {
      var i, len, ref, results;
      ref = frame.data;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        page = ref[i];
        results.push(page.buffer);
      }
      return results;
    })();

    process.send(frame, transfer);
  } else {
    process.send(frame);
  }
};