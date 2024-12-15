export default function() {
    return new Promise((resolve, reject) => {
        Auth.user ? reject('/') : resolve();
    });
}
