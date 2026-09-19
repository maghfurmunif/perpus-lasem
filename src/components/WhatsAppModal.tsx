import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  villageName: string;
  userName: string;
  initialMessage?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  villageName,
  userName,
  initialMessage,
}) => {
  const defaultTemplates = [
    `Halo Pustakawan Desa ${villageName}, saya ${userName}. Saya ingin bertanya tentang ketersediaan buku fisik di ruang baca desa.`,
    `Halo Pustakawan, saya ${userName}. Saya ingin memohon perpanjangan pinjaman buku saya selama 7 hari lagi.`,
    `Halo Pustakawan, saya butuh bantuan cara membaca buku yang sudah saya unduh saat internet mati.`,
    `Halo, apakah ada jadwal bimbingan belajar anak dan bedah buku pertanian minggu ini?`
  ];

  const [message, setMessage] = useState(initialMessage || defaultTemplates[0]);
  const [copied, setCopied] = useState(false);

  // Early return SETELAH semua hooks (aturan React Hooks)
  if (!isOpen) return null;

  const librarianPhone = '6281234567890';
  const waUrl = `https://wa.me/${librarianPhone}?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#25D366] text-stone-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-stone-900">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest block text-stone-800">
                LAYANAN RAMAH WARGA
              </span>
              <h3 className="font-bold text-base font-serif">
                Tanya Pustakawan Desa
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-800 hover:bg-black/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p>
              Pustakawan desa bertugas setiap hari Senin s/d Sabtu (08.00 - 17.00 WIB). Pesan Anda akan langsung dibalas dengan ramah.
            </p>
          </div>

          {/* Quick template choices */}
          <div className="space-y-1.5">
            <span className="font-bold text-stone-700 block">Pilih Contoh Pertanyaan:</span>
            <div className="space-y-1">
              {defaultTemplates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(t)}
                  className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] truncate block"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Editable text */}
          <div className="space-y-1">
            <label className="font-bold text-stone-700 block">Isi Pesan WhatsApp:</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Buka Aplikasi WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
