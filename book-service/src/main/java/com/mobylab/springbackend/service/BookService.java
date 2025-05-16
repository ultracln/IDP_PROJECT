package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.Book;
import com.mobylab.springbackend.client.*;
import com.mobylab.springbackend.entity.Offer;
import com.mobylab.springbackend.repository.*;
import com.mobylab.springbackend.service.dto.BookDto;
import com.mobylab.springbackend.service.dto.BookWithOwnerDto;
import com.mobylab.springbackend.exception.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;

@Service
@Transactional
public class BookService {
    private final BookRepository bookRepository;
    private final AuthServiceClient authServiceClient;

    @Autowired private OfferedBookRepository offeredBookRepository;
    @Autowired private OfferRepository offerRepository;

    public BookService(BookRepository bookRepository, AuthServiceClient authServiceClient) {
        this.bookRepository = bookRepository;
        this.authServiceClient = authServiceClient;
    }

    public List<BookWithOwnerDto> getBooksByAuthor(String author) {
        List<Book> books = bookRepository.getBooksByAuthor(author).orElse(Collections.emptyList());

        return books.stream()
                .map(book -> new BookWithOwnerDto()
                        .setAuthor(book.getAuthor())
                        .setTitle(book.getTitle())
                        .setOwnerEmail(authServiceClient.getUserEmailById(book.getOwnerId())))
                .collect(Collectors.toList());
    }

    public Book addBook(BookDto bookDto, String email) {
        UUID userId = authServiceClient.getUserIdByEmail(email);

        // Check for duplicate
        Optional<List<Book>> existingBooks = bookRepository.getBooksByTitle(bookDto.getTitle());
        if (existingBooks.isPresent()) {
            boolean alreadyExists = existingBooks.get().stream().anyMatch(book ->
                    book.getAuthor().equalsIgnoreCase(bookDto.getAuthor()) &&
                            book.getOwnerId().equals(userId)
            );
            if (alreadyExists) {
                throw new BookAlreadyExistsException("This book already exists for the user.");
            }
        }

        Book book = new Book();
        book.setAuthor(bookDto.getAuthor());
        book.setTitle(bookDto.getTitle());
        book.setOwnerId(userId);

        return bookRepository.save(book);
    }


    public boolean deleteBookByTitleAndOwner(String title, String email) {
        UUID userId = authServiceClient.getUserIdByEmail(email);
        Optional<List<Book>> optionalBooks = bookRepository.getBooksByTitle(title);

        if (optionalBooks.isPresent()) {
            for (Book book : optionalBooks.get()) {
                if (book.getOwnerId() != null && book.getOwnerId().equals(userId)) {
                    List<Offer> offers = offerRepository.findAllByBook(book.getId());
                    for (Offer offer : offers) {
                        offeredBookRepository.deleteAll(offer.getOfferedBooks());
                        offer.setOfferedBooks(null);
                        offerRepository.delete(offer);
                    }
                    bookRepository.delete(book);
                    return true;
                }
            }
        }
        return false;
    }

    public boolean deleteBookById(UUID bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            List<Offer> offers = offerRepository.findAllByBook(book.getId());
            for (Offer offer : offers) {
                offeredBookRepository.deleteAll(offer.getOfferedBooks());
                offer.setOfferedBooks(null);
                offerRepository.delete(offer);
            }
            bookRepository.delete(book);
            return true;
        }
        return false;
    }

    public void transferOwnership(UUID bookId, UUID newOwnerId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setOwnerId(newOwnerId);
        bookRepository.save(book);
    }

    private BookWithOwnerDto mapToBookWithOwnerDto(Book book) {
        return new BookWithOwnerDto()
                .setTitle(book.getTitle())
                .setAuthor(book.getAuthor())
                .setOwnerEmail(authServiceClient.getUserEmailById(book.getOwnerId()))
                .setOwnerUsername(authServiceClient.getUsernameById(book.getOwnerId()));
    }

    public Page<BookWithOwnerDto> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<BookWithOwnerDto> dtoList = bookPage.getContent().stream()
                .map(this::mapToBookWithOwnerDto)
                .toList();

        return new PageImpl<>(dtoList, pageable, bookPage.getTotalElements());
    }
}
