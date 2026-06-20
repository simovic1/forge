package com.simovic1.forge.weeklyreview;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface WeeklyReviewRepository extends JpaRepository<WeeklyReview, Long> {

    List<WeeklyReview> findByUserId(Long userId);

    Optional<WeeklyReview> findByUserIdAndWeekStartDate(Long userId, LocalDate weekStartDate);

    boolean existsByUserIdAndWeekStartDate(Long userId, LocalDate weekStartDate);
}
