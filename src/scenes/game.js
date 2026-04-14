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
  const skinId = localStorage.getItem("selectedSkin") || "mouette";

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

  // --- 2. MANAGER ---
  const manager = add([
    "game_manager",
    {
      speed: 350,
      maxSpeed: 1200,
      accel: 8,
      score: data.score,
      lives: data.lives,
    },
  ]);

  // --- 3. HUD (SCORE & CŒURS) ---
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
    sprite(`${skinId}Idle`, { width: 80, height: 80 }),
    pos(250, height() / 2),
    area(),
    body(),
    anchor("center"),
    z(3),
    "player",
    { canShoot: true, cooldown: 0.3, isInvincible: false },
  ]);

  // --- 5. LOGIQUE DE PAUSE MODIFIÉE ---
  function togglePause() {
    isPaused = !isPaused;
    get("*").forEach((obj) => {
      if (!obj.is("pause_ui")) {
        obj.paused = isPaused;
      }
    });

    if (isPaused) {
      // 1. Overlay noir
      add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.5),
        fixed(),
        z(200),
        "pause_ui",
        "pause_menu_screen",
      ]);

      // 2. Texte PAUSE
      add([
        text("PAUSE", { size: 48 }),
        pos(center().x, center().y - 80),
        anchor("center"),
        fixed(),
        z(201),
        "pause_ui",
        "pause_menu_screen",
      ]);

      // 3. Remplacement du texte par le sprite backBtn pour reprendre
      const resumeBtn = add([
        sprite("backBtn", { width: 160 }),
        pos(center().x, center().y),
        area(),
        anchor("center"),
        fixed(),
        z(201),
        "pause_ui",
        "pause_menu_screen",
      ]);

      resumeBtn.onClick(togglePause);

      // 4. Bouton MENU sur l'overlay
      const menuBtn = add([
        sprite("menu", { width: 160 }),
        pos(center().x, center().y + 100),
        area(),
        anchor("center"),
        fixed(),
        z(201),
        "pause_ui",
        "pause_menu_screen",
      ]);

      menuBtn.onClick(() => {
        go("menu");
      });
    } else {
      destroyAll("pause_menu_screen");
    }
  }

  // --- 6. ACTIONS ---
  const jump = () => {
    if (isPaused) return;
    if (!seagullSoundPlayed) {
      window.seagullHandle = play("seagull", { volume: 0.3 });
      seagullSoundPlayed = true;
    }
    player.jump(800);
    player.use(sprite(`${skinId}Fly`, { width: 80, height: 80 }));
    wait(0.2, () => {
      if (player.exists())
        player.use(sprite(`${skinId}Idle`, { width: 80, height: 80 }));
    });
  };

  const shoot = () => {
    if (isPaused) return;
    if (player.canShoot) {
      window.poopHandle = play("poopSound", { volume: 0.6 });
      spawnProjectile(player.pos);
      player.use(sprite(`${skinId}Poop`, { width: 80, height: 80 }));
      player.canShoot = false;
      wait(player.cooldown, () => {
        if (player.exists()) {
          player.use(sprite(`${skinId}Idle`, { width: 80, height: 80 }));
          player.canShoot = true;
        }
      });
    }
  };

  onKeyPress("space", jump);
  onMousePress("left", jump);
  onMousePress("right", shoot);
  onKeyPress("escape", togglePause);

  // --- 7. LOGIQUE UPDATE ---
  player.onUpdate(() => {
    if (isPaused) return;
    if (manager.speed < manager.maxSpeed) {
      manager.speed += manager.accel * dt();
    }
    player.pos.x = 250;
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

  onUpdate("projectile", (p) => {
    if (p.pos.x < -100 || p.pos.x > width() + 100 || p.pos.y > height() + 100) {
      destroy(p);
    }
  });

  // --- 8. COLLISIONS ---
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

  onCollide("projectile", "bonus", (p, b) => {
    destroy(p);
    let dirtySprite =
      b.carColor === "car1"
        ? "car1sale"
        : b.carColor === "car2"
          ? "car2sale"
          : "";
    if (dirtySprite !== "") {
      b.use(sprite(dirtySprite, { width: 120, height: 67 }));
      b.unuse("bonus");
      manager.score += 500;
      play("poopSound", { volume: 0.3, detune: 500 });
    }
  });

  player.onCollide("life_bonus", (heart) => {
    if (manager.lives < 3) {
      manager.lives++;
      drawHearts();
      hudFrame.outline.color = rgb(0, 255, 0);
      wait(0.3, () => (hudFrame.outline.color = rgb(255, 255, 255)));
    }
    destroy(heart);
  });

  player.onCollide("obstacle", () => {
    if (!isPaused) handleDeath();
  });
  player.onCollide("ground", () => {
    if (!isPaused) handleDeath();
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

  // --- 10. BOUTON PAUSE (AGRANDI ET DÉPLACÉ EN BAS À DROITE) ---
  const pauseBtn = add([
    sprite("pauseBtn", { width: 80, height: 80 }), // Taille doublée
    pos(width() - 60, height() - 60), // Positionné en bas à droite
    area(),
    fixed(),
    anchor("center"),
    z(100),
    "pause_ui",
  ]);

  pauseBtn.onClick(togglePause);

  // --- FONCTIONS UTILES ---
  function activateInvincibility() {
    player.isInvincible = true;
    const blink = loop(0.1, () => {
      player.opacity = player.opacity === 1 ? 0.3 : 1;
    });
    wait(2, () => {
      blink.cancel();
      player.opacity = 1;
      player.isInvincible = false;
    });
  }

  function handleDeath() {
    if (player.isInvincible) return;
    manager.lives--;
    drawHearts();
    play("hitSound", { volume: 0.6 });
    if (manager.lives <= 0)
      go("gameOver", { score: Math.floor(manager.score) });
    else {
      shake(10);
      activateInvincibility();
    }
  }
}
