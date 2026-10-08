/**
 * Growth IT Solution - Server-Side HTML Sanitizer
 * Strips malicious tags (<script>, <iframe>, <object>, <embed>, event handlers like onload/onerror, javascript: URIs)
 * while preserving safe HTML formatting for blog posts and rich content.
 */

function sanitizeHtml(htmlInput) {
    if (typeof htmlInput !== 'string') return '';

    let clean = htmlInput;

    // 1. Remove script, iframe, object, embed, applet tags and their contents
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // 2. Remove inline event handlers (on*="...")
    clean = clean.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // 3. Remove javascript: pseudo-protocols in href/src
    clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>]+/gi, 'href="#"');
    clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>]+/gi, 'src=""');

    return clean.trim();
}

module.exports = {
    sanitizeHtml
};
