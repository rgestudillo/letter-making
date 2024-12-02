export interface Letter {
    id: string;
    content: string;
    author?: string;
    timestamp: number;
}

export function createLetter(content: string, author?: string): Letter {
    return {
        id: Date.now().toString(),
        content,
        author,
        timestamp: Date.now(),
    };
}

