// Aplicação do ISP: Interfaces segregadas por capacidade do gateway
// Cada interface representa um conjunto coeso de funcionalidades relacionadas

// ============= Interfaces Segregadas =============

// Interface base - todos os gateways devem suportar
interface PaymentProcessor {
  processPayment(amount: number): boolean;
  refundPayment(transactionId: string): boolean;
}

// Capacidade de tokenização de cartões
interface CardTokenization {
  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string;
  validateToken(token: string): boolean;
}

// Capacidade de gerenciar assinaturas/pagamentos recorrentes
interface SubscriptionManager {
  createSubscription(customerId: string, plan: string): string;
  cancelSubscription(subscriptionId: string): boolean;
  updateSubscription(subscriptionId: string, newPlan: string): boolean;
}

// Capacidade de análise de fraude
interface FraudDetection {
  analyzeTransaction(transaction: Transaction): FraudScore;
  blockTransaction(transactionId: string): boolean;
}

// Capacidade de webhooks
interface WebhookSupport {
  registerWebhook(url: string, events: string[]): string;
  removeWebhook(webhookId: string): boolean;
}

// Capacidade de split de pagamento (marketplace)
interface PaymentSplitting {
  splitPayment(amount: number, recipients: Recipient[]): boolean;
  calculateFees(amount: number, recipients: Recipient[]): number;
}

// Capacidade de pagamentos internacionais
interface InternationalPayments {
  convertCurrency(amount: number, from: string, to: string): number;
  processInternationalPayment(amount: number, currency: string): boolean;
}

// ============= Tipos Auxiliares =============

interface Transaction {
  id: string;
  amount: number;
  customerId: string;
}

interface FraudScore {
  score: number;
  risk: "low" | "medium" | "high";
}

interface Recipient {
  id: string;
  percentage: number;
}

// ============= Implementações =============

// Gateway simples - implementa apenas o básico
class SimplePaymentGateway implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`[Simples] Processando pagamento de R$ ${amount}`);
    return true;
  }

  refundPayment(transactionId: string): boolean {
    console.log(`[Simples] Reembolsando transação ${transactionId}`);
    return true;
  }
}

// Gateway intermediário - adiciona tokenização e análise básica de fraude
class IntermediatePaymentGateway
  implements PaymentProcessor, CardTokenization, FraudDetection
{
  processPayment(amount: number): boolean {
    console.log(`[Intermediário] Processando pagamento de R$ ${amount}`);
    return true;
  }

  refundPayment(transactionId: string): boolean {
    console.log(`[Intermediário] Reembolsando transação ${transactionId}`);
    return true;
  }

  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string {
    const token = `tok_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[Intermediário] Cartão tokenizado: ${token}`);
    return token;
  }

  validateToken(token: string): boolean {
    console.log(`[Intermediário] Validando token ${token}`);
    return token.startsWith("tok_");
  }

  analyzeTransaction(transaction: Transaction): FraudScore {
    const score = Math.random() * 100;
    const risk = score > 70 ? "high" : score > 40 ? "medium" : "low";
    console.log(
      `[Intermediário] Análise de fraude: ${risk} (${score.toFixed(2)})`
    );
    return { score, risk };
  }

  blockTransaction(transactionId: string): boolean {
    console.log(`[Intermediário] Transação bloqueada: ${transactionId}`);
    return true;
  }
}

