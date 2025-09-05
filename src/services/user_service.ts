import { AppDataSource } from "../config/db";
import { User } from "../models/user.entity";
export class UserService {
    private userRepository = AppDataSource.getRepository(User);
async create(user: Partial<User>) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
}
async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
}
async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
}
async findAll() {
    return this.userRepository.find();
}
async updateStatus(id: number, status: "active" | "inactive") {
    return this.userRepository.update(id, { status });
}
}