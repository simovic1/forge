package com.simovic1.forge.dailylog;

import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;

    @Transactional(readOnly = true)
    public DailyLog getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<DailyLog> getByUser(Long userId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public DailyLog getByUserAndDate(Long userId, LocalDate logDate) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public DailyLog create(DailyLog dailyLog) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public DailyLog update(Long id, DailyLog dailyLog) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
