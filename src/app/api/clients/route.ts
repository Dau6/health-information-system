import { NextRequest, NextResponse } from "next/server";
import { useClients } from "@/store";
import { ApiResponse, Client } from "@/types";
import { z } from "zod";
import { withAuth } from "@/lib/auth";

// Client validation schema
const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email").optional(),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().optional(),
});

/**
 * GET /api/clients - Get all clients or search by query
 */
export const GET = withAuth(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const searchTerm = searchParams.get("search");
  
  const clientsStore = useClients();
  
  let result: Client[];
  
  if (searchTerm) {
    result = clientsStore.searchClients(searchTerm);
  } else {
    result = clientsStore.clients;
  }
  
  const response: ApiResponse<Client[]> = {
    success: true,
    data: result,
  };
  
  return NextResponse.json(response);
});

/**
 * POST /api/clients - Create a new client
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    
    // Validate client data
    const parseResult = clientSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          message: parseResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }
    
    const clientsStore = useClients();
    const newClient = clientsStore.addClient(parseResult.data);
    
    const response: ApiResponse<Client> = {
      success: true,
      data: newClient,
      message: "Client created successfully",
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to create client",
      },
      { status: 500 }
    );
  }
}); 