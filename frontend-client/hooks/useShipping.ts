import { useState, useCallback } from 'react';
import { CartDTO } from '@/types/cart.types';
import { Address } from '@/types/user';
import { getAvailableServices, calculateShippingFee } from '@/lib/services/ghn-service';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function useShipping() {
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const calculateTotalShipping = useCallback(async (cart: CartDTO, address: Address) => {
        if (!cart || !cart.items || !address.districtId) {
            return;
        }

        setLoading(true);
        try {
            const DEFAULT_FROM_DISTRICT = 1442;
            const SHOP_ID = 198238;

            const totalWeight = cart.items.reduce((sum, item) => sum + (item.quantity * 200), 0); // Assume 200g per item
            const height = 10;
            const width = 10;
            const length = 10;



            // 1. Get available services
            const services = await getAvailableServices(DEFAULT_FROM_DISTRICT, address.districtId, SHOP_ID);

            if (services.length === 0) {
                logger.warn(`No shipping services available for shop ${SHOP_ID}`);
                setShippingFee(0);
                return;
            }

            // Sort services to prefer "Chuan"
            const sortedServices = [...services].sort((a, b) => {
                if (a.short_name === "Chuan") return -1;
                if (b.short_name === "Chuan") return 1;
                return 0;
            });

            let feeData = null;
            let lastError = null;

            // Try each service until one works
            for (const service of sortedServices) {
                try {
                    // Map items to GHN format
                    const ghnItems = cart.items.map(item => ({
                        name: item.productName,
                        code: item.variantId?.toString(),
                        quantity: item.quantity,
                        price: item.price,
                        length: 10, // Mock dimensions
                        width: 10,
                        height: 10,
                        weight: 200 // Mock weight
                    }));

                    feeData = await calculateShippingFee({
                        service_id: service.service_id,
                        service_type_id: null,
                        insurance_value: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                        coupon: null,
                        to_ward_code: address.wardCode || "",
                        to_district_id: address.districtId,
                        from_district_id: DEFAULT_FROM_DISTRICT,
                        from_ward_code: "21211", // Hardcoded as per request
                        weight: totalWeight,
                        length: length,
                        width: width,
                        height: height,
                        cod_failed_amount: 2000, // Hardcoded as per request
                        items: ghnItems
                    }, SHOP_ID);

                    if (feeData) {
                        break; // Found a working service
                    }
                } catch (e) {
                    logger.warn(`Service ${service.service_id} (${service.short_name}) failed:`, { error: e });
                    lastError = e;
                    continue;
                }
            }

            if (feeData) {
                setShippingFee(feeData.total);
            } else {
                logger.error("All shipping services failed", lastError);
                throw lastError || new Error("No suitable shipping service found");
            }
        } catch (error) {
            logger.error("Failed to calculate shipping:", error);
            toast.error("Failed to calculate shipping fee");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        shippingFee,
        loading,
        calculateTotalShipping
    };
}
