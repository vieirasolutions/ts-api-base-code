import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { password } = accountData
    const hashedPassword = await this.encrypter.encrypt(password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
}