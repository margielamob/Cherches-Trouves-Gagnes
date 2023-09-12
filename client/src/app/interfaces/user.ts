export interface UserData {
    // from AngularFireAuth
    displayName: string;
    email: string;
    emailVerified?: boolean;
    photoURL?: string;
    uid: string;
    phoneNumber?: string;
    // user config
    theme?: string;
    language?: string;
    gameLost?: number;
    gameWins?: number;
    gamePlayed: number;
    averageTime?: string;
}
