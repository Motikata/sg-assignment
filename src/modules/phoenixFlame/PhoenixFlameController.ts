// PhoenixFlameController.ts
import { Container, Texture } from "pixi.js";
import { PhoenixFlameModel } from "./PhoenixFlameModel";
import { PhoenixFlameView } from "./PhoenixFlameView";
import type { SceneController } from "../../common/interfaces";

/**
 * PhoenixFlameController - orchestrates model and view for the flame effect.
 * Handles logic, updates, and proper centering of the flame effect.
 */
export class PhoenixFlameController extends Container implements SceneController {
    model: PhoenixFlameModel;
    view: Container;              // <--- IMPORTANT: now is centerContainer!
    centerContainer: Container;
    flameView: PhoenixFlameView;  // real view
    running: boolean = false;

    constructor() {
        super();
        this.model = new PhoenixFlameModel();

        // This container will always be centered on screen (portrait/landscape)
        this.centerContainer = new Container();

        // Use a nice flame png, fallback to a yellow circle if not found
        const flameTexture = Texture.from("flame.png");
        this.flameView = new PhoenixFlameView(flameTexture);

        // Add the flame effect view to the centering container
        this.centerContainer.addChild(this.flameView);

        // Add centerContainer to the controller root (so addChild(this.view) always adds this)
        this.addChild(this.centerContainer);

        // ВАЖНО! SceneController.view да е centerContainer
        this.view = this.centerContainer;

        this.running = true;
        this.loop = this.loop.bind(this);
        this.start();
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
    }

    /**
     * Layout method - centers the flame in the middle of the stage (portrait/landscape safe).
     * Call this on resize or orientation change!
     */
    layout(stageWidth?: number, stageHeight?: number) {
        const w = stageWidth ?? 800;
        const h = stageHeight ?? 600;
        this.centerContainer.x = w / 2;
        this.centerContainer.y = h / 2;
        // Center point is (0,0) for particles, so all spawn from middle!
    }

    destroy() {
        this.stop();
        this.removeChildren();
    }

    /**
     * Particle update/render loop (uses requestAnimationFrame)
     */
    loop() {
        if (!this.running) return;
        // Spawn one new particle per frame at the center (0,0 of centerContainer)
        this.model.spawn(0, 0);
        // Update simulation
        this.model.update();
        // Render
        this.flameView.renderParticles(this.model);
        // Next frame
        requestAnimationFrame(this.loop);
    }
}
