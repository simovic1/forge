package com.simovic1.forge.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(String email, String rawPassword, String name) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyUsedException(normalizedEmail);
        }
        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .name(name)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public User create(User user) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public User update(Long id, User user) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
