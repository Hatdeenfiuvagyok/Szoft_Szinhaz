package org.theater.bookingtheater.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.theater.bookingtheater.service.UserService;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    // ----------------------
    // REGISTER TEST
    // ----------------------
    @Test
    void testRegisterSuccessful() throws Exception {
        when(userService.register("test@example.com", "pass")).thenReturn(true);

        Map<String, String> body = Map.of(
                "email", "test@example.com",
                "password", "pass"
        );

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Regisztráció sikeres!"));
    }

    @Test
    void testRegisterEmailAlreadyUsed() throws Exception {
        when(userService.register(anyString(), anyString())).thenReturn(false);

        Map<String, String> body = Map.of(
                "email", "test@example.com",
                "password", "pass"
        );

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Ez az email már regisztrálva van."));
    }

    @Test
    void testRegisterMissingFields() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Hiányzó email vagy jelszó"));
    }

    // ----------------------
    // LOGIN TEST
    // ----------------------
    @Test
    void testLoginSuccessful() throws Exception {
        when(userService.authenticate("test@example.com", "pass")).thenReturn(true);

        Map<String, String> body = Map.of(
                "email", "test@example.com",
                "password", "pass"
        );

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Bejelentkezés sikeres!"));
    }

    @Test
    void testLoginWrongCredentials() throws Exception {
        when(userService.authenticate(anyString(), anyString())).thenReturn(false);

        Map<String, String> body = Map.of(
                "email", "test@example.com",
                "password", "wrong"
        );

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Helytelen email vagy jelszó."));
    }

    @Test
    void testLoginMissingFields() throws Exception {
        Map<String, String> body = Map.of("email", "test@example.com");

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Hiányzó email vagy jelszó"));
    }
}
