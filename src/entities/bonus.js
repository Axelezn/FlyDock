import { G_HEIGHT, HITBOX_OFFSET } from "./ground";

export function spawnBonus() {
  const type = choose(["car1", "car2"]);
  const posY = height() - G_HEIGHT + HITBOX_OFFSET - 10;

  add([
    sprite(type, { width: 120, height: 67 }),
    anchor("botleft"),
    pos(width(), posY),
    area(),
    z(2),
    "bonus",
    {
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;

        const speed = manager?.speed || 350;
        this.move(-speed, 0);

        if (this.pos.x < -150) destroy(this);
      },
    },
  ]);
}
