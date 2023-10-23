export interface ChatMessage {
    message: string;
    user: string;
    room: string;
}

export interface ChatRoom {
    name: string;
    messages: ChatMessage[];
}

export interface ChatUser {
    displayName: string;
}
