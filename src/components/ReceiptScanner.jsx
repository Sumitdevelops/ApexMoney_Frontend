import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, FileText, Loader2, CheckCircle, X, Sparkles, AlertCircle, Image } from 'lucide-react';
import axios from 'axios';
// Tesseract.js is loaded dynamically on demand (see handleFileUpload) to avoid
// pulling the ~2 MB WASM module into the main bundle.

const BACKEND = import.meta.env.VITE_BACKENDURL;

const ReceiptScanner = ({ onScanComplete, onClose }) => {
    const [receiptText, setReceiptText] = useState('');
    const [scanning, setScanning] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [ocrStatus, setOcrStatus] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleScan = async () => {
        if (!receiptText.trim()) return;
        setScanning(true);
        setError('');
        setResult(null);
        setOcrStatus('Parsing with AI...');

        try {
            const res = await axios.post(`${BACKEND}/ai/scan-receipt`, { receiptText }, { withCredentials: true });
            setResult(res.data);
            setOcrStatus('');
        } catch (err) {
            setError(err?.response?.data?.details || err?.response?.data?.error || 'Failed to scan receipt');
            setOcrStatus('');
        } finally {
            setScanning(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setResult(null);

        if (file.type.startsWith('image/')) {
            // Show preview
            const reader = new FileReader();
            reader.onload = (ev) => setPreviewImage(ev.target.result);
            reader.readAsDataURL(file);

            // Run OCR — dynamically load Tesseract only when needed
            setScanning(true);
            setOcrProgress(0);
            setOcrStatus('Loading OCR engine...');

            try {
                const Tesseract = await import('tesseract.js');
                setOcrStatus('Initializing OCR engine...');
                const { data } = await Tesseract.recognize(file, 'eng', {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setOcrProgress(Math.round(m.progress * 100));
                            setOcrStatus(`Reading receipt... ${Math.round(m.progress * 100)}%`);
                        } else if (m.status === 'loading language traineddata') {
                            setOcrStatus('Loading language model...');
                        } else if (m.status === 'initializing api') {
                            setOcrStatus('Initializing OCR engine...');
                        }
                    },
                });

                if (data.text.trim()) {
                    setReceiptText(data.text.trim());
                    setOcrStatus('Text extracted! Click "Scan with AI" to parse.');
                    setScanning(false);
                } else {
                    setError('Could not extract text from the image. Try a clearer photo or paste the text manually.');
                    setScanning(false);
                    setOcrStatus('');
                }
            } catch (err) {
                setError('OCR failed: ' + (err?.message || 'Unknown error'));
                setScanning(false);
                setOcrStatus('');
            }
        } else if (file.type.startsWith('text/')) {
            const text = await file.text();
            setReceiptText(text);
            setPreviewImage(null);
        } else {
            setError('Unsupported file type. Please upload an image (JPEG, PNG) or a text file.');
        }
    };

    const handleApplyResult = () => {
        if (result && onScanComplete) {
            onScanComplete({
                amount: result.amount || '',
                category: result.category || 'Other',
                notes: result.description || '',
                merchant: result.merchant || '',
                date: result.date || new Date().toISOString().slice(0, 10),
                currency: result.currency || 'INR',
            });
        }
    };

    const sampleReceipts = [
        "Starbucks Coffee\nDate: 02/03/2026\nLatte Grande - ₹350\nCroissant - ₹180\nTotal: ₹530",
        "AMAZON.IN\nOrder #123-4567890\nWireless Earbuds - ₹2,499\nPhone Case - ₹599\nDelivery: Free\nTotal: ₹3,098",
        "Uber Ride\nFrom: Koramangala\nTo: MG Road\nDistance: 8.2 km\nFare: ₹245\nDate: 01-03-2026",
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Camera size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Receipt Scanner</h3>
                            <p className="text-indigo-200 text-xs">Upload photo or paste text • AI extracts details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        {[
                            { key: 'upload', label: 'Upload Receipt', icon: Image },
                            { key: 'paste', label: 'Paste Text', icon: FileText },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition flex-1 justify-center ${activeTab === key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={16} />{label}
                            </button>
                        ))}
                    </div>

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="mb-4">
                            <div
                                onClick={() => !scanning && fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${scanning ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                                    }`}
                            >
                                {previewImage ? (
                                    <div className="space-y-3">
                                        <img src={previewImage} alt="Receipt preview" className="max-h-40 mx-auto rounded-lg shadow-md object-contain" />
                                        {!scanning && <p className="text-xs text-gray-500">Click to upload a different image</p>}
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                            <Camera size={24} className="text-indigo-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Upload receipt photo</p>
                                        <p className="text-xs text-gray-400 mt-1">Supports JPEG, PNG, or text files</p>
                                    </>
                                )}

                                {/* OCR Progress */}
                                {scanning && ocrStatus && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium">
                                            <Loader2 size={16} className="animate-spin" />
                                            {ocrStatus}
                                        </div>
                                        {ocrProgress > 0 && (
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <motion.div
                                                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${ocrProgress}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,.txt,.csv"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </div>

                            {/* Extracted text preview */}
                            {receiptText && !scanning && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-500">Extracted Text</span>
                                        <button onClick={() => { setReceiptText(''); setPreviewImage(null); }} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                                    </div>
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-28 overflow-y-auto font-mono">{receiptText}</pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paste Tab */}
                    {activeTab === 'paste' && (
                        <div className="mb-4">
                            <textarea
                                value={receiptText}
                                onChange={(e) => setReceiptText(e.target.value)}
                                rows={6}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition text-sm resize-none"
                                placeholder="Paste your receipt or bill text here..."
                            />

                            {/* Quick samples */}
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1.5">Try a sample:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {['Coffee Shop', 'Online Order', 'Uber Ride'].map((label, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setReceiptText(sampleReceipts[i])}
                                            className="px-2.5 py-1 text-xs bg-gray-100 text-gray-500 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scan Button */}
                    <motion.button
                        onClick={handleScan}
                        disabled={scanning || !receiptText.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 transition-all"
                    >
                        {scanning ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        {scanning ? 'Processing...' : receiptText ? '✨ Scan with AI' : 'Upload or paste a receipt first'}
                    </motion.button>

                    {/* Error */}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </motion.div>
                    )}

                    {/* Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle size={18} className="text-emerald-600" />
                                    <span className="font-semibold text-emerald-700">Receipt Parsed Successfully</span>
                                    {result.confidence && (
                                        <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{result.confidence}% confident</span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center py-1.5 border-b border-emerald-100">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-bold text-gray-800 text-lg">{result.currencySymbol || '$'}{Number(result.amount).toLocaleString()}</span>
                                    </div>
                                    {result.currency && (
                                        <div className="flex justify-between py-1.5 border-b border-emerald-100">
                                            <span className="text-gray-500">Currency</span>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{result.currency}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-1.5 border-b border-emerald-100">
                                        <span className="text-gray-500">Category</span>
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{result.category}</span>
                                    </div>
                                    {result.merchant && (
                                        <div className="flex justify-between py-1.5 border-b border-emerald-100">
                                            <span className="text-gray-500">Merchant</span>
                                            <span className="text-gray-800 font-medium">{result.merchant}</span>
                                        </div>
                                    )}
                                    {result.description && (
                                        <div className="flex justify-between py-1.5 border-b border-emerald-100">
                                            <span className="text-gray-500">Description</span>
                                            <span className="text-gray-800">{result.description}</span>
                                        </div>
                                    )}
                                    {result.date && (
                                        <div className="flex justify-between py-1.5 border-b border-emerald-100">
                                            <span className="text-gray-500">Date</span>
                                            <span className="text-gray-800">{result.date}</span>
                                        </div>
                                    )}
                                    {result.items?.length > 0 && (
                                        <div className="py-1.5">
                                            <span className="text-gray-500 block mb-1">Items</span>
                                            <div className="flex flex-wrap gap-1">
                                                {result.items.map((item, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    onClick={handleApplyResult}
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition shadow-md"
                                >
                                    ✓ Apply to Expense Form
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ReceiptScanner;
