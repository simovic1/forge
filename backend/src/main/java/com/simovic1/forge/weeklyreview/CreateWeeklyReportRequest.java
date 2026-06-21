package com.simovic1.forge.weeklyreview;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Payload for creating a weekly review. The week is identified by any date
 * within it ({@code weekStartDate}); the service snaps it to that week's Monday
 * and derives the Sunday end date. Only the written reflection is stored.
 */
public record CreateWeeklyReportRequest(

        @NotNull
        LocalDate weekStartDate,

        String whatWentWell,
        String biggestChallenge,
        String mainTriggerNote,
        String nextWeekFocus,
        String notes
) {
}
