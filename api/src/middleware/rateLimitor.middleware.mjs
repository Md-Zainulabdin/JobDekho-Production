import { rateLimit } from 'express-rate-limit'

const limitor = rateLimit({
    windowMs: 15 * 60 * 1000, // 20 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
    message: {
        message: "Too many requests, please try again later."
    },
    statusCode: 429,
})

const authRateLimitor = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
    message: {
        message: "Too many requests, please try again later."
    },
    statusCode: 429,
})

export { authRateLimitor, limitor }