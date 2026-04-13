import { addGround } from "../entities/terrain";

export default function gameScene() {
    addGround();
    add([
        rect(32, 32),
        pos(center()),
        color(255, 0, 0),
        area(),
        body(),
    ]);
}