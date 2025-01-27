import User from "./user";

const myUser = new User("Valdir", "Mendes", "valdir.mendes@minhaempresa.com");
console.log(`Usuário: ${myUser.getFullName()}`);
myUser.saveToDatabase();
myUser.sendEmail();