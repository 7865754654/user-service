// Импортируем DataSource из TypeORM для подключения к базе данных
import { DataSource } from "typeorm";
import { User } from "../models/user.entity";
// dotenv позволяет читать переменные окружения из файла .env
import dotenv from "dotenv";

// Загружаем все переменные из .env в process.env
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Автоматически создаёт таблицы по сущностям
    entities: [User], //Сам массив сущностей(таблицы)
});