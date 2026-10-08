/**
 * Growth IT Solution - Authentication & Authorization Middleware Engine
 */

const db = require('../../database/db');
const { parseCookies } = require('../utils/cookies');

// Role hierarchy & permission registry
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        'system:all',
        'manage:users',
        'manage:services',
        'manage:projects',
        'manage:messages',
        'manage:media',
        'manage:blogs',
        'manage:pages',
        'manage:content',
        'manage:assigned_content'
    ],
    ADMIN: [
        'manage:services',
        'manage:projects',
        'manage:messages',
        'manage:media',
        'manage:blogs',
        'manage:pages',
        'manage:content',
        'manage:assigned_content'
    ],
    EDITOR: [
        'manage:blogs',
        'manage:pages',
        'manage:content',
        'manage:assigned_content'
    ],
    CONTENT_MANAGER: [
        'manage:assigned_content'
    ]
};

/**
 * Extract session token from HTTP Request (Cookie or Authorization Bearer header)
 * @param {object} req 
 * @returns {string|null}
 */
function extractSessionToken(req) {
    // 1. Try secure HTTP-only Cookie
    const cookies = parseCookies(req);
    if (cookies.session_id) {
        return cookies.session_id;
    }

    // 2. Try Authorization header (Bearer token)
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7).trim();
    }

    return null;
}

/**
 * Authentication Middleware: Resolves and validates user session
 * @param {object} req 
 * @returns {object|null} Logged in sanitized user object or null
 */
function authenticate(req) {
    const token = extractSessionToken(req);
    if (!token) {
        return null;
    }

    const session = db.getSession(token);
    if (!session) {
        return null;
    }

    const user = db.getUserById(session.user_id);
    if (!user || user.status !== 'active') {
        return null;
    }

    // Sanitize user object (never expose password_hash)
    const sanitizedUser = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: ROLE_PERMISSIONS[user.role] || [],
        created_at: user.created_at
    };

    req.user = sanitizedUser;
    req.session = session;
    return sanitizedUser;
}

/**
 * Check if user has one of the allowed roles
 * @param {object} user 
 * @param {Array<string>} allowedRoles 
 * @returns {boolean}
 */
function isAuthorizedRole(user, allowedRoles = []) {
    if (!user || !user.role) return false;
    if (user.role === 'SUPER_ADMIN') return true; // Super Admin has full system access
    return allowedRoles.includes(user.role);
}

/**
 * Check if user has specific permission
 * @param {object} user 
 * @param {string} permission 
 * @returns {boolean}
 */
function isAuthorizedPermission(user, permission) {
    if (!user || !user.role) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
}

module.exports = {
    ROLE_PERMISSIONS,
    extractSessionToken,
    authenticate,
    isAuthorizedRole,
    isAuthorizedPermission
};
