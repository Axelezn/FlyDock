export function mover() {
  return {
    id: "mover",
    require: ["pos"],
    update() {
      const speed = get("game_manager")[0].speed;
      this.move(-speed, 0);
    },
  };
}
