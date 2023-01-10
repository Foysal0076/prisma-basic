import Hapi from '@hapi/hapi'
import sendgrid from '@sendgrid/mail'

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    sendEmailToken: (email: string, token: string) => Promise<void>
  }
}

const emailPlugin: Hapi.Plugin<null> = {
  name: 'app/email',
  register: async (server: Hapi.Server) => {
    if (!process.env.SEND_GRID_API_KEY) {
      server.log(
        'warn',
        `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails. Using debug mode which logs the email tokens instead.`
      )
      server.app.sendEmailToken = sendEmailToken
    } else {
      sendgrid.setApiKey(process.env.SEND_GRID_API_KEY)
      server.app.sendEmailToken = sendEmailToken
    }
  },
}

const sendEmailToken = async (email: string, token: string) => {
  const message = {
    to: email,
    from: 'EMAIL_ADDRESS_CONFIGURED_IN_SENDGRID@email.com',
    subject: 'Login token for the modern backend api',
    text: 'Your login token is: ' + token,
  }

  await sendgrid.send(message)
}

export default emailPlugin
