package org.recommender.service;

import org.recommender.dto.request.InteractionDTO;
import org.recommender.dto.request.RecommendationRequest;
import org.recommender.dto.request.SearchRequest;
import org.recommender.dto.response.MovieIdsResponse;
import org.recommender.dto.response.MovieResponse;
import org.recommender.entity.Interactions;
import org.recommender.entity.Movies;
import org.recommender.repository.MovieRepository;
import org.recommender.webClient.RecommenderClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collector;

@Service
public class MovieServiceImpl implements MovieService{

    UserService userService;
    InteractionsService interactionsService;
    MovieRepository movieRepository;
    private final WebClient flaskApiClient;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository, WebClient flaskApiClient, UserService userService, InteractionsService interactionsService){

        this.movieRepository = movieRepository;
        this.flaskApiClient = flaskApiClient;
        this.userService = userService;
        this.interactionsService = interactionsService;
    }

    public List<Movies> findAll(){
        return movieRepository.findAll();
    }

    @Override
    public Movies findMovieById(Long movieId) {

        return movieRepository.findByMovieId(movieId)
                .orElseThrow(()-> new RuntimeException(" movie not found..."));
    }

    @Override
    public List<Movies> findMovieByIds(List<Long> movieIds) {
        return movieRepository.findByMovieIdIn (movieIds);
    }

    @Override
    public List<MovieResponse> recommendMoviesByQuery(String query){

        SearchRequest searchQuery = new SearchRequest(query.replaceAll("\n", ""));
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Request JSON being sent :" + mapper.writeValueAsString(searchQuery));
        MovieIdsResponse response = flaskApiClient.
                post()
                .uri("search")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(searchQuery)
                .retrieve()
                .bodyToMono(MovieIdsResponse.class)
                .block();
        System.out.println(response.getMovieIds());

        if (!response.getMovieIds().isEmpty()) {
            System.out.println(response.toString());
            return response.getMovieIds().stream()
                    .map(movieId -> movieRepository.findByMovieId(movieId).
                            orElse(null)).filter(Objects::nonNull).
                    map(movie -> new MovieResponse(movie.getMovieId(), movie.getTitle(), movie.getGenres(), movie.getPosterUrl()))
                    .toList();
        }
        System.out.println("No movies Found...");
        return null;
    }

    public List<MovieResponse> recommendMoviesByUserId(Long userId){

        if(userId!=0){
            List<String> genres = userService.getUserPrefGenres(userId);
            List<InteractionDTO> userInteractions = interactionsService.getInteractionsByUserId(userId)
                    .stream()
                    .map(InteractionDTO::new)
                    .toList();

            RecommendationRequest request = new RecommendationRequest(userId,genres,userInteractions);
            MovieIdsResponse response = flaskApiClient.
                    post()
                    .uri("buildUserPreferences")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MovieIdsResponse.class)
                    .block();
            System.out.println(response);

            if (response!=null && !response.getMovieIds().isEmpty()) {
                System.out.println(response.toString());
                return response.getMovieIds().stream()
                        .map(movieId -> movieRepository.findByMovieId(movieId).
                                orElse(null)).filter(Objects::nonNull).
                        map(movie -> new MovieResponse(movie.getMovieId(), movie.getTitle(), movie.getGenres(), movie.getPosterUrl()))
                        .toList();
            }
            System.out.println("No movies Found...");
            return null;

        }
        return null;
    }

}

