package com.africa.sport.repository;

import com.africa.sport.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamId(Long teamId);
    List<Player> findByPosition(String position);
    List<Player> findByNationality(String nationality);
}
