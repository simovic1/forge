package com.simovic1.forge.weeklyreview;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WeeklyReportNotFoundException extends RuntimeException {

    public WeeklyReportNotFoundException(Long id) {
        super("Weekly report not found: " + id);
    }
}
