import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  Link2,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { ContactTable } from "./components/ContactTable";
import { Dropzone } from "./components/Dropzone";
import { SectionTitle } from "./components/SectionTitle";
import { StatCard } from "./components/StatCard";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { downloadVcf, fetchConfig, processSpreadsheet } from "./lib/api";

const FALLBACK_DEFAULTS = {
  countryCode: "91",
  contactPrefix: "Contact",
  batchSize: 256,
  groupPrefix: "Group"
};

function App() {
  const [config, setConfig] = useState({
    defaults: FALLBACK_DEFAULTS,
    countryCodes: []
  });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const [form, setForm] = useState(FALLBACK_DEFAULTS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const nextConfig = await fetchConfig();
        setConfig(nextConfig);
        setForm(nextConfig.defaults);
      } catch (_error) {
        setConfig({
          defaults: FALLBACK_DEFAULTS,
          countryCodes: []
        });
      }
    };

    loadConfig();
  }, []);

  const handleProcess = () => {
    if (!file) {
      setError("Choose a CSV or XLSX file first.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setCopied(false);
    setUploadProgress(0);
    setIsProcessing(true);

    processSpreadsheet(
      { ...form, file },
      (event) => {
        if (!event.total) {
          return;
        }

        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    )
      .then((nextResult) => {
        startTransition(() => {
          setResult(nextResult);
        });
        setSuccessMessage("Contacts processed successfully. You can now review the data and download the VCF.");
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message ?? "Unable to process this file.");
      })
      .finally(() => {
        setUploadProgress(100);
        setIsProcessing(false);
      });
  };

  const handleVcfDownload = async () => {
    if (!result?.validContacts?.length) {
      setError("There are no valid contacts to export.");
      return;
    }

    setIsDownloading(true);
    setError("");

    try {
      const response = await downloadVcf({
        contacts: result.validContacts,
        contactPrefix: form.contactPrefix
      });

      const blobUrl = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${form.contactPrefix.toLowerCase().replace(/\s+/g, "-") || "contacts"}.vcf`;
      anchor.click();
      URL.revokeObjectURL(blobUrl);
    } catch (_error) {
      setError("The VCF file could not be generated.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLinks = async () => {
    if (!result?.validContacts?.length) {
      setError("Process a file first to generate WhatsApp links.");
      return;
    }

    const allLinks = result.validContacts.map((contact) => contact.waLink).join("\n");
    try {
      await navigator.clipboard.writeText(allLinks);
      setCopied(true);
      setSuccessMessage("All click-to-chat links were copied to the clipboard.");
    } catch (_error) {
      setError("Clipboard access was blocked. You can still open the links individually below.");
    }
  };

  return (
    <div className="grid-pattern min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Navbar />
        <header className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/60 shadow-glow">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-200">
                <ShieldCheck className="h-4 w-4" />
                Legal and manual WhatsApp workflow
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                Bulk WhatsApp Contact Generator
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Turn spreadsheets into clean phone lists, downloadable VCF contacts, and grouped batches that make WhatsApp group setup much faster without bypassing WhatsApp’s rules.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Process Data
                </button>
                <button
                  type="button"
                  onClick={handleVcfDownload}
                  disabled={!result?.validContacts?.length || isDownloading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download VCF
                </button>
              </div>
            </div>

            <div id="how-it-works" className="glass-panel rounded-[2rem] border border-slate-800/80 p-6">
              <p className="text-sm font-semibold text-white">How to create a WhatsApp group in 3 steps</p>
              <div className="mt-6 space-y-4">
                {[
                  "Import the downloaded VCF file into your phone contacts.",
                  "Open WhatsApp and start a new group manually.",
                  "Select the imported contacts, choose a suggested batch, and create the group."
                ].map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-brand-200">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-6 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                This app does not create groups automatically. It prepares contacts and links so users can complete group creation inside WhatsApp.
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 space-y-8">
          <section id="vcf-tool" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <Dropzone
                file={file}
                isDragging={isDragging}
                uploadProgress={uploadProgress}
                onDragStateChange={setIsDragging}
                onFileSelect={(selectedFile) => {
                  setFile(selectedFile);
                  setError("");
                  setSuccessMessage("");
                  setUploadProgress(0);
                }}
              />

              {error ? (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 px-5 py-4 text-sm text-brand-100">
                  {successMessage}
                </div>
              ) : null}
            </div>

            <aside className="glass-panel rounded-[2rem] border border-slate-800/80 p-6 shadow-glow">
              <SectionTitle
                eyebrow="Configuration"
                title="Contact formatting options"
                description="Set the default country code, contact label prefix, and group batching before processing."
              />

              <div className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Country code</span>
                  <select
                    value={form.countryCode}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, countryCode: event.target.value }))
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-brand-400"
                  >
                    {(config.countryCodes.length ? config.countryCodes : [{ code: "91", label: "India (+91)" }]).map(
                      (option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Contact name prefix</span>
                  <input
                    value={form.contactPrefix}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, contactPrefix: event.target.value }))
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                    placeholder="Contact"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Group name prefix</span>
                  <input
                    value={form.groupPrefix}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, groupPrefix: event.target.value }))
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                    placeholder="Group"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-300">
                  <span>Batch size per group</span>
                  <input
                    type="number"
                    min="1"
                    max="1024"
                    value={form.batchSize}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, batchSize: Number(event.target.value) || 1 }))
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCopyLinks}
                  disabled={!result?.validContacts?.length}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Links Copied" : "Copy WhatsApp Links"}
                </button>
              </div>
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total scanned"
              value={result?.stats?.totalScanned ?? 0}
              hint="Non-empty cells scanned from the uploaded sheet."
              tone="accent"
            />
            <StatCard
              label="Valid numbers"
              value={result?.stats?.validNumbers ?? 0}
              hint="Contacts ready for VCF export and wa.me links."
              tone="success"
            />
            <StatCard
              label="Invalid numbers"
              value={result?.stats?.invalidNumbers ?? 0}
              hint="Rows that still need a quick fix before import."
              tone="danger"
            />
            <StatCard
              label="Duplicates removed"
              value={result?.stats?.duplicatesRemoved ?? 0}
              hint="Repeated numbers automatically skipped during processing."
            />
          </section>

          <section className="glass-panel rounded-[2rem] border border-slate-800/80 p-6 shadow-glow">
            <SectionTitle
              eyebrow="Preview"
              title="Processed contact review"
              description="Inspect cleaned results before exporting. Valid rows receive VCF names and WhatsApp-ready links."
              action={
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  <ClipboardList className="h-4 w-4 text-brand-300" />
                  {result?.fileName ?? "No file processed yet"}
                </div>
              }
            />

            <div className="mt-6">
              {isPending && !result?.records?.length ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
                  Finalizing preview...
                </div>
              ) : result?.records?.length ? (
                <ContactTable records={result.records} />
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
                  Upload a file and process it to see the preview table.
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[2rem] border border-slate-800/80 p-6 shadow-glow">
              <SectionTitle
                eyebrow="Group Helper"
                title="Suggested WhatsApp group batches"
                description="Use batches to stay organized when you manually create groups in WhatsApp."
              />

              <div className="mt-6 space-y-3">
                {result?.batches?.length ? (
                  result.batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between rounded-3xl border border-slate-800/80 bg-slate-950/50 px-4 py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{batch.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {batch.startLabel} to {batch.endLabel}
                        </p>
                      </div>
                      <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-brand-200">
                        {batch.size} contacts
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">
                    Process valid contacts to see suggested group splits.
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] border border-slate-800/80 p-6 shadow-glow">
              <SectionTitle
                eyebrow="WhatsApp Helper"
                title="Ready-to-use click-to-chat links"
                description="Every valid number gets a wa.me link so your team can open a chat quickly if needed."
              />

              <div className="mt-6 max-h-[24rem] space-y-3 overflow-auto pr-2">
                {result?.validContacts?.length ? (
                  result.validContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{contact.contactName}</p>
                        <p className="mt-1 text-xs text-slate-400">{contact.phoneNumber}</p>
                      </div>
                      <a
                        href={contact.waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-200 transition hover:text-brand-100"
                      >
                        <Link2 className="h-4 w-4" />
                        Open link
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">
                    WhatsApp links appear here after processing a file.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="features" className="rounded-[2rem] border border-slate-800/80 bg-slate-950/50 p-6 shadow-glow">
            <SectionTitle
              eyebrow="Why this works"
              title="Built around WhatsApp’s real limitations"
              description="This product is intentionally designed as a helper tool, not an automation bypass."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: <ShieldCheck className="h-5 w-5 text-brand-300" />,
                  title: "Safe and compliant",
                  text: "The app prepares contacts and links only. Group creation remains a manual step inside WhatsApp."
                },
                {
                  icon: <Users className="h-5 w-5 text-sky-300" />,
                  title: "Scaled for teams",
                  text: "Duplicate removal, batching, and quick exports make large outreach lists manageable."
                },
                {
                  icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
                  title: "Phone-ready exports",
                  text: "VCF formatting is compatible with common Android and iPhone import flows."
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/50 p-5"
                >
                  <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-950 p-3">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
