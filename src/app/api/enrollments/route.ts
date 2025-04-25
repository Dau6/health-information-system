import { NextRequest, NextResponse } from "next/server";
import { useEnrollments } from "@/store";
import { ApiResponse, Enrollment } from "@/types";
import { z } from "zod";

// Enrollment validation schema
const enrollmentSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  programId: z.string().min(1, "Program ID is required"),
  notes: z.string().optional(),
});

/**
 * GET /api/enrollments - Get all enrollments
 */
export async function GET(request: NextRequest) {
  const enrollmentsStore = useEnrollments();
  const enrollments = enrollmentsStore.enrollments;
  
  const response: ApiResponse<Enrollment[]> = {
    success: true,
    data: enrollments,
  };
  
  return NextResponse.json(response);
}

/**
 * POST /api/enrollments - Create a new enrollment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate enrollment data
    const parseResult = enrollmentSchema.safeParse(body);
    
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
    
    const { clientId, programId, notes } = parseResult.data;
    const enrollmentsStore = useEnrollments();
    
    const newEnrollment = enrollmentsStore.enrollClient(clientId, programId, notes);
    
    if (!newEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad request",
          message: "Failed to enroll client. Client or program not found.",
        },
        { status: 400 }
      );
    }
    
    const response: ApiResponse<Enrollment> = {
      success: true,
      data: newEnrollment,
      message: "Client enrolled in program successfully",
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to enroll client in program",
      },
      { status: 500 }
    );
  }
} 