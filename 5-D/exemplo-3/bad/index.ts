// Violação do DIP: Sistema de processamento de pagamento com múltiplas dependências concretas
// CheckoutService depende diretamente de implementações concretas de vários serviços

interface Payment {
  orderId: string;
  amount: number;
  method: "credit_card" | "pix" | "boleto";
  customerId: string;
}

interface Customer {
  id: string;
  email: string;
  name: string;
}

// Serviços concretos de baixo nível
class StripePaymentGateway {
  processPayment(amount: number, cardToken: string): boolean {
    console.log(`💳 [Stripe] Processando R$ ${amount} com token ${cardToken}`);
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`↩️  [Stripe] Estornando transação ${transactionId}`);
    return true;
  }
}

class SendGridEmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`📧 [SendGrid] Enviando email para ${to}`);
    console.log(`   ${subject}: ${body}`);
  }
}

class TwilioSMSService {
  sendSMS(to: string, message: string): void {
    console.log(`📱 [Twilio] Enviando SMS para ${to}: ${message}`);
  }
}

class MySQLDatabase {
  saveTransaction(payment: Payment): void {
    console.log(`💾 [MySQL] Salvando transação:`, payment);
  }

  getCustomer(customerId: string): Customer {
    console.log(`🔍 [MySQL] Buscando cliente ${customerId}`);
    return {
      id: customerId,
      email: "customer@example.com",
      name: "Cliente Exemplo",
    };
  }
}

class CloudWatchLogger {
  log(level: string, message: string): void {
    console.log(`📝 [CloudWatch] [${level}] ${message}`);
  }

  error(message: string, error: Error): void {
    console.error(`❌ [CloudWatch] ERROR: ${message}`, error);
  }
}

class NewRelicMetrics {
  recordMetric(name: string, value: number): void {
    console.log(`📊 [NewRelic] Métrica ${name}: ${value}`);
  }

  incrementCounter(name: string): void {
    console.log(`📈 [NewRelic] Incrementando contador ${name}`);
  }
}

// Serviço de alto nível - PROBLEMA: depende diretamente de todas as implementações concretas
class CheckoutService {
  private paymentGateway: StripePaymentGateway; // Dependência concreta!
  private emailService: SendGridEmailService; // Dependência concreta!
  private smsService: TwilioSMSService; // Dependência concreta!
  private database: MySQLDatabase; // Dependência concreta!
  private logger: CloudWatchLogger; // Dependência concreta!
  private metrics: NewRelicMetrics; // Dependência concreta!

  constructor() {
    // Acoplamento forte com todas as implementações!
    this.paymentGateway = new StripePaymentGateway();
    this.emailService = new SendGridEmailService();
    this.smsService = new TwilioSMSService();
    this.database = new MySQLDatabase();
    this.logger = new CloudWatchLogger();
    this.metrics = new NewRelicMetrics();
  }

  processCheckout(payment: Payment): boolean {
    this.logger.log("INFO", `Iniciando checkout para pedido ${payment.orderId}`);
    this.metrics.incrementCounter("checkout.started");

    try {
      // Buscar cliente
      const customer = this.database.getCustomer(payment.customerId);

      // Processar pagamento
      const success = this.paymentGateway.processPayment(
        payment.amount,
        "card_token_123"
      );

      if (!success) {
        throw new Error("Falha no processamento do pagamento");
      }

      // Salvar transação
      this.database.saveTransaction(payment);

      // Notificar cliente
      this.emailService.sendEmail(
        customer.email,
        "Pagamento Confirmado",
        `Seu pagamento de R$ ${payment.amount} foi confirmado!`
      );

      this.smsService.sendSMS(
        "+5511999999999",
        `Pagamento de R$ ${payment.amount} confirmado!`
      );

      // Métricas
      this.metrics.recordMetric("checkout.amount", payment.amount);
      this.metrics.incrementCounter("checkout.success");

      this.logger.log("INFO", `Checkout finalizado com sucesso: ${payment.orderId}`);

      return true;
    } catch (error) {
      this.logger.error("Erro no checkout", error as Error);
      this.metrics.incrementCounter("checkout.failed");
      return false;
    }
  }
}

// Teste
console.log("=== Processando Checkout ===\n");

const checkoutService = new CheckoutService();

const payment: Payment = {
  orderId: "ORD-001",
  amount: 499.90,
  method: "credit_card",
  customerId: "CUST-123",
};

const result = checkoutService.processCheckout(payment);

console.log(`\n${result ? "✅" : "❌"} Checkout ${result ? "realizado" : "falhou"}`);

console.log("\n❌ Problemas:");
console.log("- CheckoutService está acoplado a 6 implementações concretas");
console.log("- Impossível trocar Stripe por outro gateway sem modificar CheckoutService");
console.log("- Impossível trocar SendGrid por outro provedor de email");
console.log("- Impossível testar sem instanciar todos os serviços reais");
console.log("- Mudança em qualquer serviço externo pode quebrar CheckoutService");
console.log("- Violação massiva do DIP e SRP");
