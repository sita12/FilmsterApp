class ReviewsController < ApplicationController
  before_action :authenticate_user!

  def create
    @movie = Movie.find_or_initialize_by(tmdb_id: params[:tmdb_id])
    Tmdb::Api.key("3deceb9041e72a8856191ddeaf96a293")
    Tmdb::Api.language("en")
    if @movie.new_record?
      # fetch movie data from API using params[:tmdb_id]
      @fetched_movie = Tmdb::Movie.detail(params[:tmdb_id])

      # create a new Movie based on the response data
      @movie.title = @fetched_movie.title
      @movie.plot = @fetched_movie.overview
      @movie.release_date = @fetched_movie.release_date
      @movie.released = true if (@fetched_movie.release_date[0...4].to_i <= Time.now.year)
      @movie.runtime = @fetched_movie.runtime
      @movie.popularity = @fetched_movie.popularity
       @movie.genre = @fetched_movie.genres.collect { |x| x[:name] }
      @fetched_movie.genres.each { |x| @movie.genre += (x.name + " ")}
      @movie.language = @fetched_movie.original_language
      @movie.budget = @fetched_movie.budget
      @movie.average_vote = @fetched_movie.vote_average
      @movie.vote_count = @fetched_movie.vote_count
      @movie.poster = @fetched_movie.poster_path
      @movie.homepage = @fetched_movie.homepage
      @movie.tmdb_id = @fetched_movie.id
      @movie.imdb_id = @fetched_movie.imdb_id

      @movie.save
    end

    # create a new review and connect it to the current_user and the movie
    @review = current_user.reviews.new(review_params.merge(movie_id: @movie.id))

    if @review.save
      flash[:success] = "Review saved!"
      redirect_to root_path
    else
      flash[:alert] = "Woops! It seems there was an error."
      redirect_to root_path
    end

  end

  private

  def review_params
    params.require(:review).permit(:comment)
  end
end