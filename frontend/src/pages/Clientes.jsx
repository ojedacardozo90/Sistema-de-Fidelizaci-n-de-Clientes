import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import Table from "../components/Table";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    api.get(endpoints.clientes)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const headers = ["ID", "Nombre", "Apellido", "Documento", "Nacionalidad", "Email"];

  const rows = clientes.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    apellido: c.apellido,
    documento: c.numero_documento,
    nacionalidad: c.nacionalidad,
    email: c.email,
  }));

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Clientes</h2>
      <Table headers={headers} rows={rows} />
    </div>
  );
}
