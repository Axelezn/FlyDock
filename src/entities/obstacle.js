import { G_HEIGHT, HITBOX_OFFSET } from "./ground";

export function spawnObstacle() {
  const types = [
    "containervcma",
    "containervmanu",
    "containervharopa",
    "containerVrose",
  ];
  const spr = choose(types);

  // --- RÉGLAGES DU PASSAGE (Ajustement précis) ---
  const SEAGULL_H = 80;
  // Passage de 3.5 mouettes pour un défi équilibré (280px)
  const GAP = SEAGULL_H * 3.5;
  const OBSTACLE_W = 100;

  // Calcul de la position du sol physique (quai)
  const groundY = height() - G_HEIGHT + HITBOX_OFFSET;

  // Espace total à boucher par les obstacles
  const totalAvailable = groundY - GAP;

  // Répartition aléatoire de la hauteur (entre 15% et 85% pour éviter les bords extrêmes)
  const topH = rand(totalAvailable * 0.15, totalAvailable * 0.85);
  const bottomH = totalAvailable - topH;

  // 1. OBSTACLE DU HAUT (Plafonnier)
  add([
    sprite(spr, {
      width: OBSTACLE_W,
      height: topH,
      flipY: true,
    }),
    area(),
    anchor("topleft"),
    pos(width(), 0), // Touche le bord haut de l'écran
    z(2),
    "obstacle",
    {
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;

        const speed = manager?.speed || 350;
        this.move(-speed, 0);

        if (this.pos.x < -OBSTACLE_W) destroy(this);
      },
    },
  ]);

  // 2. OBSTACLE DU BAS (Posé au sol)
  add([
    sprite(spr, {
      width: OBSTACLE_W,
      height: bottomH,
    }),
    area(),
    anchor("botleft"),
    pos(width(), groundY), // Touche parfaitement le haut du quai
    z(2),
    "obstacle",
    {
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;

        const speed = manager?.speed || 350;
        this.move(-speed, 0);

        if (this.pos.x < -OBSTACLE_W) destroy(this);
      },
    },
  ]);
}
 