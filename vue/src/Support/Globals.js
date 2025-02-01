export default async () => {
    return {
        Auth: Store.state.Auth,
        FRONT_URL: import.meta.env.VITE_FRONT_URL,
        BACK_URL: import.meta.env.VITE_BACK_URL,
        UPLOADS_URL: import.meta.env.VITE_UPLOADS_URL,
        IS_PRODUCTION: import.meta.env.VITE_ENV == 'production',
    }
}
