// Aplicação do DIP: Sistema com inversão de dependência completa
// CheckoutService depende apenas de abstrações, todas as implementações são injetadas

// ============= Tipos de Domínio =============

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
  phone?: string;
}

// ============= Abstrações (Interfaces) =============

interface PaymentGateway {
  processPayment(amount: number, paymentToken: string): boolean;
  refund(transactionId: string): boolean;
}

interface EmailService {
  send(to: string, subject: string, body: string): void;
}

interface SMSService {
  send(to: string, message: string): void;
}

interface CustomerRepository {
  findById(customerId: string): Customer | null;
}

interface TransactionRepository {
  save(payment: Payment): void;
}

interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
  debug(message: string): void;
}

interface MetricsCollector {
  recordMetric(name: string, value: number): void;
  incrementCounter(name: string): void;
}

// ============= Implementações Concretas - Stripe =============

class StripePaymentGateway implements PaymentGateway {
  processPayment(amount: number, paymentToken: string): boolean {
    console.log(`💳 [Stripe] Processando R$ ${amount} com token ${paymentToken}`);
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`↩️  [Stripe] Estornando transação ${transactionId}`);
    return true;
  }
}

// ============= Implementações Concretas - PagSeguro =============

class PagSeguroPaymentGateway implements PaymentGateway {
  processPayment(amount: number, paymentToken: string): boolean {
    console.log(`💳 [PagSeguro] Processando R$ ${amount} com token ${paymentToken}`);
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`↩️  [PagSeguro] Estornando transação ${transactionId}`);
    return true;
  }
}

// ============= Implementações de Email =============

class SendGridEmailService implements EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`📧 [SendGrid] Enviando para ${to}`);
    console.log(`   Assunto: ${subject}`);
    console.log(`   Corpo: ${body}`);
  }
}

class AWSEmailService implements EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`📧 [AWS SES] Enviando para ${to}`);
    console.log(`   Assunto: ${subject}`);
  }
}

// ============= Implementações de SMS =============

class TwilioSMSService implements SMSService {
  send(to: string, message: string): void {
    console.log(`📱 [Twilio] SMS para ${to}: ${message}`);
  }
}

class SNSSMSService implements SMSService {
  send(to: string, message: string): void {
    console.log(`📱 [AWS SNS] SMS para ${to}: ${message}`);
  }
}

// ============= Implementações de Repositórios =============

class MySQLCustomerRepository implements CustomerRepository {
  findById(customerId: string): Customer | null {
    console.log(`🔍 [MySQL] Buscando cliente ${customerId}`);
    return {
      id: customerId,
      email: "customer@example.com",
      name: "Cliente MySQL",
      phone: "+5511999999999",
    };
  }
}

class MongoDBCustomerRepository implements CustomerRepository {
  findById(customerId: string): Customer | null {
    console.log(`🔍 [MongoDB] Buscando cliente ${customerId}`);
    return {
      id: customerId,
      email: "customer@example.com",
      name: "Cliente MongoDB",
      phone: "+5511999999999",
    };
  }
}

class MySQLTransactionRepository implements TransactionRepository {
  save(payment: Payment): void {
    console.log(`💾 [MySQL] Salvando transação do pedido ${payment.orderId}`);
  }
}

class MongoDBTransactionRepository implements TransactionRepository {
  save(payment: Payment): void {
    console.log(`💾 [MongoDB] Salvando transação do pedido ${payment.orderId}`);
  }
}

// ============= Implementações de Logger =============

class CloudWatchLogger implements Logger {
  info(message: string): void {
    console.log(`📝 [CloudWatch] INFO: ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`❌ [CloudWatch] ERROR: ${message}`, error?.message || "");
  }

  debug(message: string): void {
    console.log(`🐛 [CloudWatch] DEBUG: ${message}`);
  }
}

class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`📝 [Console] INFO: ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`❌ [Console] ERROR: ${message}`, error?.message || "");
  }

  debug(message: string): void {
    console.log(`🐛 [Console] DEBUG: ${message}`);
  }
}

// ============= Implementações de Métricas =============

class NewRelicMetrics implements MetricsCollector {
  recordMetric(name: string, value: number): void {
    console.log(`📊 [NewRelic] Métrica ${name}: ${value}`);
  }

  incrementCounter(name: string): void {
    console.log(`📈 [NewRelic] Incrementando ${name}`);
  }
}

class DatadogMetrics implements MetricsCollector {
  recordMetric(name: string, value: number): void {
    console.log(`📊 [Datadog] Métrica ${name}: ${value}`);
  }

  incrementCounter(name: string): void {
    console.log(`📈 [Datadog] Incrementando ${name}`);
  }
}

// ============= Serviço de Alto Nível =============

class CheckoutService {
  constructor(
    private paymentGateway: PaymentGateway,
    private emailService: EmailService,
    private smsService: SMSService,
    private customerRepository: CustomerRepository,
    private transactionRepository: TransactionRepository,
    private logger: Logger,
    private metrics: MetricsCollector
  ) {
    // Todas as dependências são injetadas!
    // CheckoutService não conhece implementações concretas!
  }

