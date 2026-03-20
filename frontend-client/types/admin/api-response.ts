/**
 * Generic APIResponse wrapper from backend
 * All CRUD operations return this structure
 */
export interface APIResponse<T> {
    message: string;
    success: boolean;
    data: T;
}

/**
 * Helper to unwrap APIResponse and get the data
 * @throws Error if response status is false
 */
export function unwrapApiResponse<T>(response: APIResponse<T>): T {
    if (!response.success) {
        throw new Error(response.message || 'Operation failed');
    }
    return response.data;
}

/**
 * Extract success message from APIResponse
 */
export function getSuccessMessage<T>(response: APIResponse<T>): string {
    return response.message;
}
