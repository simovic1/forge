package com.simovic1.forge.dailylog;

import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DailyLogAlreadyExistsException extends RuntimeException {

    public DailyLogAlreadyExistsException(LocalDate logDate) {
        super("A daily log already exists for " + logDate);
    }
}
