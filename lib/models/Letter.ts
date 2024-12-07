export interface Letter {
    id: string;
    title: string;
    content: string;
    author?: string;
    timestamp: number;
    createdBy: string;
    recipient_email?: string;
}

export function createLetter(title: string, content: string, recipient_email?: string, author?: string, createdBy: string = 'Guest'): Letter {
    return {
        id: Date.now().toString(),
        title,
        content,
        author,
        timestamp: Date.now(),
        createdBy,
        recipient_email
    };
}

