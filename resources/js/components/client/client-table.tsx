import { useCallback, useState } from "react";
import { Cliente } from "../../types/clientes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ClienteRow from "./client-row";
import { Pagination } from "../ui/pagination";

export default function ClienteTable({
    clientes,
    onVerHistorial,
    itemsPerPage = 5,
}: {
    clientes: Cliente[];
    onVerHistorial: (cliente: Cliente) => void;
    itemsPerPage?: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedClientes, setPaginatedClientes] = useState<Cliente[]>([]);

    const handlePaginatedData = useCallback((data: Cliente[]) => {
        setPaginatedClientes(data);
    }, []);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Identificación</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Compras</TableHead>
                        <TableHead>Monto Total</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedClientes.length > 0 ? (
                        paginatedClientes.map((cliente) => <ClienteRow key={cliente.id} cliente={cliente} onVerHistorial={onVerHistorial} />)
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                No se encontraron clientes
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pagination
                data={clientes}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPaginatedData={handlePaginatedData}
                pageInfo={{ itemName: 'clientes' }}
                maxPageButtons={5}
            />
        </>
    );
}
