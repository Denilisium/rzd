import { ws_port } from '../common/config.json';
import { fork, exec } from 'child_process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Package from './models/Package';

import run from './calculation';
import Timings from './models/Timings';
import Traffic from './models/Traffic';
const app = express();


app.use(bodyParser.json());
app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
  console.error(err);
  res.status(500).send(err);
});

app.listen(ws_port, () => {
  console.log('Listen on ' + ws_port);
});

const process = fork('./dist/main/worker.js');
process.on('message', (message: Package) => {
  emit(message);
});

/**
 * Database part
 */
app.get('/db/exec', (req: express.Request, res: express.Response) => {
  const pack = new Package('exec', req.query.query);
  process.send(pack);
  subscribeAndResponse(pack.id, res);
});

app.get('/db/run', (req: express.Request, res: express.Response) => {
  const pack = new Package('run', req.query.query);
  process.send(pack);
  subscribeAndResponse(pack.id, res);
});

app.get('/db/last_row_id', (req: express.Request, res: express.Response) => {
  const pack = new Package('last_row_id');
  process.send(pack);
  subscribeAndResponse(pack.id, res);
});

app.get('/db/close', (req: express.Request, res: express.Response) => {
  const pack = new Package('close');
  process.send(pack);
  subscribeAndResponse(pack.id, res);
});


app.get('/db/open', (req: express.Request, res: express.Response) => {
  const pack = new Package('open', req.query.path);
  process.send(pack);
  subscribeAndResponse(pack.id, res);
});

app.get('/script/run', (req: express.Request, res: express.Response) => {
  const routeId = +req.query.routeId;
  const folderLocation = req.query.folder;
  const whereQuery: string = req.query.sqlQuery;

  prepareData(routeId)
    .then((output) => {
      run(req.query.scriptPath, folderLocation, output.data, output.stations)
        .then((output: any) => {
          openFolder(folderLocation);
          res.send({});
        })
        .catch((error: any) => {
          console.error('error r', error);
          res.status(400).send(error);
        });
    });
});

function openFolder(path: string) {
  // swith mac linux
  exec(`start "" "${path}"`);
}

function prepareData(routeId: number, whereQuery?: string): Promise<{ data: Traffic[], stations: number[] }> {
  let uniqueStations: Set<number>;
  let sql = Timings.buildQuery(routeId);

  return new Promise((resolve, reject) => {
    if (whereQuery) {
      sql += ' AND ' + whereQuery
    }

    // loading a route
    const pack = new Package('exec', sql);
    process.send(pack);
    subscribe(pack.id, (response) => {
      if (response.fail !== true) {
        resolve(response.payload);
      } else {
        reject();
      }
    });
  })
    .then((data: Timings[]) => {
      return new Promise((resolve, reject) => {
        // get all unique stations from the loaded route
        uniqueStations = new Set(data.map((item) => item.stationId));
        const firstStationId = uniqueStations[0];

        // loading all timestamps from Traffic with stations from the previously loaded route
        const pack = new Package('exec', Traffic.buildQuery(Array.from(uniqueStations)));
        process.send(pack);
        subscribe(pack.id, (response: any) => {
          if (response.fail !== true) {
            const traffic: Traffic[] = response.payload;
            const output: Traffic[] = [];

            // time from Timings -> Traffic data (setting norm_in_hour and time_in_hour)
            traffic.map((item, index) => {
              const norm = data.find((normData) => normData.fromStationId === item.fromStation &&
                normData.stationId === item.cstation);
              if (norm) {
                // converting from seconds to hours
                if (item.cstation !== firstStationId && index !== 0) {
                  item.time_in_hour -= traffic[index - 1].time_in_hour;
                } else {
                  item.time_in_hour = 0;
                }
                item.norm_in_hour = norm.timestamp / 3600;
                item.time_in_hour = item.time_in_hour / 3600;
                output.push(item);
              }
            });

            resolve(output);
          } else {
            reject();
          }
        });
      })
    })
    .then((response: Traffic[]) => {
      return { data: response, stations: Array.from(uniqueStations) };
    });
}

interface SubscribeCallback {
  (response: Package): void;
}

const $$subscribes: Map<string, SubscribeCallback> = new Map();

function subscribe(id: string, cbk: SubscribeCallback) {
  $$subscribes.set(id, cbk);
}

function subscribeAndResponse(id: string, res: express.Response) {
  console.info('------ main -> subscribe -> ' + id);
  $$subscribes.set(id, (message: Package) => {
    if (message.fail === true) {
      res.status(400).send(message.payload);
    } else {
      res.send(message.payload || {});
    }
  });
}

function emit(message: Package) {
  console.info(`------ get from child -> id ${message.id}, action: ${message.action}`);
  const _subscriber = $$subscribes.get(message.id);
  if (_subscriber) {
    console.info(`------ main -> emit -> id ${message.id}, action: ${message.action}`);
    _subscriber(message);
    $$subscribes.delete(message.id);
  }
}
