package com.simovic1.forge.weeklyreview;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record WeeklyReportResponse(
        Long id,
        Long userId,
        LocalDate weekStartDate,
        LocalDate weekEndDate,
        String whatWentWell,
        String biggestChallenge,
        String mainTriggerNote,
        String nextWeekFocus,
        String notes,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static WeeklyReportResponse from(WeeklyReport review) {
        return new WeeklyReportResponse(
                review.getId(),
                review.getUser().getId(),
                review.getWeekStartDate(),
                review.getWeekEndDate(),
                review.getWhatWentWell(),
                review.getBiggestChallenge(),
                review.getMainTriggerNote(),
                review.getNextWeekFocus(),
                review.getNotes(),
                review.getCreatedAt(),
                review.getUpdatedAt());
    }
}
