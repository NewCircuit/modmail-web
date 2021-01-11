function cookieExists(cname: string) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const array = decodedCookie.split(';');
    const idx = array.findIndex((cookie) => cookie.trim().indexOf(name) === 0);
    return idx >= 0;
}

function cookieSet(cname: string, cvalue: string, expirationInHours = 24) {
    const now = new Date();
    now.setTime(now.getTime() + expirationInHours * 60 * 60 * 1000);
    const expires = `expires=${now.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function cookieRemove(cname: string) {
    if (cookieExists(cname)) {
        cookieSet(cname, '', -1);
    }
}

export default {
    exists: cookieExists,
    remove: cookieRemove,
    set: cookieSet,
};

// -- test
// export default function Cookies() {
//     if (!cookieExists('test')) {
//         console.log('setting cookie');
//         cookieSet('test', 'test');
//     } else {
//         console.log('cookie already set');
//         cookieRemove('test');
//     }
// }
