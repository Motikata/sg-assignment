import type { Container } from "pixi.js";

/**
 * SceneController - Interface for all scene controllers.
 *
 * @property view     - The main container for the scene.
 * @property destroy  - Optional cleanup method, called when scene is removed.
 * @property layout   - Optional layout method, called on resize (with optional width/height).
 */
export interface SceneController {
    view: Container;
    destroy?: () => void;
    layout?: (stageWidth?: number, stageHeight?: number) => void;
}

/**
 * Avatar - Represents a dialogue character (with avatar image and side).
 *
 * @property name     - Name of the character.
 * @property position - Which side the avatar appears on ("left" or "right").
 * @property url      - Image URL for the avatar picture.
 */
export interface Avatar {
    name: string;
    position: "left" | "right";
    url: string;
}

/**
 * Emoji - Represents a custom emoji (inline sprite in text).
 *
 * @property name - The emoji's name/key (for use in {emoji} tags in text).
 * @property url  - Image URL for the emoji sprite.
 */
export interface Emoji {
    name: string;
    url: string;
}

/**
 * DialogueLine - Represents a line of dialogue for MagicWords.
 *
 * @property name - Who is speaking (should match an Avatar's name).
 * @property text - The dialogue text (may contain {emoji} tags).
 */
export interface DialogueLine {
    name: string;
    text: string;
}

/**
 * Particle - Represents a single fire particle for PhoenixFlame.
 *
 * @property x       - X coordinate.
 * @property y       - Y coordinate.
 * @property vx      - X velocity.
 * @property vy      - Y velocity.
 * @property life    - Current life (frames/ticks).
 * @property maxLife - Maximum life (when to remove particle).
 * @property scale   - Sprite scale.
 * @property alpha   - Sprite transparency.
 */
export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    scale: number;
    alpha: number;
}
