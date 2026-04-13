export default function gameOverScene(data) {
  // RÉCUPÉRATION SÉCURISÉE
  let highScore = Number(localStorage.getItem("highScore")) || 0;
  let isNewRecord = false;

  // Comparaison de nombres
  if (data.score > highScore) {
    highScore = data.score;
    localStorage.setItem("highScore", highScore.toString());
    isNewRecord = true;
  }

  add([
    sprite("background", { width: width(), height: height() }),
    pos(0, 0),
    fixed(),
  ]);

  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.8),
    fixed(),
  ]);

  add([
    text("GAME OVER", { size: 80 }),
    pos(center().x, height() * 0.2),
    anchor("center"),
    color(255, 50, 50),
    outline(6, rgb(0, 0, 0)),
  ]);

  add([
    text(`SCORE : ${data.score}`, { size: 35 }),
    pos(center().x, height() * 0.35),
    anchor("center"),
    outline(4, rgb(0, 0, 0)),
  ]);

  add([
    text(isNewRecord ? "NOUVEAU RECORD !" : `MEILLEUR SCORE : ${highScore}`, {
      size: 25,
    }),
    pos(center().x, height() * 0.45),
    anchor("center"),
    color(255, 218, 68),
    outline(4, rgb(0, 0, 0)),
  ]);

  // Boutons REJOUER / MENU
  const retryBtn = add([
    rect(300, 70, { radius: 15 }),
    pos(center().x, height() * 0.65),
    anchor("center"),
    color(255, 218, 68),
    outline(4, rgb(0, 0, 0)),
    area(),
  ]);
  add([
    text("REJOUER", { size: 30 }),
    pos(center().x, height() * 0.65),
    anchor("center"),
    color(0, 0, 0),
  ]);
  retryBtn.onClick(() => go("game", { lives: 3, score: 0 }));

  const menuBtn = add([
    rect(300, 50, { radius: 10 }),
    pos(center().x, height() * 0.8),
    anchor("center"),
    color(255, 255, 255),
    outline(3, rgb(0, 0, 0)),
    area(),
  ]);
  add([
    text("MENU", { size: 20 }),
    pos(center().x, height() * 0.8),
    anchor("center"),
    color(0, 0, 0),
  ]);
  menuBtn.onClick(() => go("menu"));
}
