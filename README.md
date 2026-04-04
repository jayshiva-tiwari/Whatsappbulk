# Bulk WhatsApp Contact Generator

Production-ready web application for converting spreadsheet phone numbers into clean VCF contacts and WhatsApp-ready helper outputs, without bypassing WhatsApp's restrictions.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Spreadsheet parsing: SheetJS (`xlsx`)
- File upload: `multer`

## Features

- Upload `.csv` and `.xlsx` files with drag-and-drop support
- Clean phone numbers by removing spaces, symbols, empty rows, and duplicates
- Apply a selectable default country code (`+91` by default)
- Preview valid and invalid rows with processing stats
- Export valid contacts to an Android/iPhone compatible `.vcf` file
- Generate `https://wa.me/<number>` links for every valid contact
- Split valid contacts into suggested WhatsApp group batches
- Show an in-app 3-step guide for manual WhatsApp group creation

## Folder Structure

```text
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── lib
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── services
│   │   ├── utils
│   │   ├── index.js
│   │   └── routes.js
│   └── package.json
└── package.json
```

## How It Works

1. Upload a spreadsheet containing phone numbers.
2. The backend reads the first sheet, extracts every non-empty cell, and normalizes each value.
3. Invalid rows are flagged, duplicates are removed, and valid numbers are converted into:
   - VCF contact entries
   - `wa.me` links
   - Suggested group batches

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app in development mode

```bash
npm run dev
```

This runs:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:8080`

### 3. Build for production

```bash
npm run build
```

### 4. Run the backend in production mode

```bash
npm run start
```

You can serve the built frontend separately with any static hosting provider, or add a reverse proxy in front of both services.

## API Endpoints

### `GET /api/health`

Health check endpoint.

### `GET /api/config`

Returns default form values and a small set of country code options.

### `POST /api/process`

Multipart form upload endpoint.

Form fields:

- `file`: `.csv` or `.xlsx`
- `countryCode`
- `contactPrefix`
- `batchSize`
- `groupPrefix`

Response includes:

- processed rows
- valid contacts
- invalid contacts
- batch suggestions
- summary stats

### `POST /api/export/vcf`

Accepts a JSON payload with valid contacts and returns a downloadable `.vcf` file.

## Production Notes

- The app intentionally does not automate WhatsApp group creation.
- Group creation stays manual inside WhatsApp to remain within supported behavior.
- The server is stateless for processing, which makes horizontal scaling easier.
- Upload size is currently limited to `10 MB` per file.

## Manual WhatsApp Flow

1. Download the generated `.vcf` file.
2. Import the contacts into your phone.
3. Open WhatsApp and create the group manually using the processed contacts.
