package com.africa.sport.repository;

import com.africa.sport.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatus(TournamentStatus status);
    List<Tournament> findByCountryAndStatus(String country, TournamentStatus status);
    List<Tournament> findByCity(String city);

    @Query("SELECT t FROM Tournament t WHERE t.promoter.id = :promoterId")
    List<Tournament> findByPromoterId(@Param("promoterId") Long promoterId);
}
