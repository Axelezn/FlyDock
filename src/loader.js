export function loadAssets() {
  // On retire "../public/" car Vite sert ce dossier comme étant la racine "/"
  loadSound("seagull", "sounds/seagull.mp3");
  loadSound("poopSound", "sounds/poopSound.m4a");
  loadSound("klaxonbateau", "sounds/klaxonbateau.mp3");
  loadSound("death", "sounds/death.mp3");
  loadSound("hitSound", "sounds/hitSound.mp3");

  loadSprite("seagullIdle", "sprites/seagullIdle.png");
  loadSprite("seagullFly", "sprites/seagullFly.png");
  loadSprite("seagullPoop", "sprites/seagullPoop.png");
  loadSprite("background", "sprites/background.jpg");
  loadSprite("car1", "sprites/car1.png");
  loadSprite("car2", "sprites/car2.png");
  loadSprite("poop", "sprites/poop.png");
  loadSprite("poopSplat", "sprites/epoop.png");
  loadSprite("container_cma", "sprites/container_cma.png");
  loadSprite("container_manu", "sprites/container_manu.png");
  loadSprite("container_haropa", "sprites/container_haropa.png");
  loadSprite("pauseBtn", "sprites/pause.png");
  loadSprite("heart", "sprites/heart.png");
  loadSprite("containervcma", "sprites/containerVcma.png");
  loadSprite("containervmanu", "sprites/containerVmanu.png");
  loadSprite("containervharopa", "sprites/containerVharopa.png");
  loadSprite("playbtn", "sprites/playBtn.png");
  loadSprite("soundon", "sprites/soundon.png");
  loadSprite("soundoff", "sprites/soundoff.png");
  loadSprite("containerVrose", "sprites/containerVrose.png");
  loadSprite("containerrose", "sprites/containerrose.png");
  loadSprite("car1sale", "sprites/car1sale.png");
  loadSprite("car2sale", "sprites/car2sale.png");
  loadSprite("flecheDroite", "sprites/flecheDroite.png");
  loadSprite("flecheGauche", "sprites/flecheGauche.png");
  loadSprite("skinbtn", "sprites/skinBtn.png");
  loadSprite("logoFlyDock", "sprites/logoFlyDock.png");
  loadSprite("gameOver", "sprites/gameOver.png");
  loadSprite("newGame", "sprites/newGame.png");
  loadSprite("menu", "sprites/menuBtn.png");
  loadSprite("backBtn", "sprites/backBtn.png");

  // Skins
  loadSprite("mouettePirateIdle", "sprites/mouettePirateIdle.png");
  loadSprite("mouettePirateFly", "sprites/mouettePirateFly.png");
  loadSprite("mouettePiratePoop", "sprites/mouettePiratePoop.png");
}
