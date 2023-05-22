import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('deve retornar um usuario pelo id', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'meuemail@gmail.com',
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('deve gerar erro ao nao encontrar id do usuario', async () => {
    expect(() =>
      sut.execute({
        userId: 'not-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
