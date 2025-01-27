import User from "./user";

export default class EmailService {
    public send(user: User): void {
        console.log("sending email")
    }
}