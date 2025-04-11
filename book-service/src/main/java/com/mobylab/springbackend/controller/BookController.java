package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.entity.Book;
import com.mobylab.springbackend.service.BookService;
import com.mobylab.springbackend.service.dto.BookDto;
import com.mobylab.springbackend.service.dto.BookWithOwnerDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController implements SecuredRestController {

    private final BookService bookService;

    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @GetMapping("/getByAuthor")
    public ResponseEntity<List<BookWithOwnerDto>> getBooksByAuthor(String author){
        List<BookWithOwnerDto> bookDtoList = bookService.getBooksByAuthor(author);
        if (bookDtoList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(200).body(bookDtoList);
    }

    @PostMapping("/addBook")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<Book> addBook(@RequestBody BookDto bookDto){
        Book book = bookService.addBook(bookDto);
        return ResponseEntity.status(201).body(book);
    }

    @DeleteMapping("/deleteByTitle")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBookByTitle(@RequestParam String title,
                                                  Principal principal) {
        UUID userId = UUID.fromString(principal.getName()); // get from JWT via principal
        boolean deleted = bookService.deleteBookByTitleAndOwner(title, userId);

        if (deleted) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
        }
    }


}
