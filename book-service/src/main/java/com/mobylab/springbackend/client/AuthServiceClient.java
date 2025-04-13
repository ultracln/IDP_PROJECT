package com.mobylab.springbackend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.servlet.http.HttpServletRequest;


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
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", getCurrentToken());
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    authServiceBaseUrl + "/api/v1/auth/users/" + userId + "/email",
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return response.getBody();
        } catch (Exception e) {
            return "unknown@example.com";
        }
    }


    private String getCurrentToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user in security context");
        }

        // Try to extract from credentials
        if (authentication.getCredentials() instanceof String token) {
            return "Bearer " + token;
        }

        // Try from Principal
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            // Fallback: try reading from headers via RequestContextHolder
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                return header;
            }
        }

        throw new RuntimeException("Could not extract JWT token");
    }


}
