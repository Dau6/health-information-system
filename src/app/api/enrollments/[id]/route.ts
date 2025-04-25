import { NextRequest, NextResponse } from "next/server";
import { useEnrollments } from "@/store";
import { ApiResponse, Enrollment } from "@/types";
import { z } from "zod";

// Enrollment update validation schema
const enrollmentUpdateSchema = z.object({
  status: z.enum(["active", "completed", "withdrawn"]).optional(),
  notes: z.string().optional().nullable(),
});

/**
 * GET /api/enrollments/:id - Get a specific enrollment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const enrollmentsStore = useEnrollments();
  
  const enrollment = enrollmentsStore.getEnrollmentById(id);
  
  if (!enrollment) {
    return NextResponse.json(
      {
        success: false,
        error: "Not found",
        message: "Enrollment not found",
      },
      { status: 404 }
    );
  }
  
  const response: ApiResponse<Enrollment> = {
    success: true,
    data: enrollment,
  };
  
  return NextResponse.json(response);
}

/**
 * PUT /api/enrollments/:id - Update an enrollment
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate enrollment data
    const parseResult = enrollmentUpdateSchema.safeParse(body);
    
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
    
    const enrollmentsStore = useEnrollments();
    const updatedEnrollment = enrollmentsStore.updateEnrollment(id, parseResult.data);
    
    if (!updatedEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Enrollment not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Enrollment> = {
      success: true,
      data: updatedEnrollment,
      message: "Enrollment updated successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to update enrollment",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/enrollments/:id - Withdraw from an enrollment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const enrollmentsStore = useEnrollments();
    
    const success = enrollmentsStore.cancelEnrollment(id);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Enrollment not found",
        },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: "Enrollment withdrawn successfully",
    };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: "Failed to withdraw from enrollment",
      },
      { status: 500 }
    );
  }
} 
 