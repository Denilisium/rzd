import { ws_port } from '../../common/config.json';

export default class HttpClient {
  public static get(method: string, query?: any): Promise<any> {
    let url = 'http://localhost:' + ws_port + '/' + method;
    const params: string[] = [];
    if (query && query instanceof Object) {
      Object.keys(query).map((field) => {
        const value = query[field];
        params.push(`${field}=${value}`);
      });
    }
    if (params.length) {
      url += '?' + params.join('&');
    }

    return fetch(url)
      .then((resp: Response) => {
        const json = resp.json();
        return json;
      });
  }
}