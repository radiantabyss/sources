export default async () => {
    return {
        Auth: Store.state.Auth,
        app_url: import.meta.env.VITE_URL,
        back_url: import.meta.env.VITE_BACK_URL,
        uploads_url: import.meta.env.VITE_UPLOADS_URL,

        is_dev: import.meta.env.MODE == 'development',
        is_local: import.meta.env.VITE_ENV == 'local',
        is_production: import.meta.env.VITE_ENV == 'production',
    }
}
