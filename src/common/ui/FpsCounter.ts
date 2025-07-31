import { Container, Text } from "pixi.js";

export class FpsCounter extends Container {
    private text: Text;
    private last: number = 0;
    private frames: number = 0;

    constructor() {
        super();
        this.text = new Text("FPS: ?", { fontSize: 16, fill: 0xffffff });
        this.addChild(this.text);

        this.last = performance.now();
        this.frames = 0;

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    loop() {
        this.frames++;
        const now = performance.now();
        if (now - this.last >= 1000) {
            this.text.text = `FPS: ${this.frames}`;
            this.frames = 0;
            this.last = now;
        }
        requestAnimationFrame(this.loop);
    }
}
