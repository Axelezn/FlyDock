import { mover } from "../components/mover";

export function spawnObstacle() {
  const h = rand(40, 100);
  const w = rand(40, 80);

  // Bas
  add([
    rect(w, h),
    pos(width(), height() - 48 - h),
    color(255, 255, 0),
    area(),
    body({ isStatic: true }),
    mover(),
    offscreen({ destroy: true }),
    "obstacle",
  ]);

  // Haut (Miroir)
  add([
    rect(w, h),
    pos(width(), 0),
    color(255, 255, 0),
    area(),
    body({ isStatic: true }),
    mover(),
    offscreen({ destroy: true }),
    "obstacle",
  ]);
}
