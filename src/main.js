import kaplay from "kaplay";
import gameScene from "./scenes/game";

kaplay();

// Définir la force de gravité (9.81 * 100 environ pour le feeling arcade)
setGravity(1600);

scene("game", gameScene);
go("game");
