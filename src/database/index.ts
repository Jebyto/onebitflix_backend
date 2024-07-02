import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: 'DB_USER',
    password: 'DB_PASSWORD',
    database: 'DB_NAME',
    define: {
        underscored: true,
    }
});