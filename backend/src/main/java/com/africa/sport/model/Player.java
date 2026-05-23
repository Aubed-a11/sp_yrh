package com.africa.sport.model;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String photo;
    private Integer jerseyNumber;
    private String position;
    private Integer age;
    private String nationality;
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    public Player() {}

    // Getters / Setters
    public Long getId()                { return id; }
    public String getFirstName()       { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getLastName()        { return lastName; }
    public void setLastName(String v)  { this.lastName = v; }
    public String getPhoto()           { return photo; }
    public void setPhoto(String v)     { this.photo = v; }
    public Integer getJerseyNumber()   { return jerseyNumber; }
    public void setJerseyNumber(Integer v){ this.jerseyNumber = v; }
    public String getPosition()        { return position; }
    public void setPosition(String v)  { this.position = v; }
    public Integer getAge()            { return age; }
    public void setAge(Integer v)      { this.age = v; }
    public String getNationality()     { return nationality; }
    public void setNationality(String v){ this.nationality = v; }
    public boolean isActive()          { return active; }
    public void setActive(boolean v)   { this.active = v; }
    public Team getTeam()              { return team; }
    public void setTeam(Team v)        { this.team = v; }
}
