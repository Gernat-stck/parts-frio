<?php

namespace App\Services;

use App\Models\Receiver;
use App\Models\SalesHistory;
use Illuminate\Support\Facades\Log;  // Importar Log
use Throwable; // Importar Throwable

class SaleService
{
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
     * @return array<int, array> A list of clients with aggregated sales data.
     */
    public function obtenerTodosLosClientes(): array
    {
        try {
            $clientes = Receiver::all(); // Obtener todos los receptores

            return $clientes->map(function ($receiver) {
                // Compras totales para estadísticas generales
                $comprasTotales = SalesHistory::where('nitReceiver', $receiver->nit)->get();

                $totalCompras = $comprasTotales->count();
                $montoTotal = $comprasTotales->sum(function ($venta) {
                    $json = json_decode(json_encode($venta->json_enviado), true);
                    return collect($json['cuerpoDocumento'] ?? [])
                        ->sum(fn($item) => floatval($item['ventaGravada'] ?? 0));
                });

                // Últimas 5 compras para historial breve
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
                    'address' => trim(($receiver->municipio ?? '') . ' ' . ($receiver->departamento ?? '')), // Asegurar que no haya doble espacio si uno es nulo
                    'fechaRegistro' => $receiver->created_at->format('Y-m-d'),
                    'totalCompras' => $totalCompras,
                    'montoTotal' => $montoTotal,
                    'historialCompras' => $historialCompras
                ];
            })->toArray();
        } catch (Throwable $e) {
            Log::error("Error al obtener todos los clientes con historial de compras: " . $e->getMessage());
            return []; // Devolver un array vacío en caso de error
        }
    }
}
