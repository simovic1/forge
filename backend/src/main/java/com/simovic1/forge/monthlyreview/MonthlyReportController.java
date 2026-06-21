package com.simovic1.forge.monthlyreview;

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
@RequestMapping("/api/monthly-reports")
@RequiredArgsConstructor
public class MonthlyReportController {

    private final MonthlyReportService monthlyReportService;

    @GetMapping
    public List<MonthlyReportResponse> list(@AuthenticationPrincipal Jwt jwt) {
        Long userId = Long.valueOf(jwt.getSubject());
        return monthlyReportService.getByUser(userId).stream()
                .map(MonthlyReportResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<MonthlyReportResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateMonthlyReportRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        MonthlyReport created = monthlyReportService.create(userId, request);
        return ResponseEntity
                .created(URI.create("/api/monthly-reports/" + created.getId()))
                .body(MonthlyReportResponse.from(created));
    }

    @PutMapping("/{id}")
    public MonthlyReportResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody CreateMonthlyReportRequest request) {
        Long userId = Long.valueOf(jwt.getSubject());
        return MonthlyReportResponse.from(monthlyReportService.update(userId, id, request));
    }
}
