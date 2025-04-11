package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.Book;
import com.mobylab.springbackend.entity.Offer;
import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.repository.*;
import com.mobylab.springbackend.service.dto.BookDto;
import com.mobylab.springbackend.service.dto.BookWithOwnerDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;




@Service
@Transactional
public class BookServie {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    @Autowired
    private OfferedBookRepository offeredBookRepository;

//    @Autowired
//    private RequestedBookRepository requestedBookRepository;

    @Autowired
    private OfferRepository offerRepository;


    public BookServie(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public List<BookWithOwnerDto> getBooksByAuthor(String author) {
        List<Book> books = bookRepository.getBooksByAuthor(author)
                .orElse(Collections.emptyList());

        return books.stream()
                .map(book -> new BookWithOwnerDto()
                        .setAuthor(book.getAuthor())
                        .setTitle(book.getTitle())
                        .setOwnerEmail(book.getOwner() != null ? book.getOwner().getEmail() : null))
                .collect(Collectors.toList());
    }



    public Book addBook(BookDto bookDto) {
        Book book = new Book();
        book.setAuthor(bookDto.getAuthor());
        book.setTitle(bookDto.getTitle());

        String email = ((UserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal()).getUsername();

        User owner = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        book.setOwner(owner);

        return bookRepository.save(book);
    }
    public boolean deleteBookByTitleAndOwner(String title, String email) {
        Optional<List<Book>> optionalBooks = bookRepository.getBooksByTitle(title);
        if (optionalBooks.isPresent()) {
            for (Book book : optionalBooks.get()) {
                if (book.getOwner() != null && book.getOwner().getEmail().equals(email)) {

                    List<Offer> offers = offerRepository.findAllByBook(book.getId());

                    for (Offer offer : offers) {
                        offeredBookRepository.deleteAll(offer.getOfferedBooks());
//                        requestedBookRepository.deleteAll(offer.getRequestedBooks());
                        offer.setOfferedBooks(null);
                        offer.setRequestedBooks(null);
                        offerRepository.delete(offer);
                    }
                    bookRepository.delete(book);

                    return true;
                }
            }
        }
        return false;
    }



}
