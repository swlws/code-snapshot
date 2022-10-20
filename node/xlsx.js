//
// 导出EXCEL
//

const Excel = require("exceljs");

class Xlsx {
  constructor(filepath) {
    this.filepath = filepath;

    this.__initWorkbook();
  }

  __initWorkbook() {
    const workbook = new Excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    this.workbook = workbook;
  }

  addWorksheet(name = "sheet") {
    this.sheet = this.workbook.addWorksheet(name, {
      properties: {
        defaultColWidth: 10,
      },
    });
  }

  setColumns(columns = []) {
    this.sheet.columns = columns;
  }

  setRows(rows = []) {
    this.sheet.addRows(rows);
  }

  async writeFile() {
    await this.workbook.xlsx.writeFile(this.filepath);
  }
}

function autoColumnWidth(columns, rows) {
  for (let col of columns) {
    const { key, header = "" } = col;
    const width = rows.reduce((w, item) => {
      const len = (item[key] || "").length;
      return Math.max(w, len);
    }, header.length);

    col.width = Math.max(10, Math.min(width * 2.5, 50));
  }
}

async function createWorkbook(distpath, sheetOption) {
  if (!distpath) return;
  if (!Array.isArray(sheetOption)) sheetOption = [];

  const xlsx = new Xlsx(distpath);

  for (let item of sheetOption) {
    const { name, columns, rows } = item;

    autoColumnWidth(columns, rows);

    xlsx.addWorksheet(name);
    xlsx.setColumns(columns);
    xlsx.setRows(rows);
  }

  await xlsx.writeFile();
}
module.exports = createWorkbook;

// 测试代码
// const path = require("path");
// const distpath = path.resolve(__dirname, "1.xlsx");
// createWorkbook(distpath, [
//   {
//     name: "sheet",
//     columns: [{ header: "ID", key: "id", width: 20 }],
//     rows: [{ id: "xxx-001010" }],
//   },
// ]);
