package com.simovic1.forge.monthlyreview;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record MonthlyReportResponse(
        Long id,
        Long userId,
        LocalDate periodStartDate,
        LocalDate periodEndDate,
        OffsetDateTime completedAt,
        BigDecimal measuredWeightKg,
        BigDecimal waistCm,
        BigDecimal chestCm,
        BigDecimal neckCm,
        BigDecimal hipsCm,
        BigDecimal bicepsLeftCm,
        BigDecimal bicepsRightCm,
        BigDecimal thighLeftCm,
        BigDecimal thighRightCm,
        Short confidenceLevel,
        Short selfSatisfactionLevel,
        Short foodControlLevel,
        Short energyLevel,
        Short stressLevel,
        Short cravingControlLevel,
        String whatImproved,
        String biggestObstacle,
        String proudestMoment,
        String noticedPattern,
        String nextMonthFocus,
        String notes,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static MonthlyReportResponse from(MonthlyReport report) {
        return new MonthlyReportResponse(
                report.getId(),
                report.getUser().getId(),
                report.getPeriodStartDate(),
                report.getPeriodEndDate(),
                report.getCompletedAt(),
                report.getMeasuredWeightKg(),
                report.getWaistCm(),
                report.getChestCm(),
                report.getNeckCm(),
                report.getHipsCm(),
                report.getBicepsLeftCm(),
                report.getBicepsRightCm(),
                report.getThighLeftCm(),
                report.getThighRightCm(),
                report.getConfidenceLevel(),
                report.getSelfSatisfactionLevel(),
                report.getFoodControlLevel(),
                report.getEnergyLevel(),
                report.getStressLevel(),
                report.getCravingControlLevel(),
                report.getWhatImproved(),
                report.getBiggestObstacle(),
                report.getProudestMoment(),
                report.getNoticedPattern(),
                report.getNextMonthFocus(),
                report.getNotes(),
                report.getCreatedAt(),
                report.getUpdatedAt());
    }
}
