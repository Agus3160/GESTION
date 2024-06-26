import { type NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { generateApiErrorResponse, generateApiSuccessResponse } from '@/lib/apiResponse'
import { CuentaBancaria } from '@prisma/client'

export async function GET(request: NextRequest) {
  
  const searchParams = request.nextUrl.searchParams

  const bancoId = searchParams.get('bancoId')
  const esCuentaAhorro = searchParams.get('esCuentaAhorro')
  const deleted = searchParams.get('deleted')

  let values: CuentaBancaria[]|null = null;
  
  //Si hay informacion para la busqueda, agregarla al filtro
  const where = {
    bancoId: bancoId ?? undefined,
    esCuentaAhorro: esCuentaAhorro === 'true' ? true : (esCuentaAhorro === 'false' ? false : undefined),
    deleted: (deleted && deleted == 'true') ? {not: null} : (deleted && deleted == 'false') ? null : undefined
  }

  //Asignar los elementos encontrados a los valores
  values = await prisma.cuentaBancaria.findMany({
    where: where,
    include:{
      banco:true
    }
  }
)

  return generateApiSuccessResponse(200, "Cuentas bancarias encontradas", values)
}