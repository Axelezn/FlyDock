export function loadAssets() {
  // On retire "../public/" car Vite sert ce dossier comme étant la racine "/"
  loadSound("seagull", "sounds/seagull.mp3");
  loadSound("poopSound", "sounds/poopSound.m4a");

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
}
