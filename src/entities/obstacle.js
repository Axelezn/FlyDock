import { G_HEIGHT, HITBOX_OFFSET } from "./ground";

export function spawnObstacle() {
  const types = [
    "containervcma",
    "containervmanu",
    "containervharopa",
    "containerVrose",
  ];
  const spr = choose(types);

  // --- PARAMÈTRES DE DIMENSION ET DIFFICULTÉ ---
  const SEAGULL_H = 80;

  // --- RÉGLAGE DU PASSAGE ---
  // On réduit le passage de 3 à 2.7 mouettes (216px). Le défi est plus relevé !
  const GAP = SEAGULL_H * 2.7;

  // --- NOUVELLE LARGEUR (Axe X) ---
  // On augmente la largeur de 120 à 200 pour qu'ils paraissent massifs
  // et aient des proportions plus réalistes de conteneurs industriels.
  const OBSTACLE_W = 200;

  // --- AJUSTEMENT PRÉCIS DES HITBOXES ---
  // Comme les conteneurs sont plus larges, on ajuste les marges latérales (PADDING_X).
  // Cherche ces valeurs visuellement : le rectangle bleu doit coller au dessin.
  // Augmente ce chiffre pour resserrer le rectangle bleu vers le centre.
  const PADDING_X = 60;
  const HITBOX_W = OBSTACLE_W - PADDING_X * 2;

  // Marge de sécurité en haut/bas (SAFETY_MARGIN)
  // On garde ce réglage pour éviter de mourir dans le vide entre les deux conteneurs.
  const SAFETY_MARGIN = 45;

  // Calcul du sol physique
  const groundY = height() - G_HEIGHT + HITBOX_OFFSET;
  const totalAvailable = groundY - GAP;
  const topH = rand(totalAvailable * 0.05, totalAvailable * 0.95);

  // 1. OBSTACLE DU HAUT (Plafonnier)
  add([
    sprite(spr, { width: OBSTACLE_W, height: topH, flipY: true }),
    area({
      shape: new Rect(
        vec2(PADDING_X, 0), // On décale le rectangle bleu vers la droite
        HITBOX_W, // Largeur resserrée
        topH - SAFETY_MARGIN, // On raccourcit la hitbox en bas
      ),
    }),
    anchor("topleft"),
    pos(width(), 0), // Touche le plafond invisible
    z(2),
    "obstacle",
    {
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;
        this.move(-(manager?.speed || 350), 0);

        // Nettoyage automatique basé sur la nouvelle largeur
        if (this.pos.x < -OBSTACLE_W) destroy(this);
      },
    },
  ]);

  // 2. OBSTACLE DU BAS (Pilier)
  // On garde la hauteur visuelle de 800 pour traverser le sol
  const visualHeight = 800;

  add([
    sprite(spr, { width: OBSTACLE_W, height: visualHeight }),
    area({
      shape: new Rect(
        // On décale le rectangle bleu vers la droite ET vers le bas (pour pas que ça flotte)
        vec2(PADDING_X, SAFETY_MARGIN),
        HITBOX_W,
        visualHeight - SAFETY_MARGIN,
      ),
    }),
    anchor("topleft"),
    pos(width(), topH + GAP), // Spawn parfaitement après le passage
    z(2),
    "obstacle",
    {
      update() {
        const manager = get("game_manager")[0];
        if (this.paused || (manager && manager.paused)) return;
        this.move(-(manager?.speed || 350), 0);

        // Nettoyage automatique basé sur la nouvelle largeur
        if (this.pos.x < -OBSTACLE_W) destroy(this);
      },
    },
  ]);
}
