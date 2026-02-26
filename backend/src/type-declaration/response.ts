export type SuccessResponse<T> = {
    ok: true;
    msg: string;
    data?: T;
}