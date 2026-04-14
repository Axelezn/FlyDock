export default function menuScene() {
  const highScore = Number(localStorage.getItem("highScore")) || 0;

  // --- CORRECTION VOLUME : getVolume() au lieu de volume() ---
  let isMuted = getVolume() === 0;

  // 1. FOND DE SCÈNE
  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
    z(0),
  ]);

  // 2. OVERLAY GRISÉ
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.5),
    fixed(),
    z(1),
  ]);

  // 3. LOGO DU JEU
  add([
    sprite("logoFlyDock", { width: 500 }),
    pos(center().x, height() * 0.15),
    anchor("center"),
    z(10),
  ]);

  // 4. MEILLEUR SCORE
  add([
    text(`MEILLEUR SCORE : ${highScore}`, { size: 24 }),
    pos(center().x, height() * 0.3),
    anchor("center"),
    color(255, 218, 68),
    outline(4, rgb(0, 0, 0)),
    z(10),
  ]);

  // 5. BOUTON DE SKINS
  const skinBtn = add([
    // --- CORRECTION SPRITE : "skinbtn" au lieu de "skin" ---
    sprite("skinbtn", { width: 220 }),
    pos(center().x, height() * 0.6),
    anchor("center"),
    area(),
    z(10),
    "skin_btn",
  ]);

  // Activation du bouton Skin
  skinBtn.onClick(() => go("skinMenu"));

  // 6. BOÎTE DES RÈGLES
  const rulesW = width() * 0.2;
  const rulesH = height() * 0.25;
  const rulesPos = vec2(200, height() * 0.2);

  add([
    rect(rulesW, rulesH, { radius: 20 }),
    pos(rulesPos),
    anchor("center"),
    color(255, 255, 255),
    outline(5, rgb(0, 0, 0)),
    z(5),
  ]);

  add([
    text(
      "LES REGLES DE FLYDOCK :\n\n" +
        "ESPACE : VOLER\n" +
        "CLIC DROIT : SURPRISE\n\n" +
        "POINTS :\n" +
        "VOITURES : 500p",
      { size: 18, width: rulesW * 0.9, align: "center" },
    ),
    pos(rulesPos),
    anchor("center"),
    color(0, 0, 0),
    z(6),
  ]);

  // 7. BOUTON PLAY
  const startBtn = add([
    sprite("playbtn", { width: 220 }),
    pos(center().x, height() * 0.8),
    anchor("center"),
    area(),
    z(10),
    "start_btn",
  ]);

  startBtn.onClick(() => go("game"));

  // 8. BOUTON SON
  const soundBtn = add([
    sprite(isMuted ? "soundoff" : "soundon", { width: 60, height: 60 }),
    pos(width() - 50, height() - 50),
    anchor("center"),
    area(),
    fixed(),
    z(10),
    "sound_btn",
  ]);

  soundBtn.onClick(() => {
    isMuted = !isMuted;
    // --- CORRECTION VOLUME : setVolume() au lieu de volume() ---
    setVolume(isMuted ? 0 : 1);

    soundBtn.use(
      sprite(isMuted ? "soundoff" : "soundon", { width: 60, height: 60 }),
    );
  });

  // 9. ANIMATIONS DE SURVOL (Hover)

  // Fonction pour mettre à jour le curseur globalement
  function updateCursor() {
    if (
      startBtn.isHovering() ||
      soundBtn.isHovering() ||
      skinBtn.isHovering()
    ) {
      setCursor("pointer");
    } else {
      setCursor("default");
    }
  }

  onUpdate("start_btn", (b) => {
    b.scale = b.isHovering() ? vec2(1.1) : vec2(1);
    updateCursor();
  });

  onUpdate("sound_btn", (s) => {
    s.scale = s.isHovering() ? vec2(1.1) : vec2(1);
    updateCursor();
  });

  // Ajout de l'animation pour le bouton Skin
  onUpdate("skin_btn", (sk) => {
    sk.scale = sk.isHovering() ? vec2(1.1) : vec2(1);
    updateCursor();
  });
}
