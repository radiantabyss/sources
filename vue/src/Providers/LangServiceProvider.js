export default async (app) => {
    window.lang = import.meta.env.VITE_DEFAULT_LANG;
    window.Translate = {};
    window.__ = (str) => {
        return Translate[str] || str;
    }
    app.config.globalProperties.__ = __;

    if ( Auth.user && Auth.user.meta.lang ) {
        window.lang = Auth.user.meta.lang;
    }

    if ( lang == 'en' ) {
        return;
    }

    let url = import.meta.env.VITE_URL;
    Translate = await Request.get(`/lang/${lang}.json?v=${Math.random()}`, {}, false, is_dev ? `${url}:8080` : url);
}
