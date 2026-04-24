import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, institution, major } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // In mock mode, we just return a success response
    const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
    await setSession(mockUserId);

    return NextResponse.json(
      {
        user: {
          id: mockUserId,
          full_name: full_name,
          institution: institution || "Sin institución",
          major: major || "Sin carrera",
        },
        message: "Registro exitoso (Mock Mode)",
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error procesando el registro" },
      { status: 400 }
    );
  }
}
