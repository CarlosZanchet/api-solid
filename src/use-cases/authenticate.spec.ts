import { hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('usuario consegue se autenticar', async () => {
    // a senha do usuario deve ser hash assim que ele se cadastrar
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'meuemail@gmail.com',
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({
      email: 'meuemail@gmail.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('autenticar com email invalido esperando throw', async () => {
    // a senha do usuario deve ser hash assim que ele se cadastrar
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'inexistente@gmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('autenticar com senha invalida esperando throw', async () => {
    // a senha do usuario deve ser hash assim que ele se cadastrar
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'meuemail@gmail.com',
      password_hash: await hash('12345', 6),
    })

    expect(() =>
      sut.execute({
        email: 'meuemail@gmail.com',
        password: 'senhadiferente',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
