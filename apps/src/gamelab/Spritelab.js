var Spritelab = function() {
  console.log('spritelab!');
};

module.exports = Spritelab;

window.p5.prototype.executeDrawLoopAndCallbacks = function() {
  console.log('native draw loop!');
};
