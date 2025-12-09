package org.theater.bookingtheater.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.theater.bookingtheater.model.User;
import org.theater.bookingtheater.repository.UserRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // Teszthez saját hash metódus, ugyanaz mint UserService-ben
    private String sha256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --------------------------
    // REGISTER TESTS
    // --------------------------

    @Test
    void testRegisterSuccess() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);

        boolean result = userService.register("test@example.com", "password123");

        verify(userRepository, times(1)).save(any(User.class));
        assertTrue(result);
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        boolean result = userService.register("test@example.com", "password123");

        verify(userRepository, never()).save(any(User.class));
        assertFalse(result);
    }

    // --------------------------
    // AUTHENTICATE TESTS
    // --------------------------

    @Test
    void testAuthenticateSuccess() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash(sha256("secret"));   // valódi hash

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        boolean result = userService.authenticate("test@example.com", "secret");

        assertTrue(result);
    }

    @Test
    void testAuthenticateWrongPassword() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash(sha256("secret"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        boolean result = userService.authenticate("test@example.com", "wrong");

        assertFalse(result);
    }

    @Test
    void testAuthenticateEmailNotFound() {
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.empty());

        boolean result = userService.authenticate("test@example.com", "anything");

        assertFalse(result);
    }
}
