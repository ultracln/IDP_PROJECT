package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.OfferService;
import com.mobylab.springbackend.service.dto.CreateOfferFromContextDto;
import com.mobylab.springbackend.service.dto.OfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/offers")
public class OfferController implements SecuredRestController {

    @Autowired
    private OfferService offerService;

    @GetMapping("/received/me")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public List<OfferDto> getOffersReceivedByAuthenticatedUser(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        return offerService.getOffersReceivedByUserId(userId);
    }

    @GetMapping("/received")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OfferDto> getOffersReceived(@RequestParam String userId) {
        return offerService.getOffersReceivedByUserId(UUID.fromString(userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('USER')")
    public OfferDto respondToOffer(@PathVariable UUID id, @RequestParam String status,
                                   Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        return offerService.respondToOffer(id, status, userId);
    }

    @PostMapping("/me")
    @PreAuthorize("hasAuthority('USER')")
    public OfferDto createOfferFromAuthenticatedUser(
            @RequestBody CreateOfferFromContextDto dto,
            Principal principal) {

        UUID senderId = UUID.fromString(principal.getName());
        UUID receiverId = UUID.fromString(dto.getReceiverId());

        return offerService.createFromAuthenticatedUser(dto, senderId, receiverId);
    }
}
