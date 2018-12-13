import * as fs from 'fs';
import * as path from 'path';
import { readFile } from 'fs';
import { spawn } from 'child_process';

function run(scriptPath: string, folderPath: string, data: any[], stationNumbers: number[]) {
  return new Promise((resolve, reject) => {
    const args = ['--vanilla', scriptPath, stationNumbers.join(',')];

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    } else {
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        fs.unlinkSync(path.join(folderPath, file));
      }
    }

    const inpath = folderPath + '/in.csv';
    const outpath = folderPath + '/out.txt';

    args.push(folderPath);

    fs.writeFileSync(inpath, parseToCsv(data));
    const child = spawn('Rscript', args);
    child.on('error', (err) => {
      console.error(err);
      reject(err);
    });
    child.on('close', () => {
      readFile(outpath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve();
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