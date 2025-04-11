package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.*;
import com.mobylab.springbackend.repository.*;
import com.mobylab.springbackend.service.dto.CreateOfferFromContextDto;
import com.mobylab.springbackend.service.dto.OfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OfferService {

    @Autowired private OfferRepository offerRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private OfferedBookRepository offeredBookRepository;
//    @Autowired private RequestedBookRepository requestedBookRepository;
    @Autowired private EmailService emailService;
    @Autowired private BookServie bookServie;
    public OfferDto createFromAuthenticatedUser(CreateOfferFromContextDto dto, String email) {
        User sender = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findUserByEmail(dto.getReceiverEmail())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        List<UUID> offeredBooks = resolveBookIdsFromTitles(dto.getOfferedBookTitles(), sender.getId());
        List<UUID> requestedBooks = resolveBookIdsFromTitles(dto.getRequestedBookTitles(), receiver.getId());

        return createOffer(sender, receiver, offeredBooks, requestedBooks);
    }

    public OfferDto createOffer(User sender, User receiver, List<UUID> offeredBookIds, List<UUID> requestedBookIds) {
        Offer offer = new Offer();
        offer.setSender(sender);
        offer.setReceiver(receiver);
        offer.setStatus("PENDING");
        offer = offerRepository.save(offer);

        saveBooksForOffer(offer, offeredBookIds, true);
        saveBooksForOffer(offer, requestedBookIds, false);

        return toDto(offer);
    }

    public List<OfferDto> getOffersReceivedByName(String username) {
        User user = userRepository.findUserByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Offer> offers = offerRepository.findAllWithDetails();
        List<OfferDto> result = new ArrayList<>();

        for (Offer offer : offers) {
            if (offer.getReceiver().getId().equals(user.getId())) {
                result.add(toDto(offer));
            }
        }

        return result;
    }

    private OfferDto deleteBooksFromOffer(Offer offer) {
        OfferDto offerDto = toDto(offer);
//        Set<OfferedBook> offeredsBooks = offer.getOfferedBooks();
//        Set<OfferedBook> requestedBooks = offer.getRequestedBooks();
//        for (OfferedBook offered : offeredsBooks) {
//            Book book = offered.getBook();
//            bookServie.deleteBookByTitleAndOwner(book.getTitle(), book.getOwner().getEmail());
//        }
//
//        for (OfferedBook requested : requestedBooks) {
//            Book book = requested.getBook();
//            bookServie.deleteBookByTitleAndOwner(book.getTitle(), book.getOwner().getEmail());
//        }
        for (OfferedBook ob : offer.getOfferedBooks()) {
            Book book = ob.getBook();
            bookServie.deleteBookByTitleAndOwner(book.getTitle(), book.getOwner().getEmail());
        }
        return offerDto;
    }


    public OfferDto respondToOffer(UUID offerId, String newStatus, String username) {
        Offer offer = offerRepository.findByIdFull(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        String senderUsername = offer.getSender().getEmail();
        String receiverUsername = offer.getReceiver().getEmail();


        if (!username.equals(receiverUsername) && !username.equals(senderUsername)) {
            throw new RuntimeException("You are not authorized to respond to this offer.");
        }

        offer.setStatus(newStatus);
        offerRepository.save(offer);
        if (username.equals(receiverUsername)) {
            if ("ACCEPTED".equalsIgnoreCase(newStatus) || "OK".equalsIgnoreCase(newStatus)) {
                String toEmail = offer.getSender().getEmail();
                String subject = "Oferta a fost acceptata!";
                String body = "Felicitari! Oferta ta de schimb de carți a fost acceptata de " + username + ".";
                emailService.sendEmail(toEmail, subject, body);


                    return deleteBooksFromOffer(offer);
            } else if ("REJECTED".equalsIgnoreCase(newStatus) || "NO".equalsIgnoreCase(newStatus)) {
                String toEmail = offer.getSender().getEmail();
                String subject = "Oferta a fost respinsa!";
                String body = "Ne pare rau! Oferta ta de schimb de carți a fost respinsa de " + username + ".";
                emailService.sendEmail(toEmail, subject, body);
                return deleteBooksFromOffer(offer);
            }
        }
        if (username.equals(senderUsername)) {
            if ("CANCEL".equalsIgnoreCase(newStatus)) {
                return deleteBooksFromOffer(offer);
            }
        } else {
            throw new RuntimeException("You are not authorized to respond to this offer.");
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
                .filter(book -> book.getOwner() != null && book.getOwner().getId().equals(ownerId))
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

            offeredBookRepository.save(offerBook);
        }
    }


    private OfferDto toDto(Offer offer) {
        OfferDto dto = new OfferDto();
        dto.setId(offer.getId());
        dto.setSenderEmail(offer.getSender().getEmail());
        dto.setReceiverEmail(offer.getReceiver().getEmail());
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
}
