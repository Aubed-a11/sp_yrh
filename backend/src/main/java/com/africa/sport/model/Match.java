package com.africa.sport.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
public class Match {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    private Integer homeScore = 0;
    private Integer awayScore = 0;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    private LocalDateTime scheduledAt;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private String venue;
    private Integer round;
    private String phase;
    private String matchGroup;
    private Integer minute;

    @ManyToOne
    @JoinColumn(name = "admin_terrain_id")
    private User adminTerrain;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<MatchEvent> events = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = MatchStatus.SCHEDULED;
    }

    public Match() {}

    // Getters / Setters
    public Long getId()                      { return id; }
    public Tournament getTournament()        { return tournament; }
    public void setTournament(Tournament v)  { this.tournament = v; }
    public Team getHomeTeam()                { return homeTeam; }
    public void setHomeTeam(Team v)          { this.homeTeam = v; }
    public Team getAwayTeam()                { return awayTeam; }
    public void setAwayTeam(Team v)          { this.awayTeam = v; }
    public Integer getHomeScore()            { return homeScore; }
    public void setHomeScore(Integer v)      { this.homeScore = v; }
    public Integer getAwayScore()            { return awayScore; }
    public void setAwayScore(Integer v)      { this.awayScore = v; }
    public MatchStatus getStatus()           { return status; }
    public void setStatus(MatchStatus v)     { this.status = v; }
    public LocalDateTime getScheduledAt()    { return scheduledAt; }
    public void setScheduledAt(LocalDateTime v){ this.scheduledAt = v; }
    public LocalDateTime getStartedAt()      { return startedAt; }
    public void setStartedAt(LocalDateTime v){ this.startedAt = v; }
    public LocalDateTime getEndedAt()        { return endedAt; }
    public void setEndedAt(LocalDateTime v)  { this.endedAt = v; }
    public String getVenue()                 { return venue; }
    public void setVenue(String v)           { this.venue = v; }
    public Integer getRound()                { return round; }
    public void setRound(Integer v)          { this.round = v; }
    public String getPhase()                 { return phase; }
    public void setPhase(String v)           { this.phase = v; }
    public String getMatchGroup()            { return matchGroup; }
    public void setMatchGroup(String v)      { this.matchGroup = v; }
    public Integer getMinute()               { return minute; }
    public void setMinute(Integer v)         { this.minute = v; }
    public User getAdminTerrain()            { return adminTerrain; }
    public void setAdminTerrain(User v)      { this.adminTerrain = v; }
    public List<MatchEvent> getEvents()      { return events; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
}
