export interface FriendRequest {
    from?: string;
    to?: string;
    uniqueKey?: string;
    status: 'pending' | 'sent' | 'none' | 'cancelled';
    docId?: string;
}
