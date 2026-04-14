import kaplay from "kaplay";
import gameScene from "./scenes/game";
import menuScene from "./scenes/menu";
import gameOverScene from "./scenes/gameOver";
import skinMenu from "./scenes/skinMenu";
import { loadAssets } from "./loader";

const k = kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
  letterbox: false, // Permet au jeu de s'étendre sur tout l'écran
  global: true,
});

loadAssets();

// Déclaration des scènes
scene("menu", menuScene);
scene("skinMenu", skinMenu);
scene("game", gameScene);
scene("gameOver", gameOverScene);

// Lancement
go("menu");
