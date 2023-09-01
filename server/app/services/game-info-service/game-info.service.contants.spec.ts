import { PrivateGameInformation } from '@app/interface/game-info';

const game1: PrivateGameInformation = {
    id: '0',
    thumbnail: 'image',
    idOriginalBmp: '0',
    idEditedBmp: '0',
    soloScore: [],
    multiplayerScore: [],
    name: 'Alice',
    differenceRadius: 1,
    differences: [],
};

const game2: PrivateGameInformation = {
    id: '1',
    thumbnail: 'image',
    idOriginalBmp: '1',
    idEditedBmp: '1',
    soloScore: [],
    multiplayerScore: [],
    name: 'Bob',
    differenceRadius: 1,
    differences: [],
};

const game3: PrivateGameInformation = {
    id: '2',
    thumbnail: 'image',
    idOriginalBmp: '2',
    idEditedBmp: '2',
    soloScore: [],
    multiplayerScore: [],
    name: 'Sami',
    differenceRadius: 1,
    differences: [],
};

export const DEFAULT_GAMES: PrivateGameInformation[] = [game1, game2, game3];
