package org.theater.bookingtheater.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.theater.bookingtheater.model.User;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testExistsByEmail_WhenUserExists() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedpwd");
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("test@example.com");

        assertTrue(exists);
    }

    @Test
    void testExistsByEmail_WhenUserDoesNotExist() {
        boolean exists = userRepository.existsByEmail("doesnotexist@example.com");

        assertFalse(exists);
    }

    @Test
    void testFindByEmail_ReturnsUser() {
        User user = new User();
        user.setEmail("abc@test.com");
        user.setPasswordHash("hashedpwd");
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("abc@test.com");

        assertTrue(found.isPresent());
        assertEquals("abc@test.com", found.get().getEmail());
        assertEquals("hashedpwd", found.get().getPasswordHash());
    }

    @Test
    void testFindByEmail_ReturnsEmptyOptional() {
        Optional<User> result = userRepository.findByEmail("unknown@test.com");

        assertTrue(result.isEmpty());
    }
}
