export const G_HEIGHT = 200;
export const G_VISUAL_HEIGHT = 450;
export const HITBOX_OFFSET = 150;
const OVERLAP = 130;

const containerSprites = [
  "container_cma",
  "container_manu",
  "container_haropa",
  "containerrose",
];

export function initGround() {
  const sprData = getSprite(containerSprites[0]);
  const ratio = sprData ? G_VISUAL_HEIGHT / sprData.data.tex.height : 1;
  const G_WIDTH = sprData ? Math.floor(sprData.data.tex.width * ratio) : 400;

  const spacing = G_WIDTH - OVERLAP;
  const count = Math.ceil(width() / spacing) + 2;

  for (let i = 0; i < count; i++) {
    add([
      sprite(containerSprites[i % containerSprites.length], {
        width: G_WIDTH,
        height: G_VISUAL_HEIGHT,
      }),

      anchor("topleft"),

      // Positionné à height() - 180
      pos(i * spacing, height() - G_HEIGHT),

      area({
        shape: new Rect(
          vec2(0, HITBOX_OFFSET), // Hitbox encore plus basse
          G_WIDTH,
          G_HEIGHT - HITBOX_OFFSET,
        ),
      }),

      body({ isStatic: true }),
      z(1),
      "ground",

      {
        update() {
          const manager = get("game_manager")[0];
          if (this.paused || (manager && manager.paused)) return;

          this.move(-(manager?.speed || 350), 0);

          if (this.pos.x <= -G_WIDTH) {
            this.pos.x += count * spacing;
          }
        },
      },
    ]);
  }
}
