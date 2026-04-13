export function scroller() {
  return {
    id: "scroller",
    require: ["pos"],
    update() {
      this.move(-get("game_manager")[0].speed, 0);
      if (this.pos.x <= -width()) {
        this.pos.x += width() * 2;
      }
    },
  };
}
