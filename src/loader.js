export function loadAssets() {
  // On retire "../public/" car Vite sert ce dossier comme étant la racine "/"
  loadSound("seagull", "sounds/seagull.mp3");

  loadSprite("seagullIdle", "sprites/seagullIdle.png");
  loadSprite("seagullFly", "sprites/seagullFly.png");
  loadSprite("seagullPoop", "sprites/seagullPoop.png");
  loadSprite("background", "sprites/background.jpg");
}
