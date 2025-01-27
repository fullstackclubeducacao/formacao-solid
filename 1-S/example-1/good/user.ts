export default class User {
    public firstName: string;
    public lastName: string;
    public email: string;

    constructor(firstName: string, lastName: string, email: string) {
        console.log("creating the user object");
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`
    }
}