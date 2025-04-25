import { NextRequest, NextResponse } from "next/server";
import { usePrograms } from "@/store";
import { ApiResponse, HealthProgram } from "@/types";
import { z } from "zod";

// Program update validation schema
const programUpdateSchema = z.object({
  name: z.string().min(1, "Program name is required").optional(),
  description: z.string().min(1, "Program description is required").optional(),
});

/**
 * GET /api/programs/:id - Get a specific health program
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const programsStore = usePrograms();
  
  const program = programsStore.getProgramById(id);
  
  if (!program) {
    return NextResponse.json(
      {
        success: false,
        error: "Not found",
        message: "Health program not found",
      },
      { status: 404 }
    );
  }
  
  const programWithClients = programsStore.getProgramWithClients(id);
  
  const response: ApiResponse<typeof programWithClients> = {
    success: true,
    data: programWithClients,
  };
  
  return NextResponse.json(response);
}

/**
 * PUT /api/programs/:id - Update a health program
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate program data
    const parseResult = programUpdateSchema.safeParse(body);
    
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
    
    const programsStore = usePrograms();
    const updatedProgram = programsStore.updateProgram(id, parseResult.data);
    
    if (!updatedProgram) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Health program not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<HealthProgram> = {
      success: true,
      data: updatedProgram,
      message: "Health program updated successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to update health program",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/programs/:id - Delete a health program
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const programsStore = usePrograms();
    
    const success = programsStore.deleteProgram(id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Health program not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: "Health program deleted successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to delete health program",
      },
      { status: 500 }
    );
  }
} 