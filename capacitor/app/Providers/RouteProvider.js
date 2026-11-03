import createRouter from '@radiantabyss/capacitor/src/Routing/Router.js';

export default async () => {
    const { Router, RouteFiles } = await createRouter();

    //load ipc routes
    for ( let Route of RouteFiles.routes ) {
        Router.addRoute(Route);
    }
}
