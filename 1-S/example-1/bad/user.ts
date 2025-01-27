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

    public saveToDatabase(): void {
        // Lógica para salvar no banco de dados
        // Acoplamento com banco de dados
        //  - Conexão
        //  - Tipo de banco de dados
        //  - Credenciais de acesso
        console.log("saving to database")
    }

    public sendEmail(): void {
        // Lógica para enviar e-mail
        // Acoplamento com servidor de e-mail
        //  - Dados de servidor de e-mail
        //  - Configurações de acesso
        console.log("sending email")
    }
}