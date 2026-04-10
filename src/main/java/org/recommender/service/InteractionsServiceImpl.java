package org.recommender.service;

import org.recommender.entity.Interactions;
import org.recommender.repository.InteractionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionsServiceImpl implements InteractionsService{

    InteractionRepository interactionRepository;

    public InteractionsServiceImpl(InteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
    }

    @Override
    public List<Interactions> getInteractionsByUserId(Long userId){
        return interactionRepository.findByUserId(userId);
    }
}
