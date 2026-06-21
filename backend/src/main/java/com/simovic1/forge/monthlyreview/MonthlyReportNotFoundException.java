package com.simovic1.forge.monthlyreview;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MonthlyReportNotFoundException extends RuntimeException {

    public MonthlyReportNotFoundException(Long id) {
        super("Monthly report not found: " + id);
    }
}
