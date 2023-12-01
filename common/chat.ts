export interface ChatMessage {
    message: string;
    user: string;
    room: string;
}

export interface ChatRoom {
    info: ChatRoomInfo;
    messages: ChatMessage[];
    users: string[];
}

export interface UserRoom {
    room: string;
    read: boolean;
    lastMessage?: ChatMessage;
}

export interface ChatRoomInfo {
    name: string;
    lastMessage?: ChatMessage;
}

export interface ChatUser {
    displayName: string;
}
