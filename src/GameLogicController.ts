import { Application, Container } from "pixi.js";
import { AceOfShadowsController } from "./modules/aceOfShadows/AceOfShadowsController";
import { MagicWordsController } from "./modules/magicWords/MagicWordsController";
import { PhoenixFlameController } from "./modules/phoenixFlame/PhoenixFlameController";
import { FpsCounter } from "./common/ui/FpsCounter";
import type { SceneController } from "./common/interfaces.ts";
import { GameId } from "./common/GameId.ts";

/**
 * GameLogicController
 * Main manager for all scenes (mini-games) and overlays in the app.
 */
export class GameLogicController {
    app: Application;
    root: Container;
    current?: SceneController;
    fps: FpsCounter;

    /**
     * Constructor receives main PixiJS application and root container for scenes.
     * @param app - PixiJS Application instance
     * @param root - Root Container for all scenes (below overlays)
     */
    constructor(app: Application, root: Container) {
        this.app = app;
        this.root = root;

        // Add FPS counter overlay (always on top)
        this.fps = new FpsCounter();
        this.app.stage.addChild(this.fps);
    }

    /**
     * Changes the active scene. Cleans up previous scene if exists.
     * @param ctrl - New SceneController to show
     */
    setScene(ctrl: SceneController) {
        if (this.current) {
            this.root.removeChild(this.current.view);
            this.current.destroy?.();
        }
        this.current = ctrl;
        this.root.addChild(ctrl.view);

        // Call scene layout if available
        ctrl.layout?.();
    }

    /**
     * Starts a mini-game by its GameId enum. Creates and sets the correct controller.
     * @param gameId - Which game to start (AceOfShadows, MagicWords, PhoenixFlame)
     */
    startGame(gameId: GameId) {
        switch (gameId) {
            case GameId.AceOfShadows:
                this.setScene(new AceOfShadowsController());
                break;
            case GameId.MagicWords:
                this.setScene(new MagicWordsController());
                break;
            case GameId.PhoenixFlame:
                this.setScene(new PhoenixFlameController());
                break;
        }
    }

    /**
     * Removes the current scene (if any) from the stage.
     * Can be used to return to menu or clear the view.
     */
    clearScene() {
        if (this.current) {
            this.root.removeChild(this.current.view);
            this.current.destroy?.();
        }
    }
}
