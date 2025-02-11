import { Model, DataTypes } from 'sequelize';

class Panel extends Model {
    static async find(id) {
        return await this.findOne({
            where: { id }
        });
    }
}

Panel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        swatches: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        swatch_icon_size: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default',
        },
        show_swatch_text: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        has_tray: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        swatch_alignment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        theme_settings: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        window_settings: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: SEQUELIZE,
        modelName: 'Panel',
        tableName: 'panel',
        timestamps: true,
    }
);

Panel.addHook('beforeFind', (options) => {
    options.raw = true;
});

export default Panel;
