package com.simovic1.forge.monthlyreview;

import com.simovic1.forge.user.User;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MonthlyReportService {

    private final MonthlyReportRepository monthlyReviewRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public MonthlyReport getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<MonthlyReport> getByUser(Long userId) {
        return monthlyReviewRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public MonthlyReport getByUserAndPeriodStart(Long userId, LocalDate periodStartDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Creates a monthly report. A monthly review spans four weeks, so the end
     * date is derived from the start. At most one report per user per period.
     */
    @Transactional
    public MonthlyReport create(Long userId, CreateMonthlyReportRequest request) {
        LocalDate start = request.periodStartDate();
        LocalDate end = start.plusWeeks(4).minusDays(1);

        if (monthlyReviewRepository.existsByUserIdAndPeriodStartDate(userId, start)) {
            throw new MonthlyReportAlreadyExistsException(start);
        }

        MonthlyReport report = request.toEntity();
        report.setUser(entityManager.getReference(User.class, userId));
        report.setPeriodStartDate(start);
        report.setPeriodEndDate(end);
        report.setCompletedAt(OffsetDateTime.now());
        return monthlyReviewRepository.save(report);
    }

    /**
     * Updates the user's own monthly report. The period and completion stamp are
     * left untouched; only measurements/scores/reflection are replaced.
     */
    @Transactional
    public MonthlyReport update(Long userId, Long id, CreateMonthlyReportRequest request) {
        MonthlyReport existing = monthlyReviewRepository.findById(id)
                .filter(report -> report.getUser().getId().equals(userId))
                .orElseThrow(() -> new MonthlyReportNotFoundException(id));

        request.applyTo(existing);
        return monthlyReviewRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
