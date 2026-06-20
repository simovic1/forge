package com.simovic1.forge.dailylog;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DailyLogNotFoundException extends RuntimeException {

    public DailyLogNotFoundException(Long id) {
        super("Daily log not found: " + id);
    }
}
