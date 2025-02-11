import createRouter from '@radiantabyss/vue/src/Routing/Router';

export default async (app) => {
    const { Router, RouteFiles } = await createRouter();

    //load auth routes
    for ( let Route of RouteFiles.auth ) {
        Router.addRoute(Route);
    }

    //load general routes
    for ( let Route of RouteFiles.routes ) {
        Router.addRoute(Route);
    }

    //load routes by user type or team role
    if ( Auth.user ) {

    }

    window.Router = Router;
    app.use(Router);
}
