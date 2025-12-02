/**
 * Search Params Utilities
 * Helper functions for working with URL search parameters
 */

/**
 * Parses search params into a typed object
 */
export function parseSearchParams<T extends Record<string, any>>(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined }
): Partial<T> {
    const params: Partial<T> = {};

    if (searchParams instanceof URLSearchParams) {
        searchParams.forEach((value, key) => {
            params[key as keyof T] = value as any;
        });
    } else {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined) {
                params[key as keyof T] = (Array.isArray(value) ? value[0] : value) as any;
            }
        });
    }

    return params;
}

/**
 * Converts an object to URLSearchParams
 */
export function toSearchParams(params: Record<string, any>): URLSearchParams {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    return searchParams;
}

/**
 * Gets a search param with a default value
 */
export function getSearchParam(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
    key: string,
    defaultValue?: string
): string | undefined {
    if (searchParams instanceof URLSearchParams) {
        return searchParams.get(key) || defaultValue;
    }

    const value = searchParams[key];
    if (value === undefined) return defaultValue;
    return Array.isArray(value) ? value[0] : value;
}

/**
 * Gets a search param as an integer
 */
export function getSearchParamAsInt(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
    key: string,
    defaultValue?: number
): number | undefined {
    const value = getSearchParam(searchParams, key);
    if (value === undefined) return defaultValue;

    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Gets a search param as a boolean
 */
export function getSearchParamAsBool(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
    key: string,
    defaultValue?: boolean
): boolean | undefined {
    const value = getSearchParam(searchParams, key);
    if (value === undefined) return defaultValue;

    return value === 'true' || value === '1';
}

/**
 * Common search params for pagination
 */
export interface PaginationParams {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Parses pagination params with defaults
 */
export function parsePaginationParams(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined }
): PaginationParams {
    return {
        page: getSearchParamAsInt(searchParams, 'page', 0),
        perPage: getSearchParamAsInt(searchParams, 'perPage', 10),
        sortBy: getSearchParam(searchParams, 'sortBy'),
        sortOrder: (getSearchParam(searchParams, 'sortOrder') as 'asc' | 'desc') || 'desc',
    };
}

/**
 * Common search params for product filtering
 */
export interface ProductFilterParams extends PaginationParams {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}

/**
 * Parses product filter params
 */
export function parseProductFilterParams(
    searchParams: URLSearchParams | { [key: string]: string | string[] | undefined }
): ProductFilterParams {
    return {
        ...parsePaginationParams(searchParams),
        category: getSearchParam(searchParams, 'category'),
        search: getSearchParam(searchParams, 'search'),
        minPrice: getSearchParamAsInt(searchParams, 'minPrice'),
        maxPrice: getSearchParamAsInt(searchParams, 'maxPrice'),
    };
}
