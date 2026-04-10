package org.recommender.dto.response;

import java.util.List;

public class MovieIdsResponse {

    private List<Long> movieIds;

    public List<Long> getMovieIds() {
        return movieIds;
    }

    public void setMovieIds(List<Long> movieIds) {
        this.movieIds = movieIds;
    }
}
