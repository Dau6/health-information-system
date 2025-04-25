import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

/**
 * Wraps API route handlers with authentication check
 * @param handler The route handler function to wrap
 * @returns A function that checks auth before calling the handler
 */
export function withAuth<T>(
  handler: (...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (...args: any[]) => {
    // Get the request from the args (typically the first argument)
    const req = args[0];
    
    // Check if the user is authenticated
    const auth = getAuth(req);
    const { userId } = auth;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // If authenticated, proceed with the original handler
    return handler(...args);
  };
}

/**
 * Returns the current user's ID from Clerk
 * @returns The user ID or null if not authenticated
 */
export function getCurrentUserId(req: Request): string | null {
  const auth = getAuth(req);
  return auth.userId;
} 