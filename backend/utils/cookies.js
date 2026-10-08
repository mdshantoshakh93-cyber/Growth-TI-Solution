/**
 * Growth IT Solution - Cookie Parsing & Serialization Utility
 */

/**
 * Parse Cookie header string from request into key-value object
 * @param {object} req HTTP request
 * @returns {object} cookies object
 */
function parseCookies(req) {
    const list = {};
    const cookieHeader = req.headers && req.headers.cookie;

    if (!cookieHeader) return list;

    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            list[name] = decodeURIComponent(val);
        }
    });

    return list;
}

/**
 * Serialize cookie options into Set-Cookie header string
 * @param {string} name 
 * @param {string} val 
 * @param {object} options 
 * @returns {string} Set-Cookie header string
 */
function serializeCookie(name, val, options = {}) {
    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;

    if (options.maxAge !== undefined) {
        cookieStr += `; Max-Age=${options.maxAge}`;
    }

    if (options.expires) {
        cookieStr += `; Expires=${options.expires.toUTCString()}`;
    }

    if (options.path) {
        cookieStr += `; Path=${options.path}`;
    } else {
        cookieStr += `; Path=/`;
    }

    if (options.httpOnly) {
        cookieStr += `; HttpOnly`;
    }

    if (options.secure) {
        cookieStr += `; Secure`;
    }

    if (options.sameSite) {
        const sameSiteVal = typeof options.sameSite === 'string' ? options.sameSite : 'Lax';
        cookieStr += `; SameSite=${sameSiteVal}`;
    }

    return cookieStr;
}

module.exports = {
    parseCookies,
    serializeCookie
};
