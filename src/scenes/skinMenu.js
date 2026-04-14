export default function skinMenu() {
  // --- 1. CONFIGURATION DES SKINS ---
  const availableSkins = [
    { id: "seagull", name: "Classique" },
    { id: "mouettePirate", name: "Pirate des Mers" },
  ];

  let savedSkin = localStorage.getItem("selectedSkin") || "seagull";
  let currentIndex = availableSkins.findIndex((s) => s.id === savedSkin);
  if (currentIndex === -1) currentIndex = 0;

  // --- 2. FOND ET OVERLAY (ASSOMBRISSEMENT) ---
  // On affiche le fond
  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
    z(0),
  ]);

  // On ajoute le calque noir pour assombrir
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.6), // Ajuste cette valeur (0.1 à 1) pour assombrir plus ou moins
    fixed(),
    z(1),
  ]);

  // --- 3. TITRE ---
  add([
    text("VESTIAIRE", { size: 32 }),
    pos(width() / 2, 80),
    anchor("center"),
    z(10), // On s'assure que le texte est au-dessus de l'overlay
  ]);

  // --- 4. AFFICHAGE DU PERSONNAGE (CENTRE) ---
  const skinDisplay = add([
    sprite(`${availableSkins[currentIndex].id}Fly`, {
      width: 350,
      height: 175,
    }),
    pos(width() / 2, height() / 2),
    anchor("center"),
    z(10),
  ]);

  const nameLabel = add([
    text(availableSkins[currentIndex].name, { size: 24 }),
    pos(width() / 2, height() / 2 + 140),
    anchor("center"),
    color(255, 218, 68),
    z(10),
  ]);

  // --- 5. FONCTION DE MISE À JOUR ---
  function updateSkinUI() {
    const skin = availableSkins[currentIndex];
    skinDisplay.use(sprite(`${skin.id}Fly`, { width: 350, height: 175 }));
    nameLabel.text = skin.name;
    localStorage.setItem("selectedSkin", skin.id);
  }

  // --- 6. LES BOUTONS FLÈCHES (SPRITES) ---

  const btnLeft = add([
    sprite("flecheGauche", { width: 60, height: 60 }),
    pos(width() / 2 - 200, height() / 2),
    area(),
    scale(1),
    anchor("center"),
    z(10),
    "arrow_btn",
  ]);

  const btnRight = add([
    sprite("flecheDroite", { width: 60, height: 60 }),
    pos(width() / 2 + 200, height() / 2),
    area(),
    scale(1),
    anchor("center"),
    z(10),
    "arrow_btn",
  ]);

  // --- 7. LOGIQUE DE CLIC ---
  btnLeft.onClick(() => {
    currentIndex =
      (currentIndex - 1 + availableSkins.length) % availableSkins.length;
    updateSkinUI();
    play("hitSound", { detune: 500 });
  });

  btnRight.onClick(() => {
    currentIndex = (currentIndex + 1) % availableSkins.length;
    updateSkinUI();
    play("hitSound", { detune: 500 });
  });

  // --- 8. BOUTON RETOUR ---
  const backBtn = add([
    rect(160, 50, { radius: 8 }),
    pos(width() / 2, height() - 80),
    color(40, 40, 40),
    area(),
    anchor("center"),
    outline(2, rgb(255, 255, 255)),
    z(10),
  ]);

  add([
    text("RETOUR", { size: 20 }),
    pos(width() / 2, height() - 80),
    anchor("center"),
    z(11),
  ]);

  backBtn.onClick(() => go("menu"));

  // --- 9. ANIMATIONS FLUIDES (Hover) ---
  onUpdate("arrow_btn", (b) => {
    if (b.isHovering()) {
      b.scale = lerp(b.scale, vec2(1.2), dt() * 10);
      setCursor("pointer");
    } else {
      b.scale = lerp(b.scale, vec2(1), dt() * 10);
    }
  });
}
