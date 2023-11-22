export interface FriendRequest {
    from?: string;
    to?: string;
    uniqueKey?: string;
    status: 'pending' | 'accepted';
    docId?: string;
}
