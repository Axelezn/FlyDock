export function spawnProjectile(pPos) {
  const gameManager = get("game_manager")[0];
  const currentSpeed = gameManager ? gameManager.speed : 350;

  // 1. On crée l'objet sans l'objet { vel } à la fin
  const p = add([
    sprite("seagullPoop", { width: 40, height: 40 }),
    pos(pPos.x, pPos.y + 30),
    area({ collisionIgnore: ["player"] }),
    body(),
    offscreen({ destroy: true }),
    "projectile",
  ]);

  // 2. On assigne la vitesse directement à l'objet créé
  p.vel.x = -currentSpeed * 0.2;
  p.vel.y = 200;
}
