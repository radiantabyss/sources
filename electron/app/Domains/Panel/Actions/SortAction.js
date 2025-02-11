let self = {
    async run() {
        let data = Invoke.all();
        let items = await Model.Panel.findAll({
            where: {
                id: data.ids
            },
            order: ['position'],
        });

        self[data.direction](items);
    },

    async up(items) {
        let first = items[0].position;

        for ( let i = 0; i < items.length - 1; i++ ) {
            await Model.Panel.update({
                position: items[i + 1].position
            }, {
                where: {
                    id: items[i].id,
                }
            });
        }

        await Model.Panel.update({
            position: first
        }, {
            where: {
                id: items[items.length - 1].id,
            }
        });
    },

    async down(items) {
        let last = items[items.length - 1].position;

        for ( let i = items.length - 1; i > 0; i-- ) {
            await Model.Panel.update({
                position: items[i - 1].position
            }, {
                where: {
                    id: items[i].id,
                }
            });
        }

        await Model.Panel.update({
            position: last
        }, {
            where: {
                id: items[0].id,
            }
        });
    },
}

export default self;
