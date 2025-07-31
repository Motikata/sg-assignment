import { Application } from "pixi.js";

export class StageUtils {
    private static app?: Application;

    // Call this ONCE after app is created!
    static setApp(app: Application) {
        this.app = app;
    }

    static get width(): number {
        if (this.app) return this.app.renderer.width;
        return window.innerWidth;
    }
    static get height(): number {
        if (this.app) return this.app.renderer.height;
        return window.innerHeight;
    }
}