import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { hashPassword, comparePassword } from "../hash";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userService = new UserService();
  // Регистрация нового пользователя
export class UserController {
  static async registration(req: Request, res: Response) {
    const { 
        fullName, 
        birthDate, 
        email, 
        password 
    } = req.body;
// Проверяем есть ли уже такой email
    const userExists = await userService.findByEmail(email);
    if (userExists) return res.status(400).json({ message: "Пользователь с таким email уже существует." });
// Хешируем пароль
    const hashedPassword = await hashPassword(password);
    const newUser = await userService.create({ 
        fullName, 
        birthDate, 
        email, 
        password: hashedPassword 
    });
    res.status(201).json(newUser);
  }
// Авторизация пользователя
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль." });
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Неверный email или пароль." });
    } 

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    res.json({ token });
  }
// Получение одного пользователя
  static async getUser(req: any, res: Response) { 
    const { id } = req.params;
    const user = await userService.findById(id);
    if (!user) 
        return res.status(404).json({ message: "Пользователь с таким id найден." });
//Проверка прав 
    if (req.user.id !== user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Доступ ограничен." });
    res.json(user);
  }
//Получение всех пользователей
  static async getAllUsers(req: any, res: Response) {
    if (req.user.role !== "admin") 
        return res.status(403).json({ message: "Доступ ограничен." });
    const users = await userService.findAll();
    res.json(users);
  }
// Блокировка пользователя
  static async blockUser(req: any, res: Response) {
    const { id } = req.params;
    if (req.user.id !== Number(id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Доступ ограничен." });

    await userService.updateStatus(Number(id), "inactive");
    res.json({ message: "Пользователь заблокирован." });
  }
}