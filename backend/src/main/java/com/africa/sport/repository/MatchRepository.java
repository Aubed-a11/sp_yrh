package com.africa.sport.repository;

import com.africa.sport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.status = 'LIVE' ORDER BY m.startedAt DESC")
    List<Match> findLiveMatches();

    @Query("SELECT m FROM Match m WHERE m.tournament.id = :tId ORDER BY m.scheduledAt")
    List<Match> findByTournamentId(@Param("tId") Long tId);

    @Query("SELECT m FROM Match m WHERE (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId)")
    List<Match> findByTeamId(@Param("teamId") Long teamId);
}
