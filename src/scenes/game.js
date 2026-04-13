import { addGround } from "../entities/terrain";
import { spawnProjectile } from "../entities/projectile";
import { spawnObstacle } from "../entities/obstacle";
import { spawnBonus } from "../entities/bonus";

export default function gameScene() {
  add([
    sprite("background", {
      // On force l'image à prendre toute la largeur et hauteur de l'écran
      width: width(),
      height: height(),
    }),
    pos(0, 0),
    fixed(), // Le fond ne bouge pas si la caméra bouge
    z(-1), // On le met sur la couche -1 pour être SÛR qu'il soit derrière tout
  ]);
  add([
    rect(200, 80),       // taille du cadre
    pos(10, 10),
    color(0, 0, 0),      // noir
    opacity(0.5),        // transparence
    fixed(),             // reste à l'écran
    z(1),               // au-dessus du fond
  ]);
  // Le son ne se lancera qu'au premier clic/touche pour éviter l'erreur AudioContext
  let musicStarted = false;

  const manager = add([
    "game_manager",
    {
      speed: 350,
      maxSpeed: 1000,
      accel: 20,
      score: 0,
    },
  ]);

  const scoreLabel = add([
    text("Score: 0", { size: 24 }),
    pos(24, 24),
    fixed(),
    z(2)
  ]);

  const lifeLabel = add([
    text("Vies: 3", { size: 24 }),
    pos(24, 60),
    fixed(),
    z(2)
  ]);

  addGround(0);
  addGround(width());

  // --- Le Goéland (80x80px) ---
  const player = add([
    sprite("seagullIdle", { width: 80, height: 80 }),
    pos(150, height() / 2),
    area(),
    body(),
    anchor("center"),
    "player",
    {
      health: 3,
      canShoot: true,
      cooldown: 0.3,
    },
  ]);

  player.onUpdate(() => {
    player.pos.x = 150;
    manager.score += dt()*20;
    scoreLabel.text = `Score: ${Math.floor(manager.score)}`;
    lifeLabel.text = `Vies: ${player.health}`;

    // LIMITE PLAFOND (L'oiseau ne peut pas sortir par le haut)
    if (player.pos.y < 40) {
      player.pos.y = 40;
      player.vel.y = 0;
    }

    // Mort si chute
    if (player.pos.y > height()) {
      go("game");
    }
  });

  // --- Fonctions d'actions ---
  const jump = () => {
    // Lance la musique au premier saut si elle n'a pas démarré
    if (!musicStarted) {
      play("seagull", { volume: 0.5 });
      musicStarted = true;
    }

    player.jump(700);
    player.use(sprite("seagullFly", { width: 80, height: 80 }));
    wait(0.3, () => {
      if (player.exists()) {
        player.use(sprite("seagullIdle", { width: 80, height: 80 }));
      }
    });
  };

  onKeyPress("space", jump);
  onMousePress("left", jump);

  onMousePress("right", () => {
    if (player.canShoot) {
      spawnProjectile(player.pos);
      // Change en sprite Poop sur le goéland
      player.use(sprite("seagullPoop", { width: 80, height: 80 }));
      player.canShoot = false;

      wait(player.cooldown, () => {
        if (player.exists()) {
          player.use(sprite("seagullIdle", { width: 80, height: 80 }));
          player.canShoot = true;
        }
      });
    }
  });

  function takeDamage(player) {
    player.health -= 1;

    if (player.health <= 0) {;
        go("game");
    }
  }

  // --- Collisions ---
  onCollide("projectile", "bonus", (p, b) => {
    destroy(p);
    destroy(b);
    manager.score += 500;
    addKaboom(b.pos);
  });

  player.onCollide("obstacle", () => takeDamage(player));
  player.onCollide("ground", () => takeDamage(player));

  // Boucles de jeu
  loop(2, () => spawnObstacle());
  loop(5, () => spawnBonus());
}
