package com.africa.sport.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sport_templates")
public class SportTemplate {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String icon;
    private String description;
    private String playerConfigurations;
    private String matchDuration;

    @Column(columnDefinition = "TEXT")
    private String events;

    @Column(columnDefinition = "TEXT")
    private String statistics;

    @Column(columnDefinition = "TEXT")
    private String positions;

    @Column(columnDefinition = "TEXT")
    private String terminology;

    @Column(columnDefinition = "TEXT")
    private String rules;

    private boolean active = true;

    public SportTemplate() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name, icon, description, playerConfigurations;
        private String matchDuration, events, statistics, positions;
        private String terminology, rules;
        private boolean active = true;

        public Builder name(String v)                 { this.name = v; return this; }
        public Builder icon(String v)                 { this.icon = v; return this; }
        public Builder description(String v)          { this.description = v; return this; }
        public Builder playerConfigurations(String v) { this.playerConfigurations = v; return this; }
        public Builder matchDuration(String v)        { this.matchDuration = v; return this; }
        public Builder events(String v)               { this.events = v; return this; }
        public Builder statistics(String v)           { this.statistics = v; return this; }
        public Builder positions(String v)            { this.positions = v; return this; }
        public Builder terminology(String v)          { this.terminology = v; return this; }
        public Builder rules(String v)                { this.rules = v; return this; }
        public Builder active(boolean v)              { this.active = v; return this; }

        public SportTemplate build() {
            SportTemplate s = new SportTemplate();
            s.name = name; s.icon = icon; s.description = description;
            s.playerConfigurations = playerConfigurations;
            s.matchDuration = matchDuration; s.events = events;
            s.statistics = statistics; s.positions = positions;
            s.terminology = terminology; s.rules = rules; s.active = active;
            return s;
        }
    }

    // Getters
    public Long getId()                    { return id; }
    public String getName()                { return name; }
    public void setName(String v)          { this.name = v; }
    public String getIcon()                { return icon; }
    public String getDescription()         { return description; }
    public String getPlayerConfigurations(){ return playerConfigurations; }
    public String getMatchDuration()       { return matchDuration; }
    public String getEvents()              { return events; }
    public String getStatistics()          { return statistics; }
    public String getPositions()           { return positions; }
    public String getTerminology()         { return terminology; }
    public String getRules()               { return rules; }
    public boolean isActive()              { return active; }
    public void setActive(boolean v)       { this.active = v; }
}
