var Spritelab = function() {
  console.log('spritelab!');
  this.p5 = null;
  window.p5.prototype.spriteId = 0;
  window.p5.prototype.sprites = {};

  window.p5.prototype.setAnimation = function(spriteIndex, animation) {
    let sprite = this.sprites[spriteIndex];
    if (sprite) {
      sprite.setAnimation(animation);
      sprite.scale /= sprite.baseScale;
      sprite.baseScale =
        100 /
        Math.max(
          100,
          sprite.animation.getHeight(),
          sprite.animation.getWidth()
        );
      sprite.scale *= sprite.baseScale;
    }
  };

  window.p5.prototype.makeSpriteNative = function(animation, x, y) {
    var sprite = this.createSprite(x, y);
    this.sprites[this.spriteId] = sprite; // lookup sprite given id
    sprite.id = this.spriteId; // lookup id given sprite
    sprite.baseScale = 1;
    if (animation) {
      this.setAnimation(sprite.id, animation);
    }
    sprite.speed = 10;
    sprite.patrolling = false;
    sprite.things_to_say = [];
    sprite.behaviors = [];
    sprite.collidable = false;
    sprite.collisionObjects = [];
    sprite.isGroup = false;
    this.spriteId++;
    return sprite.id;
  };

  window.p5.prototype.executeDrawLoopAndCallbacks = function() {
    this.drawSprites();
  };
};

module.exports = Spritelab;
