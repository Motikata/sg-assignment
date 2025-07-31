export interface CardData {
    cardId: number;
}

export interface StackData {
    cards: CardData[];
}

export class AceOfShadowsModel {
    stacks: StackData[];
    totalCards: number;
    totalStacks: number;

    constructor(totalCards = 144, totalStacks = 4) {
        this.totalCards = totalCards;
        this.totalStacks = totalStacks;
        // Създай празни стекове
        this.stacks = Array.from({ length: totalStacks }, () => ({ cards: [] }));
        // Всички карти започват в стек 0 (най-ляв/централен)
        for (let i = 0; i < totalCards; i++) {
            this.stacks[0].cards.push({ cardId: i });
        }
    }

    /**
     * Мести най-горната карта от sourceStack към destStack.
     * Връща cardId на преместената карта.
     */
    moveTopCard(sourceStack: number, destStack: number): number | undefined {
        if (this.stacks[sourceStack].cards.length === 0) return undefined;
        const card = this.stacks[sourceStack].cards.pop()!;
        this.stacks[destStack].cards.push(card);
        return card.cardId;
    }

    getTopStack(): number {
        // Връща индекса на стека с най-много карти
        let max = 0;
        let idx = 0;
        this.stacks.forEach((s, i) => {
            if (s.cards.length > max) {
                max = s.cards.length;
                idx = i;
            }
        });
        return idx;
    }
}
