export default function gameOverScene(data) {
  // --- 1. GESTION DU SCORE ET RECORD ---
  const currentScore = Math.floor(data.score);
  const oldHighScore = Number(localStorage.getItem("highScore")) || 0;
  let isNewRecord = false;

  if (currentScore > oldHighScore) {
    localStorage.setItem("highScore", currentScore);
    isNewRecord = true;
  }
  const highScore = isNewRecord ? currentScore : oldHighScore;

  // --- 2. AUDIO : Lancement du son de mort ---
  if (window.deathHandle) window.deathHandle.stop();
  window.deathHandle = play("death", { volume: 0.5 });

  // --- 3. DÉCOR ET OVERLAY ---
  add([sprite("background", { width: width(), height: height() }), pos(0, 0)]);

  // Filtre sombre pour faire ressortir le texte
  add([rect(width(), height()), color(0, 0, 0), opacity(0.6)]);

  // --- 4. TEXTES ---
  // Titre
  add([
    sprite("gameOver", { width: 750 }),
    pos(center().x, height() * 0.2),
    anchor("center"),
  ]);

  // Score Actuel
  add([
    text(`SCORE : ${currentScore}`, { size: 40 }),
    pos(center().x, height() * 0.35),
    anchor("center"),
    color(255, 255, 255),
  ]);

  // Meilleur Score
  add([
    text(`MEILLEUR SCORE : ${highScore}`, { size: 24 }),
    pos(center().x, height() * 0.45),
    anchor("center"),
    color(200, 200, 200),
  ]);

  // Badge Record (Si battu)
  if (isNewRecord) {
    const recordLabel = add([
      text("NOUVEAU RECORD !", { size: 30 }),
      pos(center().x, height() * 0.52),
      anchor("center"),
      color(255, 218, 68),
    ]);

    // Petit effet de clignotement pour le record
    onUpdate(() => {
      recordLabel.opacity = wave(0.2, 1, time() * 5);
    });
  }

  // --- 5. BOUTONS INTERACTIFS ---

  const stopAllAndGo = (scene) => {
    if (window.deathHandle) window.deathHandle.stop();
    if (window.klaxonHandle) window.klaxonHandle.stop();
    if (window.seagullHandle) window.seagullHandle.stop();
    go(scene);
  };

  // Bouton REJOUER
  const btnReplay = add([
    sprite("newGame", { width: 200 }),
    pos(center().x, height() * 0.7),
    anchor("center"),
    area(),
    "btn",
  ]);

  add([
    pos(center().x, height() * 0.78),
    anchor("center"),
  ]);

  // Bouton MENU
  const btnMenu = add([
    pos(center().x, height() * 0.88),
    anchor("center"),
    sprite("menu", { width: 200 }),
    area(),
    "btn",
  ]);

  // --- 6. LOGIQUE DES BOUTONS ---

  btnReplay.onClick(() => stopAllAndGo("game"));
  btnMenu.onClick(() => stopAllAndGo("menu"));

  // Touche Espace pour rejouer vite
  onKeyPress("space", () => stopAllAndGo("game"));

  // Effets au survol (Hover)
  onUpdate("btn", (b) => {
    if (b.isHovering()) {
      b.scale = vec2(1.1);
      setCursor("pointer");
    } else {
      b.scale = vec2(1);
    }

    // Si aucun bouton n'est survolé, on remet le curseur par défaut
    if (!btnReplay.isHovering() && !btnMenu.isHovering()) {
      setCursor("default");
    }
  });
}
