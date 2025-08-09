<?php

if (!function_exists('hacienda_url')) {
    /**
     * Construye una URL completa para los servicios de Hacienda.
     *
     * @param string $path Ruta relativa del endpoint (ej. '/auth', 'recepcion/firmar')
     * @return string URL completa
     */
    function hacienda_url(string $path): string
    {
        $baseUrl = config('services.hacienda.urlBase');
        return rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
    }
}
/**
 * Version extendida para moodulos extendidos 
 *  function hacienda_url(string $path, ?string $module = null): string
 *  {
 *    $baseUrl = config('services.hacienda.base_url');
 *
 *    if ($module) {
 *        $baseUrl .= '/' . trim($module, '/');
 *    }
 *
 *    return rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
 *}
 */
