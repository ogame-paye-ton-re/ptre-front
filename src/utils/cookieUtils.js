export function setCookie(name, value, options = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
        if (typeof options.expires === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + options.expires * 1000);
            options.expires = date.toUTCString();
        }
        cookieString += `; expires=${options.expires}`;
    }

    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
        cookieString += `; secure`;
    }

    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export function deleteCookie(name, options = {}) {
    setCookie(name, '', { 
        expires: -1, 
        path: options.path || '/', 
        domain: options.domain 
    });
}
