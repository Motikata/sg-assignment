// PhoenixFlameView.ts
import { Container, Sprite, Texture } from "pixi.js";
import type { PhoenixFlameModel } from "./PhoenixFlameModel";
import { Particle } from "../../common/interfaces.ts";

/**
 * PhoenixFlameView - renders fire particles as sprites
 * This view is placed in a center container that is always centered.
 */
export class PhoenixFlameView extends Container {
    particles: Sprite[] = [];
    particleTexture: Texture | undefined;

    constructor(texture?: Texture) {
        super();
        // Use a default simple fireball or a provided texture
        this.particleTexture = texture;
    }

    /**
     * Updates sprites to match model. Handles max 10 sprites.
     */
    renderParticles(model: PhoenixFlameModel) {
        // Create or remove sprites if count changes
        while (this.particles.length < model.maxParticles) {
            const s = new Sprite(this.particleTexture);
            s.anchor.set(0.5);
            this.particles.push(s);
            this.addChild(s);
        }
        while (this.particles.length > model.maxParticles) {
            const s = this.particles.pop();
            if (s) this.removeChild(s);
        }

        // Hide all
        this.particles.forEach(s => (s.visible = false));

        // Position and show active particles
        model.particles.forEach((p: Particle, i: number) => {
            const s = this.particles[i];
            if (!s) return;
            s.visible = true;
            s.x = p.x; // Relative to center container
            s.y = p.y;
            s.scale.set(p.scale);
            s.alpha = p.alpha;
            s.rotation = Math.random() * Math.PI;
        });
    }
}
