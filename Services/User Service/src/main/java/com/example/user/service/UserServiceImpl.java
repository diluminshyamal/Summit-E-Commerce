package com.example.user.service;

import com.example.user.dto.UserDto;
import com.example.user.exception.UserExceptions;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public UserDto createUser(UserDto userDto) {
        // Basic validation
        if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
            throw new UserExceptions(HttpStatus.BAD_REQUEST, "Username cannot be empty.");
        }

        // Check if username already exists
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            throw new UserExceptions(HttpStatus.CONFLICT, "Username already exists.");
        }

        try {
            User user = modelMapper.map(userDto, User.class);
            User savedUser = userRepository.save(user);
            return modelMapper.map(savedUser, UserDto.class);
        } catch (Exception e) {
            throw new UserExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating user.", java.util.List.of(e.getMessage()));
        }
    }

    @Override
    public Long getUserIdByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new UserExceptions(HttpStatus.BAD_REQUEST, "Username cannot be empty for lookup.");
        }

        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(User::getUserId).orElse(null);
    }
}