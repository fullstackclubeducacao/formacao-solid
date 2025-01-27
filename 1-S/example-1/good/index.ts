import EmailService from "./email-service";
import {UserRepository} from "./user-repository";
import User from "./user";

const myUser = new User("Valdir", "Mendes", "johndoe@example.com")
console.log(`Usuário: ${myUser.getFullName()}`);
const userRepository = new UserRepository()
const emailService = new EmailService()
userRepository.saveToDatabase(myUser)
emailService.send(myUser)