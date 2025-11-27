package org.theater.bookingtheater.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.theater.bookingtheater.model.User;
import org.theater.bookingtheater.repository.UserRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Jelszó SHA-256 hash-elése (Spring Security nélkül)
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            // hex formátumba alakítjuk (pl. "a34bcf...")
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algoritmus nem elérhető!", e);
        }
    }

    public boolean register(String email, String plainPassword) {
        if (userRepository.existsByEmail(email)) return false;

        User user = new User();
        user.setEmail(email);

        // SHA-256 hash
        user.setPasswordHash(hashPassword(plainPassword));

        userRepository.save(user);
        return true;
    }

    public boolean authenticate(String email, String plainPassword) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return false;

        User user = opt.get();

        // Összehasonlítás hash-ével
        String hashed = hashPassword(plainPassword);
        return hashed.equals(user.getPasswordHash());
    }
}
