import React, { Component } from "react";
import { deleteMovie, getMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination.jsx";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import SearchBox from "./common/searchBox";
import _ from "lodash";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    showTable: true,
    pageSize: 4,
    curPage: 1,
    curGenre: "All Genres",
    searchQuery: "",
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const { data: movies } = await getMovies();
    const genres = [...data];

    this.setState({ movies, genres });
  }

  deleteHandler = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted");
      }
      this.setState({ movies: originalMovies });
    }

    const isVisible = movies.length > 0 ? true : false;
    this.setState({ showTable: isVisible });
  };

  likeHandler = (movie) => {
    const movies = this.state.movies.map((m) => {
      if (m._id === movie._id) {
        m.liked = !m.liked;
      }
      return m;
    });
    this.setState({ movies });
  };

  pageChangeHandler = (page) => {
    this.setState({ curPage: page });
  };

  genreChangeHandler = (genre) => {
    this.setState({ curGenre: genre, searchQuery: "", curPage: 1 });
  };

  sortHandler = (sortColumn) => {
    this.setState({ sortColumn });
  };

  searchHandler = (query) => {
    this.setState({ curGenre: "All Genres", curPage: 1, searchQuery: query });
  };

  getPagedData = () => {
    let filtered = this.state.movies;

    if (this.state.searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (movie) =>
        movie.genre.name === this.state.curGenre ||
        this.state.curGenre === "All Genres"
    );
    let sorted = _.orderBy(
      filtered,
      [this.state.sortColumn.path],
      [this.state.sortColumn.order]
    );
    const movies = paginate(sorted, this.state.curPage, this.state.pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { totalCount, data } = this.getPagedData();
    const { user } = this.props;
    const infoBar = this.state.showTable
      ? `Showing ${totalCount} movies from database`
      : "No movies to display";

    return (
      <div className="row">
        <div className="col-3 mt-4">
          <ListGroup
            items={this.state.genres}
            curGenre={this.state.curGenre}
            onGenreChange={this.genreChangeHandler}
          />
        </div>
        <div className="col">
          <p className="my-3">{infoBar}</p>
          <SearchBox
            value={this.state.searchQuery}
            onChange={this.searchHandler}
          />
          {this.state.showTable && (
            <MoviesTable
              movies={data}
              sortColumn={this.state.sortColumn}
              onLike={this.likeHandler}
              onDelete={this.deleteHandler}
              onSort={this.sortHandler}
            />
          )}

          <Pagination
            itemsCount={totalCount}
            pageSize={this.state.pageSize}
            onPageChange={this.pageChangeHandler}
            curPage={this.state.curPage}
          />
          {user && user.isAdmin && (
            <Link
              className="btn btn-primary mr-auto"
              style={{ marginLeft: "650px" }}
              to="/movies/new"
            >
              Add Movie
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default Movies;
