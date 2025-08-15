<?php

namespace App\Services;

use App\Models\Receiver;
use App\Models\SalesHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Throwable;

class SaleService
{
    /**
     * Bring invoices for a specific month
     * @param string $month
     * @return LengthAwarePaginator
     */
    public function obtenerFacturasPorMes(Request $request): LengthAwarePaginator
    {

        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);
        $perPage = $request->input('perPage', 5);
        $estado = $request->input('estado');
        $busqueda = $request->input('busqueda');

        $request->validate([
            'month' => 'nullable|integer|min:1|max:12',
            'year' => 'nullable|integer|min:2000|max:' . Carbon::now()->year,
            'perPage' => 'nullable|integer|min:1|max:100',
            'estado' => 'nullable|string|in:PROCESADO,CONTINGENCIA,ANULADO,todos',
            'busqueda' => 'nullable|string|max:255',
        ]);

        $query = SalesHistory::query()
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year);

        if ($estado && $estado !== 'todos') {
            $query->where('estado', $estado);
        }

        if ($busqueda) {
            $query->where(function ($q) use ($busqueda) {
                $q->whereRaw("json_enviado->'receptor'->>'nombre' ILIKE ?", ["%$busqueda%"])
                    ->orWhere('nitReceiver', 'ILIKE', "%$busqueda%")
                    ->orWhere('numeroControl', 'ILIKE', "%$busqueda%")
                    ->orWhere('codigoGeneracion', 'ILIKE', "%$busqueda%");
            });
        }


        return $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Retrieves a client with their latest sales history.
     *
     * @param string $nit The NIT of the client.
     * @return array|null An array containing client details and sales history, or null if not found.
     */
    public function obtenerClienteConCompras(string $nit): ?array
    {
        try {
            $receiver = Receiver::where('nit', $nit)->first();

            if (!$receiver) {
                Log::info("Cliente no encontrado con NIT: {$nit}");
                return null;
            }

            $compras = SalesHistory::where('nitReceiver', $nit)
                ->orderByDesc('fechaEmi')
                ->take(5) // Obtener las últimas 5 compras
                ->get();

            $historialCompras = $compras->map(function ($venta) {
                $json = json_decode(json_encode($venta->json_enviado), true);
                $productos = collect($json['cuerpoDocumento'] ?? [])
                    ->map(function ($item) {
                        // Asegurar que las claves existan antes de acceder a ellas
                        $cantidad = $item['cantidad'] ?? 0;
                        $descripcion = $item['descripcion'] ?? 'N/A';
                        $ventaGravada = $item['ventaGravada'] ?? 0;
                        return "{$cantidad} x {$descripcion} ({$ventaGravada})";
                    })->toArray();

                $monto = collect($json['cuerpoDocumento'] ?? [])
                    ->sum(function ($item) {
                        return floatval($item['ventaGravada'] ?? 0);
                    });

                return [
                    'fecha' => $venta->fechaEmi,
                    'factura' => $venta->codigoGeneracion,
                    'monto' => $monto,
                    'productos' => $productos
                ];
            })->toArray();

            Log::info("Cliente con compras recuperado para NIT: {$nit}");
            return [
                'id' => $receiver->id,
                'fechaRegistro' => $receiver->created_at->format('Y-m-d'),
                'totalCompras' => $compras->count(),
                'montoTotal' => $historialCompras->sum('monto'),
                'historialCompras' => $historialCompras
            ];
        } catch (Throwable $e) {
            Log::error("Error al obtener cliente con compras para NIT {$nit}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Retrieves all clients with their total sales and a brief sales history.
     *
     * @return LengthAwarePaginator A list of clients with aggregated sales data.
     */

    public function obtenerClientesPaginados(Request $request): LengthAwarePaginator
    {
        try {
            $perPage = $request->input('perPage', 5);
            $busqueda = $request->input('busqueda');

            $request->validate([
                'perPage' => 'nullable|integer|min:1|max:100',
                'busqueda' => 'nullable|string|max:255',
            ]);

            $query = Receiver::query();

            if ($busqueda) {
                $query->where(function ($q) use ($busqueda) {
                    $q->where('nombre', 'ILIKE', "%$busqueda%")
                        ->orWhere('correo', 'ILIKE', "%$busqueda%")
                        ->orWhere('nit', 'ILIKE', "%$busqueda%")
                        ->orWhere('nrc', 'ILIKE', "%$busqueda%");
                });
            }

            $paginados = $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

            $clientesTransformados = $paginados->getCollection()->map(function ($receiver) {
                $comprasTotales = SalesHistory::where('nitReceiver', $receiver->nit)->get();

                $totalCompras = $comprasTotales->count();
                $montoTotal = $comprasTotales->sum(function ($venta) {
                    $json = json_decode(json_encode($venta->json_enviado), true);
                    return collect($json['cuerpoDocumento'] ?? [])
                        ->sum(fn($item) => floatval($item['ventaGravada'] ?? 0));
                });

                $ultimasCompras = $comprasTotales->sortByDesc('fechaEmi')->take(5);

                $historialCompras = $ultimasCompras->map(function ($venta) {
                    $json = json_decode(json_encode($venta->json_enviado), true);
                    $productos = collect($json['cuerpoDocumento'] ?? [])
                        ->map(function ($item) {
                            $cantidad = $item['cantidad'] ?? 0;
                            $descripcion = $item['descripcion'] ?? 'N/A';
                            $ventaGravada = $item['ventaGravada'] ?? 0;
                            return "{$cantidad} x {$descripcion} ({$ventaGravada})";
                        })->toArray();

                    $monto = collect($json['cuerpoDocumento'] ?? [])
                        ->sum(fn($item) => floatval($item['ventaGravada'] ?? 0));

                    return [
                        'fecha' => $venta->fechaEmi,
                        'factura' => $venta->codigoGeneracion,
                        'monto' => $monto,
                        'productos' => $productos
                    ];
                })->toArray();

                return [
                    'id' => $receiver->id,
                    'name' => $receiver->nombre,
                    'email' => $receiver->correo,
                    'phone' => $receiver->telefono,
                    'document' => $receiver->nit ?? $receiver->nrc,
                    'address' => trim(($receiver->municipio ?? '') . ' ' . ($receiver->departamento ?? '')),
                    'fechaRegistro' => $receiver->created_at->format('Y-m-d'),
                    'totalCompras' => $totalCompras,
                    'montoTotal' => $montoTotal,
                    'historialCompras' => $historialCompras
                ];
            });

            $paginados->setCollection($clientesTransformados);

            return $paginados;
        } catch (Throwable $e) {
            Log::error("Error al obtener clientes paginados: " . $e->getMessage());
            return new LengthAwarePaginator([], 0, $perPage);
        }
    }

    /**
     * Get invoice details by its generation code.
     * @param string $codigoGeneracion
     * @return array|null
     */
    public function findInvoiceByCodigoGeneracion(string $codigoGeneracion): array|null
    {
        try {
            $registro = SalesHistory::where('codigoGeneracion', $codigoGeneracion)->first();
            if (!$registro) {
                throw new Exception("No se encontró historial para el código: {$codigoGeneracion}");
            }
            // Si json_enviado es string JSON, lo decodificamos
            return $registro->json_enviado;
        } catch (Throwable $e) {
            // Puedes loguear el error si lo deseas
            Log::error("Error al obtener datos del DTE"  . $e->getMessage());
            return null;
        }
    }
}
