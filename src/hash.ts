import bcrypt from "bcrypt";
// Функция для хеширования пароля
export const hashPassword = async (password: string): Promise <string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash
    }
    catch (error) {
 console.error("Ошибка при хешировании пароля:", error);
 throw error; 
    }
};
//Функция для сравнения введённого пароля с хешем из базы
export const comparePassword = async (password: string, hash: string): Promise <boolean> => {
    try {
        return await bcrypt.compare(password, hash);
    }
    catch (error) {
        console.error("Ошибка во время сравнения паролей:", error);
        throw error;
    }
};

