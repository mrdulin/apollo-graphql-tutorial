import { RESTDataSource } from 'apollo-datasource-rest';

export class MoviesAPI extends RESTDataSource {
  public async getMovies() {
    const songs = await this.context.dataSources.songsAPI.getSongs();
    const movies = ['a', 'b'];
    return JSON.stringify({ movies, songs });
  }
}
