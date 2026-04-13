import { mover } from "../components/mover";

export function spawnBonus() {
  const carModel = choose(["car1", "car2"]);
  const carWidth = 120;
  const carHeight = 60;
  const groundHeight = 80; // Doit correspondre au G_SIZE de ground.js

  add([
    sprite(carModel, { width: carWidth, height: carHeight }),
    // Y = Hauteur totale - hauteur du sol - hauteur de la voiture
    pos(width() + 100, height() - groundHeight - carHeight),
    area(),
    mover(),
    z(2),
    "bonus",
  ]);
}
