"use client"
import React, { useState, useEffect } from 'react';
import agregarCheque from '@/lib/cheque/agregarCheque';
import obtenerBancoPorId from '@/lib/banco/obtenerBancoPorId';
import obtenerCuentaBancariaPorId from '@/lib/entidad/obtenerEntidadPorId';
import obtenerBancos from "@/lib/banco/obtenerBancos";
import { Banco } from "@prisma/client";
import obtenerTiposOperacion from '@/lib/tipoOperacion/obtenerTiposOperacion';
import { TipoOperacion } from '@prisma/client';
import obtenerCuentaBancaria from '@/lib/cuentaBancaria/obtenerCuentaBancaria';
import { CuentaBancaria } from '@prisma/client';
import obtenerCuentasFiltros from '@/lib/cuentaBancaria/obtenerCuentasFiltros';
import { CuentaBancariaAndBanco } from '@/lib/definitions';
  

const CrearCheques = () => {

 const estadoInicial = [{ id: "0", nombre: "No hay bancos", deleted: null }];


  // Definir estados para almacenar los valores del cheque
  const [numeroCheque, setNumeroCheque] = useState('');
  const [esRecibido, setEsRecibido] = useState(false); 
  const [monto, setMonto] = useState(0); 
  const [fechaEmision, setFechaEmision] = useState('');

  const [involucrado, setInvolucrado] = useState('');
  const [estado, setEstado] = useState('');
  const [bancoChequeId, setBancoChequeId] = useState('');
  console.log(bancoChequeId)
  const [tipoOperacionId, setTipoOperacionId] = useState('');
  const [cuentaBancariaAfectadaId, setCuentaBancariaAfectadaId] = useState('')
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancariaAndBanco[]>([])
  const [involucradoNombre, setInvolucradoNombre]= useState('')
  const [involucradoDocumentoIdentidad, setInvolucradoDocumentoIdentidad]= useState('')

  console.log(tipoOperacionId)
  

  const obtenerYMostrarBanco = async () => {
    try {
      const cuentasData = await obtenerBancos();

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setBancos(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };


  const obtenerYMostrarCuentasBancarias= async () => {
    try {
      const cuentasData = await obtenerCuentaBancaria();

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setCuentasBancarias(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener los tipos de operacion:", error);
    }
  };
 // const [banco, setBanco] = useState<Banco[]>(estadoInicial);

  useEffect(() => {
    obtenerYMostrarBanco();
    obtenerYMostrarCuentasBancarias();
  }, [])



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        await agregarCheque(
          numeroCheque,
          esRecibido,
          monto,
          new Date(fechaEmision),
          involucradoNombre,
          involucradoDocumentoIdentidad,
          bancoChequeId,
          cuentaBancariaAfectadaId
        
        //  cuentaBancariaAfectadaId
        );
   
    setNumeroCheque('');
    setEsRecibido(false);
    setMonto(0);
    setFechaEmision('');
    setInvolucrado('');
    setBancoChequeId('');
    setTipoOperacionId('');
    setCuentaBancariaAfectadaId('');
    setInvolucradoNombre('');
    setInvolucradoDocumentoIdentidad('');

    // Puedes mostrar algún mensaje de éxito si es necesario
    console.log('Cheque registrado exitosamente');
  } catch (error) {
    // Manejar el error si la función agregarCheque falla
    console.error('Error al registrar el cheque:', error);
  }
};
  

  return (
    <div className="max-w-md mx-auto bg-gray-800 py-6 px-4 rounded-md shadow-md [min-width:300px]">
   
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numeroCheque" className="block font-medium">Número de Cheque xd:</label>
        <input
          type="text"
          id="numeroCheque"
          value={numeroCheque}
          onChange={(e) => setNumeroCheque(e.target.value)}
          className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="monto" className="block font-medium">Monto:</label>
        <input
          type="number"
          id="monto"
          defaultValue={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
    <input
        type="checkbox"
        id="esRecibido"
        checked={esRecibido}
        onChange={(e) => setEsRecibido(e.target.checked)}
        className="text-blue-500 border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
    <label htmlFor="esRecibido" className="ml-2">Es recibido</label>
    </div>
      <div>
        <label htmlFor="fechaEmision" className="block font-medium">Fecha de Emisión:</label>
        <input
          type="date"
          id="fechaEmision"
          value={fechaEmision}
          onChange={(e) => setFechaEmision(e.target.value)}
          className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
  <label htmlFor="involucradoNombre" className="block font-medium">Nombre del involucrado:</label>
  <input
    type="text"
    id="involucradoNombre"
    value={involucradoNombre}
    onChange={(e) => setInvolucradoNombre(e.target.value)}
    disabled={esRecibido} // Deshabilita el campo si esRecibido está marcado
    className={`text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${esRecibido ? 'bg-gray-200' : ''}`}
  />
</div>

<div>
  <label htmlFor="involucradoDocumentoIdentidad" className="block font-medium">Doc. de identidad:</label>
  <input
    type="text"
    id="involucradoDocumentoIdentidad"
    value={involucradoDocumentoIdentidad}
    onChange={(e) => setInvolucradoDocumentoIdentidad(e.target.value)}
    disabled={esRecibido} // Deshabilita el campo si esRecibido está marcado
    className={`text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${esRecibido ? 'bg-gray-200' : ''}`}
  />
</div>

      <div>
          <label htmlFor="bancoChequeId" className="block font-medium">Banco:</label>
          <select
            id="bancoChequeId"
            value={bancoChequeId}
            onChange={(e) => setBancoChequeId(e.target.value)}
            className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un banco</option>
            {bancos.map(banco => (
              <option key={banco.id} value={banco.id}>{banco.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cuentaBancariaId" className="block font-medium">Cuenta bancaria:</label>
          <select
            id="cuentaBancariaId"
            value={cuentaBancariaAfectadaId}
            onChange={(e) => setCuentaBancariaAfectadaId(e.target.value)}
            className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una cuenta</option>
            {cuentasBancarias.map(cuentasBancarias => (
              <option key={cuentasBancarias.id} value={cuentasBancarias.id}>{cuentasBancarias.banco.nombre} {cuentasBancarias.numeroCuenta}</option>
            ))}
          </select>
        </div>
     
      <button  type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600">Registrar Cheque</button>
    </form>
  </div>
);
};


export default CrearCheques;