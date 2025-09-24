package com.ecom.notification.controller;


import com.ecom.notification.aspect.RequireRole;
import com.ecom.notification.dtos.AnalyticsResponse;
import com.ecom.notification.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {


    @Autowired
    private AnalyticsService analyticsService;


    @GetMapping("/admin/app/analytics")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        AnalyticsResponse response = analyticsService.getAnalyticsData();
        return new ResponseEntity<AnalyticsResponse>(response, HttpStatus.OK);
    }
}
