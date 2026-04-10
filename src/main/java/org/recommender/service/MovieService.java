package org.recommender.service;

import org.recommender.dto.response.MovieResponse;
import org.recommender.entity.Movies;

import java.util.List;

public interface MovieService {

    List<Movies> findAll();

    Movies findMovieById(Long movieId);

    List<Movies> findMovieByIds(List<Long> movieIds);

    List<MovieResponse> recommendMoviesByQuery(String query);

    List<MovieResponse> recommendMoviesByUserId(Long userId);
}
