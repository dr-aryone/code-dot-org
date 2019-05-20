var Spritelab = function() {
  console.log('spritelab!');
  this.p5 = null;
  window.p5.prototype.spriteId = 0;

  window.p5.prototype.makeNewSprite = function(animation, x, y) {
    var sprite = this.createSprite(x, y);
    sprite.id = this.spriteId;
    this.spriteId++;
    return sprite.id;
  };

  window.p5.prototype.executeDrawLoopAndCallbacks = function() {
    console.log('native draw loop!');
    this.drawSprites();
  };
};

module.exports = Spritelab;
