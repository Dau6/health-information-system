import { NextRequest, NextResponse } from "next/server";
import { usePrograms } from "@/store";
import { ApiResponse, HealthProgram } from "@/types";
import { z } from "zod";

// Program validation schema
const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Program description is required"),
});

/**
 * GET /api/programs - Get all health programs
 */
export async function GET(request: NextRequest) {
  const programsStore = usePrograms();
  const programs = programsStore.programs;
  
  const response: ApiResponse<HealthProgram[]> = {
    success: true,
    data: programs,
  };
  
  return NextResponse.json(response);
}

/**
 * POST /api/programs - Create a new health program
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate program data
    const parseResult = programSchema.safeParse(body);
    
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
    const newProgram = programsStore.addProgram(parseResult.data);
    
    const response: ApiResponse<HealthProgram> = {
      success: true,
      data: newProgram,
      message: "Health program created successfully",
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to create health program",
      },
      { status: 500 }
    );
  }
} 