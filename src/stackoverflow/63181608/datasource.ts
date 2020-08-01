import { RESTDataSource } from 'apollo-datasource-rest';
import FormData from 'form-data';

export default class MyDatasource extends RESTDataSource {
  public async postFileToServer({ str }) {
    const inMemoryFile = Buffer.from(str, 'utf-8');
    const myForm = new FormData();
    myForm.append('file', inMemoryFile, 'file.txt');
    const url = 'http://localhost:3000/upload';

    return this.post(url, myForm);
  }
}
