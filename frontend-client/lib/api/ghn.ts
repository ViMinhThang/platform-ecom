// GHN API integration for Vietnamese address selection
import type { GHNProvince, GHNDistrict, GHNWard, GHNService, GHNFeeRequest, GHNFeeResponse } from '@/types/user';

interface GHNResponse<T> {
    code: number;
    message: string;
    data: T;
}

const GHN_API_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const GHN_API_ORDER_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order";
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

        const data: GHNResponse<GHNProvince[]> = await response.json();
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

        const data: GHNResponse<GHNDistrict[]> = await response.json();
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

        const data: GHNResponse<GHNWard[]> = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching wards:', error);
        throw new Error('Unable to load wards. Please try again later.');
    }
}

/**
 * Get available shipping services
 * @param fromDistrict - Sender district ID
 * @param toDistrict - Receiver district ID
 * @param shopId - Shop ID
 */
export async function getAvailableServices(fromDistrict: number, toDistrict: number, shopId: number): Promise<GHNService[]> {
    try {
        const response = await fetch(`${GHN_API_ORDER_URL}/available-services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': GHN_TOKEN,
            },
            body: JSON.stringify({
                shop_id: shopId,
                from_district: fromDistrict,
                to_district: toDistrict
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }

        const data: GHNResponse<GHNService[]> = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching services:', error);
        throw new Error('Unable to load shipping services.');
    }
}

/**
 * Calculate shipping fee
 * @param params - Fee calculation parameters
 * @param shopId - Shop ID
 */
export async function calculateShippingFee(params: GHNFeeRequest, shopId: number): Promise<GHNFeeResponse> {
    try {
        const response = await fetch(`${GHN_API_ORDER_URL}/fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': GHN_TOKEN,
                'shop_id': shopId.toString()
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GHN Fee Error:', errorData);
            throw new Error(errorData.message || 'Failed to calculate shipping fee');
        }

        const data: GHNResponse<GHNFeeResponse> = await response.json();
        return data.data!;
    } catch (error) {
        console.error('Error calculating fee:', error);
        throw error;
    }
}
