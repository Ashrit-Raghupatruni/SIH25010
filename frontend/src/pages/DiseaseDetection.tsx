import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, ArrowLeft, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface DiseaseResult {
  disease: string;
  confidence: number;
  solution: string;
}

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOpen(true);
    } catch {
      setError(t("camera_error"));
    }
  }, [t]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setImage(canvas.toDataURL("image/jpeg"));
    stopCamera();
    setResult(null);
    setError(null);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraOpen(false);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setResult({
        disease: "Leaf Blight",
        confidence: 92.4,
        solution: "Apply Mancozeb fungicide (2g/L) every 10 days. Remove infected leaves immediately.",
      });
    } catch {
      setError(t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setResult(null); setError(null); };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("disease_detection")}</h1>
      </div>

      <AnimatePresence>
        {cameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative overflow-hidden rounded-2xl border bg-foreground/5">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
              <Button onClick={capturePhoto} size="lg" className="rounded-full px-8 text-lg font-bold">{t("capture")}</Button>
              <Button onClick={stopCamera} size="lg" variant="outline" className="rounded-full">{t("cancel")}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {image && !cameraOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <img src={image} alt="Preview" className="w-full rounded-2xl border object-cover" />
          <button onClick={reset} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 text-background">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {!image && !cameraOpen && (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="card-hover flex flex-col items-center gap-3 rounded-2xl border bg-card p-8 shadow-sm">
            <Upload className="h-10 w-10 text-primary" />
            <span className="text-lg font-bold">{t("upload_image")}</span>
          </button>
          <button onClick={startCamera} className="card-hover flex flex-col items-center gap-3 rounded-2xl border bg-card p-8 shadow-sm">
            <Camera className="h-10 w-10 text-secondary" />
            <span className="text-lg font-bold">{t("take_photo")}</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {image && !cameraOpen && !result && (
        <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full rounded-xl py-6 text-lg font-bold">
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("analyzing")}</> : t("detect_disease")}
        </Button>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-extrabold">{t("results")}</h2>
            <div className="grid gap-3">
              <div className="rounded-xl bg-destructive/10 p-4">
                <span className="text-sm font-semibold text-muted-foreground">{t("disease_detected")}</span>
                <p className="text-lg font-bold text-destructive">{result.disease}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-4">
                <span className="text-sm font-semibold text-muted-foreground">{t("confidence")}</span>
                <p className="text-lg font-bold text-primary">{result.confidence}%</p>
              </div>
              <div className="rounded-xl bg-accent p-4">
                <span className="text-sm font-semibold text-muted-foreground">{t("suggested_treatment")}</span>
                <p className="mt-1 font-semibold text-accent-foreground">{result.solution}</p>
              </div>
            </div>
            <Button onClick={reset} variant="outline" size="lg" className="w-full rounded-xl text-lg font-bold">{t("scan_another")}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseDetection;
