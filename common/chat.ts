export interface ChatMessage {
    message: string;
    user: string | undefined;
    room: string;
}

export interface ChatRoom {
    info: ChatRoomInfo;
    messages: ChatMessage[];
}

export interface ChatRoomInfo {
    name: string;
    lastMessage?: ChatMessage;
}

export interface ChatUser {
    displayName: string;
}
