export default function menuScene() {
  const highScore = Number(localStorage.getItem("highScore")) || 0;

  // On vérifie l'état actuel du volume au chargement de la scène
  let isMuted = volume() === 0;

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

  // 3. TITRE DU JEU
  add([
    text("FLYDOCK", { size: Math.floor(width() * 0.08) }),
    pos(center().x, height() * 0.15),
    anchor("center"),
    outline(8, rgb(0, 0, 0)),
    z(10),
  ]);

  // 4. MEILLEUR SCORE
  add([
    text(`MEILLEUR SCORE : ${highScore}`, { size: 24 }),
    pos(center().x, height() * 0.25),
    anchor("center"),
    color(255, 218, 68),
    outline(4, rgb(0, 0, 0)),
    z(10),
  ]);

  // 5. BOÎTE DES RÈGLES
  const rulesW = width() * 0.5;
  const rulesH = height() * 0.35;
  const rulesPos = vec2(center().x, height() * 0.45);

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
        "CLIC DROIT : EXCREMENTS\n\n" +
        "POINTS :\n" +
        "VOITURES : 500p\n" +
        "PIETONS : 300p",
      { size: 20, width: rulesW * 0.9, align: "center" },
    ),
    pos(rulesPos),
    anchor("center"),
    color(0, 0, 0),
    z(6),
  ]);

  // 6. BOUTON PLAY
  const btnPos = vec2(center().x, height() * 0.8);

  const startBtn = add([
    sprite("playbtn", { width: 220 }),
    pos(btnPos),
    anchor("center"),
    area(),
    z(10),
    "start_btn",
  ]);

  startBtn.onClick(() => go("game"));

  // 7. BOUTON SON (Bas à droite)
  const soundBtn = add([
    // Affiche le sprite en fonction de si le son est coupé ou non
    sprite(isMuted ? "soundoff" : "soundon", { width: 60, height: 60 }),
    pos(width() - 50, height() - 50),
    anchor("center"),
    area(),
    fixed(),
    z(10),
    "sound_btn",
  ]);

  // Logique de switch
  soundBtn.onClick(() => {
    isMuted = !isMuted;
    volume(isMuted ? 0 : 1); // Coupe ou active le son global du jeu

    // On met à jour le sprite immédiatement
    soundBtn.use(
      sprite(isMuted ? "soundoff" : "soundon", { width: 60, height: 60 }),
    );
  });

  // 8. ANIMATIONS DE SURVOL (Hover)
  // Animation pour le bouton Start
  onUpdate("start_btn", (b) => {
    if (b.isHovering()) {
      b.scale = vec2(1.1);
      setCursor("pointer");
    } else {
      b.scale = vec2(1);
    }
  });

  // Animation pour le bouton Son
  onUpdate("sound_btn", (s) => {
    if (s.isHovering()) {
      s.scale = vec2(1.1);
      setCursor("pointer");
    } else {
      s.scale = vec2(1);
    }

    // Reset le curseur si on ne survole aucun des deux boutons
    if (!s.isHovering() && !startBtn.isHovering()) {
      setCursor("default");
    }
  });
}
