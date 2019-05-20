function createNewSprite(name, animation, location) {
  var spriteIndex = makeSpriteNative(animation, location.x, location.y);
  return spriteIndex;
}

function makeNewSpriteAnon(animation, location) {
  makeSpriteNative(animation, location.x, location.y);
}

function draw() {
  executeDrawLoopAndCallbacks();
}