import xlsx from "xlsx";
import { AppError } from "../utils/errors.js";

const flattenRows = (worksheet) =>
  xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    defval: ""
  });

export const parseSpreadsheet = (buffer, fileName) => {
  if (!buffer?.length) {
    throw new AppError("The uploaded file is empty.");
  }

  const workbook = xlsx.read(buffer, {
    type: "buffer",
    raw: false
  });

  const [firstSheetName] = workbook.SheetNames;

  if (!firstSheetName) {
    throw new AppError("No readable sheet was found in the uploaded file.");
  }

  const rows = flattenRows(workbook.Sheets[firstSheetName]);

  if (!rows.length) {
    throw new AppError(`No rows were found in ${fileName}.`);
  }

  return rows;
};

