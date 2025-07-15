<?php

// app/DTOs/DteFacturaDTO.php

namespace App\DTOs;

class IdentificacionDTO
{
    public int $version;
    public string $ambiente;
    public string $tipoDte;
    public string $numeroControl;
    public string $codigoGeneracion;
    public int $tipoModelo;
    public int $tipoOperacion;
    public ?int $tipoContingencia;
    public ?string $motivoContin;
    public string $fecEmi;
    public string $horEmi;
    public string $tipoMoneda;
}

class EmisorDTO
{
    public string $nit;
    public string $nrc;
    public string $nombre;
    public string $nombreComercial;
    public string $codActividad;
    public string $descActividad;
    public string $tipoEstablecimiento;
    public string $telefono;
    public string $correo;
    public string $codEstableMH;
    public string $codEstable;
    public string $codPuntoVentaMH;
    public string $codPuntoVenta;
    public DireccionDTO $direccion;
}

class ItemDTO
{
    public int $numItem;
    public int $tipoItem;
    public ?string $numeroDocumento;
    public ?string $codTributo;
    public string $codigo;
    public string $descripcion;
    public float $cantidad;
    public int $uniMedida;
    public float $precioUni;
    public float $montoDescu;
    public float $ventaNoSuj;
    public float $ventaExenta;
    public float $ventaGravada;
    public ?array $tributos;
    public float $psv;
    public float $noGravado;
    public float $ivaItem;
}
class ResumenDTO
{
    public float $totalVenta;
    public float $totalDescuentos;
    public float $totalVentaNoSuj;
    public float $totalVentaExenta;
    public float $totalVentaGravada;
    public float $totalVentaGravada0;
    public float $totalVentaGravada12;
    public float $totalIva;
    public float $totalOtrosCargos;
    public float $totalOtrosCargosNoGravados;
}
class ReceptorDTO
{
    public string $nit;
    public string $nrc;
    public string $nombre;
    public ?string $nombreComercial;
    public ?string $telefono;
    public ?string $correo;
    public DireccionDTO $direccion;
}
class DireccionDTO
{
    public string $departamento;
    public string $municipio;
    public ?string $complemento;
}
class ExtensionDTO
{
    public ?string $codigoSeguridad;
    public ?string $codigoSeguridad2;
    public ?string $codigoSeguridad3;
    public ?string $codigoSeguridad4;
    public ?string $codigoSeguridad5;
}
class DocumentoRelacionadoDTO
{
    public string $tipoDte;
    public string $numeroControl;
    public string $codigoGeneracion;
    public ?string $motivoContin;
    public string $fecEmi;
    public string $horEmi;
    public string $tipoMoneda;
}
class VentaTerceroDTO
{
    public string $nit;
    public string $nrc;
    public string $nombre;
    public ?string $nombreComercial;
    public ?string $telefono;
    public ?string $correo;
    public DireccionDTO $direccion;
}
class DteFacturaDTO
{
    public IdentificacionDTO $identificacion;
    public ?array $documentoRelacionado; // Puede ser array de DocumentoRelacionadoDTO
    public ?array $otrosDocumentos;
    public ?VentaTerceroDTO $ventaTercero;
    public EmisorDTO $emisor;
    public ReceptorDTO $receptor;
    public ?ExtensionDTO $extension;
    public array $cuerpoDocumento; // array de ItemDTO
    public ResumenDTO $resumen;
    public array $apendice; // array de ApendiceDTO
    public ?string $firmaElectronica;
    public ?string $selloRecibido;
}
