package com.simovic1.forge.weeklyreview;

import com.simovic1.forge.user.User;
import jakarta.persistence.EntityManager;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WeeklyReportService {

    private final WeeklyReportRepository weeklyReviewRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public WeeklyReport getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<WeeklyReport> getByUser(Long userId) {
        return weeklyReviewRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public WeeklyReport getByUserAndWeekStart(Long userId, LocalDate weekStartDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Creates a weekly review for the week containing {@code weekStartDate}. The
     * date is snapped to that week's Monday and the Sunday end is derived, so a
     * week is always Monday–Sunday. At most one review per user per week.
     */
    @Transactional
    public WeeklyReport create(Long userId, CreateWeeklyReportRequest request) {
        LocalDate weekStart = request.weekStartDate()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        if (weeklyReviewRepository.existsByUserIdAndWeekStartDate(userId, weekStart)) {
            throw new WeeklyReportAlreadyExistsException(weekStart);
        }

        WeeklyReport review = WeeklyReport.builder()
                .user(entityManager.getReference(User.class, userId))
                .weekStartDate(weekStart)
                .weekEndDate(weekStart.plusDays(6))
                .whatWentWell(request.whatWentWell())
                .biggestChallenge(request.biggestChallenge())
                .mainTriggerNote(request.mainTriggerNote())
                .nextWeekFocus(request.nextWeekFocus())
                .notes(request.notes())
                .build();
        return weeklyReviewRepository.save(review);
    }

    /**
     * Updates the reflection fields of the user's own weekly report. The week
     * (start/end dates) is fixed and not changed here. A report belonging to
     * another user yields a 404 rather than a 403, to avoid leaking ids.
     */
    @Transactional
    public WeeklyReport update(Long userId, Long id, CreateWeeklyReportRequest request) {
        WeeklyReport existing = weeklyReviewRepository.findById(id)
                .filter(report -> report.getUser().getId().equals(userId))
                .orElseThrow(() -> new WeeklyReportNotFoundException(id));

        existing.setWhatWentWell(request.whatWentWell());
        existing.setBiggestChallenge(request.biggestChallenge());
        existing.setMainTriggerNote(request.mainTriggerNote());
        existing.setNextWeekFocus(request.nextWeekFocus());
        existing.setNotes(request.notes());
        return weeklyReviewRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
