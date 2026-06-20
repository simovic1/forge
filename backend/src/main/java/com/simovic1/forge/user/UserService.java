package com.simovic1.forge.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

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

    /**
     * Returns the user only when the email exists and the password matches.
     * Empty otherwise — callers decide how to signal failure (the auth layer
     * maps an empty result to a single, non-enumerating error).
     */
    @Transactional(readOnly = true)
    public Optional<User> findByCredentials(String email, String rawPassword) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        return userRepository.findByEmail(normalizedEmail)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
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
