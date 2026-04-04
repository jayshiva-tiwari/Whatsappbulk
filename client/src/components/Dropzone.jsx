import { FileSpreadsheet, UploadCloud } from "lucide-react";

export function Dropzone({ file, isDragging, uploadProgress, onDragStateChange, onFileSelect }) {
  const handleDrop = (event) => {
    event.preventDefault();
    onDragStateChange(false);

    const [selectedFile] = event.dataTransfer.files;
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <label
      className={`group relative block overflow-hidden rounded-[2rem] border border-dashed p-8 transition duration-300 ${
        isDragging
          ? "border-brand-300 bg-brand-500/10"
          : "border-slate-700 bg-slate-950/40 hover:border-brand-400/60 hover:bg-slate-900/70"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv,.xlsx"
        className="sr-only"
        onChange={(event) => {
          const [selectedFile] = event.target.files ?? [];
          if (selectedFile) {
            onFileSelect(selectedFile);
          }
        }}
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex rounded-full border border-brand-400/30 bg-brand-500/10 p-3 text-brand-200">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold text-white">
            Drop your spreadsheet here
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Upload a `.csv` or `.xlsx` file with phone numbers. We clean duplicates,
            normalize the numbers, flag invalid rows, and prepare VCF contacts for manual WhatsApp group creation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 px-3 py-1.5">Safe workflow only</span>
            <span className="rounded-full border border-slate-700 px-3 py-1.5">Default +91 formatting</span>
            <span className="rounded-full border border-slate-700 px-3 py-1.5">Android + iPhone VCF</span>
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-[1.75rem] border border-slate-800/80 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-100">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{file?.name ?? "No file selected yet"}</p>
              <p className="text-xs text-slate-400">
                {file ? `${Math.max(file.size / 1024, 1).toFixed(1)} KB` : "Choose a file or drag it here"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Upload progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-brand-400 to-sky-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-400">
            Tip: keep a single number per cell for the cleanest import preview, but mixed spreadsheets still work.
          </p>
        </div>
      </div>
    </label>
  );
}

