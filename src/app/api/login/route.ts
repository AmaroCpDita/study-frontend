import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In mock mode, we accept any login except for a specific error email
    if (email === "error@popstudy.com") {
      return NextResponse.json(
        { message: "Credenciales incorrectas (simulado)" },
        { status: 401 }
      );
    }

    // Set mock session
    const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
    await setSession(mockUserId, rememberMe);

    return NextResponse.json(
      {
        user: {
          id: mockUserId,
          full_name: "AmaroCpDita",
          institution: "Universidad de Ejemplo",
          major: "Analista Ejemplificador",
        },
        message: "Login exitoso (Mock Mode)",
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error en la solicitud" },
      { status: 400 }
    );
  }
}
