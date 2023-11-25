export interface UserData {
    // from AngularFireAuth
    displayName: string;
    email: string;
    photoURL?: string;
    uid: string;
    phoneNumber?: string;
    theme?: string;
    language?: string;
    numberDifferenceFound?: number;
    totalTimePlayed?: number;
    gameWins?: number;
    gamePlayed: number;
    friends?: string[];
}
