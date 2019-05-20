function makeNewSprite(animation, x, y) {
  var spriteIndex = makeSpriteNative(x, y);
  return spriteIndex;
}

function makeNewSpriteAnon(animation, location) {
  makeSpriteNative(animation, location.x, location.y);
}

function draw() {
  executeDrawLoopAndCallbacks();
}