package com.mobylab.springbackend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
public class AuthServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${auth-service.base-url}")
    private String authServiceBaseUrl;

    public UUID getUserIdByEmail(String email) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", getCurrentToken());
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<UUID> response = restTemplate.exchange(
                    authServiceBaseUrl + "/api/v1/auth/users/email/" + email + "/id",
                    HttpMethod.GET,
                    entity,
                    UUID.class
            );

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Could not fetch user ID by email", e);
        }
    }

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

    private String getCurrentToken() {
        Object credentials = SecurityContextHolder.getContext().getAuthentication().getCredentials();
        if (credentials instanceof String token) {
            return "Bearer " + token;
        }
        throw new RuntimeException("No JWT token found in security context");
    }

}
