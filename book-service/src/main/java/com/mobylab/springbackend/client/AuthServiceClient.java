package com.mobylab.springbackend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AuthServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${auth-service.base-url}")
    private String authServiceBaseUrl;

    public String getUserEmailById(UUID userId) {
        try {
            return restTemplate.getForObject(
                    authServiceBaseUrl + "/api/v1/users/" + userId + "/email",
                    String.class
            );
        } catch (Exception e) {
            return "unknown@example.com";
        }
    }
}
