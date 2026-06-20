package com.simovic1.forge.monthlyreview;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MonthlyReviewService {

    private final MonthlyReviewRepository monthlyReviewRepository;

    @Transactional(readOnly = true)
    public MonthlyReview getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<MonthlyReview> getByUser(Long userId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public MonthlyReview getByUserAndPeriodStart(Long userId, LocalDate periodStartDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public MonthlyReview create(MonthlyReview monthlyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public MonthlyReview update(Long id, MonthlyReview monthlyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
