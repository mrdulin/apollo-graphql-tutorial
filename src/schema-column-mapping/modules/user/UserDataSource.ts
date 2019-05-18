export interface IUserDataSource {
  findById(id: string): Promise<any>;
}
