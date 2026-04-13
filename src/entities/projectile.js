export function spawnProjectile(pPos) {
  const gameManager = get("game_manager")[0];
  const currentSpeed = gameManager ? gameManager.speed : 350;

  const p = add([
    // 1. On force la taille et on s'assure que le nom "poop" est le bon
    sprite("poop", { width: 40, height: 40 }),
    pos(pPos.x, pPos.y + 40),
    area({ collisionIgnore: ["player"] }),
    body(),
    offscreen({ destroy: true }),
    // 2. On le met au premier plan
    z(5),
    // 3. Secours : si l'image bug, on verra au moins un point blanc
    color(255, 255, 255),
    "projectile",
  ]);

  p.vel.x = -currentSpeed * 0.5;
  p.vel.y = 400;
}
