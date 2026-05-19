package com.ecom.common.client;

import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

public class RestClientFactory {

    private RestClientFactory() {
        // Utility class
    }

    public static <T> T createClient(RestClient.Builder builder, String baseUrl, Class<T> clientClass) {
        RestClient restClient = builder.baseUrl(baseUrl).build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(clientClass);
    }
}
