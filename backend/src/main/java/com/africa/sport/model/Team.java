package com.africa.sport.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String logo;
    private String city;
    private String country;
    private boolean permanent = false;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private SportTemplate sport;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Player> players = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Team() {}

    // Getters / Setters
    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public void setName(String v)        { this.name = v; }
    public String getLogo()              { return logo; }
    public void setLogo(String v)        { this.logo = v; }
    public String getCity()              { return city; }
    public void setCity(String v)        { this.city = v; }
    public String getCountry()           { return country; }
    public void setCountry(String v)     { this.country = v; }
    public boolean isPermanent()         { return permanent; }
    public void setPermanent(boolean v)  { this.permanent = v; }
    public SportTemplate getSport()      { return sport; }
    public void setSport(SportTemplate v){ this.sport = v; }
    public List<Player> getPlayers()     { return players; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getExpiresAt()  { return expiresAt; }
    public void setExpiresAt(LocalDateTime v){ this.expiresAt = v; }
}
