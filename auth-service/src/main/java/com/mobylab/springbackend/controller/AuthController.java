package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.service.AuthService;
import com.mobylab.springbackend.service.dto.LoginDto;
import com.mobylab.springbackend.service.dto.LoginResponseDto;
import com.mobylab.springbackend.service.dto.RegisterDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mobylab.springbackend.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private AuthService authService;

    @Autowired
    private UserRepository userRepository;


    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @RequestMapping(path ="/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        logger.info("Request to register user {}", registerDto.getEmail());
        authService.register(registerDto);
        logger.info("Successfully registered user {}", registerDto.getEmail());
        return new ResponseEntity<>("User registered", HttpStatus.CREATED);
    }

    @RequestMapping(path ="/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        System.out.println("respondToOffer() called with id = " + loginDto.getEmail());
        logger.info("Request to login for user {}", loginDto.getEmail());
        String token = authService.login(loginDto);
        logger.info("Successfully logged in user {}", loginDto.getEmail());
        return ResponseEntity.ok(
                new LoginResponseDto()
                        .setToken(token)
                        .setExpire(3600000L)
        );
    }

    @GetMapping("/users/{id}/email")
    public ResponseEntity<String> getUserEmailById(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt.map(user -> ResponseEntity.ok(user.getEmail()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/email/{email}/id")
    public ResponseEntity<UUID> getUserIdByEmail(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(user -> ResponseEntity.ok(user.getId()))
                .orElse(ResponseEntity.notFound().build());
    }



//    @SecurityRequirement(name = "Bearer Authentication")
//    @RequestMapping(path ="/token", method = RequestMethod.GET)
//    public ResponseEntity<?> validateToken() {
//        UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        logger.info("Request to validate token for user {}", user.getUsername());
//        String email = user.getUsername();
//        logger.info("Successfully validated token for user {}", user.getUsername());
//        return new ResponseEntity<>(email, HttpStatus.OK);
//    }
}
