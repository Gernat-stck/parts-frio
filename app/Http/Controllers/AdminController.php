<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeCreateRequest;
use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Http\Requests\Inventory\StoreInventoryItemRequest;
use App\Http\Requests\Inventory\UpdateInventoryItemRequest;
use App\Http\Resources\ClienteRecordResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SalesHistoryResource;
use App\Models\SalesHistory;
use App\Models\User; 
use App\Services\InventoryService;
use App\Services\InvoiceService;
use App\Services\SaleService;
use App\Services\Support\SchemaAwareNormalizer;
use App\Services\UserService;
use Illuminate\Http\Request as HttpRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; 
use Throwable; 

class AdminController extends Controller
{
    protected InventoryService $inventoryService;
    protected InvoiceService $invoiceService;
    protected SaleService $saleService;
    protected UserService $userService;

    /**
     * Constructor for AdminController
     *
     * @param InventoryService $inventoryService
     * @param InvoiceService $invoiceService
     * @param SaleService $saleService
     * @param UserService $userService
     */
    public function __construct(InventoryService $inventoryService, InvoiceService $invoiceService, SaleService $saleService, UserService $userService)
    {
        $this->inventoryService = $inventoryService;
        $this->invoiceService = $invoiceService;
        $this->saleService = $saleService;
        $this->userService = $userService;
    }

