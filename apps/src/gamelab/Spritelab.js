var Spritelab = function() {
  console.log('spritelab!');
  this.p5 = null;

  var spriteId = 0;
  var sprites = {};

  var allSpritesWithAnimation = function(animationName) {
    let group = [];
    Object.keys(sprites).forEach(s => {
      if (sprites[s].animationName === animationName) {
        group.push(sprites[s]);
      }
    });
    return group;
  };

  var singleOrGroup = function(spriteOrGroup, func, args) {
    if (typeof spriteOrGroup === 'number') {
      // sprite referenced by index
      const sprite = sprites[spriteOrGroup];
      return [sprite];
    }
    if (typeof spriteOrGroup === 'string') {
      // group referenced by costume name
      const spriteGroup = allSpritesWithAnimation(spriteOrGroup);
      return spriteGroup;
    }
    console.log('unknown type of spriteOrGroup: ' + typeof spriteOrGroup);
  };

  window.p5.prototype.setAnimation = function(spriteIndex, animation) {
    let sprites = singleOrGroup(spriteIndex);
    if (sprites) {
      sprites.forEach(sprite => {
        sprite.setAnimation(animation);
        sprite.animationName = animation;
        sprite.scale /= sprite.baseScale;
        sprite.baseScale =
          100 /
          Math.max(
            100,
            sprite.animation.getHeight(),
            sprite.animation.getWidth()
          );
        sprite.scale *= sprite.baseScale;
      });
    }
  };

  window.p5.prototype.makeSpriteNative = function(animation, x, y) {
    var sprite = this.createSprite(x, y);
    sprites[spriteId] = sprite; // lookup sprite given id
    sprite.id = spriteId; // lookup id given sprite
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
    spriteId++;
    return sprite.id;
  };

  window.p5.prototype.executeDrawLoopAndCallbacks = function() {
    this.drawSprites();
  };
};

module.exports = Spritelab;
