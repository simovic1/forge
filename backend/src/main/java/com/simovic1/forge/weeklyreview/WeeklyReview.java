package com.simovic1.forge.weeklyreview;

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
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "weekly_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "week_end_date", nullable = false)
    private LocalDate weekEndDate;

    @Column(name = "avg_weight", precision = 5, scale = 2)
    private BigDecimal avgWeight;

    @Column(name = "weight_change", precision = 5, scale = 2)
    private BigDecimal weightChange;

    @Column(name = "avg_sleep_hours", precision = 4, scale = 2)
    private BigDecimal avgSleepHours;

    @Column(name = "avg_steps")
    private Integer avgSteps;

    @Column(name = "training_cnt")
    private Short trainingCnt;

    @Column(name = "days_without_overeating")
    private Short daysWithoutOvereating;

    @Column(name = "avg_energy_level", precision = 3, scale = 1)
    private BigDecimal avgEnergyLevel;

    @Column(name = "avg_stress_level", precision = 3, scale = 1)
    private BigDecimal avgStressLevel;

    @Column(name = "avg_mood_level", precision = 3, scale = 1)
    private BigDecimal avgMoodLevel;

    @Column(name = "avg_calories")
    private Integer avgCalories;

    @Column(name = "what_went_well", columnDefinition = "text")
    private String whatWentWell;

    @Column(name = "biggest_problem", columnDefinition = "text")
    private String biggestProblem;

    @Column(name = "next_week_focus", columnDefinition = "text")
    private String nextWeekFocus;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
