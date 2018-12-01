import * as tmp from 'tmp';
import { writeFile, readFile } from 'fs';
import { spawn } from 'child_process';

function run(scriptPath: string, data: any[], stationNumbers: number[]) {
  return new Promise((resolve, reject) => {
    const _reject = (reason: any, clean: () => void) => {
      clean();
      reject(reason);
    }

    const _resolve = (data: any, clean: () => void) => {
      clean();
      resolve(data);
    }

    const args = ['--vanilla', scriptPath, stationNumbers.join(',')];

    tmp.dir((err, path, cleanDir) => {
      if (err) {
        _reject(err, cleanDir);
      }

      const inpath = path + '/in.csv';
      const outpath = path = '/out.txt';

      args.push('out.txt');

      writeFile(inpath, parseToCsv(data), (clbk) => {
        const child = spawn("Rscript", args);
        child.on('close', () => {
          readFile(outpath, (err, data) => {
            if (err) {
              _reject(err, cleanDir);
            }
            _resolve(data, cleanDir);
          });
        });
      });

    });
  });
}

function parseToCsv(data: any, columns: string[] = []): string {
  function addNewRow(row: any[]) {
    return row.join(',') + '\\n';
  }

  let res = '';

  const keys = Object.keys(data[0]);
  if (columns.length) {
    res += addNewRow(columns);
  } else {
    res += addNewRow(keys);
  }

  let row: any[] = [];
  data.map((dat: any) => {
    row = [];
    keys.map((field: string) => {
      row.push(dat[field]);
    });
    res += addNewRow(columns);
  });

  return res;
}

export default run;