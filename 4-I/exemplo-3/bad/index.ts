// Violação do ISP: Interface de gateway de pagamento monolítica
// Uma interface única que força todas as implementações a lidarem com todas as funcionalidades

interface PaymentGateway {
  // Processamento de pagamento básico
  processPayment(amount: number): boolean;
  refundPayment(transactionId: string): boolean;

  // Tokenização de cartão
  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string;
  validateToken(token: string): boolean;

  // Pagamento recorrente
  createSubscription(customerId: string, plan: string): string;
  cancelSubscription(subscriptionId: string): boolean;
  updateSubscription(subscriptionId: string, newPlan: string): boolean;

  // Análise de fraude
  analyzeTransaction(transaction: Transaction): FraudScore;
  blockTransaction(transactionId: string): boolean;

  // Webhooks e notificações
  registerWebhook(url: string, events: string[]): string;
  removeWebhook(webhookId: string): boolean;

  // Split de pagamento (marketplace)
  splitPayment(amount: number, recipients: Recipient[]): boolean;
  calculateFees(amount: number, recipients: Recipient[]): number;

  // Pagamento internacional
  convertCurrency(amount: number, from: string, to: string): number;
  processInternationalPayment(amount: number, currency: string): boolean;
}

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

// Gateway simples - PROBLEMA: precisa implementar tudo, mesmo funcionalidades não suportadas
class SimplePaymentGateway implements PaymentGateway {
  processPayment(amount: number): boolean {
    console.log(`Processando pagamento de R$ ${amount}`);
    return true;
  }

  refundPayment(transactionId: string): boolean {
    console.log(`Reembolsando transação ${transactionId}`);
    return true;
  }

  // Não suporta tokenização
  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string {
    throw new Error("Gateway simples não suporta tokenização");
  }

  validateToken(token: string): boolean {
    throw new Error("Gateway simples não suporta validação de token");
  }

  // Não suporta assinaturas
  createSubscription(customerId: string, plan: string): string {
    throw new Error("Gateway simples não suporta assinaturas");
  }

  cancelSubscription(subscriptionId: string): boolean {
    throw new Error("Gateway simples não suporta assinaturas");
  }

  updateSubscription(subscriptionId: string, newPlan: string): boolean {
    throw new Error("Gateway simples não suporta assinaturas");
  }

  // Análise de fraude básica (não sofisticada)
  analyzeTransaction(transaction: Transaction): FraudScore {
    return { score: 0, risk: "low" };
  }

  blockTransaction(transactionId: string): boolean {
    throw new Error("Gateway simples não suporta bloqueio de transação");
  }

  // Não suporta webhooks
  registerWebhook(url: string, events: string[]): string {
    throw new Error("Gateway simples não suporta webhooks");
  }

  removeWebhook(webhookId: string): boolean {
    throw new Error("Gateway simples não suporta webhooks");
  }

  // Não suporta split
  splitPayment(amount: number, recipients: Recipient[]): boolean {
    throw new Error("Gateway simples não suporta split de pagamento");
  }

  calculateFees(amount: number, recipients: Recipient[]): number {
    throw new Error("Gateway simples não suporta cálculo de taxas de split");
  }

  // Não suporta pagamentos internacionais
  convertCurrency(amount: number, from: string, to: string): number {
    throw new Error("Gateway simples não suporta conversão de moeda");
  }

  processInternationalPayment(amount: number, currency: string): boolean {
    throw new Error("Gateway simples não suporta pagamentos internacionais");
  }
}

// Gateway completo - usa todas as funcionalidades
class AdvancedPaymentGateway implements PaymentGateway {
  private subscriptions: Map<string, any> = new Map();
  private webhooks: Map<string, any> = new Map();

  processPayment(amount: number): boolean {
    console.log(`[Avançado] Processando pagamento de R$ ${amount}`);
    return true;
  }

  refundPayment(transactionId: string): boolean {
    console.log(`[Avançado] Reembolsando transação ${transactionId}`);
    return true;
  }

  tokenizeCard(cardNumber: string, cvv: string, expiryDate: string): string {
    const token = `tok_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[Avançado] Cartão tokenizado: ${token}`);
    return token;
  }

  validateToken(token: string): boolean {
    console.log(`[Avançado] Validando token ${token}`);
    return token.startsWith("tok_");
  }

  createSubscription(customerId: string, plan: string): string {
    const subId = `sub_${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(subId, { customerId, plan });
    console.log(`[Avançado] Assinatura criada: ${subId}`);
    return subId;
  }

  cancelSubscription(subscriptionId: string): boolean {
    this.subscriptions.delete(subscriptionId);
    console.log(`[Avançado] Assinatura cancelada: ${subscriptionId}`);
    return true;
  }

  updateSubscription(subscriptionId: string, newPlan: string): boolean {
    const sub = this.subscriptions.get(subscriptionId);
    if (sub) {
      sub.plan = newPlan;
      console.log(`[Avançado] Assinatura atualizada: ${subscriptionId}`);
      return true;
    }
    return false;
  }

  analyzeTransaction(transaction: Transaction): FraudScore {
    const score = Math.random() * 100;
    const risk = score > 70 ? "high" : score > 40 ? "medium" : "low";
    console.log(`[Avançado] Análise de fraude: ${risk} (${score.toFixed(2)})`);
    return { score, risk };
  }

  blockTransaction(transactionId: string): boolean {
    console.log(`[Avançado] Transação bloqueada: ${transactionId}`);
    return true;
  }

  registerWebhook(url: string, events: string[]): string {
    const webhookId = `wh_${Math.random().toString(36).substr(2, 9)}`;
    this.webhooks.set(webhookId, { url, events });
    console.log(`[Avançado] Webhook registrado: ${webhookId}`);
    return webhookId;
  }

  removeWebhook(webhookId: string): boolean {
    this.webhooks.delete(webhookId);
    console.log(`[Avançado] Webhook removido: ${webhookId}`);
    return true;
  }

  splitPayment(amount: number, recipients: Recipient[]): boolean {
    console.log(`[Avançado] Split de pagamento de R$ ${amount}`);
    recipients.forEach((r) => {
      console.log(`  - ${r.id}: ${r.percentage}%`);
    });
    return true;
  }

  calculateFees(amount: number, recipients: Recipient[]): number {
    const fee = amount * 0.025 * recipients.length;
    console.log(`[Avançado] Taxa calculada: R$ ${fee.toFixed(2)}`);
    return fee;
  }

  convertCurrency(amount: number, from: string, to: string): number {
    const rate = 5.2; // Exemplo: USD -> BRL
    const converted = amount * rate;
    console.log(
      `[Avançado] Conversão: ${amount} ${from} = ${converted.toFixed(2)} ${to}`
    );
    return converted;
  }

  processInternationalPayment(amount: number, currency: string): boolean {
    console.log(
      `[Avançado] Processando pagamento internacional: ${amount} ${currency}`
    );
    return true;
  }
}

// Teste
console.log("=== Gateway Simples ===");
const simpleGateway = new SimplePaymentGateway();
simpleGateway.processPayment(100);

try {
  simpleGateway.createSubscription("customer1", "premium"); // Vai falhar!
} catch (error) {
  console.error("Erro:", (error as Error).message);
}

console.log("\n=== Gateway Avançado ===");
const advancedGateway = new AdvancedPaymentGateway();
advancedGateway.processPayment(100);
advancedGateway.createSubscription("customer1", "premium");
advancedGateway.registerWebhook("https://api.example.com/webhook", [
  "payment.success",
]);
