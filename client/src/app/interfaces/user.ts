export interface UserData {
    // from AngularFireAuth
    displayName: string;
    email: string;
    emailVerified?: boolean;
    photoURL?: string;
    uid: string;
    phoneNumber?: string;
    //user config
    Theme?: string;
    Language?: string;
    game_lost?: number;
    game_wins?: number;
    game_played?: number;
    average_time?: string;
}
