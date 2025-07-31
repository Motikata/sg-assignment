import { Container, Graphics, Text } from "pixi.js";

export class Button extends Container {
    constructor(
        label: string,
        onClick: () => void,
        width: number = 200,
        height: number = 50,
        fontSize: number = 18
    ) {
        super();

        // Draw button background
        const bg = new Graphics();
        bg.beginFill(0x004488);
        bg.drawRoundedRect(0, 0, width, height, 14);
        bg.endFill();
        this.addChild(bg);

        // Create and center text
        const txt = new Text(label, { fontSize, fill: 0xffffff });
        txt.anchor.set(0.5);
        txt.x = width / 2;
        txt.y = height / 2;
        this.addChild(txt);

        // Button interactivity
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on("pointertap", () => onClick());
    }
}
