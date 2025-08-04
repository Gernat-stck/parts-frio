import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
};
export function useFlashMessage() {
    const { flash } = usePage().props as Props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        if (flash?.info) {
            toast.info(flash.info);
        }

        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);
}
