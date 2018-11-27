import HttpClient from '../../common/HttpClient';

class PredictionService {
  run(scriptPath: string, routeId: number, sqlQuery: string): Promise<any> {
    return HttpClient.get('script/run', {
      scriptPath,
      routeId,
      sqlQuery,
    });
  }
}

export default PredictionService;