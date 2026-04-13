import { initGround } from "../entities/ground";
import { spawnProjectile } from "../entities/projectile";
import { spawnObstacle } from "../entities/obstacle";
import { spawnBonus } from "../entities/bonus";
import { mover } from "../components/mover";

export default function gameScene(data = { lives: 3, score: 0 }) {
  setGravity(2500);
  let isPaused = false;
  let seagullSoundPlayed = false;
  const highScore = Number(localStorage.getItem("highScore")) || 0;

  if (window.deathHandle) {
    window.deathHandle.stop();
    window.deathHandle = null;
  }

  // --- 1. FOND ---
  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
    z(0),
  ]);

  // --- 2. MANAGER (Avec paramètres de vitesse) ---
  const manager = add([
    "game_manager",
    {
      speed: 350, // Vitesse de départ
      maxSpeed: 1200, // Vitesse maximum (tu peux l'augmenter pour plus de défi)
      accel: 8, // Points de vitesse gagnés par seconde
      score: data.score,
      lives: data.lives,
    },
  ]);

  // --- 3. SCOREBOARD (HUD) ---
  const hudFrame = add([
    rect(240, 110, { radius: 10 }),
    pos(20, 20),
    color(0, 0, 0),
    opacity(0.6),
    outline(3, rgb(255, 255, 255)),
    fixed(),
    z(10),
  ]);

  const scoreLabel = add([
    text(`SCORE: ${Math.floor(manager.score)}`, { size: 22 }),
    pos(40, 35),
    fixed(),
    z(11),
    outline(2, rgb(0, 0, 0)),
  ]);

  const highScoreLabel = add([
    text(`BEST : ${highScore}`, { size: 18 }),
    pos(40, 65),
    color(255, 218, 68),
    fixed(),
    z(11),
    outline(2, rgb(0, 0, 0)),
  ]);

  const drawHearts = () => {
    destroyAll("heart_ui");
    for (let i = 0; i < manager.lives; i++) {
      add([
        sprite("heart", { width: 20, height: 20 }),
        pos(40 + i * 28, 90),
        fixed(),
        z(11),
        "heart_ui",
      ]);
    }
  };
  drawHearts();

  initGround();

  // --- 4. JOUEUR ---
  const player = add([
    sprite("seagullIdle", { width: 80, height: 80 }),
    pos(150, height() / 2),
    area(),
    body(),
    anchor("center"),
    z(3),
    "player",
    { canShoot: true, cooldown: 0.3, isInvincible: false },
  ]);

  function activateInvincibility() {
    player.isInvincible = true;
    const blink = loop(0.1, () => {
      player.opacity = player.opacity === 1 ? 0.3 : 1;
    });
    wait(5, () => {
      blink.cancel();
      player.opacity = 1;
      player.isInvincible = false;
    });
  }

  function handleDeath() {
    if (player.isInvincible) return;

    manager.lives--;
    drawHearts();

    play("death", { volume: 0.4, detune: 500 });

    if (manager.lives <= 0) {
      if (window.klaxonHandle) window.klaxonHandle.stop();
      if (window.seagullHandle) window.seagullHandle.stop();
      go("gameOver", { score: Math.floor(manager.score) });
    } else {
      shake(10);
      activateInvincibility();
    }
  }

  // --- 5. LOGIQUE UPDATE (Vitesse + Score) ---
  player.onUpdate(() => {
    if (isPaused) return;

    // AUGMENTATION DE LA VITESSE
    if (manager.speed < manager.maxSpeed) {
      manager.speed += manager.accel * dt();
    }

    player.pos.x = 150;

    // Le score augmente aussi un peu plus vite si on va plus vite !
    manager.score += dt() * (manager.speed / 30);
    scoreLabel.text = `SCORE: ${Math.floor(manager.score)}`;

    if (manager.score > highScore) {
      highScoreLabel.text = `BEST : ${Math.floor(manager.score)}`;
      highScoreLabel.color = rgb(255, 255, 255);
    }

    if (player.pos.y < 40) {
      player.pos.y = 40;
      player.vel.y = 0;
    }

    if (player.pos.y > height() + 100) {
      manager.lives = 0;
      handleDeath();
    }
  });

  // --- 6. NETTOYAGE PROJECTILES ---
  onUpdate("projectile", (p) => {
    if (p.pos.x < -100 || p.pos.x > width() + 100 || p.pos.y > height() + 100) {
      destroy(p);
    }
  });

  // --- 7. ACTIONS ---
  const jump = () => {
    if (isPaused) return;
    if (!seagullSoundPlayed) {
      window.seagullHandle = play("seagull", { volume: 0.3 });
      seagullSoundPlayed = true;
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
      window.poopHandle = play("poopSound", { volume: 0.6 });
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

  // --- 8. COLLISIONS ---
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
      pos(impactPos.x, impactPos.y - 10),
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
    handleDeath();
  });

  player.onCollide("ground", () => {
    if (isPaused) return;
    handleDeath();
  });

  // --- 9. SPAWNS ---
  loop(2.5, () => {
    if (!isPaused) spawnObstacle();
  });
  wait(1.2, () => {
    loop(3, () => {
      if (!isPaused) spawnBonus();
    });
  });

  // --- 10. PAUSE ---
  const pauseBtn = add([
    sprite("pauseBtn", { width: 40, height: 40 }),
    pos(width() - 40, 40),
    area(),
    fixed(),
    z(100),
    "pause_ui",
  ]);

  pauseBtn.onClick(() => {
    isPaused = !isPaused;
    get("*").forEach((obj) => {
      if (!obj.is("pause_ui")) obj.paused = isPaused;
    });
    pauseBtn.opacity = isPaused ? 0.5 : 1;
  });
}