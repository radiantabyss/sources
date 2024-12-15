import createRouter from '@lumi/Routing/Router';

export default async (app) => {
    const { Router, RouteGroups } = await createRouter();

    //load auth routes
    for ( let Route of RouteGroups.auth ) {
        Router.addRoute(Route);
    }

    //load general routes
    for ( let Route of RouteGroups.routes ) {
        Router.addRoute(Route);
    }

    if ( !Auth.user ) {
        window.Router = Router;
        app.use(Router);
        return;
    }

    //load routes by user type or team role

    window.Router = Router;
    app.use(Router);
}
