export interface APIResponse<T> {
    message: string;
    success: boolean;
    data: T;
}
