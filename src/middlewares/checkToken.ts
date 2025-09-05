import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkToken = (req: any, res: Response, next: NextFunction) => {
   // Получаем токен из заголовка Authorization (формат: "Bearer <токен>")
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Токена нет" });
 // Отделяем сам токен от слова "Bearer"
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Токен пустой" });

try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = userInfo;
        next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
};
