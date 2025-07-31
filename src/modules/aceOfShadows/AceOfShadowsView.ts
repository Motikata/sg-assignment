import { Container, Sprite, Texture } from "pixi.js";

// Параметри
const CARD_WIDTH = 100;
const STACK_OFFSET_Y = 5;

class CardSprite extends Sprite {
    public isAnimating: boolean = false;
    public animationStartTime = 0;
    public startX = 0; public startY = 0;
    public endX = 0; public endY = 0;
    public cardId: number;

    constructor(texture: Texture, cardId: number) {
        super(texture);
        this.cardId = cardId;
        this.anchor.set(0.5);
    }
    startMoveAnimation(targetX: number, targetY: number, currentTime: number) {
        this.isAnimating = true;
        this.animationStartTime = currentTime;
        this.startX = this.x;
        this.startY = this.y;
        this.endX = targetX;
        this.endY = targetY;
    }
    updateAnimation(currentTime: number, duration: number): boolean {
        if (!this.isAnimating) return false;
        const elapsed = currentTime - this.animationStartTime;
        const progress = Math.min(1, elapsed / duration);
        this.x = this.startX + (this.endX - this.startX) * progress;
        this.y = this.startY + (this.endY - this.startY) * progress;
        if (progress >= 1) {
            this.isAnimating = false;
            return true;
        }
        return false;
    }
}

export class AceOfShadowsView extends Container {
    cardSprites: CardSprite[] = [];
    stackPositions: { x: number, y: number }[] = [];
    stacks: { cards: CardSprite[] }[] = [];

    constructor(cardTexture: Texture, totalCards: number, totalStacks: number) {
        super();
        // Определи позициите на стековете (центрирани)
        const spacing = CARD_WIDTH + 30;
        const baseX = 200;
        for (let s = 0; s < totalStacks; s++) {
            this.stackPositions[s] = {
                x: baseX + s * spacing,
                y: 220
            };
            this.stacks[s] = { cards: [] };
        }

        // Създай спрайтовете за картите
        for (let i = 0; i < totalCards; i++) {
            const card = new CardSprite(cardTexture, i);
            card.x = this.stackPositions[0].x;
            card.y = this.stackPositions[0].y - (totalCards - 1 - i) * STACK_OFFSET_Y;
            this.cardSprites[i] = card;
            this.stacks[0].cards.push(card);
            this.addChild(card);
        }
    }

    /**
     * Започва анимация за дадена карта към нов стек.
     */
    animateMove(cardId: number, fromStack: number, toStack: number, currentTime: number, stackOffsetY: number) {
        const card = this.cardSprites[cardId];
        // Извади картата от стария стек, добави я към новия
        const oldCards = this.stacks[fromStack].cards;
        const idx = oldCards.indexOf(card);
        if (idx >= 0) oldCards.splice(idx, 1);
        this.stacks[toStack].cards.push(card);

        // Изчисли новите координати (най-отгоре в новия стек)
        const pos = this.stackPositions[toStack];
        const y = pos.y - (this.stacks[toStack].cards.length - 1) * stackOffsetY;
        card.startMoveAnimation(pos.x, y, currentTime);
        // Подрежда всички карти в двата засегнати стека
        this.repositionStack(fromStack, stackOffsetY);
        this.repositionStack(toStack, stackOffsetY);
    }

    repositionStack(stackIndex: number, stackOffsetY: number) {
        const cards = this.stacks[stackIndex].cards;
        const pos = this.stackPositions[stackIndex];
        cards.forEach((card, i) => {
            if (!card.isAnimating) {
                card.x = pos.x;
                card.y = pos.y - (cards.length - 1 - i) * stackOffsetY;
            }
            // z-ordering: винаги последната (най-отгоре) е най-отгоре!
            this.setChildIndex(card, this.children.length - cards.length + i);
        });
    }

    repositionAll(stackOffsetY: number) {
        for (let s = 0; s < this.stacks.length; s++) {
            this.repositionStack(s, stackOffsetY);
        }
    }

    updateCardAnimations(currentTime: number, animDuration: number) {
        this.cardSprites.forEach(card => {
            if (card.isAnimating) {
                card.updateAnimation(currentTime, animDuration);
            }
        });
    }
}
