package com.simovic1.forge.user;

import java.time.OffsetDateTime;

public record UserResponse(
        Long id,
        String email,
        String name,
        OffsetDateTime createdAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getCreatedAt());
    }
}
