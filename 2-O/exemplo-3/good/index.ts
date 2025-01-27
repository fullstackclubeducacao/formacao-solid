interface NotificationSettings {
  inApp: boolean
  email: boolean
  whatsApp: boolean
  alexa: boolean
}

interface Notifiable {
  notify(message: string): void
}

class InApp implements Notifiable {
  notify(message: string) {
    console.log(`Notificação do app: ${message}`)
  }
}

class Email implements Notifiable {
  notify(message: string) {
    console.log(`Notificação por e-mail: ${message}`)
  }
}

class WhatsApp implements Notifiable {
  notify(message: string) {
    console.log(`Notificação por WhatsApp: ${message}`)
  }
}

class Alexa implements Notifiable {
  notify(message: string) {
    console.log(`Notificação Alexa: ${message}`)
  }
}

class Notifier {
  notify(message: string, channels: Notifiable[]): void {
    for (const channel of channels) {
      channel.notify(message)
    }
  }
}

const notifier = new Notifier()
const channels = new Array<Notifiable>();
const userSettings: NotificationSettings = {
  email: true,
  inApp: true,
  whatsApp: false,
  alexa: true
}
if (userSettings.inApp) {
  channels.push(new InApp())
}
if (userSettings.email) {
  channels.push(new Email())
}
if (userSettings.whatsApp) {
  channels.push(new WhatsApp())
}
if (userSettings.alexa) {
  channels.push(new Alexa())
}
notifier.notify("test", channels)