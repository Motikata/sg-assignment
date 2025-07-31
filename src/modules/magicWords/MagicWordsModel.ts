/**
 * Model for Magic Words.
 * Loads and holds avatars, emojis, and dialogue.
 */
import {Avatar, DialogueLine, Emoji} from "../../common/interfaces.ts";

export class MagicWordsModel {
    avatars: Avatar[] = [];
    emojis: Emoji[] = [];
    dialogue: DialogueLine[] = [];

    emojiMap: Map<string, Emoji> = new Map();
    avatarMap: Map<string, Avatar> = new Map();
    private resourcesURL:string = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

    async load() {
        const resp = await fetch(this.resourcesURL);
        const json = await resp.json();

        this.avatars = json.avatars ?? [];
        this.emojis = json.emojies ?? [];
        this.dialogue = json.dialogue ?? [];

        // Inject local emoji icons because they are missing
        if (!this.emojis.find(e => e.name === "affirmative")) {
            this.emojis.push({
                name: "affirmative",
                url: "affirmative.png"
            });
        }
        if (!this.emojis.find(e => e.name === "win")) {
            this.emojis.push({
                name: "win",
                url: "win.png"
            });
        }
        this.emojiMap = new Map(this.emojis.map(e => [e.name, e]));
        this.avatarMap = new Map(this.avatars.map(a => [a.name, a]));
    }

    getAvatar(name: string) {
        return this.avatarMap.get(name);
    }

    getEmoji(name: string) {
        return this.emojiMap.get(name);
    }
}
