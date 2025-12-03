import axios from 'axios';
import type { GHNProvince, GHNDistrict, GHNWard, GHNService, GHNFeeRequest, GHNFeeResponse } from '@/types/user';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errors';

interface GHNResponse<T> {
    code: number;
    message: string;
    data: T;
}

const GHN_API_BASE_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const GHN_API_ORDER_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order";
const GHN_TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN || '';

const ghnClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'token': GHN_TOKEN,
    },
});

/**
 * Get all Vietnamese provinces from GHN API
 */
export async function getProvinces(): Promise<GHNProvince[]> {
    try {
        const response = await ghnClient.get<GHNResponse<GHNProvince[]>>(`${GHN_API_BASE_URL}/province`);
        return response.data.data || [];
    } catch (error) {
        logger.error('Error fetching provinces:', error);
        throw handleError(error);
    }
}

/**
 * Get districts for a specific province from GHN API
 * @param provinceId - GHN Province ID
 */
export async function getDistricts(provinceId: number): Promise<GHNDistrict[]> {
    try {
        const response = await ghnClient.get<GHNResponse<GHNDistrict[]>>(`${GHN_API_BASE_URL}/district`, {
            params: { province_id: provinceId }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error('Error fetching districts:', error);
        throw handleError(error);
    }
}

/**
 * Get wards for a specific district from GHN API
 * @param districtId - GHN District ID
 */
export async function getWards(districtId: number): Promise<GHNWard[]> {
    try {
        // GHN API for ward usually accepts post body or query params depending on version, 
        // original code used POST with body { district_id: districtId } to `${GHN_API_BASE_URL}/ward?district_id`
        // which looks a bit weird (query param key but no value, and body). 
        // Let's stick to the original logic but use axios.
        // Actually, looking at the original code:
        // fetch(`${GHN_API_BASE_URL}/ward?district_id`, { method: 'POST', body: ... })
        // It seems it might be a typo in the original code or a specific API requirement.
        // Standard GHN API usually uses GET /master-data/ward?district_id={id} OR POST with body.
        // Let's assume the original code was working and replicate the behavior: POST request.

        const response = await ghnClient.post<GHNResponse<GHNWard[]>>(`${GHN_API_BASE_URL}/ward`, {
            district_id: districtId
        });
        return response.data.data || [];
    } catch (error) {
        logger.error('Error fetching wards:', error);
        throw handleError(error);
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
        const response = await ghnClient.post<GHNResponse<GHNService[]>>(`${GHN_API_ORDER_URL}/available-services`, {
            shop_id: shopId,
            from_district: fromDistrict,
            to_district: toDistrict
        });
        return response.data.data || [];
    } catch (error) {
        logger.error('Error fetching services:', error);
        throw handleError(error);
    }
}

/**
 * Calculate shipping fee
 * @param params - Fee calculation parameters
 * @param shopId - Shop ID
 */
export async function calculateShippingFee(params: GHNFeeRequest, shopId: number): Promise<GHNFeeResponse> {
    try {
        const response = await ghnClient.post<GHNResponse<GHNFeeResponse>>(`${GHN_API_ORDER_URL}/fee`, params, {
            headers: {
                'shop_id': shopId.toString()
            }
        });
        return response.data.data;
    } catch (error) {
        logger.error('Error calculating fee:', error);
        if (axios.isAxiosError(error) && error.response) {
            // The original code threw errorData.message
            const errorData = error.response.data as any;
            throw handleError(new Error(errorData.message || 'Failed to calculate shipping fee'));
        }
        throw handleError(error);
    }
}
