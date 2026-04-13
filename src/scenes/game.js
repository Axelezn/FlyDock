import { addGround } from "../entities/terrain";
import { spawnProjectile } from "../entities/projectile";

export default function gameScene() {
  play("seagull", { volume: 0.5 });

  const manager = add([
    "game_manager",
    {
      speed: 350,
      maxSpeed: 1000,
      accel: 20,
    },
  ]);

  addGround(0);
  addGround(width());

  const player = add([
    rect(32, 32),
    pos(150, height() / 2),
    area(),
    body(),
    color(255, 0, 0),
    "player",
    {
      canShoot: true,
      cooldown: 0.3,
    },
  ]);

  player.onUpdate(() => {
    player.pos.x = 150;

    if (player.pos.y < 0) {
      player.pos.y = 0;
      player.vel.y = 0;
    }
    if (player.pos.y > height()) {
      go("game");
    }
  });

  onKeyPress("space", () => {
    player.jump(800);
  });

  onMousePress("right", () => {
    if (player.canShoot) {
      spawnProjectile(player.pos);
      player.canShoot = false;
      wait(player.cooldown, () => {
        player.canShoot = true;
      });
    }
  });

  player.onCollide("ground", () => {
    shake();
    addKaboom(player.pos);
    wait(0.5, () => go("game"));
  });
}
