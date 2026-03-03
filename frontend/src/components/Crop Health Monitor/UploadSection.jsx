import React from "react";

export default function UploadSection({
  selectedFile,
  setSelectedFile,
  onPredict,
  loading,
}) {
  const [previewUrl, setPreviewUrl] = React.useState("");

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
  };

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Upload Crop Image</h2>
        <p className="mt-1 text-sm text-slate-500">
          Supports JPG, PNG. Recommended clear leaf close-up.
        </p>
      </div>

      <label className="group relative flex h-[320px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 px-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50">
        {!selectedFile ? (
          <>
            <div className="mb-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Click to Select
            </div>
            <p className="text-base font-medium text-slate-800">Drop image here or browse</p>
            <p className="mt-2 text-sm text-slate-500">Maximum size: 10MB</p>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-2">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected crop"
                className="max-h-[230px] w-auto rounded-xl border border-slate-200 object-contain shadow-sm"
              />
            ) : null}
            <p className="max-w-full break-all text-xs font-medium text-slate-700 sm:text-sm">
              {selectedFile.name}
            </p>
          </div>
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onPredict}
          disabled={loading || !selectedFile}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Analyzing..." : "Run Diagnosis"}
        </button>
        <button
          type="button"
          onClick={() => setSelectedFile(null)}
          disabled={!selectedFile || loading}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
