/**
 * PhoenixFlameModel - simple particle data holder
 */
import {Particle} from "../../common/interfaces.ts";


export class PhoenixFlameModel {
    particles: Particle[] = [];
    maxParticles = 10;

    /**
     * Creates or recycles a particle at (x, y)
     */
    spawn(x: number, y: number) {
        if (this.particles.length >= this.maxParticles) return;
        this.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 1.4,
            vy: -2 - Math.random() * 2,
            life: 0,
            maxLife: 50 + Math.random() * 30,
            scale: 0.7 + Math.random() * 0.8,
            alpha: 1
        });
    }

    /**
     * Advances all particles and removes dead ones.
     */
    update() {
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // "gravity" upwards (wind)
            p.life++;
            p.alpha = Math.max(0, 1 - p.life / p.maxLife);
            p.scale *= 0.985;
        }
        // Remove dead
        this.particles = this.particles.filter(p => p.life < p.maxLife);
    }
}
