import { Gym } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

interface FeatchNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}

interface FeatchNearbyGymsResponse {
  gyms: Gym[]
}

export class FeatchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FeatchNearbyGymsRequest): Promise<FeatchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
