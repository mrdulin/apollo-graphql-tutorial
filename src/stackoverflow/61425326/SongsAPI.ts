import { RESTDataSource } from 'apollo-datasource-rest';

export class SongsAPI extends RESTDataSource {
  public async getSongs() {
    return ['x', 'y'];
  }
}
