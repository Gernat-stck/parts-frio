<?php

namespace App\Services;

use App\Http\Requests\Inventory\StoreInventoryItemRequest;
use App\Http\Requests\Inventory\UpdateInventoryItemRequest;
use App\Models\Inventory;
use App\Services\ImageStorageService;
use Illuminate\Database\Eloquent\Collection; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class InventoryService
{
    protected ImageStorageService $imageStorageService;

    public function __construct(ImageStorageService $imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

    /**
     * Preserves values for fields that are missing or null in the data array,
     * by taking them from the existing inventory item.
     *
     * @param array $data The data array to modify.
     * @param Inventory $inventoryItem The existing inventory item.
     * @param array $fields The list of fields to check and preserve.
     * @return void
     */
    private function preserveMissingFields(array &$data, Inventory $inventoryItem, array $fields): void
    {
        foreach ($fields as $field) {
            if (!array_key_exists($field, $data) || is_null($data[$field])) {
                $data[$field] = $inventoryItem->$field;
            }
        }
    }


    /**
     * Retrieve all products from the inventory.
     *
     * @return Collection<int, Inventory>
     */
    public function getAllProducts(): Collection
    {
        try {
            return Inventory::all();
        } catch (Throwable $e) {
            Log::error("Error al obtener todos los productos: " . $e->getMessage());
            // Considerar lanzar una excepción personalizada o devolver una colección vacía.
            return new Collection();
        }
    }

    /**
     * Find a product by its product_code.
     *
     * @param string $productCode The unique product code.
     * @return Inventory|null
     */
    public function findProductById(string $productCode): ?Inventory
    {
        try {
            return Inventory::where('product_code', $productCode)->first();
        } catch (Throwable $e) {
            Log::error("Error al buscar producto por código {$productCode}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Add a new product to the inventory.
     *
     * @param StoreInventoryItemRequest $request The request containing product data.
     * @return Inventory
     * @throws Throwable If an error occurs during transaction.
     */
    public function addProduct(StoreInventoryItemRequest $request): Inventory
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            if ($request->hasFile('img_product')) {
                try {
                    $data['img_product'] = $this->imageStorageService->storeAndGetPath($request->file('img_product'));
                } catch (Throwable $e) {
                    Log::error("Error al guardar la imagen del producto: " . $e->getMessage());
                    throw new \Exception("Error al procesar la imagen del producto.");
                }
            }

            try {
                $item = Inventory::create($data);
                Log::info("Producto añadido al inventario: " . $item->product_code);
                return $item;
            } catch (Throwable $e) {
                // Si la creación falla y ya se guardó la imagen, considera eliminarla.
                if (isset($data['img_product'])) {
                    $this->imageStorageService->deleteImage($data['img_product']);
                }
                Log::error("Error al crear el producto: " . $e->getMessage());
                throw new \Exception("No se pudo crear el producto en el inventario.");
            }
        });
    }

    /**
     * Update an existing product in the inventory.
     *
     * @param UpdateInventoryItemRequest $request The request containing update data.
     * @param Inventory $inventoryItem The inventory item instance to update.
     * @return bool True if the update was successful, false otherwise.
     */
    public function updateProduct(UpdateInventoryItemRequest $request, Inventory $inventoryItem): bool
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();

            // Si se envía una nueva imagen
            if ($request->hasFile('img_product')) {
                $disk = config('filesystems.default');

                // Eliminar imagen anterior si es relativa y existe
                if ($inventoryItem->img_product && !Str::startsWith($inventoryItem->img_product, 'http')) {
                    try {
                        if (Storage::disk($disk)->exists($inventoryItem->img_product)) {
                            $this->imageStorageService->deleteImage($inventoryItem->img_product);
                            Log::info("Imagen anterior eliminada para producto: {$inventoryItem->product_code}");
                        }
                    } catch (Throwable $e) {
                        Log::warning("No se pudo eliminar la imagen anterior para producto {$inventoryItem->product_code}: " . $e->getMessage());
                        // No es crítico para detener la operación, solo loguear.
                    }
                }

                // Guardar nueva imagen
                $data['img_product'] = $this->imageStorageService->storeProductImage($request->file('img_product'));
                Log::info("Nueva imagen guardada para producto: {$inventoryItem->product_code}");
            } else {
                // Si no se envía imagen, conservar la actual (ya está en $inventoryItem->img_product)
                // y asegurar que no se sobrescriba si 'img_product' no está en $data.
                if (!array_key_exists('img_product', $data)) {
                    $data['img_product'] = $inventoryItem->img_product;
                }
            }

            // Actualizar el modelo con los datos validados
            $inventoryItem->fill($data);
            $inventoryItem->save();

            DB::commit();
            Log::info("Producto actualizado exitosamente: {$inventoryItem->product_code}");
            return true;
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error("Error al actualizar producto {$inventoryItem->product_code}: " . $e->getMessage());
            // Si la nueva imagen se guardó antes del rollback y la actualización falló,
            // considera eliminar la imagen recién subida aquí para evitar huérfanos.
            if (isset($data['img_product']) && $request->hasFile('img_product')) {
                $this->imageStorageService->deleteImage($data['img_product']);
                Log::info("Imagen recién subida eliminada tras fallo de actualización para producto: {$inventoryItem->product_code}");
            }
            return false;
        }
    }

    /**
     * Retorna una lista única de categorías de los productos.
     *
     * @return array<int, string>
     */
    public function getUniqueCategories(): array
    {
        try {
            return Inventory::query()
                ->select('category')
                ->distinct()
                ->pluck('category')
                ->filter() // Eliminar valores nulos o vacíos
                ->map(function ($cat) {
                    return ucfirst(strtolower(trim($cat))); // Normalizar formato
                })
                ->unique() // Asegurar unicidad después de la normalización
                ->sort()   // Ordenar alfabéticamente
                ->values() // Reindexar el array
                ->toArray();
        } catch (Throwable $e) {
            Log::error("Error al obtener categorías únicas: " . $e->getMessage());
            return []; // Devolver un array vacío en caso de error
        }
    }
}
