export interface FriendRequest {
    from?: string;
    to?: string;
    uniqueKey?: string;
    status: 'pending' | 'sent' | 'none' | 'cancelled';
    docId?: string; // Ajouter cette ligne pour inclure l'ID du document Firestore
}
