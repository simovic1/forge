package com.simovic1.forge.monthlyreview;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyReviewRepository extends JpaRepository<MonthlyReview, Long> {

    List<MonthlyReview> findByUserId(Long userId);

    Optional<MonthlyReview> findByUserIdAndPeriodStartDate(Long userId, LocalDate periodStartDate);

    boolean existsByUserIdAndPeriodStartDate(Long userId, LocalDate periodStartDate);
}
