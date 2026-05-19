/**
 * Application Logger
 * Provides structured logging with environment-aware output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: unknown;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isProduction = process.env.NODE_ENV === 'production';

    /**
     * Determines if a log level should be output based on the environment
     */
    private shouldLog(level: LogLevel): boolean {
        if (this.isProduction) {
            return level === 'error' || level === 'warn';
        }
        return true;
    }

    /**
     * Formats the log message with timestamp and level
     */
    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    /**
     * Logs debug information (development only)
     */
    debug(message: string, context?: LogContext): void {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message), context || '');
        }
    }

    /**
     * Logs informational messages
     */
    info(message: string, context?: LogContext): void {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), context || '');
        }
    }

    /**
     * Logs warning messages
     */
    warn(message: string, context?: LogContext): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), context || '');
        }
    }

    /**
     * Logs error messages with optional error object
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        if (this.shouldLog('error')) {
            const errorDetails = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error;

            console.error(
                this.formatMessage('error', message),
                { error: errorDetails, ...context }
            );
        }
    }

    /**
     * Logs API request information
     */
    apiRequest(method: string, url: string, context?: LogContext): void {
        this.debug(`API ${method} ${url}`, context);
    }

    /**
     * Logs API response information
     */
    apiResponse(method: string, url: string, status: number, context?: LogContext): void {
        if (status >= 400) {
            this.error(`API ${method} ${url} failed with status ${status}`, undefined, context);
        } else {
            this.debug(`API ${method} ${url} succeeded with status ${status}`, context);
        }
    }
}

// Export a singleton instance
export const logger = new Logger();

// Export the class for testing purposes
export { Logger };
