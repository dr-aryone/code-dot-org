var Spritelab = function() {
  var spriteId = 0;
  var nativeSpriteMap = {};

  var allSpritesWithAnimation = function(animationName) {
    let group = [];
    Object.keys(nativeSpriteMap).forEach(s => {
      if (nativeSpriteMap[s].animationName === animationName) {
        group.push(nativeSpriteMap[s]);
      }
    });
    return group;
  };

  var singleOrGroup = function(spriteOrGroup, func, args) {
    if (typeof spriteOrGroup === 'number') {
      // sprite referenced by index
      const sprite = nativeSpriteMap[spriteOrGroup];
      return [sprite];
    }
    if (typeof spriteOrGroup === 'string') {
      // group referenced by costume name
      const spriteGroup = allSpritesWithAnimation(spriteOrGroup);
      return spriteGroup;
    }
    console.log('unknown type of spriteOrGroup: ' + typeof spriteOrGroup);
  };

  window.p5.prototype.destroy = function(spriteIndex) {
    let sprites = singleOrGroup(spriteIndex);
    if (sprites) {
      sprites.forEach(sprite => {
        sprite.destroy();
        delete nativeSpriteMap[sprite.id];
      });
    }
  };

  window.p5.prototype.setAnimation = function(spriteIndex, animation) {
    let nativeSpriteMap = singleOrGroup(spriteIndex);
    if (nativeSpriteMap) {
      nativeSpriteMap.forEach(sprite => {
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
    nativeSpriteMap[spriteId] = sprite; // lookup sprite given id
    sprite.id = spriteId; // lookup id given sprite
    sprite.baseScale = 1;
    if (animation) {
      this.setAnimation(sprite.id, animation);
    }
    spriteId++;
    return sprite.id;
  };

  window.p5.prototype.executeDrawLoopAndCallbacks = function() {
    this.drawSprites();
  };
};

module.exports = Spritelab;
