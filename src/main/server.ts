import { ws_port } from '../common/config.json';
import { fork } from 'child_process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Package from './models/Package';

import * as R from 'r-script';

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
  const r = R(req.query.scriptPath);
  r.call(function (err, d) {
    if (err) {
      res.status(400).send(err);
    };
    res.send(d);
  });
});

interface SubscribeCallback {
  (response: Package): void;
}

const $$subscribes: Map<string, SubscribeCallback> = new Map();
// function subscribe(id: number, cbk: SubscribeCallback) {
//   $$subscribes.set(id, cbk);
// }

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
