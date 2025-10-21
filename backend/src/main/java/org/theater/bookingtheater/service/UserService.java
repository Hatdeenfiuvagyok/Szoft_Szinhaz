package org.theater.bookingtheater.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.theater.bookingtheater.model.User;
import org.theater.bookingtheater.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public boolean register(String email, String plainPassword) {
        if (userRepository.existsByEmail(email)) return false;
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(plainPassword));
        userRepository.save(u);
        return true;
    }

    public boolean authenticate(String email, String plainPassword) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return false;
        return passwordEncoder.matches(plainPassword, opt.get().getPasswordHash());
    }
}
