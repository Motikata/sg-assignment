import { Container, Sprite, Text, Texture, TextStyle } from "pixi.js";
import type { MagicWordsModel } from "./MagicWordsModel";
import { DialogueLine } from "../../common/interfaces.ts";
import {StageUtils} from "../../utils/StageUtils.ts";

/**
 * Utility: Parses text, replaces {emoji} with Sprite, supports word wrap.
 * Accepts maxWidth to wrap long lines.
 */
function parseRichText(
    text: string,
    emojiTextures: Map<string, Texture>,
    style: Partial<TextStyle>,
    maxWidth: number
) {
    const container = new Container();
    let x = 0;
    let y = 0;
    const lineHeight = (style.fontSize ? Number(style.fontSize) : 20) + 8;

    const words = text.split(/(\s+)/); // Split by spaces, keep them
    for (let word of words) {
        let match = word.match(/^\{([^}]+)\}$/); // Exact emoji
        let obj;
        if (match) {
            const tex = emojiTextures.get(match[1]);
            if (tex) {
                obj = new Sprite(tex);
                obj.width = obj.height = lineHeight - 4;
            } else {
                obj = new Text(word, style);
            }
        } else {
            obj = new Text(word, style);
        }

        // Wrap logic
        if (x + obj.width > maxWidth && x > 0) {
            x = 0;
            y += lineHeight;
        }
        obj.x = x;
        obj.y = y;
        container.addChild(obj);
        x += obj.width;
    }
    return container;
}

/**
 * MagicWordsView
 * Renders: avatar, name, and dialogue line with inline emojis.
 * Responsive for any stage size.
 */
export class MagicWordsView extends Container {
    avatarSprite: Sprite;
    nameText: Text;
    lineContainer: Container;
    emojiTextures: Map<string, Texture>;
    lastStageWidth: number = StageUtils.width
    lastStageHeight: number = StageUtils.height;  // fallback default

    constructor(emojiTextures: Map<string, Texture>) {
        super();
        this.emojiTextures = emojiTextures;

        // Avatar image
        this.avatarSprite = new Sprite(Texture.EMPTY);
        this.avatarSprite.width = this.avatarSprite.height = 64;
        this.avatarSprite.y = 60;
        this.addChild(this.avatarSprite);

        // Name above avatar
        this.nameText = new Text("", {
            fontSize: 24,
            fill: "#fff",
            fontWeight: "bold",
            align: "center",
            dropShadow: true,
            dropShadowDistance: 1,
            dropShadowColor: "#111"
        });
        this.addChild(this.nameText);

        // Dialogue line container
        this.lineContainer = new Container();
        this.addChild(this.lineContainer);
    }

    /**
     * Show a dialogue line: avatar (left/right), name, wrapped text with emojis.
     * Call with stageWidth/stageHeight (for responsive layout).
     */
    showLine(
        line: DialogueLine,
        model: MagicWordsModel,
        stageWidth = 800,
        stageHeight = 600
    ) {
        this.lastStageWidth = stageWidth;
        this.lastStageHeight = stageHeight;
        this.lineContainer.removeChildren();

        // Avatar & name
        const avatar = model.getAvatar(line.name);
        let avatarX = 20;
        if (avatar?.position === "right") {
            avatarX = stageWidth - 20 - this.avatarSprite.width;
        }
        this.avatarSprite.x = avatarX;
        this.avatarSprite.texture = avatar ? Texture.from(avatar.url) : Texture.EMPTY;

        // Name above avatar, centered to avatar
        this.nameText.text = avatar ? avatar.name : "";
        this.nameText.x = avatarX + (this.avatarSprite.width - this.nameText.width) / 2;
        this.nameText.y = this.avatarSprite.y - this.nameText.height - 8;

        // Text bubble width – leave padding left/right (and room for avatar if both sides)
        const maxTextWidth = stageWidth - this.avatarSprite.width - 80;

        // Rich text with wrapping
        const richLine = parseRichText(
            line.text,
            this.emojiTextures,
            { fontSize: 28, fill: "#fff" },
            maxTextWidth
        );

        // Position the dialogue line
        // If avatar is left, place text to right of avatar
        // If avatar is right, place text to left
        if (avatar?.position === "left") {
            richLine.x = this.avatarSprite.x + this.avatarSprite.width + 20;
        } else if (avatar?.position === "right") {
            richLine.x = 20;
        } else {
            richLine.x = 100; // fallback, center-ish
        }
        richLine.y = this.avatarSprite.y;

        this.lineContainer.addChild(richLine);
    }

    /**
     * Call this on resize to reposition everything.
     * Keeps last shown line.
     */
    layout(stageWidth: number, stageHeight: number, line?: DialogueLine, model?: MagicWordsModel) {
        this.lastStageWidth = stageWidth;
        this.lastStageHeight = stageHeight;
        if (line && model) {
            this.showLine(line, model, stageWidth, stageHeight);
        }
    }
}
