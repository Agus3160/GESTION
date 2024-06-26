import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {generateApiErrorResponse, generateApiSuccessResponse} from "@/lib/apiResponse";

import { MovimientoDetalle } from "@prisma/client";

export async function POST(req: NextRequest) {
  
  const body: MovimientoDetalle = await req.json();
  const { 
    movimientoId,
    metodoPago,
    monto,
    concepto
   } = body;

  if(!movimientoId || !monto ) return generateApiErrorResponse("Faltan datos para el movimiento detalle", 400)

  if(monto.lessThanOrEqualTo(0)) return generateApiErrorResponse("El monto debe ser mayor a 0", 400)

  try{
    const movimientoDetalle = await prisma.movimientoDetalle.create({
      data: {
        movimientoId,
        metodoPago, 
        monto, 
        concepto
      }
    })
  
    if(!movimientoDetalle) return generateApiErrorResponse("Error generando el movimiento detalle", 400) 

    return generateApiSuccessResponse(200, "El movimiento detalle fue generada correctamente")
  
  }catch(err){
    if(err instanceof PrismaClientKnownRequestError && err.code === "P2002") return generateApiErrorResponse("El movimiento detalle ya existe", 400)
    else return generateApiErrorResponse("Hubo un error en la creacion del movimiento detalle", 500)
  }  
}

export async function GET() {
  const movimientoDetalle = await prisma.movimientoDetalle.findMany()
  return generateApiSuccessResponse(200, "Exito al obtener los movimientos detalles", movimientoDetalle)
}