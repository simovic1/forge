package com.simovic1.forge.dailylog;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface DailyLogRepository extends JpaRepository<DailyLog, Long> {

    List<DailyLog> findByUserId(Long userId);

    Optional<DailyLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    List<DailyLog> findByUserIdAndLogDateBetween(Long userId, LocalDate from, LocalDate to);

    boolean existsByUserIdAndLogDate(Long userId, LocalDate logDate);
}
