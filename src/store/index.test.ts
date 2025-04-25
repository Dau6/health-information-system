import { useHealthSystem, useClients, usePrograms, useEnrollments } from './index'

// Reset the store before each test
beforeEach(() => {
  const store = useHealthSystem.getState()
  store.clients = []
  store.programs = []
  store.enrollments = []
})

describe('Health System Store', () => {
  describe('Client Management', () => {
    it('should add a new client', () => {
      const { addClient, clients } = useClients()
      
      const newClient = addClient({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '1234567890',
        address: 'Test Address',
      })
      
      expect(clients.length).toBe(1)
      expect(clients[0].id).toBe(newClient.id)
      expect(clients[0].firstName).toBe('Test')
      expect(clients[0].lastName).toBe('User')
    })
    
    it('should update an existing client', () => {
      const { addClient, updateClient, clients } = useClients()
      
      // Add a client first
      const newClient = addClient({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '1234567890',
        address: 'Test Address',
      })
      
      // Update the client
      const updatedClient = updateClient(newClient.id, {
        firstName: 'Updated',
        lastName: 'Name',
      })
      
      expect(clients.length).toBe(1)
      expect(updatedClient?.firstName).toBe('Updated')
      expect(updatedClient?.lastName).toBe('Name')
      expect(clients[0].firstName).toBe('Updated')
      expect(clients[0].lastName).toBe('Name')
    })
    
    it('should delete a client', () => {
      const { addClient, deleteClient, clients } = useClients()
      
      // Add a client first
      const newClient = addClient({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '1234567890',
        address: 'Test Address',
      })
      
      expect(clients.length).toBe(1)
      
      // Delete the client
      const success = deleteClient(newClient.id)
      
      expect(success).toBe(true)
      expect(clients.length).toBe(0)
    })
  })
  
  describe('Program Management', () => {
    it('should add a new program', () => {
      const { addProgram, programs } = usePrograms()
      
      const newProgram = addProgram({
        name: 'Test Program',
        description: 'Test Description',
      })
      
      expect(programs.length).toBe(1)
      expect(programs[0].id).toBe(newProgram.id)
      expect(programs[0].name).toBe('Test Program')
      expect(programs[0].description).toBe('Test Description')
    })
  })
  
  describe('Enrollment Management', () => {
    it('should enroll a client in a program', () => {
      const { addClient } = useClients()
      const { addProgram } = usePrograms()
      const { enrollClient, enrollments } = useEnrollments()
      
      // Add a client
      const client = addClient({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '1234567890',
        address: 'Test Address',
      })
      
      // Add a program
      const program = addProgram({
        name: 'Test Program',
        description: 'Test Description',
      })
      
      // Enroll client in program
      const enrollment = enrollClient(client.id, program.id, 'Test notes')
      
      expect(enrollments.length).toBe(1)
      expect(enrollments[0].id).toBe(enrollment?.id)
      expect(enrollments[0].clientId).toBe(client.id)
      expect(enrollments[0].programId).toBe(program.id)
      expect(enrollments[0].notes).toBe('Test notes')
      expect(enrollments[0].status).toBe('active')
    })
    
    it('should get a client with programs', () => {
      const { addClient, getClientWithPrograms } = useClients()
      const { addProgram } = usePrograms()
      const { enrollClient } = useEnrollments()
      
      // Add a client
      const client = addClient({
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contactNumber: '1234567890',
        address: 'Test Address',
      })
      
      // Add a program
      const program = addProgram({
        name: 'Test Program',
        description: 'Test Description',
      })
      
      // Enroll client in program
      enrollClient(client.id, program.id)
      
      // Get client with programs
      const clientWithPrograms = getClientWithPrograms(client.id)
      
      expect(clientWithPrograms).toBeDefined()
      expect(clientWithPrograms?.id).toBe(client.id)
      expect(clientWithPrograms?.enrollments.length).toBe(1)
      expect(clientWithPrograms?.enrollments[0].programId).toBe(program.id)
      expect(clientWithPrograms?.enrollments[0].program.name).toBe('Test Program')
    })
  })
}) 