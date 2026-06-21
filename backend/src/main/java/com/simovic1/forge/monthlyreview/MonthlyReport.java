package com.simovic1.forge.monthlyreview;

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
@Table(name = "monthly_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "period_start_date", nullable = false)
    private LocalDate periodStartDate;

    @Column(name = "period_end_date", nullable = false)
    private LocalDate periodEndDate;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    // Body measurements

    @Column(name = "measured_weight_kg", precision = 5, scale = 2)
    private BigDecimal measuredWeightKg;

    @Column(name = "waist_cm", precision = 5, scale = 2)
    private BigDecimal waistCm;

    @Column(name = "chest_cm", precision = 5, scale = 2)
    private BigDecimal chestCm;

    @Column(name = "neck_cm", precision = 5, scale = 2)
    private BigDecimal neckCm;

    @Column(name = "hips_cm", precision = 5, scale = 2)
    private BigDecimal hipsCm;

    @Column(name = "biceps_left_cm", precision = 5, scale = 2)
    private BigDecimal bicepsLeftCm;

    @Column(name = "biceps_right_cm", precision = 5, scale = 2)
    private BigDecimal bicepsRightCm;

    @Column(name = "thigh_left_cm", precision = 5, scale = 2)
    private BigDecimal thighLeftCm;

    @Column(name = "thigh_right_cm", precision = 5, scale = 2)
    private BigDecimal thighRightCm;

    // Mental state

    @Column(name = "confidence_level")
    private Short confidenceLevel;

    @Column(name = "self_satisfaction_level")
    private Short selfSatisfactionLevel;

    @Column(name = "food_control_level")
    private Short foodControlLevel;

    @Column(name = "energy_level")
    private Short energyLevel;

    @Column(name = "stress_level")
    private Short stressLevel;

    @Column(name = "craving_control_level")
    private Short cravingControlLevel;

    // Reflection

    @Column(name = "what_improved", columnDefinition = "text")
    private String whatImproved;

    @Column(name = "biggest_obstacle", columnDefinition = "text")
    private String biggestObstacle;

    @Column(name = "proudest_moment", columnDefinition = "text")
    private String proudestMoment;

    @Column(name = "noticed_pattern", columnDefinition = "text")
    private String noticedPattern;

    @Column(name = "next_month_focus", columnDefinition = "text")
    private String nextMonthFocus;

    @Column(columnDefinition = "text")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
