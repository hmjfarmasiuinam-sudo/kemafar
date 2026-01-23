/**
 * Logger Utility
 * Centralized logging that respects environment
 * In production, logs are suppressed or sent to monitoring service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  context?: string;
  data?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private shouldLog(level: LogLevel): boolean {
    // Don't log in test environment
    if (this.isTest) {
      return false;
    }

    // In production, only log warnings and errors
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return false;
    }

    return true;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    options?: LoggerOptions
  ): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  private sendToMonitoring(
    _level: LogLevel,
    _message: string,
    _options?: LoggerOptions
  ): void {
    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    if (!this.isDevelopment) {
      // TODO: Integrate with Sentry or other monitoring service
      // Sentry.captureMessage(message, {
      //   level: level as SeverityLevel,
      //   contexts: { custom: options?.data }
      // });
    }
  }

  debug(message: string, options?: LoggerOptions): void {
    if (this.shouldLog('debug')) {
      console.warn(this.formatMessage('debug', message, options));
      if (options?.data) {
        console.warn('Data:', options.data);
      }
    }
  }

  info(message: string, options?: LoggerOptions): void {
    if (this.shouldLog('info')) {
      console.warn(this.formatMessage('info', message, options));
      if (options?.data) {
        console.warn('Data:', options.data);
      }
    }
  }

  warn(message: string, options?: LoggerOptions): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, options));
      if (options?.data) {
        console.warn('Data:', options.data);
      }
    }
    this.sendToMonitoring('warn', message, options);
  }

  error(message: string, error?: unknown, options?: LoggerOptions): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, options));

      if (error instanceof Error) {
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
      } else if (error) {
        console.error('Error:', error);
      }

      if (options?.data) {
        console.error('Data:', options.data);
      }
    }

    this.sendToMonitoring('error', message, {
      ...options,
      data: {
        ...options?.data,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
        } : error,
      },
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, options?: LoggerOptions) => logger.debug(message, options),
  info: (message: string, options?: LoggerOptions) => logger.info(message, options),
  warn: (message: string, options?: LoggerOptions) => logger.warn(message, options),
  error: (message: string, error?: unknown, options?: LoggerOptions) =>
    logger.error(message, error, options),
};
