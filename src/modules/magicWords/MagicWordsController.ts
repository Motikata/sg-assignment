import { MagicWordsModel } from "./MagicWordsModel";
import { MagicWordsView } from "./MagicWordsView";
import { Texture } from "pixi.js";

/**
 * Controller for Magic Words.
 * Auto-advances dialogue every 3 seconds, loops at end.
 */
export class MagicWordsController {
    model: MagicWordsModel;
    view: MagicWordsView;
    emojiTextures: Map<string, Texture> = new Map();
    currentLine: number = 0;
    timerId?: ReturnType<typeof setInterval>;

    constructor() {
        this.model = new MagicWordsModel();
        this.view = new MagicWordsView(this.emojiTextures);
        this.start();
    }

    async start() {
        await this.model.load();
        await this.preloadEmojis();
        this.view.emojiTextures = this.emojiTextures;
        this.currentLine = 0;
        this.showLine(this.currentLine);
        this.startTimer();
    }

    async preloadEmojis() {
        // Preload emoji textures (sprites)
        for (const emoji of this.model.emojis) {
            const tex = Texture.from(emoji.url);
            this.emojiTextures.set(emoji.name, tex);
        }
    }

    showLine(idx: number) {
        if (this.model.dialogue.length === 0) return;
        // Cycle if needed
        const safeIdx = ((idx % this.model.dialogue.length) + this.model.dialogue.length) % this.model.dialogue.length;
        this.currentLine = safeIdx;
        this.view.showLine(this.model.dialogue[safeIdx], this.model);
    }

    nextLine() {
        this.currentLine = (this.currentLine + 1) % this.model.dialogue.length;
        this.showLine(this.currentLine);
    }

    startTimer() {
        this.stopTimer();
        this.timerId = setInterval(() => {
            this.nextLine();
        }, 3000);
    }

    stopTimer() {
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = undefined;
    }

    destroy() {
        this.stopTimer();
        this.view.destroy({ children: true });
    }
}
