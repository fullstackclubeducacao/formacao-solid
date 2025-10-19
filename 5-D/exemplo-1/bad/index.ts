// Violação do DIP: Classe de alto nível depende diretamente de implementação concreta
// UserService depende diretamente da classe EmailService (baixo nível)

// Serviço de baixo nível - implementação concreta
class EmailService {
  constructor(
    private host: string,
    private port: number,
    private protocol: string,
    private user: string,
    private pass: string
  ) { }

  sendEmail(to: string, subject: string, body: string): void {
    console.log(`📧 Enviando email para ${to}`);
    console.log(`   Assunto: ${subject}`);
    console.log(`   Corpo: ${body}`);
  }
}

// Serviço de alto nível - PROBLEMA: depende diretamente da implementação concreta
class UserService {
  private emailService: EmailService; // Dependência direta da classe concreta!

  constructor() {
    this.emailService = new EmailService(
      "smtp.example.com",
      587,
      "TLS",
      "user@example.com",
      "password"
    ); // Acoplamento forte!
  }

  registerUser(email: string, name: string): void {
    console.log(`\n✅ Registrando usuário: ${name} (${email})`);

    // Lógica de registro...
    console.log("   Salvando no banco de dados...");

    // Enviando notificação
    this.emailService.sendEmail(
      email,
      "Bem-vindo!",
      `Olá ${name}, seja bem-vindo!`
    );
  }
}

// Teste
const userService = new UserService();
userService.registerUser("joao@example.com", "João Silva");

// PROBLEMAS:
// 1. Impossível testar UserService sem enviar emails reais
// 2. Impossível trocar EmailService por SMSService ou PushNotification
// 3. UserService está fortemente acoplado a EmailService
// 4. Mudanças em EmailService podem quebrar UserService

console.log("\n❌ Problemas:");
console.log("- UserService depende diretamente de EmailService");
console.log("- Difícil de testar (não podemos mockar EmailService facilmente)");
console.log("- Impossível mudar para SMS ou Push Notification sem modificar UserService");
