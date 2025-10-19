// Aplicação do DIP: Ambos dependem de abstrações (interfaces)
// UserService (alto nível) e implementações concretas (baixo nível) dependem da interface

// Abstração - o contrato que todos devem seguir
interface NotificationService {
  send(to: string, subject: string, message: string): void;
}

// Implementações concretas - dependem da abstração
class EmailServiceDIP implements NotificationService {
  constructor(
    private host: string,
    private port: number,
    private protocol: string,
    private user: string,
    private pass: string
  ) { }

  send(to: string, subject: string, message: string): void {
    console.log(`📧 Enviando email para ${to}`);
    console.log(`   Assunto: ${subject}`);
    console.log(`   Mensagem: ${message}`);
  }
}

class SMSService implements NotificationService {
  send(to: string, subject: string, message: string): void {
    console.log(`📱 Enviando SMS para ${to}`);
    console.log(`   ${subject}: ${message}`);
  }
}

class PushNotificationService implements NotificationService {
  send(to: string, subject: string, message: string): void {
    console.log(`🔔 Enviando Push Notification para ${to}`);
    console.log(`   ${subject}: ${message}`);
  }
}

// Serviço de alto nível - depende da abstração, não da implementação
class UserServiceDIP {
  private notificationService: NotificationService; // Dependência da interface!

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService; // Injeção de dependência!
  }

  registerUser(email: string, name: string): void {
    console.log(`\n✅ Registrando usuário: ${name} (${email})`);

    // Lógica de registro...
    console.log("   Salvando no banco de dados...");

    // Enviando notificação - não sabe qual implementação está sendo usada!
    this.notificationService.send(
      email,
      "Bem-vindo!",
      `Olá ${name}, seja bem-vindo!`
    );
  }
}

// Mock para testes - implementa a mesma interface
class MockNotificationService implements NotificationService {
  public sentMessages: Array<{ to: string; subject: string; message: string }> =
    [];

  send(to: string, subject: string, message: string): void {
    console.log(`🧪 [MOCK] Notificação capturada (não enviada)`);
    this.sentMessages.push({ to, subject, message });
  }
}

// Testes e demonstração
console.log("=== Usando Email ===");
const emailService = new EmailServiceDIP(
  "smtp.example.com",
  587,
  "TLS",
  "user@example.com",
  "password"
);
const userServiceWithEmail = new UserServiceDIP(emailService);
userServiceWithEmail.registerUser("joao@example.com", "João Silva");

console.log("\n=== Usando SMS ===");
const smsService = new SMSService();
const userServiceWithSMS = new UserServiceDIP(smsService);
userServiceWithSMS.registerUser("+5511999999999", "Maria Santos");

console.log("\n=== Usando Push Notification ===");
const pushService = new PushNotificationService();
const userServiceWithPush = new UserServiceDIP(pushService);
userServiceWithPush.registerUser("user123", "Pedro Costa");

console.log("\n=== Usando Mock para Testes ===");
const mockService = new MockNotificationService();
const userServiceForTest = new UserServiceDIP(mockService);
userServiceForTest.registerUser("test@example.com", "Usuário Teste");
console.log(`📊 Mensagens capturadas: ${mockService.sentMessages.length}`);

console.log("\n✅ Vantagens:");
console.log("- UserService não conhece implementações concretas");
console.log("- Fácil de testar com mocks");
console.log("- Fácil adicionar novos tipos de notificação");
console.log("- Baixo acoplamento entre classes");
