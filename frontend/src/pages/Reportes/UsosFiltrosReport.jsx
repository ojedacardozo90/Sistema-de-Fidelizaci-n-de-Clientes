/**
 * UsosFiltrosReport.jsx
 * -----------------------------------------------------------
 * Filtra usos por:
 *  - Concepto
 *  - Cliente
 *  - Fecha
 * Consume:
 *  /consultas/usos_por_concepto/?concepto_id=
 *  /consultas/usos_por_cliente/?cliente_id=
 *  /consultas/usos_por_fecha/?fecha=
 * -----------------------------------------------------------
 */

import { useState, useEffect } from "react";
import api from "../../services/api";
import FigmaTable from "../../components/base/FigmaTable";


export default function UsosFiltrosReport() {
  const [clientes, setClientes] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [usos, setUsos] = useState([]);

  const [filtro, setFiltro] = useState({
    cliente_id: "",
    concepto_id: "",
    fecha: "",
  });

  useEffect(() => {
    api.get(endpoints.clientes).then((r) => setClientes(r.data));
    api.get(endpoints.conceptos).then((r) => setConceptos(r.data));
  }, []);

  const consultar = () => {
    if (filtro.concepto_id)
      return api.get(`${endpoints.usos_por_concepto}?concepto_id=${filtro.concepto_id}`)
        .then((r) => setUsos(r.data));

    if (filtro.cliente_id)
      return api.get(`${endpoints.usos_por_cliente}?cliente_id=${filtro.cliente_id}`)
        .then((r) => setUsos(r.data));

    if (filtro.fecha)
      return api.get(`${endpoints.usos_por_fecha}?fecha=${filtro.fecha}`)
        .then((r) => setUsos(r.data));
  };

  const headers = ["ID", "Cliente", "Concepto", "Fecha", "Puntos"];

  const rows = usos.map((u) => ({
    id: u.id,
    cliente: `${u.cliente.nombre} ${u.cliente.apellido}`,
    concepto: u.concepto.descripcion,
    fecha: u.fecha.slice(0, 10),
    puntos: u.puntos_utilizados,
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Usos Filtrados</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filtro.concepto_id}
          onChange={(e) => setFiltro({ ...filtro, concepto_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Concepto...</option>
          {conceptos.map((c) => (
            <option value={c.id} key={c.id}>{c.descripcion}</option>
          ))}
        </select>

        <select
          value={filtro.cliente_id}
          onChange={(e) => setFiltro({ ...filtro, cliente_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Cliente...</option>
          {clientes.map((c) => (
            <option value={c.id} key={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={filtro.fecha}
          onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
        />
      </div>

      <button
        onClick={consultar}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Buscar
      </button>

      <Table headers={headers} rows={rows} />
    </div>
  );
}
