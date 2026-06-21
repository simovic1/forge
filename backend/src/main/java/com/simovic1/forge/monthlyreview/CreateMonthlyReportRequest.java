package com.simovic1.forge.monthlyreview;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for creating a monthly report. The period spans four weeks: the
 * service derives {@code periodEndDate} from {@code periodStartDate}. Every
 * measurement and reflection is optional. Scores use a 1-10 scale.
 */
public record CreateMonthlyReportRequest(

        @NotNull
        LocalDate periodStartDate,

        // Body measurements
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal measuredWeightKg,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal waistCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal chestCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal neckCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal hipsCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal bicepsLeftCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal bicepsRightCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal thighLeftCm,
        @DecimalMin("0.0") @Digits(integer = 3, fraction = 2) BigDecimal thighRightCm,

        // Mental state (1-10)
        @Min(1) @Max(10) Short confidenceLevel,
        @Min(1) @Max(10) Short selfSatisfactionLevel,
        @Min(1) @Max(10) Short foodControlLevel,
        @Min(1) @Max(10) Short energyLevel,
        @Min(1) @Max(10) Short stressLevel,
        @Min(1) @Max(10) Short cravingControlLevel,

        // Reflection
        String whatImproved,
        String biggestObstacle,
        String proudestMoment,
        String noticedPattern,
        String nextMonthFocus,
        String notes
) {

    /** Builds the data part of the entity; the service sets user and period. */
    public MonthlyReport toEntity() {
        MonthlyReport report = new MonthlyReport();
        applyTo(report);
        return report;
    }

    /** Copies measurements/scores/reflection onto an existing report (updates). */
    public void applyTo(MonthlyReport report) {
        report.setMeasuredWeightKg(measuredWeightKg);
        report.setWaistCm(waistCm);
        report.setChestCm(chestCm);
        report.setNeckCm(neckCm);
        report.setHipsCm(hipsCm);
        report.setBicepsLeftCm(bicepsLeftCm);
        report.setBicepsRightCm(bicepsRightCm);
        report.setThighLeftCm(thighLeftCm);
        report.setThighRightCm(thighRightCm);
        report.setConfidenceLevel(confidenceLevel);
        report.setSelfSatisfactionLevel(selfSatisfactionLevel);
        report.setFoodControlLevel(foodControlLevel);
        report.setEnergyLevel(energyLevel);
        report.setStressLevel(stressLevel);
        report.setCravingControlLevel(cravingControlLevel);
        report.setWhatImproved(whatImproved);
        report.setBiggestObstacle(biggestObstacle);
        report.setProudestMoment(proudestMoment);
        report.setNoticedPattern(noticedPattern);
        report.setNextMonthFocus(nextMonthFocus);
        report.setNotes(notes);
    }
}
