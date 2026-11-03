export default async () => {
    loadFrontend();
}

//front is loaded last, so its first IPC call finds the routes registered
function loadFrontend() {
    let script = document.createElement('script');
    script.src = VUE_SCRIPT_URL;
    script.type = 'module';
    document.head.appendChild(script);
}
