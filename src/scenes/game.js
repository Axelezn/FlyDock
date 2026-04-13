import { addGround } from "../entities/terrain";

export default function gameScene() {
  // 1. Gestionnaire de vitesse (Game Manager)
  // On crée un objet invisible qui contient la vitesse actuelle du jeu
  const manager = add([
    "game_manager",
    {
      speed: 350, // Vitesse de départ
      maxSpeed: 1000, // Vitesse maximale
      accel: 20, // Accélération par seconde
    },
  ]);

  // Logique d'accélération progressive
  onUpdate(() => {
    if (manager.speed < manager.maxSpeed) {
      manager.speed += manager.accel * dt();
    }
  });

  // 2. Le Sol "Infini"
  // On en place deux l'un après l'autre. Le composant 'scroller'
  // les fera boucler automatiquement.
  addGround(0);
  addGround(width());

  // 3. Le Joueur (le carré)
  const player = add([
    rect(32, 32),
    pos(150, height() / 2), // Positionné à gauche
    area(),
    body(),
    color(255, 0, 0),
    "player",
  ]);

  // Contrôle de saut (Flappy Bird Style)
  onKeyPress("space", () => {
    player.jump(750);
  });

  // Condition de défaite (Collision avec le sol)
  player.onCollide("ground", () => {
    shake();
    addKaboom(player.pos);
    // On attend un court instant avant de recommencer
    wait(0.5, () => go("game"));
  });
}
