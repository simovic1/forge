package com.simovic1.forge.monthlyreview;

import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class MonthlyReportAlreadyExistsException extends RuntimeException {

    public MonthlyReportAlreadyExistsException(LocalDate periodStartDate) {
        super("A monthly report already exists for the period starting " + periodStartDate);
    }
}
