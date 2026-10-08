/**
 * Growth IT Solution - In-Memory Rate Limiter for Login Security
 */

class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // Default 5 attempts per 15 minutes
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }

    /**
     * Get IP address from HTTP request
     * @param {object} req 
     * @returns {string}
     */
    getIp(req) {
        return (
            (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
            (req.socket && req.socket.remoteAddress) ||
            '127.0.0.1'
        );
    }

    /**
     * Check if client IP is currently rate limited
     * @param {string} key 
     * @returns {{ limited: boolean, remainingAttempts: number, resetSeconds: number }}
     */
    check(key) {
        const now = Date.now();
        const record = this.attempts.get(key);

        if (!record) {
            return { limited: false, remainingAttempts: this.maxAttempts, resetSeconds: 0 };
        }

        if (now > record.resetTime) {
            this.attempts.delete(key);
            return { limited: false, remainingAttempts: this.maxAttempts, resetSeconds: 0 };
        }

        if (record.count >= this.maxAttempts) {
            const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
            return { limited: true, remainingAttempts: 0, resetSeconds };
        }

        return {
            limited: false,
            remainingAttempts: this.maxAttempts - record.count,
            resetSeconds: Math.ceil((record.resetTime - now) / 1000)
        };
    }

    /**
     * Consume an attempt for key
     * @param {string} key 
     * @returns {{ limited: boolean, remainingAttempts: number, resetSeconds: number }}
     */
    consume(key) {
        const now = Date.now();
        let record = this.attempts.get(key);

        if (!record || now > record.resetTime) {
            record = {
                count: 1,
                resetTime: now + this.windowMs
            };
        } else {
            record.count += 1;
        }

        this.attempts.set(key, record);

        if (record.count >= this.maxAttempts) {
            const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
            return { limited: true, remainingAttempts: 0, resetSeconds };
        }

        return {
            limited: false,
            remainingAttempts: this.maxAttempts - record.count,
            resetSeconds: Math.ceil((record.resetTime - now) / 1000)
        };
    }

    /**
     * Reset attempt counter on successful authentication
     * @param {string} key 
     */
    reset(key) {
        this.attempts.delete(key);
    }
}

// Singleton login rate limiter: 20 attempts per 15 mins
const loginRateLimiter = new RateLimiter(20, 15 * 60 * 1000);

module.exports = {
    RateLimiter,
    loginRateLimiter
};
