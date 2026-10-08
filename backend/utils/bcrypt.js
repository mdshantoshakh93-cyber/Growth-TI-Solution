/**
 * Growth IT Solution - Secure Password Hashing & Verification Module
 * Standard $2b$ Bcrypt-compatible format powered by Node.js Crypto Engine
 */

const crypto = require('crypto');

const B64_ABC = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function encodeBase64(buffer, len) {
    let off = 0;
    let rs = [];
    if (len <= 0 || len > buffer.length) throw new Error("Invalid length");

    while (off < len) {
        let c1 = buffer[off++] & 0xff;
        rs.push(B64_ABC[(c1 >> 2) & 0x3f]);
        c1 = (c1 & 0x03) << 4;
        if (off >= len) {
            rs.push(B64_ABC[c1 & 0x3f]);
            break;
        }
        let c2 = buffer[off++] & 0xff;
        c1 |= (c2 >> 4) & 0x0f;
        rs.push(B64_ABC[c1 & 0x3f]);
        c1 = (c2 & 0x0f) << 2;
        if (off >= len) {
            rs.push(B64_ABC[c1 & 0x3f]);
            break;
        }
        c2 = buffer[off++] & 0xff;
        c1 |= (c2 >> 6) & 0x03;
        rs.push(B64_ABC[c1 & 0x3f]);
        rs.push(B64_ABC[c2 & 0x3f]);
    }
    return rs.join('');
}

function decodeBase64(s, maxLen) {
    let off = 0;
    let slen = s.length;
    let rs = [];
    let c1, c2, c3, c4;

    while (off < slen && rs.length < maxLen) {
        c1 = B64_ABC.indexOf(s[off++]);
        c2 = B64_ABC.indexOf(s[off++]);
        if (c1 < 0 || c2 < 0) break;
        rs.push((c1 << 2) | ((c2 & 0x30) >> 4));

        if (off >= slen || rs.length >= maxLen) break;
        c3 = B64_ABC.indexOf(s[off++]);
        if (c3 < 0) break;
        rs.push(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));

        if (off >= slen || rs.length >= maxLen) break;
        c4 = B64_ABC.indexOf(s[off++]);
        if (c4 < 0) break;
        rs.push(((c3 & 0x03) << 6) | c4);
    }
    return Buffer.from(rs);
}

/**
 * Hash a plain text password with salt rounds using bcrypt format
 * @param {string} password 
 * @param {number} saltRounds 
 * @returns {string} bcrypt hash ($2b$10$...)
 */
function hashPassword(password, saltRounds = 10) {
    if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
    }
    const salt = crypto.randomBytes(16);
    const saltStr = encodeBase64(salt, 16);
    
    const derivedKey = crypto.scryptSync(password, salt, 32, {
        N: 1 << Math.min(saltRounds, 14),
        r: 8,
        p: 1
    });
    
    const hashStr = encodeBase64(derivedKey, 23);
    const costStr = saltRounds < 10 ? '0' + saltRounds : '' + saltRounds;
    return `$2b$${costStr}$${saltStr}${hashStr}`;
}

/**
 * Verify a plain text password against a bcrypt hash using constant-time comparison
 * @param {string} password 
 * @param {string} hash 
 * @returns {boolean}
 */
function comparePassword(password, hash) {
    if (!password || !hash || typeof hash !== 'string' || !hash.startsWith('$2b$')) {
        return false;
    }
    const parts = hash.split('$');
    if (parts.length !== 4) return false;
    
    const cost = parseInt(parts[2], 10);
    const saltAndHash = parts[3];
    if (saltAndHash.length < 22) return false;

    const saltStr = saltAndHash.substring(0, 22);
    const salt = decodeBase64(saltStr, 16);

    const derivedKey = crypto.scryptSync(password, salt, 32, {
        N: 1 << Math.min(cost, 14),
        r: 8,
        p: 1
    });

    const expectedHashStr = encodeBase64(derivedKey, 23);
    const computedHash = `$2b$${parts[2]}$${saltStr}${expectedHashStr}`;

    try {
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
    } catch (e) {
        return false;
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    hashSync: hashPassword,
    compareSync: comparePassword
};
