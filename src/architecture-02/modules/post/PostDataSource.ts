export interface IPostDataSource {
  findById(id: string): Promise<any>;
  find(): Promise<any[]>;
}
