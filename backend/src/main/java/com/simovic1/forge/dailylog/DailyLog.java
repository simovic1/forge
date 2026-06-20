package com.simovic1.forge.dailylog;

import com.simovic1.forge.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "daily_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(name = "sleeping_hours", precision = 4, scale = 2)
    private BigDecimal sleepingHours;

    @Column
    private Integer steps;

    @Column(name = "training_completed")
    private Boolean trainingCompleted;

    @Column(name = "protein_grams")
    private Integer proteinGrams;

    @Column
    private Integer calories;

    @Column(name = "water_liters", precision = 4, scale = 2)
    private BigDecimal waterLiters;

    @Column
    private Boolean overeating;

    @Column(name = "trigger_type", length = 100)
    private String triggerType;

    @Column(name = "resisted_trigger")
    private Boolean resistedTrigger;

    @Column(name = "energy_level")
    private Short energyLevel;

    @Column(name = "stress_level")
    private Short stressLevel;

    @Column(name = "mood_level")
    private Short moodLevel;

    @Column(columnDefinition = "text")
    private String notes;
}
