// GHN API integration for Vietnamese address selection
import type { ApiResponse, GHNProvince, GHNDistrict, GHNWard } from '@/types/user';

const GHN_API_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const GHN_TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN || '';

/**
 * Get all Vietnamese provinces from GHN API
 */
export async function getProvinces(): Promise<GHNProvince[]> {
    try {
        const response = await fetch(`${GHN_API_BASE_URL}/province`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': GHN_TOKEN,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch provinces');
        }

        const data: ApiResponse<GHNProvince[]> = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw new Error('Unable to load provinces. Please try again later.');
    }
}

/**
 * Get districts for a specific province from GHN API
 * @param provinceId - GHN Province ID
 */
export async function getDistricts(provinceId: number): Promise<GHNDistrict[]> {
    try {
        const response = await fetch(`${GHN_API_BASE_URL}/district?province_id=${provinceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': GHN_TOKEN,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch districts');
        }

        const data: ApiResponse<GHNDistrict[]> = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw new Error('Unable to load districts. Please try again later.');
    }
}

/**
 * Get wards for a specific district from GHN API
 * @param districtId - GHN District ID
 */
export async function getWards(districtId: number): Promise<GHNWard[]> {
    try {
        const response = await fetch(`${GHN_API_BASE_URL}/ward?district_id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': GHN_TOKEN,
            },
            body: JSON.stringify({ district_id: districtId }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch wards');
        }

        const data: ApiResponse<GHNWard[]> = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw new Error('Unable to load wards. Please try again later.');
    }
}
