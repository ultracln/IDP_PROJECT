package com.mobylab.springbackend.service;

import com.mobylab.springbackend.config.security.JwtGenerator;
import com.mobylab.springbackend.entity.Role;
import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.exception.BadRequestException;
import com.mobylab.springbackend.repository.RoleRepository;
import com.mobylab.springbackend.repository.UserRepository;
import com.mobylab.springbackend.service.dto.LoginDto;
import com.mobylab.springbackend.service.dto.RegisterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private AuthenticationManager authenticationManager;

    private JwtGenerator jwtGenerator;

    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository, RoleRepository roleRepository, AuthenticationManager authenticationManager, JwtGenerator jwtGenerator) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    public void register(RegisterDto registerDto) {

        if(userRepository.existsUserByEmail(registerDto.getEmail())) {
            throw new BadRequestException("Email is already used");
        }

        List<Role> roleList = new ArrayList<>();
        roleList.add(roleRepository.findRoleByName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found")));


        userRepository.save(new User()
                .setEmail(registerDto.getEmail())
                .setPassword(passwordEncoder.encode(registerDto.getPassword()))
                .setUsername(registerDto.getUsername())
                .setRoles(roleList));
    }

    public String login(LoginDto loginDto) {
        System.out.println("Attempting login for: " + loginDto.getEmail());

        Optional<User> optionalUser = userRepository.findUserByEmail(loginDto.getEmail());
        System.out.println("User found? " + optionalUser.isPresent());

        if (optionalUser.isEmpty()) {
            throw new BadRequestException("Wrong credentials");
        }

        System.out.println("Trying authenticationManager.authenticate()...");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        System.out.println("Authentication succeeded. Generating token.");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);
    }

}
