export interface Letter {
    id: string;
    content: string;
    author?: string;
    timestamp: number;
    createdBy: string;
}

export function createLetter(content: string, author?: string, createdBy: string = 'Guest'): Letter {
    return {
        id: Date.now().toString(),
        content,
        author,
        timestamp: Date.now(),
        createdBy  // Either a user ID or 'Guest'
    };
}
