package com.simovic1.forge.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
