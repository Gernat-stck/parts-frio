<?php

namespace App\Enums;

enum TipoItem: int
{
    case Bienes = 1;
    case Servicios = 2; 
    case Ambos = 3; // Represents both goods and services
    case Otros = 4;
}
