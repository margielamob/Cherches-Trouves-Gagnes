export enum SocketEvent {
    ServeMessages = 'ServeMessages',
    FetchMessages = 'FetchMessages',
    RefreshGames = 'refreshGames',
    AcceptPlayer = 'acceptPlayer',
    RejectPlayer = 'rejectPlayer',
    PlayerLeft = 'playerLeft',
    Connection = 'connection',
    Disconnect = 'Disconnect',
    CreateGame = 'createGame',
    CreateGameMulti = 'createGameMulti',
    GameCreated = 'gameCreated',
    GameDeleted = 'gameDeleted',
    GamesDeleted = 'gamesDeleted',
    RequestToJoin = 'requestToJoin',
    Clock = 'clock',
    Error = 'error',
    JoinGame = 'joinGame',
    WaitPlayer = 'waitPlayer',
    Play = 'play',
    NewGameBoard = 'newGameBoard',
    LeaveGame = 'leaveGame',
    LeaveWaiting = 'leaveWaiting',
    Win = 'win',
    Lose = 'lose',
    DifferenceNotFound = 'differenceNotFound',
    DifferenceFound = 'differenceFound',
    DifferenceFoundMulti = 'differenceFoundMulti',
    Difference = 'difference',
    GetGamesWaiting = 'getGamesWaiting',
    Message = 'message',
    EventMessage = 'eventMessage',
    FetchDifferences = 'fetchDifferences',
    Clue = 'clue',
    Authenticate = 'Authenticate',
    UserExists = 'UserExists',
    PrototypeMessage = 'PrototypeMessage',
    UserAuthenticated = 'UserAuthenticated',
    DisconnectFromChat = 'DisconnectFromChat',
    NewMessage = 'NewMessage',
}
