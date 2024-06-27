import { NextRequest } from "next/server";
import { estadoCheque } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import reflejarOperacion from "@/lib/moduloBanco/operacion/reflejarOperacion";
import ApiError from "@/lib/api/ApiError";
import generarAsiento from "@/lib/asientos/services/asiento/generarAsiento";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const id = params.id;
  
    try{

      const cheque = await prisma.$transaction(async (tx) => {

        const chequeTx = await tx.cheque.update({
          where: {
            id,
          },
          data: {
            fechaDeposito: new Date(),
            estado: estadoCheque.PAGADO,
          },
        })

        if(chequeTx.fechaPago && chequeTx.fechaPago.toISOString().split('T')[0] > new Date().toISOString().split('T')[0]) throw new ApiError("El cheque no puede ser conciliado antes de la fecha de pago.", 400)

        return chequeTx

      })

      if (!cheque) return generateApiErrorResponse("Cheque no encontrado", 404)

      const tipoOperacion = await prisma.tipoOperacion.findUnique({
        where: {
          nombre: "Conciliación de Cheque",
        },select:{
          id: true,
          esDebito: true,
          afectaSaldo: true,
          afectaSaldoDisponible: true,
          nombre: true
        }
      });	

      if(!tipoOperacion) return generateApiErrorResponse("Tipo de operacion para conciliacion de cheque no encontrada", 404)

      const operacion = await prisma.operacion.create({
        data: {
          nombreInvolucrado: cheque.involucrado,
          concepto: "Conciliación de cheque n° " + cheque.numeroCheque,
          fechaOperacion: new Date(),
          cuentaBancariaOrigenId: cheque.cuentaBancariaAfectadaId,
          monto: cheque.monto,
          tipoOperacionId: tipoOperacion.id,
          numeroComprobante: cheque.numeroCheque,
        },
      });

      if(tipoOperacion.nombre === "Pago a Proveedores" && tipoOperacion.esDebito)
      {
        const numOrdenCompra = Math.floor(Math.random() * (3000 - 100 + 1) + 100)
        await generarAsiento([
          {
            fecha: operacion.fechaOperacion,
            concepto: operacion.concepto + " con orden de compra #" + numOrdenCompra,
            monto: +operacion.monto,
            codigo:"101.01.01",
            esDebe: false,
            esAsentable: true
          },
          {
            fecha: operacion.fechaOperacion,
            concepto: "Bancos con relacion a la orden de compra #" + numOrdenCompra,
            monto: +operacion.monto,
            codigo:"101.01.02",
            esDebe: true,
            esAsentable: true
          }
        ])
      }

      if (!operacion) return generateApiErrorResponse("Operacion no creada", 500)

      await reflejarOperacion(operacion.cuentaBancariaOrigenId, cheque.monto, tipoOperacion.esDebito, tipoOperacion.afectaSaldo, tipoOperacion.afectaSaldoDisponible);
      
      return generateApiSuccessResponse(
        200,
        `Cheque n° ${cheque.numeroCheque} fue pagado`,
        cheque
      );
  }catch(err){
    console.error(err)
    if(err instanceof PrismaClientKnownRequestError) return generateApiErrorResponse(err.message, 500);
    if(err instanceof Error) return generateApiErrorResponse(err.message, 500);
    return generateApiErrorResponse("Error al conciliar el cheque", 500);
  }
}
