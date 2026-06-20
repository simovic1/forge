package com.simovic1.forge.dailylog;

import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/daily-logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @GetMapping
    public List<DailyLogResponse> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        Long userId = Long.valueOf(jwt.getSubject());
        List<DailyLog> logs = (from != null && to != null)
                ? dailyLogService.getByUserBetween(userId, from, to)
                : dailyLogService.getByUser(userId);
        return logs.stream().map(DailyLogResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<DailyLogResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateDailyLogRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        DailyLog created = dailyLogService.create(userId, request.toEntity());
        return ResponseEntity
                .created(URI.create("/api/daily-logs/" + created.getId()))
                .body(DailyLogResponse.from(created));
    }

    @PutMapping("/{id}")
    public DailyLogResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CreateDailyLogRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        DailyLog updated = dailyLogService.update(userId, id, request);
        return DailyLogResponse.from(updated);
    }
}
