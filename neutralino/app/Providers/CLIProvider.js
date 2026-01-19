import Command from '@radiantabyss/neutralino/src/Command.js';

export default async () => {
    await Command();
    await Neutralino.app.exit();
}
