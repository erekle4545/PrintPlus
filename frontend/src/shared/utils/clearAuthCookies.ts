export function clearAuthCookies() {
    const authCookieNames = [
        'laravel_session',
        'XSRF-TOKEN',
    ];

    const cookies = document.cookie.split(';');
    const domains = ['.printplus.ge', 'printplus.ge', '.api.printplus.ge', 'api.printplus.ge', ''];

    cookies.forEach(cookie => {
        const name = cookie.split('=')[0].trim();

        // Clear only auth-related cookies (laravel_session, XSRF-TOKEN, remember_web_*)
        const isAuthCookie = authCookieNames.includes(name) || name.startsWith('remember_web');

        if (isAuthCookie) {
            // Clear for all possible domains and paths
            domains.forEach(domain => {
                if (domain) {
                    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=${domain}`;
                } else {
                    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                }
            });
            console.log(`Cleared auth cookie: ${name}`);
        }
    });
}