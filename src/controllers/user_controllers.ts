import { Request, Response } from "express";
import { UserService } from "../services/user_service";
import { hashPassword, comparePassword } from "../hash";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userService = new UserService();

export class UserController {
  static async register(req: Request, res: Response) {
    const { fullName, birthDate, email, password } = req.body;
    const existingUser = await userService.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email уже существует" });

    const hashed = await hashPassword(password);
    const user = await userService.create({ fullName, birthDate, email, password: hashed });
    res.status(201).json(user);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ message: "Неверный email или пароль" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.json({ token });
  }

  static async getUser(req: any, res: Response) {
    const { id } = req.params;
    const user = await userService.findById(Number(id));
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    if (req.user.id !== user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Нет доступа" });

    res.json(user);
  }

  static async getUsers(req: any, res: Response) {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Нет доступа" });
    const users = await userService.findAll();
    res.json(users);
  }

  static async blockUser(req: any, res: Response) {
    const { id } = req.params;
    if (req.user.id !== Number(id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Нет доступа" });

    await userService.updateStatus(Number(id), "inactive");
    res.json({ message: "Пользователь заблокирован" });
  }
}