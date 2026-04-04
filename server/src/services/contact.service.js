import {
  DEFAULT_BATCH_SIZE,
  DEFAULT_CONTACT_PREFIX,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_GROUP_PREFIX
} from "../utils/constants.js";
import { normalizePhoneNumber, buildWaLink } from "./phone.service.js";

const isHeaderRow = (row = []) =>
  row.some((cell) => {
    const value = String(cell ?? "").trim().toLowerCase();
    return ["phone", "mobile", "number", "contact"].some((keyword) => value.includes(keyword));
  });

const extractCandidates = (rows) => {
  const startIndex = rows.length > 1 && isHeaderRow(rows[0]) ? 1 : 0;

  return rows.slice(startIndex).flatMap((row, rowIndex) =>
    row.map((cell, columnIndex) => ({
      rowNumber: startIndex + rowIndex + 1,
      columnNumber: columnIndex + 1,
      value: String(cell ?? "").trim()
    }))
  );
};

const createBatchName = (prefix, index) => `${prefix} ${index + 1}`;

const escapeVCard = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

export const processContacts = ({
  rows,
  countryCode = DEFAULT_COUNTRY_CODE,
  contactPrefix = DEFAULT_CONTACT_PREFIX,
  batchSize = DEFAULT_BATCH_SIZE,
  groupPrefix = DEFAULT_GROUP_PREFIX
}) => {
  const candidates = extractCandidates(rows);
  const seen = new Set();
  const records = [];
  let duplicateCount = 0;

  for (const candidate of candidates) {
    const normalized = normalizePhoneNumber(candidate.value, countryCode);
    const empty = !candidate.value;

    if (empty) {
      continue;
    }

    if (!normalized.isValid) {
      records.push({
        id: `${candidate.rowNumber}-${candidate.columnNumber}`,
        source: candidate.value,
        phoneNumber: normalized.international,
        digits: normalized.digits,
        status: "invalid",
        reason: "Invalid phone length after cleanup"
      });
      continue;
    }

    if (seen.has(normalized.digits)) {
      duplicateCount += 1;
      continue;
    }

    seen.add(normalized.digits);

    const contactIndex = seen.size;

    records.push({
      id: `${candidate.rowNumber}-${candidate.columnNumber}`,
      source: candidate.value,
      phoneNumber: normalized.international,
      digits: normalized.digits,
      status: "valid",
      reason: "Ready for VCF export",
      contactName: `${contactPrefix} ${contactIndex}`,
      waLink: buildWaLink(normalized.digits)
    });
  }

  const validContacts = records.filter((record) => record.status === "valid");
  const invalidContacts = records.filter((record) => record.status === "invalid");
  const safeBatchSize = Math.max(1, Number(batchSize) || DEFAULT_BATCH_SIZE);

  const batches = Array.from(
    { length: Math.ceil(validContacts.length / safeBatchSize) },
    (_, index) => {
      const batchContacts = validContacts.slice(index * safeBatchSize, (index + 1) * safeBatchSize);

      return {
        id: index + 1,
        name: createBatchName(groupPrefix, index),
        size: batchContacts.length,
        startLabel: batchContacts[0]?.contactName ?? null,
        endLabel: batchContacts.at(-1)?.contactName ?? null
      };
    }
  );

  return {
    records,
    validContacts,
    invalidContacts,
    batches,
    stats: {
      totalScanned: candidates.filter((candidate) => candidate.value).length,
      totalProcessed: records.length,
      validNumbers: validContacts.length,
      invalidNumbers: invalidContacts.length,
      duplicatesRemoved: duplicateCount
    }
  };
};

export const generateVcf = (contacts, prefix = DEFAULT_CONTACT_PREFIX) =>
  contacts
    .map((contact, index) => {
      const name = contact.contactName || `${prefix} ${index + 1}`;
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escapeVCard(name)}`,
        `N:${escapeVCard(name)};;;;`,
        `TEL;TYPE=CELL:${contact.phoneNumber}`,
        "END:VCARD"
      ].join("\n");
    })
    .join("\n");

