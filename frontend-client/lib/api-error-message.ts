type ErrorRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ErrorRecord =>
    typeof value === "object" && value !== null;

const resolveMessage = (value: unknown): string | null => {
    if (typeof value === "string" && value.trim().length > 0) {
        return value;
    }
    return null;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === "string" && error.trim().length > 0) {
        return error;
    }

    if (error instanceof Error && error.message !== "Rejected") {
        const message = resolveMessage(error.message);
        if (message) {
            return message;
        }
    }

    if (!isRecord(error)) {
        return fallback;
    }

    const directMessage = resolveMessage(error.message);
    if (directMessage && directMessage !== "Rejected") {
        return directMessage;
    }

    const directError = resolveMessage(error.error);
    if (directError) {
        return directError;
    }

    if (isRecord(error.data)) {
        const dataMessage = resolveMessage(error.data.message);
        if (dataMessage) {
            return dataMessage;
        }
    }

    return fallback;
}

