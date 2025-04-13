package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.client.AuthServiceClient;
import com.mobylab.springbackend.service.OfferService;
import com.mobylab.springbackend.service.dto.CreateOfferFromContextDto;
import com.mobylab.springbackend.service.dto.OfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/offers")
public class OfferController implements SecuredRestController {

    @Autowired private OfferService offerService;
    @Autowired private AuthServiceClient authServiceClient;

    @GetMapping("/received/me")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public List<OfferDto> getOffersReceivedByAuthenticatedUser(Principal principal) {
        String email = principal.getName();
        return offerService.getOffersReceivedByEmail(email);
    }

    @GetMapping("/received")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<OfferDto> getOffersReceived(@RequestParam String userId) {
        return offerService.getOffersReceivedByUserId(UUID.fromString(userId));
    }

    @GetMapping("/offers")
    public ResponseEntity<List<OfferDto>> getOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public OfferDto respondToOffer(@PathVariable UUID id, @RequestParam String status,
                                   Principal principal) {
        String email = principal.getName();
        return offerService.respondToOffer(id, status, email);
    }

    @PostMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public OfferDto createOfferFromAuthenticatedUser(
            @RequestBody CreateOfferFromContextDto dto,
            Principal principal) {

        String senderEmail = principal.getName();
        UUID senderId = authServiceClient.getUserIdByEmail(senderEmail);
        UUID receiverId = UUID.fromString(dto.getReceiverId());

        return offerService.createFromAuthenticatedUser(dto, senderId, receiverId);
    }
}
