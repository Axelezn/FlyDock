import { initGround } from "../entities/ground";
import { spawnProjectile } from "../entities/projectile";
import { spawnObstacle } from "../entities/obstacle";
import { spawnBonus } from "../entities/bonus";
import { mover } from "../components/mover";

let musicStarted = false;

export default function gameScene(data = { lives: 3, score: 0 }) {
  // 1. PHYSIQUE ET ÉTAT
  setGravity(2500);
  let isPaused = false;

  // NOUVEAU : Récupération du record pour l'affichage HUD
  const highScore = localStorage.getItem("highScore") || 0;

  // 2. FOND
  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
    z(0),
  ]);

  // 3. MANAGER (Vies et Score)
  const manager = add([
    "game_manager",
    {
      speed: 350,
      maxSpeed: 1000,
      accel: 20,
      score: data.score,
      lives: data.lives,
    },
  ]);

  // 4. INTERFACE (UI)
  // Score actuel
  const scoreLabel = add([
    text(`Score: ${Math.floor(manager.score)}`, { size: 24 }),
    pos(24, 24),
    fixed(),
    z(10),
  ]);

  // NOUVEAU : Affichage du Meilleur Score en haut à droite
  const highScoreLabel = add([
    text(`Record: ${highScore}`, { size: 24 }),
    pos(width() - 24, 24),
    anchor("topright"),
    fixed(),
    z(10),
    color(255, 255, 255),
  ]);

  // Affichage des cœurs
  const drawHearts = () => {
    destroyAll("heart_ui");
    for (let i = 0; i < manager.lives; i++) {
      add([
        sprite("heart", { width: 30, height: 30 }),
        pos(24 + i * 35, 60),
        fixed(),
        z(10),
        "heart_ui",
      ]);
    }
  };
  drawHearts();

  // 5. SOL ET ENTITÉS
  initGround();

  const player = add([
    sprite("seagullIdle", { width: 80, height: 80 }),
    pos(150, height() / 2),
    area(),
    body(),
    anchor("center"),
    z(3),
    "player",
    { canShoot: true, cooldown: 0.3 },
  ]);

  // 6. LOGIQUE JOUEUR
  player.onUpdate(() => {
    if (isPaused) return;

    player.pos.x = 150;
    manager.score += dt() * 10;
    scoreLabel.text = `Score: ${Math.floor(manager.score)}`;

    // NOUVEAU : Si on dépasse le record en direct, on change la couleur du texte !
    if (manager.score > highScore) {
      highScoreLabel.text = `Record: ${Math.floor(manager.score)}`;
      highScoreLabel.color = rgb(255, 218, 68); // Devient Jaune
    }

    if (player.pos.y < 40) {
      player.pos.y = 40;
      player.vel.y = 0;
    }

    if (player.pos.y > height() + 100) {
      handleDeath();
    }
  });

  function handleDeath() {
    manager.lives--;
    if (manager.lives <= 0) {
      go("gameOver", { score: Math.floor(manager.score) });
    } else {
      go("game", { lives: manager.lives, score: manager.score });
    }
  }

  // 7. ACTIONS
  const jump = () => {
    if (isPaused) return;
    if (!musicStarted) {
      play("seagull", { volume: 0.3 });
      musicStarted = true;
    }
    player.jump(800);
    player.use(sprite("seagullFly", { width: 80, height: 80 }));
    wait(0.2, () => {
      if (player.exists())
        player.use(sprite("seagullIdle", { width: 80, height: 80 }));
    });
  };

  const shoot = () => {
    if (isPaused) return;
    if (player.canShoot) {
      play("poopSound", { volume: 0.6 });
      spawnProjectile(player.pos);
      player.use(sprite("seagullPoop", { width: 80, height: 80 }));
      player.canShoot = false;
      wait(player.cooldown, () => {
        if (player.exists()) {
          player.use(sprite("seagullIdle", { width: 80, height: 80 }));
          player.canShoot = true;
        }
      });
    }
  };

  onKeyPress("space", jump);
  onMousePress("left", jump);
  onMousePress("right", shoot);

  // 8. COLLISIONS
  onCollide("projectile", "bonus", (p, b) => {
    destroy(p);
    destroy(b);
    manager.score += 500;
  });

  onCollide("projectile", "ground", (p) => {
    const impactPos = p.pos;
    destroy(p);
    const splat = add([
      sprite("poopSplat", { width: 60, height: 30 }),
      pos(impactPos.x, impactPos.y),
      mover(),
      z(2),
      "splat",
    ]);
    wait(2, () => {
      if (splat.exists()) destroy(splat);
    });
  });

  player.onCollide("obstacle", () => {
    if (isPaused) return;
    shake();
    handleDeath();
  });

  player.onCollide("ground", () => {
    if (isPaused) return;
    handleDeath();
  });

  // 9. BOUCLES (Spawns)
  loop(2.5, () => {
    if (!isPaused) spawnObstacle();
  });
  wait(1.2, () => {
    loop(3, () => {
      if (!isPaused) spawnBonus();
    });
  });

  // 10. BOUTON PAUSE
  const pauseBtn = add([
    sprite("pauseBtn", { width: 50, height: 50 }),
    pos(width() - 70, height() - 70),
    area(),
    fixed(),
    z(100),
    "pause_ui",
  ]);

  pauseBtn.onClick(() => {
    isPaused = !isPaused;
    get("*").forEach((obj) => {
      if (!obj.is("pause_ui")) {
        obj.paused = isPaused;
      }
    });
    pauseBtn.opacity = isPaused ? 0.5 : 1;
  });
}
