export class LateCheckInValidationError extends Error {
  constructor() {
    super('O checkin não é valido, ultrapassou 20 minutos da sua criacao')
  }
}
