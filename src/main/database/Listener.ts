// import * as fs from 'fs';

// import DatabaseHandler from './handler';
// import Output from '../../common/Output';
// import ChannelListener from '../services/ChannelListener';

// export default class Mediator {
//   private dbHandler: DatabaseHandler;

//   constructor() {
//     this.dbHandler = DatabaseHandler.instance;
//   }

//   public listen() {
//     ChannelListener.subscribe('db:exec', (query: string, send) => {
//       send(this.dbHandler.exec(query));
//     });

//     ChannelListener.subscribe('db:run', (query: string, send) => {
//       send(this.dbHandler.run(query));
//     });

//     ChannelListener.subscribe('db:last_row_id', (args: any, send) => {
//       send(this.dbHandler.getLastRowId());
//     });

//     ChannelListener.subscribe('db:open', (path: string, send) => {
//       fs.readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
//         if (err) {
//           send(Output.error(err.message));
//         }
//         const result = this.dbHandler.open(data);
//         const output = result ? Output.success('') : Output.error('Can\'t open db');
//         send(output);
//       });
//     });

//     ChannelListener.subscribe('db:close', (args: any, send) => {
//       send(this.dbHandler.close());
//     });
//   }

//   public destroy() {
//     ChannelListener.unsibsribe('db:exec', 'db:run', 'db:open');
//   }
// } 