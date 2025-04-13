package com.mobylab.springbackend.service;

import com.mobylab.springbackend.client.*;
import com.mobylab.springbackend.entity.*;
import com.mobylab.springbackend.repository.*;
import com.mobylab.springbackend.service.dto.CreateOfferFromContextDto;
import com.mobylab.springbackend.service.dto.OfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.stream.Collectors;
import java.util.*;

@Service
public class OfferService {

    @Autowired private OfferRepository offerRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private OfferedBookRepository offeredBookRepository;
    @Autowired private EmailService emailService;
    @Autowired private BookService bookService;

    @Autowired
    private AuthServiceClient authServiceClient;

    public OfferService(OfferRepository offerRepository, AuthServiceClient authServiceClient) {
        this.offerRepository = offerRepository;
        this.authServiceClient = authServiceClient;
    }

    public OfferDto createFromAuthenticatedUser(CreateOfferFromContextDto dto, UUID senderId, UUID receiverId) {
        List<UUID> offeredBooks = resolveBookIdsFromTitles(dto.getOfferedBookTitles(), senderId);
        List<UUID> requestedBooks = resolveBookIdsFromTitles(dto.getRequestedBookTitles(), receiverId);

        return createOffer(senderId, receiverId, offeredBooks, requestedBooks);
    }


    public OfferDto createOffer(UUID senderId, UUID receiverId, List<UUID> offeredBookIds, List<UUID> requestedBookIds) {
        Offer offer = new Offer();
        offer.setSenderId(senderId);
        offer.setReceiverId(receiverId);
        offer.setStatus("PENDING");
        offer = offerRepository.save(offer);

        saveBooksForOffer(offer, offeredBookIds, true);
        saveBooksForOffer(offer, requestedBookIds, false);

        return toDto(offer);
    }


    public List<OfferDto> getOffersReceivedByUserId(UUID userId) {
        List<Offer> offers = offerRepository.findAll();
        List<OfferDto> result = new ArrayList<>();

        for (Offer offer : offers) {
            if (offer.getReceiverId().equals(userId)) {
                result.add(toDto(offer));
            }
        }

        return result;
    }

    public List<OfferDto> getAllOffers() {
        return offerRepository.findAll().stream().map(offer -> {
            OfferDto dto = new OfferDto();
            dto.setId(offer.getId());
            dto.setStatus(offer.getStatus());

            dto.setSenderEmail(authServiceClient.getUserEmailById(offer.getSenderId()));
            dto.setReceiverEmail(authServiceClient.getUserEmailById(offer.getReceiverId()));

            dto.setOfferedBookTitles(
                    offer.getOfferedBooks().stream()
                            .map(ob -> ob.getBook().getTitle())
                            .toList()
            );
            dto.setRequestedBookTitles(
                    offer.getOfferedBooks().stream()
                            .filter(OfferedBook::isRequested)
                            .map(rb -> rb.getBook().getTitle())
                            .toList()
            );

            return dto;
        }).toList();
    }


    private OfferDto deleteBooksFromOffer(Offer offer) {
        OfferDto offerDto = toDto(offer);
        for (OfferedBook ob : offer.getOfferedBooks()) {
            Book book = ob.getBook();
            bookService.deleteBookById(book.getId());
        }
        return offerDto;
    }

    public OfferDto respondToOffer(UUID offerId, String newStatus, UUID userId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!userId.equals(offer.getReceiverId()) && !userId.equals(offer.getSenderId())) {
            throw new RuntimeException("You are not authorized to respond to this offer.");
        }

        offer.setStatus(newStatus);
        offerRepository.save(offer);

        if (userId.equals(offer.getReceiverId())) {
            if ("ACCEPTED".equalsIgnoreCase(newStatus) || "OK".equalsIgnoreCase(newStatus)) {
                emailService.sendEmail("sender@example.com", "Oferta acceptata!", "Felicitări!");
                return swapBooks(offer);
            } else if ("REJECTED".equalsIgnoreCase(newStatus) || "NO".equalsIgnoreCase(newStatus)) {
                emailService.sendEmail("sender@example.com", "Oferta respinsă!", "Ne pare rău!");
                return deleteBooksFromOffer(offer);
            }
        }

        if (userId.equals(offer.getSenderId()) && "CANCEL".equalsIgnoreCase(newStatus)) {
            return deleteBooksFromOffer(offer);
        }

        return toDto(offer);
    }



    private List<UUID> resolveBookIdsFromTitles(List<String> titles, UUID ownerId) {
        return titles.stream()
                .flatMap(t -> Arrays.stream(t.split(",")))
                .map(String::trim)
                .map(title -> bookRepository.getBooksByTitle(title)
                        .orElseThrow(() -> new RuntimeException("Book not found: " + title)))
                .flatMap(List::stream)
                .filter(book -> book.getOwnerId() != null && book.getOwnerId().equals(ownerId))
                .map(Book::getId)
                .toList();
    }


    private void saveBooksForOffer(Offer offer, List<UUID> bookIds, boolean isRequested) {
        for (UUID bookId : bookIds) {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            OfferedBook offerBook = new OfferedBook();
            offerBook.setOffer(offer);
            offerBook.setBook(book);
            offerBook.setRequested(!isRequested);

            offer.getOfferedBooks().add(offerBook);

            offeredBookRepository.save(offerBook);
        }
    }


    public List<OfferDto> getOffersReceivedByEmail(String email) {
        UUID userId = authServiceClient.getUserIdByEmail(email);
        return getOffersReceivedByUserId(userId);
    }

    public OfferDto respondToOffer(UUID offerId, String newStatus, String email) {
        UUID userId = authServiceClient.getUserIdByEmail(email);
        return respondToOffer(offerId, newStatus, userId);
    }

    private OfferDto toDto(Offer offer) {
        OfferDto dto = new OfferDto();
        dto.setId(offer.getId());
        dto.setSenderEmail(authServiceClient.getUserEmailById(offer.getSenderId()));
        dto.setReceiverEmail(authServiceClient.getUserEmailById(offer.getReceiverId()));
        dto.setStatus(offer.getStatus());

        List<String> offered = offer.getOfferedBooks().stream()
                .filter(b -> !b.isRequested())
                .map(ob -> ob.getBook().getTitle())
                .toList();

        List<String> requested = offer.getOfferedBooks().stream()
                .filter(OfferedBook::isRequested)
                .map(rb -> rb.getBook().getTitle())
                .toList();

        dto.setOfferedBookTitles(offered);
        dto.setRequestedBookTitles(requested);

        return dto;
    }

    private OfferDto swapBooks(Offer offer) {
        UUID senderId = offer.getSenderId();
        UUID receiverId = offer.getReceiverId();

        for (OfferedBook ob : offer.getOfferedBooks()) {
            Book book = ob.getBook();

            if (ob.isRequested()) {
                // Book originally belonged to receiver -> send to sender
                bookService.transferOwnership(book.getId(), senderId);
            } else {
                // Book originally belonged to sender -> send to receiver
                bookService.transferOwnership(book.getId(), receiverId);
            }
        }

        offer.setStatus("COMPLETED");
        offerRepository.save(offer);

        return toDto(offer);
    }

}
