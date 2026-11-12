import { Fragment, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileSpreadsheet, FileDown, Loader2, Upload, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAdminData } from '../AdminData';
import { MAX_RECORDS, downloadTemplate, parseConferenceFile, type ParsedRow } from '../bulkImport';
import { useToast } from './Toast';
import { cn } from '@/utils/cn';

type Step = 'choose' | 'reading' | 'preview' | 'done';

/**
 * Excel bulk upload: download template → choose file → preview with validation →
 * confirm or cancel → import summary. Demo only: records go into this session's list.
 */
export function BulkUploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { conferences, addConferences } = useAdminData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('choose');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [templateBusy, setTemplateBusy] = useState(false);

  const valid = rows.filter((r) => r.conference);
  const rejected = rows.filter((r) => !r.conference);

  const reset = () => {
    setStep('choose');
    setFileName('');
    setFileError('');
    setRows([]);
    if (inputRef.current) inputRef.current.value = '';
  };
  const close = () => {
    reset();
    onClose();
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileError('');
    setStep('reading');
    const result = await parseConferenceFile(file, conferences);
    if (inputRef.current) inputRef.current.value = '';
    if (!result.ok) {
      setFileError(result.error);
      setStep('choose');
      return;
    }
    setRows(result.rows);
    setStep('preview');
  };

  const confirmImport = () => {
    addConferences(valid.map((r) => r.conference!));
    toast(`${valid.length} conference${valid.length === 1 ? '' : 's'} imported into this demo session (not saved).`);
    setStep('done');
  };

  const title = step === 'preview' ? 'Check the records before importing' : step === 'done' ? 'Import summary' : 'Bulk upload conferences';

  return (
    <Modal open={open} onClose={close} title={title} size={step === 'preview' || step === 'done' ? 'lg' : 'md'}>
      {(step === 'choose' || step === 'reading') && (
        <div className="space-y-5">
          <ol className="space-y-3 text-[0.95rem]">
            <li className="flex gap-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">1</span>
              <div className="flex-1">
                <p>Download the Excel template. The Instructions sheet lists every column and its format.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  disabled={templateBusy}
                  onClick={async () => {
                    setTemplateBusy(true);
                    await downloadTemplate();
                    setTemplateBusy(false);
                  }}
                >
                  <FileDown aria-hidden className="size-4" /> Download Excel template
                </Button>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">2</span>
              <p className="flex-1">Fill in up to {MAX_RECORDS} conferences, one per row. Title, short form, subject area, start and end dates, city, country and description are required.</p>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">3</span>
              <p className="flex-1">Upload the file. You will see a preview with any errors before anything is imported.</p>
            </li>
          </ol>

          <label
            htmlFor="bulk-file"
            className={cn(
              'flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed bg-mist px-6 py-7 text-center transition-colors hover:border-navy-800 focus-within:border-globe-600',
              fileError ? 'border-danger' : 'border-navy-100',
            )}
          >
            {step === 'reading' ? <Loader2 aria-hidden className="size-8 animate-spin text-globe-600" /> : <FileSpreadsheet aria-hidden className="size-8 text-globe-600" strokeWidth={1.4} />}
            <span className="font-semibold text-navy-900">{step === 'reading' ? `Reading ${fileName}…` : 'Choose Excel file'}</span>
            <span className="text-sm text-muted">.xlsx or .xls, up to {MAX_RECORDS} conferences, 1 MB maximum</span>
            <input
              ref={inputRef}
              id="bulk-file"
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="sr-only"
              disabled={step === 'reading'}
              aria-describedby={fileError ? 'bulk-file-error' : undefined}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          {fileError && (
            <p id="bulk-file-error" role="alert" className="flex items-start gap-2 rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 px-3 py-2.5 text-sm text-danger">
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong className="font-semibold">{fileName}:</strong> {fileError}
              </span>
            </p>
          )}
          <div className="flex justify-end border-t border-rule pt-4">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div>
          <p className="text-[0.95rem]">
            <strong className="text-navy-900">{fileName}</strong>: {rows.length} record{rows.length === 1 ? '' : 's'} found.{' '}
            <span className="font-semibold text-success">{valid.length} ready to import</span>
            {rejected.length > 0 && (
              <>
                , <span className="font-semibold text-danger">{rejected.length} with errors</span> (these will not be imported)
              </>
            )}
            .
          </p>
          <PreviewTable rows={rows} />
          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
            <Button variant="secondary" onClick={reset}>
              <Upload aria-hidden className="size-4" /> Choose another file
            </Button>
            <Button variant="secondary" onClick={close}>
              Cancel import
            </Button>
            <Button onClick={confirmImport} disabled={!valid.length}>
              {valid.length ? `Import ${valid.length} conference${valid.length === 1 ? '' : 's'}` : 'Nothing to import'}
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-success/30 bg-success/5 p-4">
              <p className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 aria-hidden className="size-5" /> {valid.length} imported
              </p>
              <p className="mt-1 text-sm text-muted">Added to the conference list as {valid.map((r) => r.conference!.acronym).join(', ') || 'none'}.</p>
            </div>
            <div className={cn('rounded-[var(--radius-md)] border p-4', rejected.length ? 'border-danger/30 bg-danger/5' : 'border-rule bg-mist')}>
              <p className={cn('flex items-center gap-2 font-semibold', rejected.length ? 'text-danger' : 'text-muted')}>
                <XCircle aria-hidden className="size-5" /> {rejected.length} rejected
              </p>
              <p className="mt-1 text-sm text-muted">{rejected.length ? 'Fix these rows in the file and upload them again.' : 'Every record passed validation.'}</p>
            </div>
          </div>
          {rejected.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {rejected.map((r) => (
                <li key={r.row} className="rounded-[var(--radius-md)] border border-rule p-3">
                  <p className="font-semibold text-navy-900">
                    Row {r.row}: {r.values.acronym || r.values.title || 'untitled'}
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-danger">
                    {r.errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm text-muted">Demo mode: imported conferences stay in this browser session only and are not saved.</p>
          <div className="mt-5 flex justify-end gap-2 border-t border-rule pt-4">
            <Button variant="secondary" onClick={reset}>
              Upload another file
            </Button>
            <Button onClick={close}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function PreviewTable({ rows }: { rows: ParsedRow[] }) {
  return (
    <div className="mt-4 max-h-[55vh] overflow-auto rounded-[var(--radius-md)] border border-rule">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Records found in the uploaded file</caption>
        <thead className="sticky top-0 bg-mist text-xs text-muted">
          <tr>
            <th className="px-3 py-2.5 font-semibold">Row</th>
            <th className="px-3 py-2.5 font-semibold">Conference</th>
            <th className="px-3 py-2.5 font-semibold">Subject area</th>
            <th className="px-3 py-2.5 font-semibold">Dates</th>
            <th className="px-3 py-2.5 font-semibold">Location</th>
            <th className="px-3 py-2.5 font-semibold">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <Fragment key={r.row}>
              <tr className={cn('border-t border-rule align-top', !r.conference && 'bg-danger/[0.03]')}>
                <td className="px-3 py-2.5 tabular-nums text-muted">{r.row}</td>
                <td className="px-3 py-2.5">
                  <span className="font-semibold text-navy-900">{r.values.acronym || '—'}</span>
                  <span className="block max-w-[16rem] truncate text-xs text-muted">{r.values.title || 'No title'}</span>
                </td>
                <td className="px-3 py-2.5">{r.values.topic || '—'}</td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">
                  {r.values.startDate || '—'}
                  <span className="block text-xs text-muted">to {r.values.endDate || '—'}</span>
                </td>
                <td className="px-3 py-2.5">{[r.values.city, r.values.country].filter(Boolean).join(', ') || '—'}</td>
                <td className="px-3 py-2.5">
                  {r.conference ? (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                      <CheckCircle2 aria-hidden className="size-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                      <XCircle aria-hidden className="size-3.5" /> {r.errors.length} error{r.errors.length === 1 ? '' : 's'}
                    </span>
                  )}
                </td>
              </tr>
              {!r.conference && (
                <tr className="bg-danger/[0.03]">
                  <td />
                  <td colSpan={5} className="px-3 pb-3 pt-0">
                    <ul className="list-disc space-y-0.5 pl-4 text-xs text-danger">
                      {r.errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
