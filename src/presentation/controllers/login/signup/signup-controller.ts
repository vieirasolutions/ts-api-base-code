import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../../domain/errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })

      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch (error) {
      if (error instanceof EmailInUseError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}
