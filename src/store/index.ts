'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { 
  Client, 
  HealthProgram, 
  Enrollment,
  ClientWithPrograms,
  ProgramWithClients
} from '@/types';

/**
 * Mock data for the health information system
 */

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Get current ISO timestamp
const getTimestamp = () => new Date().toISOString();

// Initial health programs
const initialPrograms: HealthProgram[] = [
  {
    id: generateId(),
    name: 'HIV Prevention',
    description: 'Program aimed at HIV prevention through education and screening.',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  },
  {
    id: generateId(),
    name: 'TB Treatment',
    description: 'Comprehensive tuberculosis treatment and monitoring program.',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  },
  {
    id: generateId(),
    name: 'Malaria Control',
    description: 'Malaria prevention, diagnosis and treatment program.',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  },
];

// Initial clients
const initialClients: Client[] = [
  {
    id: generateId(),
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    contactNumber: '+1234567890',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown',
    medicalHistory: 'No significant history',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  },
  {
    id: generateId(),
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-08-20',
    gender: 'female',
    contactNumber: '+1987654321',
    email: 'jane.smith@example.com',
    address: '456 Elm St, Othertown',
    medicalHistory: 'History of asthma',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  },
];

// Initial enrollments (empty array to start)
const initialEnrollments: Enrollment[] = [];

/**
 * Define the state interface for our store
 */
interface HealthSystemState {
  // Data
  clients: Client[];
  programs: HealthProgram[];
  enrollments: Enrollment[];
  
  // Selectors
  getClientById: (id: string) => Client | undefined;
  getProgramById: (id: string) => HealthProgram | undefined;
  getEnrollmentById: (id: string) => Enrollment | undefined;
  getClientWithPrograms: (clientId: string) => ClientWithPrograms | undefined;
  getProgramWithClients: (programId: string) => ProgramWithClients | undefined;
  getClientsBySearchTerm: (term: string) => Client[];
  
  // Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, clientUpdate: Partial<Client>) => Client | undefined;
  deleteClient: (id: string) => boolean;
  
  addProgram: (program: Omit<HealthProgram, 'id' | 'createdAt' | 'updatedAt'>) => HealthProgram;
  updateProgram: (id: string, programUpdate: Partial<HealthProgram>) => HealthProgram | undefined;
  deleteProgram: (id: string) => boolean;
  
  enrollClientInProgram: (clientId: string, programId: string, notes?: string) => Enrollment | undefined;
  updateEnrollment: (id: string, enrollmentUpdate: Partial<Enrollment>) => Enrollment | undefined;
  cancelEnrollment: (enrollmentId: string) => boolean;
}

/**
 * Create the store with Zustand
 */
