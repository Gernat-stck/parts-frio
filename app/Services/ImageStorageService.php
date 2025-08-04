<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // Importar Log
use Illuminate\Support\Str;
use Throwable;

class ImageStorageService
{
    protected string $disk;

    public function __construct()
    {
        // Usa el disco configurado en .env (FILESYSTEM_DISK)
        $this->disk = config('filesystems.default', 'public');
    }

    /**
     * Guarda la imagen del producto en el disco configurado y devuelve la URL pública.
     *
     * @param UploadedFile $image El archivo de imagen a almacenar.
     * @return string La URL pública de la imagen almacenada.
     * @throws \Exception Si el archivo no es válido o ocurre un error al almacenar.
     */
    public function storeProductImage(UploadedFile $image): string
    {
        if (!$image->isValid()) {
            Log::error("Archivo de imagen inválido proporcionado.");
            throw new \InvalidArgumentException("El archivo de imagen proporcionado no es válido.");
        }

        try {
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('products', $filename, $this->disk);

            if (!$path) {
                throw new \Exception("No se pudo almacenar la imagen en el disco '{$this->disk}'.");
            }
            Log::info("Imagen de producto almacenada: {$path}");
            return $this->getImageUrl($path);
        } catch (Throwable $e) {
            Log::error("Error al almacenar la imagen del producto: " . $e->getMessage());
            throw new \Exception("Error al almacenar la imagen: " . $e->getMessage());
        }
    }

    /**
     * Devuelve la URL pública de una imagen almacenada.
     *
     * @param string $path La ruta relativa de la imagen dentro del disco.
     * @return string La URL pública completa de la imagen.
     */
    public function getImageUrl(string $path): string
    {
        try {
            return Storage::disk($this->disk)->url($path);
        } catch (Throwable $e) {
            Log::error("Error al obtener la URL de la imagen para la ruta '{$path}': " . $e->getMessage());
            // Dependiendo del contexto, se podría devolver una URL de placeholder o lanzar una excepción.
            return ''; // Devolver cadena vacía o URL de fallback
        }
    }

    /**
     * Elimina una imagen del almacenamiento.
     *
     * @param string $path La ruta relativa de la imagen a eliminar.
     * @return bool True si la imagen fue eliminada, false de lo contrario.
     */
    public function deleteImage(string $path): bool
    {
        try {
            if (Storage::disk($this->disk)->exists($path)) {
                $deleted = Storage::disk($this->disk)->delete($path);
                if ($deleted) {
                    Log::info("Imagen eliminada exitosamente: {$path}");
                } else {
                    Log::warning("No se pudo eliminar la imagen: {$path}. Posiblemente permisos o ya no existe.");
                }
                return $deleted;
            }
            Log::info("Intento de eliminar imagen que no existe: {$path}");
            return false;
        } catch (Throwable $e) {
            Log::error("Error al eliminar la imagen '{$path}': " . $e->getMessage());
            return false;
        }
    }

    /**
     * Guarda la imagen y devuelve el path relativo (por ejemplo, para guardar en la base de datos).
     *
     * @param UploadedFile $image El archivo de imagen a almacenar.
     * @return string La ruta relativa de la imagen dentro del disco.
     * @throws \Exception Si el archivo no es válido o ocurre un error al almacenar.
     */
    public function storeAndGetPath(UploadedFile $image): string
    {
        if (!$image->isValid()) {
            Log::error("Archivo de imagen inválido proporcionado en storeAndGetPath.");
            throw new \InvalidArgumentException("El archivo de imagen proporcionado no es válido.");
        }

        try {
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('products', $filename, $this->disk);

            if (!$path) {
                throw new \Exception("No se pudo almacenar la imagen y obtener la ruta.");
            }
            Log::info("Imagen de producto almacenada (solo path): {$path}");
            return $path;
        } catch (Throwable $e) {
            Log::error("Error al almacenar la imagen y obtener la ruta: " . $e->getMessage());
            throw new \Exception("Error al almacenar la imagen y obtener la ruta: " . $e->getMessage());
        }
    }
}
