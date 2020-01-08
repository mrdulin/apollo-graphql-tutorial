import { RESTDataSource } from 'apollo-datasource-rest';
import { Response, Request } from 'apollo-server-env';

class SomeDataSource extends RESTDataSource {
  protected async didReceiveResponse<TResult>(res: Response, req: Request): Promise<TResult> {
    if (res.status === 404) {
      return (null as any) as Promise<TResult>;
    }

    return super.didReceiveResponse<TResult>(res, req);
  }
}
