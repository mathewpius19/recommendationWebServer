package org.recommender.repository;

import org.recommender.entity.Interactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interactions, Long> {

    List<Interactions> findByUserId(Long UserId);
}
