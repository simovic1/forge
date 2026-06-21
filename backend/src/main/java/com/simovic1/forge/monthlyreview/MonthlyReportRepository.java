package com.simovic1.forge.monthlyreview;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Long> {

    List<MonthlyReport> findByUserId(Long userId);

    Optional<MonthlyReport> findByUserIdAndPeriodStartDate(Long userId, LocalDate periodStartDate);

    boolean existsByUserIdAndPeriodStartDate(Long userId, LocalDate periodStartDate);
}
