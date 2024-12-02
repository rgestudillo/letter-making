export interface User {
    userId: string;
    userEmail: string;
    dateCreated: Date;
}

export function createUser(userId: string, userEmail: string): User {
    return {
        userId,
        userEmail,
        dateCreated: new Date()  // Current date as the creation date
    };
}
