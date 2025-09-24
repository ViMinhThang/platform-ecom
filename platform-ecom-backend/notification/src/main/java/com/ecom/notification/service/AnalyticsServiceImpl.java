package com.ecom.notification.service;

import com.ecom.notification.client.OrderServiceClient;
import com.ecom.notification.client.ProductServiceClient;
import com.ecom.notification.dtos.AnalyticsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsServiceImpl implements AnalyticsService{


    @Autowired
    ProductServiceClient productServiceClient;

    @Autowired
    OrderServiceClient orderServiceClient;

    @Override
    public AnalyticsResponse getAnalyticsData() {
        AnalyticsResponse response = new AnalyticsResponse();

        long productCount = productServiceClient.getProductCount().getBody();
        long totalOrders = orderServiceClient.getCountOrders().getBody();;
        Double totalRevenue = orderServiceClient.getTotalRevenue().getBody();

        response.setProductCount(String.valueOf(productCount));
        response.setTotalOrders(String.valueOf(totalOrders));
        response.setTotalRevenue(String.valueOf(totalRevenue != null ? totalRevenue : 0));
        return response;
    }
}
