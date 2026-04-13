export function spawnProjectile(pPos) {
  const gameManager = get("game_manager")[0];
  const currentSpeed = gameManager ? gameManager.speed : 350;

  const projectile = add([
    rect(8, 8),
    // On spawn légèrement plus bas (y + 35) pour éviter l'overlap
    pos(pPos.x + 12, pPos.y + 35),
    color(255, 255, 255),
    // On demande explicitement d'ignorer les collisions avec le joueur
    area({ collisionIgnore: ["player"] }),
    body(),
    offscreen({ destroy: true }),
    "projectile",
  ]);

  projectile.vel.x = -currentSpeed * 0.2;
  projectile.vel.y = 100;
}
