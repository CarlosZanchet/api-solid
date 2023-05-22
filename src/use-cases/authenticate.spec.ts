import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('usuario consegue se autenticar', async () => {
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
    expect(() =>
      sut.execute({
        email: 'inexistente@gmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('autenticar com senha invalida esperando throw', async () => {
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
