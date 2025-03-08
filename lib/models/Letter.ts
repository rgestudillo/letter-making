export interface Letter {
    id: string;
    title: string;
    content: string;
    author?: string;
    timestamp: number;
    createdBy: string;
    recipient_email?: string;
    image?: string;
    parentId?: string;
}

export function createLetter(
    title: string,
    content: string,
    recipient_email?: string,
    author?: string,
    createdBy: string = 'Guest',
    image?: string,
    parentId?: string
): Letter {
    return {
        id: Date.now().toString(),
        title,
        content,
        author,
        timestamp: Date.now(),
        createdBy,
        recipient_email,
        image,
        parentId
    };
}

