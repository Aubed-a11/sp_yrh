package com.africa.sport.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tournaments")
public class Tournament {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logo;
    private String city;
    private String country;
    private String description;

    @ManyToOne
    @JoinColumn(name = "sport_id", nullable = false)
    private SportTemplate sport;

    @ManyToOne
    @JoinColumn(name = "promoter_id")
    private User promoter;

    @Enumerated(EnumType.STRING)
    private TournamentFormat format;

    @Enumerated(EnumType.STRING)
    private TournamentStatus status;

    private Integer maxTeams;
    private String playerConfig;
    private String matchDuration;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToMany
    @JoinTable(
        name = "tournament_teams",
        joinColumns = @JoinColumn(name = "tournament_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<Team> teams = new ArrayList<>();

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Match> matches = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = TournamentStatus.DRAFT;
    }

    public Tournament() {}

    // Getters / Setters
    public Long getId()                       { return id; }
    public String getName()                   { return name; }
    public void setName(String v)             { this.name = v; }
    public String getLogo()                   { return logo; }
    public void setLogo(String v)             { this.logo = v; }
    public String getCity()                   { return city; }
    public void setCity(String v)             { this.city = v; }
    public String getCountry()                { return country; }
    public void setCountry(String v)          { this.country = v; }
    public String getDescription()            { return description; }
    public void setDescription(String v)      { this.description = v; }
    public SportTemplate getSport()           { return sport; }
    public void setSport(SportTemplate v)     { this.sport = v; }
    public User getPromoter()                 { return promoter; }
    public void setPromoter(User v)           { this.promoter = v; }
    public TournamentFormat getFormat()       { return format; }
    public void setFormat(TournamentFormat v) { this.format = v; }
    public TournamentStatus getStatus()       { return status; }
    public void setStatus(TournamentStatus v) { this.status = v; }
    public Integer getMaxTeams()              { return maxTeams; }
    public void setMaxTeams(Integer v)        { this.maxTeams = v; }
    public String getPlayerConfig()           { return playerConfig; }
    public void setPlayerConfig(String v)     { this.playerConfig = v; }
    public String getMatchDuration()          { return matchDuration; }
    public void setMatchDuration(String v)    { this.matchDuration = v; }
    public LocalDate getStartDate()           { return startDate; }
    public void setStartDate(LocalDate v)     { this.startDate = v; }
    public LocalDate getEndDate()             { return endDate; }
    public void setEndDate(LocalDate v)       { this.endDate = v; }
    public List<Team> getTeams()              { return teams; }
    public void setTeams(List<Team> v)        { this.teams = v; }
    public List<Match> getMatches()           { return matches; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
}
