<?php

namespace App\Enums;

enum TipoContingencia: int
{
    case ProblemaMH = 1; //Problema de Hacienda
    case ProblemaEM = 2;    // Problema de Mantenimiento en el Emisor
    case FallaInternetEM = 3;   // Falla de Internet en el Emisor
    case FallaElectricaEM = 4; // Falla Electrica en el Emisor
    case Otro = 5; // Representa cualquier otro tipo de contingencia no especificado
}
