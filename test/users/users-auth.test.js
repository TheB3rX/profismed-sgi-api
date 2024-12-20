import request from 'supertest'
import { app } from '../../src/index.js'

describe('User Authentication', () => {
  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500))
  }
  )

  it('should return a 400 status and a message if the user already exists', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'janedoe',
        firstName: 'Jane',
        lastName: 'Doe',
        userEmail: 'janedoe@example.com',
        userPhone: '+9876543210',
        roleId: 3,
        documentId: 2,
        documentNumber: '987654321',
        userJob: 'Project Manager',
        userContactOrigin: 'Company Website',
        locationId: 1,
        password: 'anotherSecurePassword456'
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Unauthorized')
  })
})
