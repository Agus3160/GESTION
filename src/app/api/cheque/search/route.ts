import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { estadoCheque } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fechaDesde = searchParams.get("fechaDesde");
  const fechaHasta = searchParams.get("fechaHasta");

  const montoDesde = searchParams.get("montoDesde")
  const montoHasta = searchParams.get("montoHasta")
  
  const skip = searchParams.get("skip");
  const upTo  = searchParams.get("upTo");

  const bancoChequeId  = searchParams.get("bancoChequeId");

  const estado = searchParams.get("estado");

  const cuenta = searchParams.get("cuenta");

  const verifiedSkip = (!skip || Number.isNaN(parseInt(skip))) ? 0 : parseInt(skip)
  const verifiedUpTo = (!upTo || Number.isNaN(parseInt(upTo))) ? 4 : parseInt(upTo)

  const amounts = [ 
    (!montoDesde || Number.isNaN(parseFloat(montoDesde)))? undefined : parseFloat(montoDesde), 
    (!montoHasta || Number.isNaN(parseFloat(montoHasta)))? undefined : parseFloat(montoHasta)
  ] 

  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    fechaEmision: {
      gte: fechaDesde ? new Date(fechaDesde) : undefined,
      lte: fechaHasta ? new Date(fechaHasta) : undefined,
    },
    bancoChequeId: bancoChequeId ? bancoChequeId : undefined,
    cuentaBancariaAfectadaId: cuenta? cuenta : undefined,
    estado: estado ? estado : undefined,
    monto:{
      gte:amounts[0],
      lte:amounts[1]
    }
  };

  //Asignar los elementos encontrados a los valores
  const values = await prisma.cheque.findMany({
    skip: verifiedSkip,
    take: verifiedUpTo,
    where: where as any,
    include:{
      cuentaAfectada: true,
      bancoCheque: true
    }
  });

  const count = await prisma.cheque.count({ where: where as any });

  if (!values)
    return generateApiErrorResponse("Error intentando buscar los Cheques", 500);

  return generateApiSuccessResponse(200, "Lista de cheques encontrados", {values:values, totalQuantity: count});
}
