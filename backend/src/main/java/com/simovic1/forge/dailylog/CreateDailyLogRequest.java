package com.simovic1.forge.dailylog;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for creating a daily log. Only {@code logDate} is required; every
 * metric is optional so users can log as little or as much as they track.
 * Energy/stress/mood and craving use a 1-10 scale (1 = low, 10 = high).
 */
public record CreateDailyLogRequest(

        @NotNull
        LocalDate logDate,

        @DecimalMin("0.0")
        @Digits(integer = 3, fraction = 2)
        BigDecimal weight,

        @DecimalMin("0.0")
        @DecimalMax("24.0")
        @Digits(integer = 2, fraction = 2)
        BigDecimal sleepingHours,

        @PositiveOrZero
        Integer steps,

        Boolean trainingCompleted,

        @PositiveOrZero
        Integer proteinGrams,

        @PositiveOrZero
        Integer calories,

        @DecimalMin("0.0")
        @Digits(integer = 2, fraction = 2)
        BigDecimal waterLiters,

        Boolean overeating,

        TriggerType triggerType,

        Boolean resistedTrigger,

        @Min(1)
        @Max(10)
        Short cravingLevel,

        String cravedFood,

        Boolean resistedCraving,

        @Min(1)
        @Max(10)
        Short energyLevel,

        @Min(1)
        @Max(10)
        Short stressLevel,

        @Min(1)
        @Max(10)
        Short moodLevel,

        String notes
) {

    public DailyLog toEntity() {
        DailyLog log = new DailyLog();
        applyTo(log);
        return log;
    }

    /** Copies every field from this payload onto an existing log (used for updates). */
    public void applyTo(DailyLog log) {
        log.setLogDate(logDate);
        log.setWeight(weight);
        log.setSleepingHours(sleepingHours);
        log.setSteps(steps);
        log.setTrainingCompleted(trainingCompleted);
        log.setProteinGrams(proteinGrams);
        log.setCalories(calories);
        log.setWaterLiters(waterLiters);
        log.setOvereating(overeating);
        log.setTriggerType(triggerType);
        log.setResistedTrigger(resistedTrigger);
        log.setCravingLevel(cravingLevel);
        log.setCravedFood(cravedFood);
        log.setResistedCraving(resistedCraving);
        log.setEnergyLevel(energyLevel);
        log.setStressLevel(stressLevel);
        log.setMoodLevel(moodLevel);
        log.setNotes(notes);
    }
}
