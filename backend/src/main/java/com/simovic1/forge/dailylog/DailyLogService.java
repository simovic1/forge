package com.simovic1.forge.dailylog;

import com.simovic1.forge.user.User;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public DailyLog getById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional(readOnly = true)
    public List<DailyLog> getByUser(Long userId) {
        return dailyLogRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<DailyLog> getByUserBetween(Long userId, LocalDate from, LocalDate to) {
        return dailyLogRepository.findByUserIdAndLogDateBetween(userId, from, to);
    }

    @Transactional(readOnly = true)
    public Optional<DailyLog> getByUserAndDate(Long userId, LocalDate logDate) {
        return dailyLogRepository.findByUserIdAndLogDate(userId, logDate);
    }

    /**
     * Creates a daily log for the given user. There can be at most one log per
     * user per day (enforced by a unique constraint), so a duplicate date is
     * rejected with a 409 rather than surfacing a database error.
     */
    @Transactional
    public DailyLog create(Long userId, DailyLog dailyLog) {
        if (dailyLogRepository.existsByUserIdAndLogDate(userId, dailyLog.getLogDate())) {
            throw new DailyLogAlreadyExistsException(dailyLog.getLogDate());
        }
        // getReference avoids loading the user row; we only need the FK.
        dailyLog.setUser(entityManager.getReference(User.class, userId));
        return dailyLogRepository.save(dailyLog);
    }

    /**
     * Updates the user's own daily log. Loading is scoped to the owner so one
     * user can never modify another's log (a foreign id yields a 404, not a 403,
     * to avoid leaking which ids exist).
     */
    @Transactional
    public DailyLog update(Long userId, Long id, CreateDailyLogRequest request) {
        DailyLog existing = dailyLogRepository.findById(id)
                .filter(log -> log.getUser().getId().equals(userId))
                .orElseThrow(() -> new DailyLogNotFoundException(id));

        // Guard against moving a log onto a date that already has one.
        if (!existing.getLogDate().equals(request.logDate())
                && dailyLogRepository.existsByUserIdAndLogDate(userId, request.logDate())) {
            throw new DailyLogAlreadyExistsException(request.logDate());
        }

        request.applyTo(existing);
        return dailyLogRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
