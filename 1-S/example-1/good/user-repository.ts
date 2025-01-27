import User from "./user";

export class UserRepository {
    public saveToDatabase(user: User): void {
        console.log("saving to database")
    }
}