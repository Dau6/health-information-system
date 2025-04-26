import { NextRequest, NextResponse } from "next/server";
import { usePrograms } from "@/store";
import { ApiResponse, HealthProgram } from "@/types";

/**
 * GET /api/public/programs - Get public health programs info
 * This endpoint doesn't require authentication
 */
export async function GET(request: NextRequest) {
  const programsStore = usePrograms();
  
  // Return only basic public information about programs
  const publicPrograms = programsStore.programs.map(program => ({
    id: program.id,
    name: program.name,
    description: program.description,
  }));
  
  const response: ApiResponse<Partial<HealthProgram>[]> = {
    success: true,
    data: publicPrograms,
  };
  
  return NextResponse.json(response);
} 