// Gateway completo - implementa todas as capacidades avançadas
class EnterprisePaymentGateway
  implements
    PaymentProcessor,
    CardTokenization,
    SubscriptionManager,
    FraudDetection,
    WebhookSupport,
    PaymentSplitting,
    InternationalPayments
{
  private subscriptions: Map<string, any> = new Map();
  private webhooks: Map<string, any> = new Map();

  // PaymentProcessor
  processPayment(amount: number): boolean {
    console.log(`[Enterprise] Processando pagamento de R$ ${amount}`);
    return true;
  }

  refundPayment(transactionId: string): boolean {
    console.log(`[Enterprise] Reembolsando transação ${transactionId}`);
    return true;
  }

  // CardTokenization
  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string {
    const token = `tok_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[Enterprise] Cartão tokenizado: ${token}`);
    return token;
  }

  validateToken(token: string): boolean {
    console.log(`[Enterprise] Validando token ${token}`);
    return token.startsWith("tok_");
  }

  // SubscriptionManager
  createSubscription(customerId: string, plan: string): string {
    const subId = `sub_${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(subId, { customerId, plan });
    console.log(`[Enterprise] Assinatura criada: ${subId} (${plan})`);
    return subId;
  }

  cancelSubscription(subscriptionId: string): boolean {
    this.subscriptions.delete(subscriptionId);
    console.log(`[Enterprise] Assinatura cancelada: ${subscriptionId}`);
    return true;
  }

  updateSubscription(subscriptionId: string, newPlan: string): boolean {
    const sub = this.subscriptions.get(subscriptionId);
    if (sub) {
      sub.plan = newPlan;
      console.log(
        `[Enterprise] Assinatura atualizada: ${subscriptionId} -> ${newPlan}`
      );
      return true;
    }
    return false;
  }

  // FraudDetection
  analyzeTransaction(transaction: Transaction): FraudScore {
    const score = Math.random() * 100;
    const risk = score > 70 ? "high" : score > 40 ? "medium" : "low";
    console.log(
      `[Enterprise] Análise de fraude: ${risk} (${score.toFixed(2)})`
    );
    return { score, risk };
  }

  blockTransaction(transactionId: string): boolean {
    console.log(`[Enterprise] Transação bloqueada: ${transactionId}`);
    return true;
  }

  // WebhookSupport
  registerWebhook(url: string, events: string[]): string {
    const webhookId = `wh_${Math.random().toString(36).substr(2, 9)}`;
    this.webhooks.set(webhookId, { url, events });
    console.log(
      `[Enterprise] Webhook registrado: ${webhookId} para eventos: ${events.join(", ")}`
    );
    return webhookId;
  }

  removeWebhook(webhookId: string): boolean {
    this.webhooks.delete(webhookId);
    console.log(`[Enterprise] Webhook removido: ${webhookId}`);
    return true;
  }

  // PaymentSplitting
  splitPayment(amount: number, recipients: Recipient[]): boolean {
    console.log(`[Enterprise] Split de pagamento de R$ ${amount}:`);
    recipients.forEach((r) => {
      const value = (amount * r.percentage) / 100;
      console.log(`  - ${r.id}: ${r.percentage}% (R$ ${value.toFixed(2)})`);
    });
    return true;
  }

  calculateFees(amount: number, recipients: Recipient[]): number {
    const fee = amount * 0.025 * recipients.length;
    console.log(`[Enterprise] Taxa total calculada: R$ ${fee.toFixed(2)}`);
    return fee;
  }

  // InternationalPayments
  convertCurrency(amount: number, from: string, to: string): number {
    const rates: { [key: string]: number } = {
      "USD-BRL": 5.2,
      "EUR-BRL": 5.8,
      "BRL-USD": 0.19,
    };
    const rate = rates[`${from}-${to}`] || 1;
    const converted = amount * rate;
    console.log(
      `[Enterprise] Conversão: ${amount} ${from} = ${converted.toFixed(2)} ${to} (taxa: ${rate})`
    );
    return converted;
  }

  processInternationalPayment(amount: number, currency: string): boolean {
    console.log(
      `[Enterprise] Processando pagamento internacional: ${amount} ${currency}`
    );
    return true;
  }
}

// ============= Funções de Serviço que usam interfaces específicas =============

// Processa um pagamento básico
function processBasicPayment(
  gateway: PaymentProcessor,
  amount: number
): boolean {
  return gateway.processPayment(amount);
}

// Processa pagamento com tokenização (mais seguro)
function processSecurePayment(
  gateway: PaymentProcessor & CardTokenization,
  cardNumber: string,
  cvv: string,
  expiryDate: string,
  amount: number
): boolean {
  const token = gateway.tokenizeCard(cardNumber, cvv, expiryDate);
  if (gateway.validateToken(token)) {
    return gateway.processPayment(amount);
  }
  return false;
}

// Cria uma assinatura com análise de fraude
function createSecureSubscription(
  gateway: SubscriptionManager & FraudDetection,
  customerId: string,
  plan: string,
  transaction: Transaction
): string | null {
  const fraudAnalysis = gateway.analyzeTransaction(transaction);

  if (fraudAnalysis.risk === "high") {
    console.log("⚠️  Risco alto detectado - assinatura bloqueada");
    return null;
  }

  return gateway.createSubscription(customerId, plan);
}

// Processa pagamento de marketplace com split
function processMarketplacePayment(
  gateway: PaymentProcessor & PaymentSplitting,
  amount: number,
  recipients: Recipient[]
): boolean {
  const fees = gateway.calculateFees(amount, recipients);
  const totalAmount = amount + fees;

  console.log(`Valor total com taxas: R$ ${totalAmount.toFixed(2)}`);

  if (gateway.processPayment(totalAmount)) {
    return gateway.splitPayment(amount, recipients);
  }

  return false;
}

// ============= Testes =============

console.log("=== Gateway Simples (apenas pagamentos básicos) ===\n");
const simpleGateway = new SimplePaymentGateway();
processBasicPayment(simpleGateway, 100);
// processSecurePayment(simpleGateway, ...); // Erro de compilação! O tipo não tem CardTokenization

console.log("\n=== Gateway Intermediário (com tokenização e fraude) ===\n");
const intermediateGateway = new IntermediatePaymentGateway();
processSecurePayment(
  intermediateGateway,
  "4111111111111111",
  "123",
  "12/25",
  250
);

const transaction: Transaction = {
  id: "txn_001",
  amount: 250,
  customerId: "cust_001",
};
intermediateGateway.analyzeTransaction(transaction);

console.log(
  "\n=== Gateway Enterprise (todas as funcionalidades) ===\n"
);
const enterpriseGateway = new EnterprisePaymentGateway();

// Teste 1: Pagamento seguro
console.log("--- Pagamento Seguro ---");
processSecurePayment(
  enterpriseGateway,
  "5555555555554444",
  "456",
  "06/26",
  500
);

// Teste 2: Assinatura com análise de fraude
console.log("\n--- Assinatura com Análise de Fraude ---");
const subTransaction: Transaction = {
  id: "txn_002",
  amount: 99.9,
  customerId: "cust_002",
};
createSecureSubscription(
  enterpriseGateway,
  "cust_002",
  "premium",
  subTransaction
);

// Teste 3: Marketplace com split
console.log("\n--- Pagamento Marketplace com Split ---");
const recipients: Recipient[] = [
  { id: "seller_001", percentage: 70 },
  { id: "seller_002", percentage: 20 },
  { id: "platform", percentage: 10 },
];
processMarketplacePayment(enterpriseGateway, 1000, recipients);

// Teste 4: Pagamento internacional
console.log("\n--- Pagamento Internacional ---");
const amountUSD = 100;
const amountBRL = enterpriseGateway.convertCurrency(amountUSD, "USD", "BRL");
enterpriseGateway.processInternationalPayment(amountBRL, "BRL");

// Teste 5: Webhooks
console.log("\n--- Configuração de Webhooks ---");
const webhookId = enterpriseGateway.registerWebhook(
  "https://api.mystore.com/webhook",
  ["payment.success", "payment.failed", "subscription.renewed"]
);

console.log(
  "\n✅ Todos os gateways funcionam apenas com as interfaces que suportam!"
);
