package com.simovic1.forge.weeklyreview;

import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class WeeklyReportAlreadyExistsException extends RuntimeException {

    public WeeklyReportAlreadyExistsException(LocalDate weekStartDate) {
        super("A weekly report already exists for the week of " + weekStartDate);
    }
}
