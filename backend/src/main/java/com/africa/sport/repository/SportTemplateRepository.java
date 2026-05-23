package com.africa.sport.repository;

import com.africa.sport.model.SportTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SportTemplateRepository extends JpaRepository<SportTemplate, Long> {
    List<SportTemplate> findByActiveTrue();
}
