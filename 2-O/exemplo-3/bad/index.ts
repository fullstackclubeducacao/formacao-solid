interface NotificationSettings {
  inApp: boolean
  email: boolean
  whatsApp: boolean
}

class Notifier {
  notify(message: string, settings: NotificationSettings): void {
    if (settings.inApp) {
      this.notifyInApp(message)
    }
    if (settings.email) {
      this.notifyByEmail(message)
    }
    if (settings.whatsApp) {
      this.notifyByWhatsApp(message)
    }
  }

  private notifyByWhatsApp(message: string) {
    console.log(`Notificação por WhatsApp: ${message}`)
  }

  private notifyByEmail(message: string) {
    console.log(`Notificação por e-mail: ${message}`)
  }

  private notifyInApp(message: string) {
    console.log(`Notificação do app: ${message}`)
  }
}

const notifier = new Notifier()
const userSettings: NotificationSettings = {
  email: true,
  inApp: true,
  whatsApp: true,
}
notifier.notify("test", userSettings)