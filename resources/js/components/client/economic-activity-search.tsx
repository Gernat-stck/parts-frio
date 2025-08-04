'use client';

import type React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ECONOMIC_ACTIVITIES } from '@/constants/salesConstants';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    codActividad?: string | null;
    descActividad?: string | null;
    onSelect: (value: string, label: string) => void;
    error?: string;
}

export default function EconomicActivitySearch({ codActividad, descActividad, onSelect, error }: Props) {
    const [query, setQuery] = useState('');
    const [hasSelected, setHasSelected] = useState(false);

    useEffect(() => {
        if (codActividad && descActividad) {
            setQuery(`${codActividad} - ${descActividad}`);
            setHasSelected(true);
        }
    }, [codActividad, descActividad]);

    const filtered = ECONOMIC_ACTIVITIES.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.value.includes(query));

    const clearSelection = () => {
        setQuery('');
        setHasSelected(false);
        onSelect('', '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);

        // Si el usuario está escribiendo, resetear la selección
        if (hasSelected) {
            setHasSelected(false);
            onSelect('', '');
        }
    };

    return (
        <div className="relative space-y-2">
            <Label htmlFor="actividadEconomica" className="text-sm font-medium">
                Actividad Económica *
            </Label>
            <div className="relative">
                <Input
                    id="actividadEconomica"
                    value={query}
                    onChange={handleChange}
                    placeholder="Buscar por código o descripción"
                    className={`pr-10 ${error ? 'border-red-500' : ''}`}
                />
                {query && (
                    <button
                        type="button"
                        onClick={clearSelection}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Limpiar selección"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {!hasSelected && query && (
                <ul className="z-10 mt-2 max-h-40 overflow-auto rounded border  shadow-lg">
                    {filtered.length > 0 ? (
                        filtered.map((item) => (
                            <li
                                key={item.value}
                                className="cursor-pointer border-b px-3 py-2 last:border-b-0"
                                onClick={() => {
                                    onSelect(item.value, item.label);
                                    setQuery(`${item.value} - ${item.label}`);
                                    setHasSelected(true);
                                }}
                            >
                                <strong>{item.value}</strong> - {item.label}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-sm text-gray-500">Sin coincidencias</li>
                    )}
                </ul>
            )}
        </div>
    );
}
