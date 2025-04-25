import { NextRequest, NextResponse } from "next/server";
import { useClients } from "@/store";
import { ApiResponse, Client } from "@/types";
import { z } from "zod";
import { withAuth } from "@/lib/auth";

// Client update validation schema
const clientUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  contactNumber: z.string().min(1, "Contact number is required").optional(),
  email: z.string().email("Invalid email").optional().nullable(),
  address: z.string().min(1, "Address is required").optional(),
  medicalHistory: z.string().optional().nullable(),
});

/**
 * GET /api/clients/:id - Get a specific client
 */
export const GET = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const clientsStore = useClients();
  
  const client = clientsStore.getClientById(id);
  
  if (!client) {
    return NextResponse.json(
      {
        success: false,
        error: "Not found",
        message: "Client not found",
      },
      { status: 404 }
    );
  }
  
  const clientWithPrograms = clientsStore.getClientWithPrograms(id);
  
  const response: ApiResponse<typeof clientWithPrograms> = {
    success: true,
    data: clientWithPrograms,
  };
  
  return NextResponse.json(response);
});

/**
 * PUT /api/clients/:id - Update a client
 */
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate client data
    const parseResult = clientUpdateSchema.safeParse(body);
    
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
    const updatedClient = clientsStore.updateClient(id, parseResult.data);
    
    if (!updatedClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Client not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Client> = {
      success: true,
      data: updatedClient,
      message: "Client updated successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to update client",
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/clients/:id - Delete a client
 */
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const clientsStore = useClients();
    
    const success = clientsStore.deleteClient(id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Client not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: "Client deleted successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to delete client",
      },
      { status: 500 }
    );
  }
}); 