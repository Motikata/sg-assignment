import { Container } from "pixi.js";
import { Button } from "./Button";
import { GameId } from "../GameId";

/**
 * MenuView - centers a group of menu buttons in its own buttonContainer
 */
export class MenuView extends Container {
    buttonContainer: Container;
    buttons: Button[];

    constructor(onMenuGameSelected: (id: GameId) => void) {
        super();

        // Inner container for easy centering
        this.buttonContainer = new Container();
        this.addChild(this.buttonContainer);

        // Create menu buttons
        this.buttons = [
            new Button("Ace of Shadows", () => onMenuGameSelected(GameId.AceOfShadows)),
            new Button("Magic Words", () => onMenuGameSelected(GameId.MagicWords)),
            new Button("Phoenix Flame", () => onMenuGameSelected(GameId.PhoenixFlame)),
        ];

        // Add buttons to the inner container
        this.buttons.forEach(btn => this.buttonContainer.addChild(btn));
    }

    layoutButtons(stageWidth: number, stageHeight: number) {
        // Layout buttons vertically inside buttonContainer
        const spacing = 30;
        let totalHeight = 0;
        let maxWidth = 0;

        this.buttons.forEach((btn, i) => {
            btn.x = 0;
            btn.y = totalHeight;
            totalHeight += btn.height + (i < this.buttons.length - 1 ? spacing : 0);
            if (btn.width > maxWidth) maxWidth = btn.width;
        });

        // Update buttonContainer's width/height via manual bounds
        this.buttonContainer.width = maxWidth;
        this.buttonContainer.height = totalHeight;
        // Center buttonContainer in the stage
        this.buttonContainer.x = (stageWidth - this.buttonContainer.width) / 2;
        this.buttonContainer.y = (stageHeight - this.buttonContainer.height) / 2;
    }
}
