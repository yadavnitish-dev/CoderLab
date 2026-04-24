/**
 * Simple delay utility (Promisified setTimeout)
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resilience Utilities
 * Artisan-grade patterns for system stability
 */

interface CircuitBreakerOptions {
  timeoutMs?: number;
  retries?: number;
  onRetry?: (error: any, attempt: number) => void;
}

/**
 * Simple Circuit Breaker / Retry Wrapper
 * Protects the event loop from hanging on external dependencies
 */
export async function withResilience<T>(
  fn: () => Promise<T>,
  options: CircuitBreakerOptions = {}
): Promise<T> {
  const { 
    timeoutMs = 5000, 
    retries = 3, 
    onRetry 
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      // Timeout Logic
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
      });

      return await Promise.race([fn(), timeoutPromise]);
    } catch (error: any) {
      lastError = error;

      if (attempt <= retries) {
        if (onRetry) onRetry(error, attempt);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        continue;
      }
    }
  }

  throw lastError;
}
