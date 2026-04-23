"use client";

import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [cvText, setCvText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const [result, setResult] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState("");
  const [gaps, setGaps] = useState("");
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [atsFeedback, setAtsFeedback] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  const isDisabled =
    loading || cvText.trim().length === 0 || jobDesc.trim().length === 0;

  // -----------------------------
  // LOADING BAR ANIMATION
  // -----------------------------
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.random() * 6;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  // -----------------------------
  // LOADING STATUS ROTATION
  // -----------------------------
  useEffect(() => {
    if (!loading) return;

    const steps = [
      "Analysing CV structure...",
      "Matching job requirements...",
      "Optimising keywords...",
      "Rewriting CV for ATS...",
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 900);

    return () => clearInterval(interval);
  }, [loading]);

  // -----------------------------
  // SMOOTH SCROLL TO RESULT
  // -----------------------------
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  const handleGenerate = async () => {
    setLoading(true);

    setResult("");
    setScore(null);
    setStrengths("");
    setGaps("");
    setMissingKeywords([]);
    setAtsFeedback("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: cvText,
          jobDescription: jobDesc,
        }),
      });

      const data = await res.json();

      setResult(data.result || "");
      setScore(data.score ?? 0);
      setStrengths(data.strengths || "");
      setGaps(data.gaps || "");
      setMissingKeywords(data.missingKeywords || []);
      setAtsFeedback(data.atsFeedback || "");

      setProgress(100);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-black">AI CV Optimiser</h1>
          <p className="text-zinc-400 text-sm mt-1">
            ATS intelligence + CV rewriting engine
          </p>
        </div>

        {/* INPUTS */}
        <textarea
          className="w-full bg-zinc-900 p-4 rounded-xl"
          rows={8}
          placeholder="Paste CV"
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />

        <textarea
          className="w-full bg-zinc-900 p-4 rounded-xl"
          rows={6}
          placeholder="Paste Job Description"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={isDisabled}
          className={`w-full py-3 rounded-xl font-bold ${
            isDisabled ? "bg-zinc-700" : "bg-white text-black"
          }`}
        >
          {loading ? "Generating..." : "Generate CV"}
        </button>

        {/* CLEAR BUTTON */}
        <button
          onClick={() => {
            setCvText("");
            setJobDesc("");
            setResult("");
            setScore(null);
            setStrengths("");
            setGaps("");
            setMissingKeywords([]);
            setAtsFeedback("");
          }}
          disabled={loading}
          className="w-full py-2 mt-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
        >
          Clear
        </button>

        {/* LOADING UI */}
        {loading && (
          <div className="space-y-3 mt-4">

            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-white via-zinc-300 to-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-zinc-400 text-center">
              {[
                "Analysing CV structure...",
                "Matching job requirements...",
                "Optimising keywords...",
                "Rewriting CV for ATS...",
              ][loadingStep]}
            </p>
          </div>
        )}

        {/* OUTPUT */}
        {result && (
          <div ref={resultRef} className="space-y-4">

            <div className="bg-zinc-900 p-5 rounded-2xl">
              <p className="text-xl font-bold">
                ATS Score: {score}/100
              </p>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl">
              <p className="font-bold mb-2">Rewritten CV</p>

              <pre className="whitespace-pre-wrap text-sm">
                {result}
              </pre>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
                className="mt-4 w-full py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition"
              >
                Copy CV
              </button>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl">
              <p className="font-bold">Strengths</p>
              <p className="text-sm mt-1">{strengths}</p>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl">
              <p className="font-bold">Gaps</p>
              <p className="text-sm mt-1">{gaps}</p>
            </div>

            <div className="bg-zinc-900 p-5 rounded-2xl">
              <p className="font-bold">ATS Feedback</p>
              <p className="text-sm mt-1">{atsFeedback}</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl">
              <p className="font-semibold mb-3">
                Missing Keywords
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {missingKeywords.map((k, i) => (
                  <div
                    key={i}
                    className="text-center px-3 py-2 rounded-xl bg-zinc-800"
                  >
                    {k}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}