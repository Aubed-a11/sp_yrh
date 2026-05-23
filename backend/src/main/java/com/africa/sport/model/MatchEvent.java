package com.africa.sport.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "match_events")
public class MatchEvent {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(nullable = false)
    private String eventType;

    private Integer minute;
    private String description;
    private LocalDateTime occurredAt;

    @PrePersist
    protected void onCreate() { occurredAt = LocalDateTime.now(); }

    public MatchEvent() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Match match;
        private String eventType, description;
        private Integer minute;
        private Team team;
        private Player player;

        public Builder match(Match v)       { this.match = v; return this; }
        public Builder eventType(String v)  { this.eventType = v; return this; }
        public Builder description(String v){ this.description = v; return this; }
        public Builder minute(Integer v)    { this.minute = v; return this; }
        public Builder team(Team v)         { this.team = v; return this; }
        public Builder player(Player v)     { this.player = v; return this; }

        public MatchEvent build() {
            MatchEvent e = new MatchEvent();
            e.match = match; e.eventType = eventType;
            e.description = description; e.minute = minute;
            e.team = team; e.player = player;
            return e;
        }
    }

    // Getters / Setters
    public Long getId()               { return id; }
    public Match getMatch()           { return match; }
    public void setMatch(Match v)     { this.match = v; }
    public Player getPlayer()         { return player; }
    public void setPlayer(Player v)   { this.player = v; }
    public Team getTeam()             { return team; }
    public void setTeam(Team v)       { this.team = v; }
    public String getEventType()      { return eventType; }
    public void setEventType(String v){ this.eventType = v; }
    public Integer getMinute()        { return minute; }
    public void setMinute(Integer v)  { this.minute = v; }
    public String getDescription()    { return description; }
    public void setDescription(String v){ this.description = v; }
    public LocalDateTime getOccurredAt(){ return occurredAt; }
}
