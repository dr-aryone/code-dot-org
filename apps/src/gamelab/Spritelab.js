var Spritelab = function() {
  var spriteId = 0;
  var nativeSpriteMap = {};

  var allSpritesWithAnimation = function(animationName) {
    let group = [];
    Object.keys(nativeSpriteMap).forEach(s => {
      if (nativeSpriteMap[s].getAnimationLabel() === animationName) {
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

  window.p5.prototype.getProp = function(spriteIndex, prop) {
    if (!spriteIndex) {
      return undefined;
    }
    // Unclear how getters should function with groups. For now just use first element
    // ^ Pulled from library. TODO- now seems like a good time to make a decision here?
    let sprite = singleOrGroup(spriteIndex)[0];
    if (prop === 'scale') {
      return sprite.getScale() * 100;
    } else if (prop === 'costume') {
      return sprite.getAnimationLabel();
    } else if (prop === 'y') {
      return 400 - sprite.y;
    } else {
      return sprite[prop];
    }
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
    sprite.getScale = function() {
      return sprite.scale / sprite.baseScale;
    };
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
