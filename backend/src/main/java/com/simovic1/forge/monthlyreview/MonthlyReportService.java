package com.simovic1.forge.monthlyreview;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MonthlyReportService {

    private final MonthlyReportRepository monthlyReviewRepository;

    @Transactional(readOnly = true)
    public MonthlyReport getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<MonthlyReport> getByUser(Long userId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public MonthlyReport getByUserAndPeriodStart(Long userId, LocalDate periodStartDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public MonthlyReport create(MonthlyReport monthlyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public MonthlyReport update(Long id, MonthlyReport monthlyReview) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