export const useHealthSystem = create<HealthSystemState>()(
  persist(
    (set, get) => ({
      // Initial state
      clients: initialClients,
      programs: initialPrograms,
      enrollments: initialEnrollments,

      // Selectors
      getClientById: (id: string) => {
        return get().clients.find(client => client.id === id);
      },
      
      getProgramById: (id: string) => {
        return get().programs.find(program => program.id === id);
      },
      
      getEnrollmentById: (id: string) => {
        return get().enrollments.find(enrollment => enrollment.id === id);
      },
      
      getClientWithPrograms: (clientId: string) => {
        const client = get().getClientById(clientId);
        
        if (!client) return undefined;
        
        const clientEnrollments = get().enrollments
          .filter(enrollment => enrollment.clientId === clientId)
          .map(enrollment => {
            const program = get().getProgramById(enrollment.programId);
            return {
              ...enrollment,
              program: program as HealthProgram
            };
          });
        
        return {
          ...client,
          enrollments: clientEnrollments
        };
      },
      
      getProgramWithClients: (programId: string) => {
        const program = get().getProgramById(programId);
        
        if (!program) return undefined;
        
        const programEnrollments = get().enrollments
          .filter(enrollment => enrollment.programId === programId)
          .map(enrollment => {
            const client = get().getClientById(enrollment.clientId);
            return {
              ...enrollment,
              client: client as Client
            };
          });
        
        return {
          ...program,
          enrollments: programEnrollments
        };
      },
      
      getClientsBySearchTerm: (term: string) => {
        const lowerTerm = term.toLowerCase();
        return get().clients.filter(client => 
          client.firstName.toLowerCase().includes(lowerTerm) ||
          client.lastName.toLowerCase().includes(lowerTerm) ||
          client.email?.toLowerCase().includes(lowerTerm) ||
          client.contactNumber.includes(term)
        );
      },
      
      // Actions
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId(),
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        };
        
        set(state => ({
          clients: [...state.clients, newClient]
        }));
        
        return newClient;
      },
      
      updateClient: (id, clientUpdate) => {
        let updatedClient: Client | undefined;
        
        set(state => {
          const updatedClients = state.clients.map(client => {
            if (client.id === id) {
              updatedClient = {
                ...client,
                ...clientUpdate,
                updatedAt: getTimestamp()
              };
              return updatedClient;
            }
            return client;
          });
          
          return { clients: updatedClients };
        });
        
        return updatedClient;
      },
      
      deleteClient: (id) => {
        let success = false;
        
        set(state => {
          const clientExists = state.clients.some(client => client.id === id);
          
          if (!clientExists) return { clients: state.clients };
          
          // Remove client enrollments
          const filteredEnrollments = state.enrollments.filter(
            enrollment => enrollment.clientId !== id
          );
          
          // Remove client
          const filteredClients = state.clients.filter(client => client.id !== id);
          
          success = true;
          
          return { 
            clients: filteredClients,
            enrollments: filteredEnrollments
          };
        });
        
        return success;
      },
      
      addProgram: (programData) => {
        const newProgram: HealthProgram = {
          ...programData,
          id: generateId(),
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        };
        
        set(state => ({
          programs: [...state.programs, newProgram]
        }));
        
        return newProgram;
      },
      
      updateProgram: (id, programUpdate) => {
        let updatedProgram: HealthProgram | undefined;
        
        set(state => {
          const updatedPrograms = state.programs.map(program => {
            if (program.id === id) {
              updatedProgram = {
                ...program,
                ...programUpdate,
                updatedAt: getTimestamp()
              };
              return updatedProgram;
            }
            return program;
          });
          
          return { programs: updatedPrograms };
        });
        
        return updatedProgram;
      },
      
      deleteProgram: (id) => {
        let success = false;
        
        set(state => {
          const programExists = state.programs.some(program => program.id === id);
          
          if (!programExists) return { programs: state.programs };
          
          // Remove program enrollments
          const filteredEnrollments = state.enrollments.filter(
            enrollment => enrollment.programId !== id
          );
          
          // Remove program
          const filteredPrograms = state.programs.filter(program => program.id !== id);
          
          success = true;
          
          return { 
            programs: filteredPrograms,
            enrollments: filteredEnrollments
          };
        });
        
        return success;
      },
      
      enrollClientInProgram: (clientId, programId, notes) => {
        const client = get().getClientById(clientId);
        const program = get().getProgramById(programId);
        
        if (!client || !program) return undefined;
        
        // Check if client is already enrolled in this program
        const existingEnrollment = get().enrollments.find(
          e => e.clientId === clientId && e.programId === programId && e.status === 'active'
        );
        
        if (existingEnrollment) return existingEnrollment;
        
        const newEnrollment: Enrollment = {
          id: generateId(),
          clientId,
          programId,
          enrollmentDate: getTimestamp(),
          status: 'active',
          notes: notes || '',
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        };
        
        set(state => ({
          enrollments: [...state.enrollments, newEnrollment]
        }));
        
        return newEnrollment;
      },
      
      updateEnrollment: (id, enrollmentUpdate) => {
        let updatedEnrollment: Enrollment | undefined;
        
        set(state => {
          const updatedEnrollments = state.enrollments.map(enrollment => {
            if (enrollment.id === id) {
              updatedEnrollment = {
                ...enrollment,
                ...enrollmentUpdate,
                updatedAt: getTimestamp()
              };
              return updatedEnrollment;
            }
            return enrollment;
          });
          
          return { enrollments: updatedEnrollments };
        });
        
        return updatedEnrollment;
      },
      
      cancelEnrollment: (enrollmentId) => {
        return !!get().updateEnrollment(enrollmentId, { status: 'withdrawn' });
      },
    }),
    {
      name: 'health-system-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export hooks for accessing the store from components
export const useClients = () => {
  const healthSystem = useHealthSystem();
  return {
    clients: healthSystem.clients,
    getClientById: healthSystem.getClientById,
    getClientWithPrograms: healthSystem.getClientWithPrograms,
    searchClients: healthSystem.getClientsBySearchTerm,
    addClient: healthSystem.addClient,
    updateClient: healthSystem.updateClient,
    deleteClient: healthSystem.deleteClient,
  };
};

export const usePrograms = () => {
  const healthSystem = useHealthSystem();
  return {
    programs: healthSystem.programs,
    getProgramById: healthSystem.getProgramById,
    getProgramWithClients: healthSystem.getProgramWithClients,
    addProgram: healthSystem.addProgram,
    updateProgram: healthSystem.updateProgram,
    deleteProgram: healthSystem.deleteProgram,
  };
};

export const useEnrollments = () => {
  const healthSystem = useHealthSystem();
  return {
    enrollments: healthSystem.enrollments,
    getEnrollmentById: healthSystem.getEnrollmentById,
    enrollClient: healthSystem.enrollClientInProgram,
    updateEnrollment: healthSystem.updateEnrollment,
    cancelEnrollment: healthSystem.cancelEnrollment,
  };
}; 