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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

// Swagger/OpenAPI imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

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


    @GetMapping("/all")
    public ResponseEntity<Page<BookWithOwnerDto>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<BookWithOwnerDto> books = bookService.getAllBooks(page, size);
        return ResponseEntity.ok(books);
    }



    @PostMapping("/addBook")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Book> addBook(@RequestBody BookDto bookDto, Principal principal) {
        String email = principal.getName(); // extracted from JWT
        Book book = bookService.addBook(bookDto, email);
        return ResponseEntity.status(201).body(book);
    }

    @DeleteMapping("/deleteByTitle")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBookByTitle(@RequestParam String title,
                                                  Principal principal) {
        String email = principal.getName();
        boolean deleted = bookService.deleteBookByTitleAndOwner(title, email);

        if (deleted) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
        }
    }

}