  processCheckout(payment: Payment): boolean {
    this.logger.info(`Iniciando checkout para pedido ${payment.orderId}`);
    this.metrics.incrementCounter("checkout.started");

    try {
      // Buscar cliente
      const customer = this.customerRepository.findById(payment.customerId);

      if (!customer) {
        throw new Error("Cliente não encontrado");
      }

      this.logger.debug(`Cliente encontrado: ${customer.name}`);

      // Processar pagamento
      const paymentToken = this.generatePaymentToken(payment);
      const success = this.paymentGateway.processPayment(
        payment.amount,
        paymentToken
      );

      if (!success) {
        throw new Error("Falha no processamento do pagamento");
      }

      // Salvar transação
      this.transactionRepository.save(payment);

      // Notificar cliente por email
      this.emailService.send(
        customer.email,
        "Pagamento Confirmado",
        `Olá ${customer.name}, seu pagamento de R$ ${payment.amount.toFixed(2)} foi confirmado!`
      );

      // Notificar por SMS se tiver telefone
      if (customer.phone) {
        this.smsService.send(
          customer.phone,
          `Pagamento de R$ ${payment.amount.toFixed(2)} confirmado! Pedido: ${payment.orderId}`
        );
      }

      // Registrar métricas
      this.metrics.recordMetric("checkout.amount", payment.amount);
      this.metrics.incrementCounter("checkout.success");

      this.logger.info(`Checkout finalizado com sucesso: ${payment.orderId}`);

      return true;
    } catch (error) {
      this.logger.error("Erro no checkout", error as Error);
      this.metrics.incrementCounter("checkout.failed");
      return false;
    }
  }

  private generatePaymentToken(payment: Payment): string {
    return `token_${payment.method}_${Date.now()}`;
  }
}

// ============= Factory Pattern para criar instâncias =============

class CheckoutServiceFactory {
  static createWithStripeAndMySQL(): CheckoutService {
    return new CheckoutService(
      new StripePaymentGateway(),
      new SendGridEmailService(),
      new TwilioSMSService(),
      new MySQLCustomerRepository(),
      new MySQLTransactionRepository(),
      new CloudWatchLogger(),
      new NewRelicMetrics()
    );
  }

  static createWithPagSeguroAndMongoDB(): CheckoutService {
    return new CheckoutService(
      new PagSeguroPaymentGateway(),
      new AWSEmailService(),
      new SNSSMSService(),
      new MongoDBCustomerRepository(),
      new MongoDBTransactionRepository(),
      new ConsoleLogger(),
      new DatadogMetrics()
    );
  }

  static createForTesting(): CheckoutService {
    // Podemos criar mocks facilmente
    return new CheckoutService(
      new MockPaymentGateway(),
      new MockEmailService(),
      new MockSMSService(),
      new MockCustomerRepository(),
      new MockTransactionRepository(),
      new ConsoleLogger(),
      new MockMetrics()
    );
  }
}

// ============= Mocks para Testes =============

class MockPaymentGateway implements PaymentGateway {
  processPayment(amount: number, paymentToken: string): boolean {
    console.log(`🧪 [Mock] Pagamento processado: R$ ${amount}`);
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`🧪 [Mock] Estorno processado: ${transactionId}`);
    return true;
  }
}

class MockEmailService implements EmailService {
  send(to: string, subject: string, body: string): void {
    console.log(`🧪 [Mock] Email enviado para ${to}`);
  }
}

class MockSMSService implements SMSService {
  send(to: string, message: string): void {
    console.log(`🧪 [Mock] SMS enviado para ${to}`);
  }
}

class MockCustomerRepository implements CustomerRepository {
  findById(customerId: string): Customer | null {
    return {
      id: customerId,
      email: "test@example.com",
      name: "Cliente Teste",
      phone: "+5511999999999",
    };
  }
}

class MockTransactionRepository implements TransactionRepository {
  save(payment: Payment): void {
    console.log(`🧪 [Mock] Transação salva: ${payment.orderId}`);
  }
}

class MockMetrics implements MetricsCollector {
  recordMetric(name: string, value: number): void {
    console.log(`🧪 [Mock] Métrica: ${name} = ${value}`);
  }

  incrementCounter(name: string): void {
    console.log(`🧪 [Mock] Contador: ${name}++`);
  }
}

// ============= Testes e Demonstração =============

const payment: Payment = {
  orderId: "ORD-001",
  amount: 499.90,
  method: "credit_card",
  customerId: "CUST-123",
};

console.log("=== Configuração 1: Stripe + MySQL + SendGrid ===\n");
const checkout1 = CheckoutServiceFactory.createWithStripeAndMySQL();
checkout1.processCheckout(payment);

console.log("\n=== Configuração 2: PagSeguro + MongoDB + AWS ===\n");
const checkout2 = CheckoutServiceFactory.createWithPagSeguroAndMongoDB();
checkout2.processCheckout({
  ...payment,
  orderId: "ORD-002",
});

console.log("\n=== Configuração 3: Ambiente de Testes com Mocks ===\n");
const checkoutTest = CheckoutServiceFactory.createForTesting();
checkoutTest.processCheckout({
  ...payment,
  orderId: "ORD-TEST",
});

console.log("\n✅ Vantagens do DIP aplicado:");
console.log("- CheckoutService não conhece nenhuma implementação concreta");
console.log("- Fácil trocar qualquer dependência (gateway, email, banco, etc)");
console.log("- Testável com mocks sem dependências externas");
console.log("- Baixíssimo acoplamento entre módulos");
console.log("- Fácil manutenção e extensão");
console.log("- Segue princípios SOLID completamente");
console.log("- Permite configurações diferentes para ambientes (dev, prod, test)");
