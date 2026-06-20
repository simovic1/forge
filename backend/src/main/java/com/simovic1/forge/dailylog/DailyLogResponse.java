package com.simovic1.forge.dailylog;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyLogResponse(
        Long id,
        Long userId,
        LocalDate logDate,
        BigDecimal weight,
        BigDecimal sleepingHours,
        Integer steps,
        Boolean trainingCompleted,
        Integer proteinGrams,
        Integer calories,
        BigDecimal waterLiters,
        Boolean overeating,
        String triggerType,
        Boolean resistedTrigger,
        Short energyLevel,
        Short stressLevel,
        Short moodLevel,
        String notes
) {

    public static DailyLogResponse from(DailyLog log) {
        return new DailyLogResponse(
                log.getId(),
                log.getUser().getId(),
                log.getLogDate(),
                log.getWeight(),
                log.getSleepingHours(),
                log.getSteps(),
                log.getTrainingCompleted(),
                log.getProteinGrams(),
                log.getCalories(),
                log.getWaterLiters(),
                log.getOvereating(),
                log.getTriggerType(),
                log.getResistedTrigger(),
                log.getEnergyLevel(),
                log.getStressLevel(),
                log.getMoodLevel(),
                log.getNotes());
    }
}
