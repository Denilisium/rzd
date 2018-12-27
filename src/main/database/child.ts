import dbHandler from './handler';
import * as fs from 'fs';
import Package from '../models/Package';



process.on('message', (message: Package) => {
  console.info('####### child -> on -> ' + message.action, message);
  const response = { ...message, payload: null } as Package;

  switch (message.action) {
    case 'open':
      fs.readFile(message.payload, (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          response.fail = true;
          response.payload = err;
        }
        const result = dbHandler.open(data);
        if (result !== true) {
          response.fail = true;
        }
        if (process.send) {
          sendBack(response);
        }
      });
      break;
    case 'save':
      const bytes = dbHandler.save();
      fs.writeFile(message.payload, bytes, (err) => {
        if (err) {
          response.fail = true;
          response.payload = err;
        }

        if (process.send) {
          sendBack(response);
        }
      });
      break;
    case 'exec':
      response.payload = dbHandler.exec(message.payload);
      sendBack(response);
      break;
    case 'run':
      dbHandler.run(message.payload);
      sendBack(response);
      break;
    case 'last_row_id':
      response.payload = dbHandler.getLastRowId();
      sendBack(response);
      break;
    case 'close':
      dbHandler.close();
      sendBack(response);
      break;
    default:
      break;
  }
});

function sendBack(message: Package) {
  console.info('####### child -> send back ->', message.action);
  if (process.send) {
    process.send(message);
  }
}
