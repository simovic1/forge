package com.simovic1.forge.weeklyreview;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WeeklyReviewService {

    private final WeeklyReviewRepository weeklyReviewRepository;

    @Transactional(readOnly = true)
    public WeeklyReview getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<WeeklyReview> getByUser(Long userId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public WeeklyReview getByUserAndWeekStart(Long userId, LocalDate weekStartDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public WeeklyReview create(WeeklyReview weeklyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public WeeklyReview update(Long id, WeeklyReview weeklyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
