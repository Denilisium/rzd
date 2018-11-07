class Import {

  public processCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(this.processData(reader.result));
        }
        else {
          reject(new Error('File doesn\'t contain test'));
        }
      };
      reader.readAsText(file);
    });
  }

  private processData(text: string) {
    const allTextLines = text.split(/\r\n|\n/);
    const fields = allTextLines[0].split(',');
    const output = [];

    for (let i = 1; i < allTextLines.length; i++) {
      const data = allTextLines[i].split(',');
      if (data.length === fields.length) {

        const obj = {};
        fields.map((field) => {
          obj[field] = data[field];
        });
        output.push(obj);
      }
    }
    return output;
  }
}