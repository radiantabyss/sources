import createRouter from '@radiantabyss/neutralino/src/Routing/Router.js';

export default async () => {
    const { Router, RouteFiles } = await createRouter();

    //load ipc routes
    for ( let Route of RouteFiles.routes ) {
        Router.addRoute(Route);
    }

    //load routes by user type or team role
}
