package com.simovic1.forge.auth;

import com.simovic1.forge.user.User;
import com.simovic1.forge.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final TokenService tokenService;

    public LoginResponse login(String email, String rawPassword) {
        User user = userService.findByCredentials(email, rawPassword)
                .orElseThrow(InvalidCredentialsException::new);
        String accessToken = tokenService.generateAccessToken(user);
        return LoginResponse.bearer(accessToken, tokenService.getAccessTokenTtl().toSeconds());
    }
}
