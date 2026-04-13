import kaplay from "kaplay";
import { loadAssets } from "./loader";
import gameScene from "./scenes/game";

kaplay();

setGravity(1600);

loadAssets();

scene("game", gameScene);

onLoad(() => {
  go("game");
});
