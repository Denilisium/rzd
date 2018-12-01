import { ws_port } from '../common/config.json';
import { fork } from 'child_process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Package from './models/Package';

import run from './calculation';
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
  const reouteId = +req.query.routeId;
  const whereQuery: string = req.query.sqlQuery;

  new Promise((resolve, reject) => {
    debugger;
    let selectQuery = 'select * from Traffic where fromStationId <> stationId';
    // if (whereQuery) {
    //   selectQuery += ' AND ' + whereQuery
    // }
    const pack = new Package('exec', selectQuery);
    process.send(pack);
    subscribe(pack.id, (response) => {
      if (response.fail !== true) {
        resolve(response.payload);
      } else {
        reject();
      }
    });
  })
    .then((data) => {
      return new Promise((resolve, reject) => {
        const pack = new Package('exec', `select * from Timings where routeId=${reouteId} AND fromStationId <> stationId`);
        process.send(pack);
        subscribe(pack.id, (response) => {
          if (response.fail !== true) {
            resolve({ traffic: data, timings: response.payload });
          } else {
            reject();
          }
        });
      })
    })
    .then((res: any) => {
      debugger;
      console.log(res.tosdf);
    });

  // run(req.query.scriptPath, [], [])
  //   .then((res: any) => {
  //     res.send({ result: res });
  //   })
  //   .catch((error: any) => {
  //     console.error('error r', error);
  //     res.status(400).send(error);
  //   });
});

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
