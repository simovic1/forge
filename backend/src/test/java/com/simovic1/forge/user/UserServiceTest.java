package com.simovic1.forge.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void register_persistsUserWithHashedPasswordAndNormalizedEmail() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("hunter2pass")).thenReturn("hashed-pw");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.register("  Alex@Example.COM ", "hunter2pass", "Alex");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertThat(saved.getEmail()).isEqualTo("alex@example.com");
        assertThat(saved.getPasswordHash()).isEqualTo("hashed-pw");
        assertThat(saved.getName()).isEqualTo("Alex");
        assertThat(result).isSameAs(saved);
    }

    @Test
    void register_neverStoresRawPassword() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("hunter2pass")).thenReturn("hashed-pw");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.register("alex@example.com", "hunter2pass", "Alex");

        assertThat(result.getPasswordHash()).isNotEqualTo("hunter2pass");
        verify(passwordEncoder).encode("hunter2pass");
    }

    @Test
    void register_checksExistenceWithNormalizedEmail() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed-pw");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.register("  Alex@Example.COM ", "hunter2pass", "Alex");

        verify(userRepository).existsByEmail("alex@example.com");
    }

    @Test
    void register_throwsWhenEmailAlreadyUsed() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.register("Alex@Example.COM", "hunter2pass", "Alex"))
                .isInstanceOf(EmailAlreadyUsedException.class)
                .hasMessageContaining("alex@example.com");

        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }
}
