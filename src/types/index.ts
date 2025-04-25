/**
 * Represents a health program in the system
 */
export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a client in the health system
 */
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email?: string;
  address: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an enrollment of a client in a health program
 */
export interface Enrollment {
  id: string;
  clientId: string;
  programId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'withdrawn';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a client with their enrolled programs
 */
export interface ClientWithPrograms extends Client {
  enrollments: (Enrollment & { program: HealthProgram })[];
}

/**
 * Represents a health program with enrolled clients
 */
export interface ProgramWithClients extends HealthProgram {
  enrollments: (Enrollment & { client: Client })[];
}

/**
 * API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 