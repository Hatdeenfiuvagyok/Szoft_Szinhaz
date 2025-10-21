package org.theater.bookingtheater.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.theater.bookingtheater.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return Map.of("success", false, "message", "Hiányzó email vagy jelszó");
        }

        boolean ok = userService.register(email, password);
        if (ok) return Map.of("success", true, "message", "Regisztráció sikeres!");
        else return Map.of("success", false, "message", "Ez az email már regisztrálva van.");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return Map.of("success", false, "message", "Hiányzó email vagy jelszó");
        }

        boolean ok = userService.authenticate(email, password);
        if (ok) return Map.of("success", true, "message", "Bejelentkezés sikeres!");
        else return Map.of("success", false, "message", "Helytelen email vagy jelszó.");
    }
}
