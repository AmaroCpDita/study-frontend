import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/auth";
import { MOCK_PROFILE } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const userId = await getSession();
    
    if (!userId) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    // Since we are in mock mode, any session userId returns the global MOCK_PROFILE
    const user = MOCK_PROFILE;

    return NextResponse.json(
      {
        user: {
          id: userId,
          full_name: user.full_name,
          institution: "Universidad de Ejemplo",
          major: "Analista Ejemplificador",
        }
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}
