package org.recommender.rest;

import org.recommender.dto.request.SearchRequest;
import org.recommender.dto.response.MovieResponse;
import org.recommender.entity.Movies;
import org.recommender.entity.User;
import org.recommender.repository.MovieRepository;
import org.recommender.service.MovieService;
import org.recommender.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

//Define routes
@RestController
@RequestMapping("/recommender")
public class Routes {

    MovieService movieService;
    UserService userService;

    public Routes(UserService userService, MovieService movieService) {
        this.userService = userService;
        this.movieService = movieService;
    }

    @GetMapping("/home")
    public String displayHome(){
        return "Welcome Home";
    }

    @GetMapping("/users")
    public List<User> getUsers(){

        return userService.findAll();
    }

    @PostMapping("/signup")
    public User registerUser(@RequestBody User user) throws Exception {
        try{
            System.out.print("Saving User....");
            return userService.signup(user.getEmail(), user.getPassword(), user.getUserName());
        }
        catch(Exception e){
            System.out.print("Error while saving User....");
            throw new Exception(e.getMessage());
        }
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) throws Exception{
        try{
            System.out.println("Validating User...");
            return userService.login(user.getEmail(), user.getPassword());
        }
        catch(Exception e){
            System.out.println("Error while logging in..");
            throw new Exception(e.getMessage());
        }
    }
    @DeleteMapping("/delete")
    public User deleteUser(@RequestBody User user) throws Exception{
        try{
            System.out.println("Deleting User...");
            return userService.deleteUser(user.getEmail(), user.getPassword());
        }
        catch(Exception e){
            System.out.println("Error while logging in..");
            throw new Exception(e.getMessage());
        }
    }

    // movie routes

    @GetMapping("/movies")
    public List<Movies> getMovies(){
        return movieService.findAll();
    }

    @PostMapping("/movies")
    public Movies getMoviesById(@RequestBody Movies movie){

        if(movie.getMovieId()!=0){
            System.out.println("Finding movie id...");
            return movieService.findMovieById(movie.getMovieId());
        }
        else{
            System.out.println("movie id not valid...");
            return null;
        }
    }

    @PostMapping("/movies/byIds")
    public List<Movies> getMoviesByIds(@RequestBody List<Long> movieIds){

        if(movieIds!=null && !movieIds.isEmpty()){
       movieIds = movieIds.stream().filter(Objects::nonNull)
               .toList();
            return movieService.findMovieByIds(movieIds);
        }
        else{
            return new ArrayList<>();
        }
    }

    @PostMapping("/movies/search")
    public List<MovieResponse> getMoviesByQuery(@RequestBody SearchRequest searchQuery) {
        String query = searchQuery.getQuery();
        if (query != null && !query.isEmpty()) {
            List<MovieResponse> movies = movieService.recommendMoviesByQuery(query);
            System.out.println(movies.toString());
            return movies;
        }
        return null;
    }

    @GetMapping("/movies/userRecommendations")
    public List<MovieResponse> getMoviesForUser(@RequestParam(value = "userId") Long userId){

        return movieService.recommendMoviesByUserId(userId);

    }


}

