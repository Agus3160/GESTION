import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fechaDesde = searchParams.get("fechaDesde");
  const fechaHasta = searchParams.get("fechaHasta");
  
  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const cuenta = searchParams.get("cuenta");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? 0 : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 4 : parseInt(upTo)

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    createdAt: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHasta ? new Date(fechaHasta) : undefined,
    },
    cuentaBancariaOrigenId: cuenta? cuenta : undefined
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.operacion.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: where as any,
    include:{
      tipoOperacion: true
    }
  });

  if (!values)
    return generateApiErrorResponse("Error intentando buscar Operaciones", 500);

  return generateApiSuccessResponse(200, "Operaciones encontradas", values);
}
