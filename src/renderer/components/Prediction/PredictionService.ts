import HttpClient from '../../common/HttpClient';

class PredictionService {
  run(scriptPath: string, name: string, sqlQuery: string): Promise<any> {
    return HttpClient.get('script/run', {
      scriptPath,
      name,
      sqlQuery,
    });
  }
}

export default PredictionService;