    /**
     * Display the admin dashboard page.
     *
     * @return \Inertia\Response
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('admin/dashboard');
    }

    #region: Inventarios

    /**
     * Display the inventory management page.
     *
     * @return \Inertia\Response
     */
    public function manageInventory(): \Inertia\Response
    {
        try {
            $products = $this->inventoryService->getAllProducts();
            return Inertia::render('admin/inventory/inventory', [
                'products' => ProductResource::collection($products), // Usar ProductResource si existe
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar la página de gestión de inventario: " . $e->getMessage());
            return Inertia::render('admin/inventory/inventory', [
                'products' => [], // Devolver vacío o un mensaje de error
                'error' => 'No se pudieron cargar los productos en este momento.'
            ])->with('error', 'Error al cargar los productos.');
        }
    }

    /**
     * Display the create inventory page.
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function createInventory(): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        try {
            $categories = $this->inventoryService->getUniqueCategories();
            return Inertia::render('admin/inventory/new-item', [
                'categories' => $categories,
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar la página de creación de inventario: " . $e->getMessage());
            return redirect()->back()->with('error', 'No se pudieron cargar las categorías en este momento.');
        }
    }

    /**
     * Display the edit inventory page.
     *
     * @param string $product_code The product code to edit.
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function editInventory(string $product_code): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        try {
            $product = $this->inventoryService->findProductById($product_code);
            if (!$product) {
                return redirect()->route('admin.inventory')->with('error', 'Producto no encontrado.');
            }
            $categories = $this->inventoryService->getUniqueCategories();
            return Inertia::render('admin/inventory/edit-item', [
                'product' => new ProductResource($product), // Usar ProductResource
                'categories' => $categories,
                'product_code' => $product_code, // Asegúrate de pasar el product_code si se necesita en el frontend
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar la página de edición de inventario para {$product_code}: " . $e->getMessage());
            return redirect()->route('admin.inventory')->with('error', 'Error al cargar la información del producto.');
        }
    }

    /**
     * Store a new inventory item.
     *
     * @param StoreInventoryItemRequest $request The request containing product data.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeInventoryItem(StoreInventoryItemRequest $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $item = $this->inventoryService->addProduct($request);
            return redirect()->route('admin.inventory')->with('success', 'Producto creado con éxito.');
        } catch (Throwable $e) {
            Log::error("Error al almacenar un nuevo producto: " . $e->getMessage());
            return redirect()->back()->with('error', "No se pudo crear el producto. " . $e->getMessage());
        }
    }

    /**
     * Update an existing inventory item.
     *
     * @param UpdateInventoryItemRequest $request The request containing update data.
     * @param string $product_code The product code of the item to update.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateInventoryItem(UpdateInventoryItemRequest $request, string $product_code): \Illuminate\Http\RedirectResponse
    {
        try {
            $inventoryItem = $this->inventoryService->findProductById($product_code); // Usar el servicio para encontrar
            if (!$inventoryItem) {
                Log::warning('Producto no encontrado para actualización', [
                    'product_code' => $product_code,
                    'request_data' => $request->all(),
                ]);
                return redirect()->back()->with('error', 'Producto no encontrado.');
            }

            $success = $this->inventoryService->updateProduct($request, $inventoryItem);

            if (!$success) {
                Log::error('Error al actualizar el producto desde el controlador', [
                    'product_code' => $product_code,
                    'request_data' => $request->all(),
                ]);
                return redirect()->back()->with('error', "No se pudo actualizar el producto. Verifica los datos e intenta nuevamente.");
            }

            return redirect()->route('admin.inventory')->with('success', "Producto actualizado con éxito.");
        } catch (Throwable $e) {
            Log::error("Excepción al actualizar producto {$product_code}: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', "Ocurrió un error inesperado al actualizar el producto.");
        }
    }

    /**
     * Delete an inventory item by product code.
     *
     * @param string $productCode The product code of the item to delete.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteInventoryItem(string $productCode): \Illuminate\Http\RedirectResponse
    {
        try {
            // Se asume que el método deleteProduct del servicio manejará la lógica de eliminación.
            // Si no existe, puedes añadirlo o mantener la lógica aquí.
            $product = $this->inventoryService->findProductById($productCode);
            if (!$product) {
                return redirect()->back()->with('error', 'Producto no encontrado para eliminar.');
            }

            // Aquí podrías añadir un método `deleteProduct` al `InventoryService`
            // Por ahora, lo mantenemos como estaba en el controlador si no hay lógica compleja.
            // Ejemplo de llamada al servicio si existiera: $this->inventoryService->deleteProduct($product);
            $deleted = $product->delete();

            if (!$deleted) {
                return redirect()->back()->with('error', 'No se pudo eliminar el producto.');
            }

            Log::info("Producto eliminado exitosamente: {$productCode}");
            return redirect()->route('admin.inventory')->with('success', 'Producto ' . $productCode . ' eliminado correctamente.');
        } catch (Throwable $e) {
            Log::error("Error al eliminar producto {$productCode}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Hubo un error al eliminar el producto.');
        }
    }

    #endregion

    #region : Usuarios

    /**
     * Display the user management page.
     *
     * @return \Inertia\Response
     */
    public function manageUsers(): \Inertia\Response
    {
        try {
            $employees = $this->userService->list(); // Suponiendo que el servicio ya maneja la carga de roles
            $employeesFormated = EmployeeResource::collection($employees);
            return Inertia::render('admin/users/user-management', [
                'employees' => $employeesFormated
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar la página de gestión de usuarios: " . $e->getMessage());
            return Inertia::render('admin/users/user-management', [
                'employees' => [],
                'error' => 'No se pudieron cargar los empleados en este momento.'
            ])->with('error', 'Error al cargar los empleados.');
        }
    }

    /**
     * Create a new user (employee).
     *
     * @param EmployeeCreateRequest $request The request containing user data.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeEmployee(EmployeeCreateRequest $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $user = $this->userService->create($request);
            Log::info("Empleado registrado: {$user}");
            return redirect()->route('admin.users')->with('success', 'Empleado registrado con éxito.');
        } catch (Throwable $e) {
            Log::error("Error al registrar empleado: " . $e->getMessage(), ['request_data' => $request->all()]);
            return redirect()->back()->with('error', 'Hubo un error al registrar el empleado: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified user in storage.
     *
     * @param EmployeeUpdateRequest $request The request containing update data.
     * @param string $userId The user_id of the user to update.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateEmployee(EmployeeUpdateRequest $request, string $userId): \Illuminate\Http\RedirectResponse
    {
        Log::info("Intento de actualización de usuario: {$userId}", ['request_data' => $request->all()]);
        try {
            $user = User::where('user_id', $userId)->first(); // Buscar el usuario por user_id
            if (!$user) {
                Log::warning('Usuario no encontrado para actualización', ['user_id' => $userId]);
                return redirect()->back()->with('error', 'Usuario no encontrado.');
            }

            // Pasa la instancia del modelo User al servicio.
            $updatedUser = $this->userService->update($request, $user); // <-- Cambio aquí: pasar el objeto $user
            Log::info("Usuario actualizado exitosamente: {$userId}");
            return redirect()->route('admin.users')->with('success', 'Usuario actualizado exitosamente.');
        } catch (Throwable $e) {
            // Manejar errores, por ejemplo, loguearlos y redirigir con un mensaje de error.
            Log::error('Error al actualizar usuario: ' . $e->getMessage(), ['user_id' => $userId, 'data' => $request->all(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Hubo un error al actualizar el usuario: ' . $e->getMessage());
        }
    }

    /**
     * Delete a user by user_id.
     *
     * @param string $userId The user_id of the user to delete.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteEmployee(string $userId): \Illuminate\Http\RedirectResponse
    {
        try {
            $deleted = $this->userService->delete($userId);

            if (!$deleted) {
                return redirect()->back()->with('error', 'Empleado no encontrado o no se pudo eliminar.');
            }

            Log::info("Empleado eliminado: {$userId}");
            return redirect()->route('admin.users')->with('success', 'Empleado eliminado con éxito.');
        } catch (Throwable $e) {
            Log::error("Error al eliminar empleado {$userId}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Hubo un error al eliminar el empleado: ' . $e->getMessage());
        }
    }

    #endregion

    #region: Punto de venta

    /**
     * Display the create order page (Point of Sale).
     *
     * @return \Inertia\Response
     */
    public function createSale(): \Inertia\Response
    {
        try {
            $availableProducts = $this->inventoryService->getAllProducts(); // Usar el servicio
            return Inertia::render('admin/sales/sale-point/sales', [
                'availableProducts' => ProductResource::collection($availableProducts)
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar la página de punto de venta: " . $e->getMessage());
            return Inertia::render('admin/sales/sale-point/sales', [
                'availableProducts' => [],
                'error' => 'No se pudieron cargar los productos disponibles.'
            ])->with('error', 'Error al cargar los productos para la venta.');
        }
    }

    /**
     * Save invoice in DB and process with Hacienda API (simulated).
     *
     * @param HttpRequest $request The HTTP request containing invoice data.
     * @param string $tipoDte The type of DTE (e.g., 'fc', 'ccf').
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveInvoice(HttpRequest $request, string $tipoDte): \Illuminate\Http\RedirectResponse
    {
        try {
            // Validar si es credito fiscal, factura, nota de credito y obtener la URL del esquema
            $schemaUrl = $this->invoiceService->getSchemaUrl($tipoDte);

            // Normalizar valores tipo string 'null', 'true', 'false'
            $rawInput = $request->all();

            // Leer y aplicar normalizador basado en el esquema JSON
            $schemaPath = storage_path($schemaUrl);
            if (!file_exists($schemaPath)) {
                Log::error("Esquema no encontrado para tipoDte: {$tipoDte} en {$schemaPath}");
                return redirect()->back()->with('error', 'Error de configuración: Esquema DTE no encontrado.');
            }
            $schema = json_decode(file_get_contents($schemaPath));
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("Error al decodificar esquema JSON para tipoDte {$tipoDte}: " . json_last_error_msg());
                return redirect()->back()->with('error', 'Error de configuración: Esquema DTE inválido.');
            }

            $normalizer = new SchemaAwareNormalizer();
            $normalized = $normalizer->normalize($rawInput, $schema);

            // Validar estructura con Opis
            $schemaResult = $this->invoiceService->validateWithOpis($normalized);

            if ($schemaResult['estado'] === 'error') {
                Log::warning('❌ Validación Opis fallida:', ['errores' => $schemaResult['errores'], 'payload' => $normalized]);
                return redirect()->back()->with('error', 'Error con el formato de datos enviado, contacte con soporte técnico.');
            }

            // Enviar a API de Hacienda (simulado)
            $response = $this->invoiceService->sendToHaciendaApi($normalized);

            if ($response['estado'] === 'rechazado') {
                Log::warning('🚫 DTE rechazado por Hacienda (simulado):', $response);
                // Aquí podrías guardar el estado como 'rechazada' en el historial si es necesario
                // $response['estado'] = 'rechazada';
            }

            // Guardar venta (incluye el sello de recibido de hacienda si aplica)
            $sales = $this->invoiceService->storeDte($normalized, $response);

            Log::info("Venta finalizada y registrada para código de generación: " . ($sales->codigoGeneracion ?? 'N/A'));
            return redirect()->route('admin.sales')->with('success', 'Venta Finalizada y DTE procesado.');
        } catch (Throwable $e) {
            Log::error("Error al guardar factura: " . $e->getMessage(), ['trace' => $e->getTraceAsString(), 'request_data' => $request->all()]);
            return redirect()->back()->with('error', 'Ocurrió un error inesperado al finalizar la venta.');
        }
    }

    /**
     * Display receiver form.
     *
     * @return \Inertia\Response
     */
    public function receiverForm(): \Inertia\Response
    {
        return Inertia::render('admin/sales/sale-point/receiver');
    }

    /**
     * Display payment method form.
     *
     * @return \Inertia\Response
     */
    public function paymentMethod(): \Inertia\Response
    {
        return Inertia::render('admin/sales/sale-point/payment-method');
    }

    /**
     * Show invoice.
     *
     * @return \Inertia\Response
     */
    public function showInvoice(): \Inertia\Response
    {
        return Inertia::render('admin/sales/sale-point/invoice');
    }

    #endregion

    #region: Sales history

    /**
     * Display the sales history page.
     *
     * @return \Inertia\Response
     */
    public function salesHistory(): \Inertia\Response
    {
        try {
            $historial = SalesHistory::all(); // Considerar paginación para grandes volúmenes de datos
            $salesHistory = SalesHistoryResource::collection($historial);
            return Inertia::render('admin/sales/sales-history', [
                'salesHistory' => $salesHistory
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar el historial de ventas: " . $e->getMessage());
            return Inertia::render('admin/sales/sales-history', [
                'salesHistory' => [],
                'error' => 'No se pudo cargar el historial de ventas en este momento.'
            ])->with('error', 'Error al cargar el historial de ventas.');
        }
    }

    #endregion

    #region: Client Record

    /**
     * Display the client sales record page.
     *
     * @return \Inertia\Response
     */
    public function salesRecord(): \Inertia\Response
    {
        try {
            $clientes = $this->saleService->obtenerTodosLosClientes();
            $clientRecordHistory = ClienteRecordResource::collection($clientes);

            return Inertia::render('admin/sales/sales-record', [
                'clientRecord' => $clientRecordHistory,
            ]);
        } catch (Throwable $e) {
            Log::error("Error al cargar el registro de clientes: " . $e->getMessage());
            return Inertia::render('admin/sales/sales-record', [
                'clientRecord' => [],
                'error' => 'No se pudo cargar el registro de clientes en este momento.'
            ])->with('error', 'Error al cargar el registro de clientes.');
        }
    }
    #endregion
}
