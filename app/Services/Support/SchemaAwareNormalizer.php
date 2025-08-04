<?php

namespace App\Services\Support;

class SchemaAwareNormalizer
{
    /**
     * Normaliza un payload con base en su esquema JSON.
     */
    public function normalize(array $payload, object $schema): array
    {
        // 🔁 Primera pasada: convertir cualquier "null" (string) en null real
        $payload = $this->deepNullify($payload);

        // ⚙️ Aplicar normalización basada en esquema
        return $this->transform($payload, $schema->properties ?? new \stdClass());
    }

    /**
     * Aplica transformaciones recursivas según el esquema.
     */
    private function transform(array $data, object $schemaProps): array
    {
        foreach ($schemaProps as $key => $expected) {
            if (!array_key_exists($key, $data)) continue;

            $value = $data[$key];

            // 🔄 Si es un array
            if (is_array($value) && isset($expected->type) && $this->isType($expected->type, 'array') && isset($expected->items)) {
                $itemSchema = $expected->items;

                $data[$key] = array_map(function ($item) use ($itemSchema) {
                    return is_array($item)
                        ? $this->transform($item, $itemSchema->properties ?? new \stdClass())
                        : $this->cast($item, $itemSchema->type ?? null);
                }, $value);

                continue;
            }

            // 🧩 Si es un objeto
            if (is_array($value) && isset($expected->type) && $this->isType($expected->type, 'object')) {
                $data[$key] = $this->transform($value, $expected->properties ?? new \stdClass());
                continue;
            }

            // 🔤 Si es valor simple
            $data[$key] = $this->cast($value, $expected->type ?? null);
        }

        return $data;
    }

    /**
     * Convierte cualquier "null" (string) en null real antes de normalizar.
     */
    private function deepNullify(mixed $input): mixed
    {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                $input[$key] = $this->deepNullify($value);
            }
            return $input;
        }

        if (is_string($input) && strtolower(trim($input)) === 'null') {
            return null;
        }

        return $input;
    }
    /**
     * Formateador de decximales
     */
    private function formatNumber(float $value): float
    {
        // 🧪 Convertimos a string con 8 decimales y devolvemos como float
        return (float) number_format($value, 8, '.', '');
    }
    /**
     * Realiza casting de valores string según el tipo esperado.
     */
    private function cast($value, $type): mixed
    {
        if (!is_string($value)) {
            // 🧮 Aseguramos precisión si es float
            if ($this->isType($type, 'number') && is_float($value)) {
                return $this->formatNumber($value);
            }
            return $value;
        }

        // 🎯 Tipo dominante si es array
        if (is_array($type)) {
            $type = array_values(array_diff($type, ['null']))[0] ?? 'string';
        }

        $lower = strtolower(trim($value));

        return match ($type) {
            'null'    => $lower === 'null' ? null : $value,
            'boolean' => $lower === 'true' ? true : ($lower === 'false' ? false : $value),
            'integer' => ctype_digit($value) ? (int) $value : $value,
            'number'  => is_numeric($value) ? $this->formatNumber((float)$value) : $value,
            default   => $value,
        };
    }
    /**
     * Verifica si el tipo esperado coincide con el deseado.
     */
    private function isType($schemaType, string $target): bool
    {
        return is_array($schemaType)
            ? in_array($target, $schemaType)
            : $schemaType === $target;
    }
}
