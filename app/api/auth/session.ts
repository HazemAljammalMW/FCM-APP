export function isTokenSet(): boolean {
    return sessionStorage.getItem('token') !== null;
}
