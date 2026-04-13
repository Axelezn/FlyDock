export default function menuScene() {
  // RÉCUPÉRATION SÉCURISÉE : on transforme le texte en nombre
  const highScore = Number(localStorage.getItem("highScore")) || 0;

  // 1. Fond
  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
    z(0),
  ]);

  // 2. Overlay grisé
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.5),
    fixed(),
    z(1),
  ]);

  // 3. Titre
  add([
    text("FLYDOCK", { size: Math.floor(width() * 0.08) }),
    pos(center().x, height() * 0.15),
    anchor("center"),
    outline(8, rgb(0, 0, 0)),
    z(10),
  ]);

  // 4. Affichage Meilleur Score
  add([
    text(`MEILLEUR SCORE : ${highScore}`, { size: 24 }),
    pos(center().x, height() * 0.25),
    anchor("center"),
    color(255, 218, 68), // Jaune
    outline(4, rgb(0, 0, 0)),
    z(10),
  ]);

  // ... (Reste du code des règles et du bouton START identique)
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
      "LES REGLES DE FLYDOCK :\n\nESPACE : VOLER\nCLIC DROIT : EXCREMENTS\n\nPOINTS :\nVOITURES : 500p\nPIETONS : 300p",
      { size: 20, width: rulesW * 0.9, align: "center" },
    ),
    pos(rulesPos),
    anchor("center"),
    color(0, 0, 0),
    z(6),
  ]);
  const btnPos = vec2(center().x, height() * 0.75);
  const startBtn = add([
    rect(width() * 0.25, 80, { radius: 20 }),
    pos(btnPos),
    anchor("center"),
    color(255, 218, 68),
    outline(5, rgb(0, 0, 0)),
    area(),
    z(10),
    "start_btn",
  ]);
  add([
    text("START", { size: 40 }),
    pos(btnPos),
    anchor("center"),
    color(0, 0, 0),
    z(11),
  ]);
  startBtn.onClick(() => go("game"));
}
