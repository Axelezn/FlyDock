const containerSprites = [
  "container_cma",
  "container_manu",
  "container_haropa",
];

// On définit deux tailles distinctes
const G_WIDTH = 200; // Plus long sur l'axe X
const G_HEIGHT = 80; // On garde la même hauteur pour que les voitures restent posées

export function initGround() {
  // On calcule le nombre nécessaire de containers en fonction de la nouvelle largeur
  const count = Math.ceil(width() / G_WIDTH) + 2;

  for (let i = 0; i < count; i++) {
    add([
      // On applique les dimensions ici
      sprite(containerSprites[i % 3], { width: G_WIDTH, height: G_HEIGHT }),
      pos(i * G_WIDTH, height() - G_HEIGHT),
      area(),
      body({ isStatic: true }),
      z(1),
      "ground",
      {
        update() {
          const speed = get("game_manager")[0]?.speed || 350;
          this.move(-speed, 0);

          // Logique de boucle infinie mise à jour avec G_WIDTH
          if (this.pos.x <= -G_WIDTH) {
            this.pos.x += count * G_WIDTH;
            // On change de sprite aléatoirement pour varier
            this.use(
              sprite(choose(containerSprites), {
                width: G_WIDTH,
                height: G_HEIGHT,
              }),
            );
          }
        },
      },
    ]);
  }
}
