import HttpClient from '../../common/HttpClient';

class PredictionService {
  run(scriptPath: string, folderPath: string, name: string, sqlQuery: string): Promise<any> {
    return HttpClient.get('script/run', {
      scriptPath,
      folderPath,
      name,
      sqlQuery,
    });
  }

  openFolder(folderPath: string) {
    return HttpClient.get('script/openFolder', {
      folderPath
    });
  }
}

export default PredictionService;