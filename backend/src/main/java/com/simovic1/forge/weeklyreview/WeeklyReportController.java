package com.simovic1.forge.weeklyreview;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weekly-reports")
@RequiredArgsConstructor
public class WeeklyReportController {

    private final WeeklyReportService weeklyReviewService;

    @GetMapping
    public List<WeeklyReportResponse> list(@AuthenticationPrincipal Jwt jwt) {
        Long userId = Long.valueOf(jwt.getSubject());
        return weeklyReviewService.getByUser(userId).stream()
                .map(WeeklyReportResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<WeeklyReportResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateWeeklyReportRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        WeeklyReport created = weeklyReviewService.create(userId, request);
        return ResponseEntity
                .created(URI.create("/api/weekly-reports/" + created.getId()))
                .body(WeeklyReportResponse.from(created));
    }

    @PutMapping("/{id}")
    public WeeklyReportResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CreateWeeklyReportRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        WeeklyReport updated = weeklyReviewService.update(userId, id, request);
        return WeeklyReportResponse.from(updated);
    }
}
