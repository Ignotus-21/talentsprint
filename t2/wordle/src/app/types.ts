export interface RegisterRequest {
    mode?: string,
    name: string
};

export interface RegisterResponse {
    id: string,
    message: string
};

export interface CreateRequest {
    id: string,
    overwrite?: boolean
};

export interface CreateResponse {
    created: boolean,
    message: string
};

export interface GuessRequest {
    id: string,
    guess: string
};

export interface GuessResponse {
    answer?: string,
    feedback: string,
    message: string
};