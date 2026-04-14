import { G_HEIGHT, HITBOX_OFFSET } from "./ground";

export function spawnBonus() {
  const manager = get("game_manager")[0];

  let isHeart = false;
  if (manager && manager.lives < 3 && chance(0.15)) {
    isHeart = true;
  }

  // On choisit la couleur de la voiture
  const carType = choose(["car1", "car2"]);
  const type = isHeart ? "heart" : carType;

  const posY = isHeart
    ? rand(150, height() - G_HEIGHT - 100)
    : height() - G_HEIGHT + HITBOX_OFFSET - 10;

  add([
    sprite(
      type,
      isHeart ? { width: 45, height: 45 } : { width: 120, height: 67 },
    ),
    anchor(isHeart ? "center" : "botleft"),
    pos(width(), posY),
    area(),
    z(2),
    isHeart ? "life_bonus" : "bonus",
    {
      // Propriété mémorisée pour savoir quelle version "sale" charger
      carColor: carType,
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;

        const speed = manager?.speed || 350;
        this.move(-speed, 0);

        if (this.pos.x < -200) destroy(this);
      },
    },
  ]);
}
