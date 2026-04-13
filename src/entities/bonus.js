import { mover } from "../components/mover";

export function spawnBonus() {
  add([
    rect(40, 40),
    pos(width(), rand(100, height() - 150)),
    color(255, 0, 255),
    area(),
    mover(),
    offscreen({ destroy: true }),
    "bonus",
  ]);
}
