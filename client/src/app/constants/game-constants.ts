export const DEFAULT_GAME_TIME = 30;
export const DEFAULT_PENALTY_TIME = 5;
export const DEFAULT_SUCCESS_TIME = 5;

export const GAME_STEP = 5;
export const PENALTY_SUCCESS_STEP = 1;

export const GAME_TIME_MIN = 10;
export const GAME_TIME_MAX = 60;

export const PENALTY_TIME_MIN = 0;
export const PENALTY_TIME_MAX = 15;

export const SUCCESS_TIME_MIN = 0;
export const SUCCESS_TIME_MAX = 15;

export const GAME_TIME_CONSTANTS_PARAMS = {
    gameTime: DEFAULT_GAME_TIME,
    penaltyTime: DEFAULT_PENALTY_TIME,
    successTime: DEFAULT_SUCCESS_TIME,
    gameStep: GAME_STEP,
    penaltySuccessStep: PENALTY_SUCCESS_STEP,
    gameTimeMin: GAME_TIME_MIN,
    gameTimeMax: GAME_TIME_MAX,
    penaltyTimeMin: PENALTY_TIME_MIN,
    penaltyTimeMax: PENALTY_TIME_MAX,
    successTimeMin: SUCCESS_TIME_MIN,
    successTimeMax: SUCCESS_TIME_MAX,
};

export enum FlashTimer {
    CheatMode = 125,
    Classic = 500,
}
