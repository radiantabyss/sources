export default function() {
    return new Promise((resolve, reject) => {
        Auth.user ? resolve() : reject('/login');
    });
}
