export function addGround() {
    return add([
        rect(width(), 48),
        pos(0, height() - 48),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
        "ground",
    ]);
}