import { Application, Container } from "pixi.js";
import { MenuOverlay } from "./common/ui/MenuOverlay";
import { GameLogicController } from "./GameLogicController";
import { GameId } from "./common/GameId";
import {StageUtils} from "./utils/StageUtils.ts";

// Create PixiJS application
const app = new Application({
    background: 0x222222,
    resizeTo: window,
});
StageUtils.setApp(app);
// Expose Pixi App globally for debugging
// @ts-ignore
globalThis.__PIXI_APP__ = app;

// Disable body margins and scrollbars
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(app.view as any);

// Root container for all game scenes
const root = new Container();
app.stage.addChild(root);

// Main game controller, managing all scenes
const game = new GameLogicController(app, root);

// UI Overlay with fullscreen and menu buttons
const uiOverlay = new MenuOverlay(
    (gameId: GameId) => {
        // When a game is selected from menu:
        uiOverlay.showBackButton();
        game.startGame(gameId);
    },
    () => {
        // When back button pressed, return to main menu:
        uiOverlay.showMenu();
        game.clearScene?.();
    }
);
app.stage.addChild(uiOverlay);

// Responsive layout handler with debounce to avoid excessive triggering
let resizeTimeout: ReturnType<typeof setTimeout>;
function layoutUI() {
    const w = app.renderer.width;
    const h = app.renderer.height;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        uiOverlay.layout(app.renderer.width, app.renderer.height);
        game.current?.layout?.(w, h);
    }, 150);


}

// Listen for resize and orientation change events
window.addEventListener("resize", layoutUI);
window.addEventListener("orientationchange", layoutUI);

// Fallback for unreliable resize on mobile
//setInterval(layoutUI, 500);

// Initial layout setup
layoutUI();