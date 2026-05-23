package com.africa.sport.controller;

import com.africa.sport.model.*;
import com.africa.sport.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

// ═══════════════════════════════════════════════════════════════
// MATCH CONTROLLER
// ═══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
class MatchController {

    private final MatchRepository matchRepository;
    private final MatchEventRepository eventRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MatchController(MatchRepository matchRepository,
                           MatchEventRepository eventRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.matchRepository = matchRepository;
        this.eventRepository = eventRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        return ResponseEntity.ok(matchRepository.findLiveMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        return matchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<MatchEvent>> getMatchEvents(@PathVariable Long id) {
        return ResponseEntity.ok(eventRepository.findByMatchIdOrderByMinuteAsc(id));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN_TERRAIN','SUPER_ADMIN_PROMOTER','PLATFORM_ADMIN')")
    public ResponseEntity<Match> startMatch(@PathVariable Long id) {
        return matchRepository.findById(id).map(match -> {
            match.setStatus(MatchStatus.LIVE);
            match.setStartedAt(LocalDateTime.now());
            Match saved = matchRepository.save(match);
            messagingTemplate.convertAndSend("/topic/match/" + id,
                Map.of("type", "MATCH_STARTED", "status", "LIVE"));
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/event")
    @PreAuthorize("hasAnyRole('ADMIN_TERRAIN','SUPER_ADMIN_PROMOTER','PLATFORM_ADMIN')")
    public ResponseEntity<MatchEvent> addEvent(@PathVariable Long id,
                                               @RequestBody AddEventRequest request) {
        return matchRepository.findById(id).map(match -> {
            // Update score
            if (request.eventType != null &&
               (request.eventType.contains("BUT") || request.eventType.contains("PANIER"))) {
                int pts = request.points > 0 ? request.points : 1;
                if (request.homeTeam) match.setHomeScore(match.getHomeScore() + pts);
                else match.setAwayScore(match.getAwayScore() + pts);
                matchRepository.save(match);
            }
            MatchEvent event = MatchEvent.builder()
                    .match(match)
                    .eventType(request.eventType)
                    .minute(request.minute)
                    .description(request.description)
                    .build();
            MatchEvent saved = eventRepository.save(event);
            messagingTemplate.convertAndSend("/topic/match/" + id + "/events",
                Map.of("eventType", saved.getEventType() != null ? saved.getEventType() : "",
                       "minute", saved.getMinute() != null ? saved.getMinute() : 0,
                       "homeScore", match.getHomeScore(),
                       "awayScore", match.getAwayScore()));
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/finish")
    @PreAuthorize("hasAnyRole('ADMIN_TERRAIN','SUPER_ADMIN_PROMOTER','PLATFORM_ADMIN')")
    public ResponseEntity<Match> finishMatch(@PathVariable Long id) {
        return matchRepository.findById(id).map(match -> {
            match.setStatus(MatchStatus.FINISHED);
            match.setEndedAt(LocalDateTime.now());
            return ResponseEntity.ok(matchRepository.save(match));
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class AddEventRequest {
        public String eventType;
        public Integer minute;
        public String description;
        public boolean homeTeam;
        public int points = 1;
    }
}

// ═══════════════════════════════════════════════════════════════
// TOURNAMENT CONTROLLER
// ═══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "*")
class TournamentController {

    private final TournamentRepository tournamentRepository;
    private final MatchRepository matchRepository;

    public TournamentController(TournamentRepository tournamentRepository,
                                MatchRepository matchRepository) {
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
    }

    @GetMapping
    public ResponseEntity<List<Tournament>> getAllTournaments(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String status) {
        if (country != null && status != null) {
            return ResponseEntity.ok(tournamentRepository.findByCountryAndStatus(
                    country, TournamentStatus.valueOf(status.toUpperCase())));
        }
        if (status != null) {
            return ResponseEntity.ok(tournamentRepository.findByStatus(
                    TournamentStatus.valueOf(status.toUpperCase())));
        }
        return ResponseEntity.ok(tournamentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournament(@PathVariable Long id) {
        return tournamentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<Match>> getTournamentMatches(@PathVariable Long id) {
        return ResponseEntity.ok(matchRepository.findByTournamentId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_PROMOTER','PLATFORM_ADMIN')")
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament) {
        return ResponseEntity.ok(tournamentRepository.save(tournament));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_PROMOTER','PLATFORM_ADMIN')")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long id,
                                                       @RequestBody Tournament updates) {
        return tournamentRepository.findById(id).map(t -> {
            t.setName(updates.getName());
            t.setDescription(updates.getDescription());
            t.setStartDate(updates.getStartDate());
            t.setEndDate(updates.getEndDate());
            return ResponseEntity.ok(tournamentRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }
}

// ═══════════════════════════════════════════════════════════════
// SPORT CONTROLLER
// ═══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/sports")
@CrossOrigin(origins = "*")
class SportController {

    private final SportTemplateRepository sportRepository;

    public SportController(SportTemplateRepository sportRepository) {
        this.sportRepository = sportRepository;
    }

    @GetMapping
    public ResponseEntity<List<SportTemplate>> getAllSports() {
        return ResponseEntity.ok(sportRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SportTemplate> getSport(@PathVariable Long id) {
        return sportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<SportTemplate> createSport(@RequestBody SportTemplate sport) {
        return ResponseEntity.ok(sportRepository.save(sport));
    }
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC CONTROLLER
// ═══════════════════════════════════════════════════════════════
@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
class PublicController {

    private final TournamentRepository tournamentRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public PublicController(TournamentRepository tournamentRepository,
                            MatchRepository matchRepository,
                            TeamRepository teamRepository,
                            PlayerRepository playerRepository) {
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    @GetMapping("/home")
    public ResponseEntity<?> getHomepage() {
        return ResponseEntity.ok(Map.of(
            "liveMatches", matchRepository.findLiveMatches(),
            "ongoingTournaments", tournamentRepository.findByStatus(TournamentStatus.ONGOING),
            "upcomingTournaments", tournamentRepository.findByStatus(TournamentStatus.REGISTRATION_OPEN)
        ));
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getTeams(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city) {
        if (country != null) return ResponseEntity.ok(teamRepository.findByCountry(country));
        if (city != null) return ResponseEntity.ok(teamRepository.findByCity(city));
        return ResponseEntity.ok(teamRepository.findAll());
    }

    @GetMapping("/players/search")
    public ResponseEntity<List<Player>> searchPlayers(
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String nationality) {
        if (nationality != null) return ResponseEntity.ok(playerRepository.findByNationality(nationality));
        if (position != null) return ResponseEntity.ok(playerRepository.findByPosition(position));
        return ResponseEntity.ok(playerRepository.findAll());
    }
}
