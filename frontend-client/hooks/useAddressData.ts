import { useState, useEffect } from 'react';
import { GHNProvince, GHNDistrict, GHNWard } from '@/types/user';
import { getProvinces, getDistricts, getWards } from '@/lib/services/ghn-service';
import { toast } from 'sonner';

/**
 * Custom hook for managing GHN API address data (provinces, districts, wards).
 * Follows Single Responsibility Principle by handling only address data fetching.
 * 
 * @param provinceId - Selected province ID to fetch districts
 * @param districtId - Selected district ID to fetch wards
 * @returns Object containing address data, loading states, and helper functions
 * 
 * @example
 * const { provinces, districts, wards, loadingProvinces } = useAddressData(
 *   form.watch('provinceId'),
 *   form.watch('districtId')
 * );
 */
export function useAddressData(provinceId?: number, districtId?: number) {
    const [provinces, setProvinces] = useState<GHNProvince[]>([]);
    const [districts, setDistricts] = useState<GHNDistrict[]>([]);
    const [wards, setWards] = useState<GHNWard[]>([]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Load provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                toast.error('Failed to load provinces');
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (!provinceId) {
            setDistricts([]);
            return;
        }

        const loadDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const data = await getDistricts(provinceId);
                setDistricts(data);
            } catch (error) {
                toast.error('Failed to load districts');
            } finally {
                setLoadingDistricts(false);
            }
        };
        loadDistricts();
    }, [provinceId]);

    // Load wards when district changes
    useEffect(() => {
        if (!districtId) {
            setWards([]);
            return;
        }

        const loadWards = async () => {
            setLoadingWards(true);
            try {
                const data = await getWards(districtId);
                setWards(data);
            } catch (error) {
                toast.error('Failed to load wards');
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [districtId]);

    return {
        provinces,
        districts,
        wards,
        loadingProvinces,
        loadingDistricts,
        loadingWards,
    };
}
