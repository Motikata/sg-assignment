import {FullScreenButton} from "./FullScreenButton.ts";
import {Button} from "./Button.ts";
import {MenuView} from "./MenuView.ts";
import {Container} from "pixi.js";
import {GameId} from "../GameId.ts";
import screenfull from "screenfull";

export class MenuOverlay extends Container {
    fullscreenBtn: FullScreenButton;
    backBtn: Button;
    menuView: MenuView;

    constructor(
        onMenuGameSelected: (id: GameId) => void,
        onBack: () => void
    ) {
        super();

        this.fullscreenBtn = new FullScreenButton();
        this.addChild(this.fullscreenBtn);

        this.backBtn = new Button("Back to Menu", onBack);
        this.addChild(this.backBtn);

        this.menuView = new MenuView(onMenuGameSelected);
        this.addChild(this.menuView);

        this.backBtn.visible = false;
    }

    showMenu() {
        this.menuView.visible = true;
        this.backBtn.visible = false;
    }

    showBackButton() {
        this.menuView.visible = false;
        this.backBtn.visible = true;
    }

    /** Always call with real stage size from main.ts! */
    layout(stageWidth: number, stageHeight: number) {
        // Fullscreen button (top right)
        this.fullscreenBtn.visible = !(screenfull.isEnabled && screenfull.isFullscreen);
        if (this.fullscreenBtn.visible) {
            this.fullscreenBtn.x =  stageWidth - this.fullscreenBtn.width -20;
            this.fullscreenBtn.y = 20;
        }

        // Back button (top left)
        this.backBtn.x = stageWidth - this.backBtn.width - 20;
        this.backBtn.y = stageHeight - this.backBtn.height - 80;

        // Layout and center menuView (the button group)
        this.menuView.layoutButtons(stageWidth, stageHeight);
    }
}
