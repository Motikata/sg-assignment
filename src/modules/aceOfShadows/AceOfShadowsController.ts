import {Container, Texture, Ticker} from "pixi.js";
import { AceOfShadowsModel } from "./AceOfShadowsModel";
import { AceOfShadowsView } from "./AceOfShadowsView";

/**
 * AceOfShadowsController - controls game logic and manages model/view.
 * Uses a centerContainer to always center the deck visually.
 */
export class AceOfShadowsController extends Container {
    model: AceOfShadowsModel;
    view: Container; // <--- .view will be centerContainer (SceneController pattern)
    centerContainer: Container;
    gameView: AceOfShadowsView; // real view (stacks/cards)
    totalCards = 144;
    totalStacks = 4;
    animationInterval = 1000;
    animationDuration = 2000;
    lastAnimTime: number = 0;
    animatingCardId: number | null = null;

    constructor() {
        super();

        // 1. Prepare model & card view
        this.model = new AceOfShadowsModel(this.totalCards, this.totalStacks);
        const cardTexture = Texture.from("card.png");
        this.gameView = new AceOfShadowsView(cardTexture, this.totalCards, this.totalStacks);

        // 2. Setup centering container & assign as .view
        this.centerContainer = new Container();
        this.centerContainer.addChild(this.gameView);
        this.addChild(this.centerContainer);
        this.view = this.centerContainer; // <--- IMPORTANT: SceneController expects .view

        // 3. Bind main update loop (for animation)
        this.update = this.update.bind(this);
        Ticker.shared.add(this.update);
    }

    /**
     * Layout: always center the deck visually
     */
    layout(stageWidth: number = 800, stageHeight: number = 600) {
        // Center the centerContainer (gameView is inside, always 0,0 relative)
        this.centerContainer.x = stageWidth / 2;
        this.centerContainer.y = stageHeight / 2;
    }

    /**
     * Main update loop for card animations and timer
     */
    update() {
        const now = Ticker.shared.lastTime;
        this.gameView.updateCardAnimations?.(now, this.animationDuration);

        if (this.animatingCardId !== null) {
            const card = this.gameView.cardSprites[this.animatingCardId];
            if (!card.isAnimating) {
                this.animatingCardId = null;
            }
            return;
        }

        if (!this.animatingCardId && now - this.lastAnimTime > this.animationInterval) {
            this.lastAnimTime = now;
            const fromStack = this.model.getTopStack();
            let toStack = fromStack;
            while (toStack === fromStack && this.model.totalStacks > 1) {
                toStack = Math.floor(Math.random() * this.model.totalStacks);
            }
            const cardId = this.model.moveTopCard(fromStack, toStack);
            if (typeof cardId === "number") {
                this.animatingCardId = cardId;
                this.gameView.animateMove(cardId, fromStack, toStack, now, 5); // 5 is STACK_OFFSET_Y
            }
        }
    }

    /**
     * Cleanup when switching scenes
     */
    destroy() {
        Ticker.shared.remove(this.update);
        this.removeChildren();
    }
}
