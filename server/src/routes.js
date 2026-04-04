import express from "express";
import multer from "multer";
import {
  COMMON_COUNTRY_CODES,
  DEFAULT_BATCH_SIZE,
  DEFAULT_CONTACT_PREFIX,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_GROUP_PREFIX,
  SUPPORTED_MIME_TYPES
} from "./utils/constants.js";
import { AppError } from "./utils/errors.js";
import { processContacts, generateVcf } from "./services/contact.service.js";
import { parseSpreadsheet } from "./services/spreadsheet.service.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_request, file, callback) => {
    const isSupportedMimeType = SUPPORTED_MIME_TYPES.has(file.mimetype);
    const isSupportedExtension = /\.(csv|xlsx)$/i.test(file.originalname);

    if (isSupportedMimeType || isSupportedExtension) {
      return callback(null, true);
    }

    return callback(new AppError("Please upload a .csv or .xlsx file."));
  }
});

router.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "bulk-whatsapp-contact-generator-api"
  });
});

router.get("/config", (_request, response) => {
  response.json({
    defaults: {
      countryCode: DEFAULT_COUNTRY_CODE,
      contactPrefix: DEFAULT_CONTACT_PREFIX,
      batchSize: DEFAULT_BATCH_SIZE,
      groupPrefix: DEFAULT_GROUP_PREFIX
    },
    countryCodes: COMMON_COUNTRY_CODES
  });
});

router.post("/process", upload.single("file"), (request, response) => {
  if (!request.file) {
    throw new AppError("Please choose a file before processing.");
  }

  const { countryCode, contactPrefix, batchSize, groupPrefix } = request.body;
  const rows = parseSpreadsheet(request.file.buffer, request.file.originalname);
  const result = processContacts({
    rows,
    countryCode,
    contactPrefix,
    batchSize,
    groupPrefix
  });

  response.json({
    fileName: request.file.originalname,
    ...result
  });
});

router.post("/export/vcf", express.json({ limit: "5mb" }), (request, response) => {
  const { contacts = [], contactPrefix = DEFAULT_CONTACT_PREFIX } = request.body ?? {};

  if (!Array.isArray(contacts) || contacts.length === 0) {
    throw new AppError("There are no valid contacts to export.");
  }

  const content = generateVcf(contacts, contactPrefix);
  const safePrefix = String(contactPrefix).trim().replace(/\s+/g, "-").toLowerCase() || "contacts";

  response.setHeader("Content-Type", "text/vcard; charset=utf-8");
  response.setHeader("Content-Disposition", `attachment; filename=\"${safePrefix}-contacts.vcf\"`);
  response.send(content);
});

export default router;

