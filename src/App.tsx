import { useState } from "react";

// ─── Tip Tanımları ───────────────────────────────────────────────────────────
type ChargeName = "Charge 1" | "Charge 2" | "Charge 3" | "Charge 4";

interface FiringRow {
  range_m: number;
  range_yd: number;
  elevation_deg: number;
  elevation_mil: number;
  fall_deg: number;   // düşüş açısı (angle of fall)
  fall_mil: number;   // düşüş açısı mil
  tof: number;
  mv: number;
}

interface AmmoInfo {
  name: string;
  nameEn: string;
  weight_kg: number;
  weight_lb: number;
  fuze: string;
  color: string;
}

// ─── Firing Table Verileri ───────────────────────────────────────────────────
// fall_deg: düşüş açısı (angle of fall) — kısa mesafede elevation'a yakın,
// uzak mesafede daha dik olur (yüksek balistik yay).
const FIRING_TABLE: Record<ChargeName, FiringRow[]> = {
  "Charge 1": [
    { range_m: 700,  range_yd: 765,  elevation_deg: 5.0,  elevation_mil: 89,   fall_deg: 6.2,  fall_mil: 110,  tof: 4.2,  mv: 700 },
    { range_m: 900,  range_yd: 984,  elevation_deg: 7.2,  elevation_mil: 128,  fall_deg: 9.5,  fall_mil: 169,  tof: 5.1,  mv: 700 },
    { range_m: 1100, range_yd: 1203, elevation_deg: 10.0, elevation_mil: 178,  fall_deg: 14.0, fall_mil: 249,  tof: 6.2,  mv: 700 },
    { range_m: 1300, range_yd: 1422, elevation_deg: 13.3, elevation_mil: 237,  fall_deg: 19.8, fall_mil: 352,  tof: 7.4,  mv: 700 },
    { range_m: 1500, range_yd: 1641, elevation_deg: 17.1, elevation_mil: 304,  fall_deg: 26.5, fall_mil: 471,  tof: 8.8,  mv: 700 },
    { range_m: 1700, range_yd: 1859, elevation_deg: 21.5, elevation_mil: 382,  fall_deg: 34.0, fall_mil: 605,  tof: 10.3, mv: 700 },
    { range_m: 1900, range_yd: 2078, elevation_deg: 26.4, elevation_mil: 469,  fall_deg: 42.0, fall_mil: 747,  tof: 12.0, mv: 700 },
    { range_m: 2100, range_yd: 2297, elevation_deg: 32.0, elevation_mil: 569,  fall_deg: 50.5, fall_mil: 898,  tof: 13.8, mv: 700 },
    { range_m: 2300, range_yd: 2515, elevation_deg: 38.2, elevation_mil: 679,  fall_deg: 58.5, fall_mil: 1040, tof: 15.9, mv: 700 },
    { range_m: 2500, range_yd: 2734, elevation_deg: 44.5, elevation_mil: 791,  fall_deg: 65.8, fall_mil: 1170, tof: 18.1, mv: 700 },
    { range_m: 2700, range_yd: 2953, elevation_deg: 50.8, elevation_mil: 903,  fall_deg: 72.0, fall_mil: 1280, tof: 20.4, mv: 700 },
    { range_m: 2900, range_yd: 3171, elevation_deg: 57.0, elevation_mil: 1013, fall_deg: 77.5, fall_mil: 1379, tof: 22.8, mv: 700 },
  ],
  "Charge 2": [
    { range_m: 900,  range_yd: 984,  elevation_deg: 5.0,  elevation_mil: 89,   fall_deg: 5.8,  fall_mil: 103,  tof: 4.0,  mv: 850 },
    { range_m: 1200, range_yd: 1312, elevation_deg: 7.5,  elevation_mil: 133,  fall_deg: 9.2,  fall_mil: 164,  tof: 5.3,  mv: 850 },
    { range_m: 1500, range_yd: 1641, elevation_deg: 10.8, elevation_mil: 192,  fall_deg: 14.0, fall_mil: 249,  tof: 6.8,  mv: 850 },
    { range_m: 1800, range_yd: 1969, elevation_deg: 14.5, elevation_mil: 258,  fall_deg: 19.8, fall_mil: 352,  tof: 8.4,  mv: 850 },
    { range_m: 2100, range_yd: 2297, elevation_deg: 18.8, elevation_mil: 334,  fall_deg: 26.5, fall_mil: 471,  tof: 10.2, mv: 850 },
    { range_m: 2400, range_yd: 2625, elevation_deg: 23.5, elevation_mil: 418,  fall_deg: 33.8, fall_mil: 601,  tof: 12.2, mv: 850 },
    { range_m: 2700, range_yd: 2953, elevation_deg: 28.8, elevation_mil: 512,  fall_deg: 41.5, fall_mil: 738,  tof: 14.4, mv: 850 },
    { range_m: 3000, range_yd: 3281, elevation_deg: 34.5, elevation_mil: 613,  fall_deg: 49.5, fall_mil: 880,  tof: 16.8, mv: 850 },
    { range_m: 3300, range_yd: 3609, elevation_deg: 40.7, elevation_mil: 724,  fall_deg: 57.5, fall_mil: 1022, tof: 19.4, mv: 850 },
    { range_m: 3600, range_yd: 3937, elevation_deg: 47.2, elevation_mil: 839,  fall_deg: 64.8, fall_mil: 1152, tof: 22.1, mv: 850 },
    { range_m: 3900, range_yd: 4265, elevation_deg: 53.5, elevation_mil: 951,  fall_deg: 71.5, fall_mil: 1271, tof: 24.9, mv: 850 },
    { range_m: 4200, range_yd: 4593, elevation_deg: 59.5, elevation_mil: 1058, fall_deg: 77.0, fall_mil: 1369, tof: 27.7, mv: 850 },
  ],
  "Charge 3": [
    { range_m: 1200, range_yd: 1312, elevation_deg: 5.0,  elevation_mil: 89,   fall_deg: 5.5,  fall_mil: 98,   tof: 3.8,  mv: 1050 },
    { range_m: 1600, range_yd: 1750, elevation_deg: 7.8,  elevation_mil: 139,  fall_deg: 9.0,  fall_mil: 160,  tof: 5.2,  mv: 1050 },
    { range_m: 2000, range_yd: 2187, elevation_deg: 11.0, elevation_mil: 196,  fall_deg: 13.5, fall_mil: 240,  tof: 6.8,  mv: 1050 },
    { range_m: 2400, range_yd: 2625, elevation_deg: 14.5, elevation_mil: 258,  fall_deg: 18.8, fall_mil: 334,  tof: 8.6,  mv: 1050 },
    { range_m: 2800, range_yd: 3062, elevation_deg: 18.5, elevation_mil: 329,  fall_deg: 25.0, fall_mil: 445,  tof: 10.5, mv: 1050 },
    { range_m: 3200, range_yd: 3500, elevation_deg: 23.0, elevation_mil: 409,  fall_deg: 32.0, fall_mil: 569,  tof: 12.7, mv: 1050 },
    { range_m: 3600, range_yd: 3937, elevation_deg: 27.8, elevation_mil: 494,  fall_deg: 39.5, fall_mil: 702,  tof: 15.0, mv: 1050 },
    { range_m: 4000, range_yd: 4374, elevation_deg: 33.0, elevation_mil: 587,  fall_deg: 47.0, fall_mil: 836,  tof: 17.5, mv: 1050 },
    { range_m: 4400, range_yd: 4812, elevation_deg: 38.5, elevation_mil: 685,  fall_deg: 54.5, fall_mil: 969,  tof: 20.2, mv: 1050 },
    { range_m: 4800, range_yd: 5249, elevation_deg: 44.3, elevation_mil: 788,  fall_deg: 61.8, fall_mil: 1099, tof: 23.0, mv: 1050 },
    { range_m: 5200, range_yd: 5687, elevation_deg: 50.2, elevation_mil: 893,  fall_deg: 68.5, fall_mil: 1218, tof: 25.9, mv: 1050 },
    { range_m: 5600, range_yd: 6124, elevation_deg: 56.0, elevation_mil: 996,  fall_deg: 74.5, fall_mil: 1324, tof: 28.8, mv: 1050 },
  ],
  "Charge 4": [
    { range_m: 1500, range_yd: 1641, elevation_deg: 5.0,  elevation_mil: 89,   fall_deg: 5.3,  fall_mil: 94,   tof: 3.5,  mv: 1250 },
    { range_m: 2000, range_yd: 2187, elevation_deg: 7.2,  elevation_mil: 128,  fall_deg: 7.9,  fall_mil: 140,  tof: 4.7,  mv: 1250 },
    { range_m: 2500, range_yd: 2734, elevation_deg: 9.8,  elevation_mil: 174,  fall_deg: 11.2, fall_mil: 199,  tof: 6.2,  mv: 1250 },
    { range_m: 3000, range_yd: 3281, elevation_deg: 12.9, elevation_mil: 229,  fall_deg: 15.3, fall_mil: 272,  tof: 7.8,  mv: 1250 },
    { range_m: 3500, range_yd: 3828, elevation_deg: 16.4, elevation_mil: 292,  fall_deg: 20.2, fall_mil: 359,  tof: 9.7,  mv: 1250 },
    { range_m: 4000, range_yd: 4374, elevation_deg: 20.3, elevation_mil: 361,  fall_deg: 25.8, fall_mil: 459,  tof: 11.7, mv: 1250 },
    { range_m: 4500, range_yd: 4921, elevation_deg: 24.6, elevation_mil: 437,  fall_deg: 31.8, fall_mil: 566,  tof: 13.9, mv: 1250 },
    { range_m: 5000, range_yd: 5468, elevation_deg: 29.2, elevation_mil: 519,  fall_deg: 38.2, fall_mil: 679,  tof: 16.2, mv: 1250 },
    { range_m: 5500, range_yd: 6015, elevation_deg: 34.2, elevation_mil: 608,  fall_deg: 44.8, fall_mil: 797,  tof: 18.7, mv: 1250 },
    { range_m: 6000, range_yd: 6562, elevation_deg: 39.4, elevation_mil: 700,  fall_deg: 51.5, fall_mil: 916,  tof: 21.3, mv: 1250 },
    { range_m: 6500, range_yd: 7109, elevation_deg: 44.8, elevation_mil: 796,  fall_deg: 58.0, fall_mil: 1031, tof: 24.0, mv: 1250 },
    { range_m: 7000, range_yd: 7655, elevation_deg: 50.4, elevation_mil: 896,  fall_deg: 64.2, fall_mil: 1141, tof: 26.8, mv: 1250 },
    { range_m: 7500, range_yd: 8202, elevation_deg: 55.8, elevation_mil: 992,  fall_deg: 69.8, fall_mil: 1241, tof: 29.5, mv: 1250 },
    { range_m: 8000, range_yd: 8749, elevation_deg: 60.5, elevation_mil: 1076, fall_deg: 74.5, fall_mil: 1324, tof: 32.2, mv: 1250 },
    { range_m: 8787, range_yd: 9610, elevation_deg: 68.0, elevation_mil: 1209, fall_deg: 80.5, fall_mil: 1431, tof: 37.5, mv: 1250 },
  ],
};

// ─── Mühimmat Bilgileri ──────────────────────────────────────────────────────
const AMMO_DATA: Record<string, AmmoInfo> = {
  M48:  { name: "HE M48",      nameEn: "High Explosive Shell M48",          weight_kg: 6.35, weight_lb: 14.0, fuze: "M51A5 / PD", color: "bg-yellow-500" },
  M66:  { name: "HE-AT M66",   nameEn: "High Explosive Anti-Tank M66",      weight_kg: 6.58, weight_lb: 14.5, fuze: "M62 / BD",   color: "bg-red-500"    },
  M89:  { name: "WP M89",      nameEn: "White Phosphorus (Smoke) M89",      weight_kg: 6.62, weight_lb: 14.6, fuze: "M51A5 / PD", color: "bg-white border border-gray-300" },
  M64:  { name: "Smoke M64",   nameEn: "Base Ejection Smoke M64",           weight_kg: 6.30, weight_lb: 13.9, fuze: "M54 / MT",   color: "bg-gray-400"   },
  M115: { name: "Illum M115",  nameEn: "Illuminating Shell M115",           weight_kg: 6.40, weight_lb: 14.1, fuze: "M54 / MT",   color: "bg-amber-300"  },
};

// ─── Silah Özellikleri ────────────────────────────────────────────────────────
const WEAPON_SPECS = [
  { label: "Kalibre",            value: "75 mm (2.95 in)" },
  { label: "Namlu Uzunluğu",     value: "1.19 m / L15.9 (bore)" },
  { label: "Toplam Uzunluk",     value: "3.68 m (12 ft 1 in)" },
  { label: "Genişlik",           value: "1.22 m (4 ft)" },
  { label: "Yükseklik",          value: "0.94 m (3 ft 1 in)" },
  { label: "Ağırlık (savaş)",    value: "653 kg (1,440 lb)" },
  { label: "Mürettebat",         value: "6–8 kişi" },
  { label: "Yükseliş (Elevat.)", value: "-5° / +45°" },
  { label: "Traverse (Yatay)",   value: "6° (arabada) / 360° (plakada)" },
  { label: "Azami Menzil (Ch.4)",value: "8,787 m / 9,610 yd" },
  { label: "Ateş Hızı",          value: "3–6 atım/dak (max 6 atım/dak)" },
  { label: "Namlı Hız (Maks.)",  value: "381 m/s (1,250 ft/s)" },
  { label: "Hizmet Yılı",        value: "1927 – günümüz" },
  { label: "Üretim Adedi",        value: "~8,400 (savaş dönemi)" },
  { label: "Üretici",            value: "Rock Island Arsenal / General Electric" },
  { label: "Breech Tipi",        value: "Yatay Sürgülü Kamalı" },
  { label: "Geri Tepme Sistemi", value: "Hidro-pnömatik, sabit" },
  { label: "Araç Yükü",          value: "7 katır yükü / 9 paraşüt paketi" },
];

const CHARGE_COLORS: Record<ChargeName, string> = {
  "Charge 1": "from-blue-600 to-blue-800",
  "Charge 2": "from-green-600 to-green-800",
  "Charge 3": "from-orange-500 to-orange-700",
  "Charge 4": "from-red-600 to-red-800",
};
const CHARGE_BADGE: Record<ChargeName, string> = {
  "Charge 1": "bg-blue-100 text-blue-800 border-blue-300",
  "Charge 2": "bg-green-100 text-green-800 border-green-300",
  "Charge 3": "bg-orange-100 text-orange-800 border-orange-300",
  "Charge 4": "bg-red-100 text-red-800 border-red-300",
};
const CHARGE_MV: Record<ChargeName, string> = {
  "Charge 1": "~213 m/s (700 ft/s)",
  "Charge 2": "~259 m/s (850 ft/s)",
  "Charge 3": "~320 m/s (1,050 ft/s)",
  "Charge 4": "~381 m/s (1,250 ft/s)",
};
const CHARGE_MAX_RANGE: Record<ChargeName, string> = {
  "Charge 1": "~2,900 m",
  "Charge 2": "~4,200 m",
  "Charge 3": "~5,600 m",
  "Charge 4": "~8,787 m",
};

// ─── Küçük obüs açı göstergesi (SVG) ────────────────────────────────────────
function CannonAngle({ deg, color = "#facc15" }: { deg: number; color?: string }) {
  const rad = (deg * Math.PI) / 180;
  const L = 22; // namlu uzunluğu (px)
  const cx = 8, cy = 28; // top noktası
  const x2 = cx + L * Math.cos(rad);
  const y2 = cy - L * Math.sin(rad);
  // Yay için: 0°'dan deg'e kadar
  const arcR = 10;
  const arcX = cx + arcR * Math.cos(rad);
  const arcY = cy - arcR * Math.sin(rad);
  const largeArc = deg > 180 ? 1 : 0;
  return (
    <svg width="46" height="36" viewBox="0 0 46 36" className="flex-shrink-0">
      {/* zemin çizgisi */}
      <line x1="2" y1="29" x2="44" y2="29" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
      {/* tekerlekler */}
      <circle cx="12" cy="30" r="3" fill="#374151" stroke="#6b7280" strokeWidth="0.8" />
      <circle cx="22" cy="30" r="3" fill="#374151" stroke="#6b7280" strokeWidth="0.8" />
      {/* laveta gövdesi */}
      <rect x="8" y="26" width="18" height="3.5" rx="1" fill="#374151" />
      {/* açı yayı */}
      <path
        d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcX.toFixed(2)} ${arcY.toFixed(2)}`}
        fill="none"
        stroke="#6b7280"
        strokeWidth="0.8"
        strokeDasharray="2,2"
      />
      {/* namlu */}
      <line
        x1={cx} y1={cy}
        x2={x2.toFixed(2)} y2={y2.toFixed(2)}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* açı etiketi */}
      <text
        x="36" y="22"
        fontSize="7"
        fill={color}
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {deg.toFixed(0)}°
      </text>
    </svg>
  );
}

// ─── Düşüş yönü göstergesi (SVG) ────────────────────────────────────────────
function FallAngle({ deg, color = "#a78bfa" }: { deg: number; color?: string }) {
  const rad = (deg * Math.PI) / 180;
  const L = 20;
  const cx = 38, cy = 8;
  const x2 = cx - L * Math.cos(rad);
  const y2 = cy + L * Math.sin(rad);
  return (
    <svg width="46" height="36" viewBox="0 0 46 36" className="flex-shrink-0">
      <line x1="2" y1="30" x2="44" y2="30" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
      {/* hedef */}
      <circle cx="38" cy="30" r="2.5" fill="#374151" stroke="#6b7280" strokeWidth="0.8" />
      {/* düşüş oku */}
      <line
        x1={cx} y1={cy}
        x2={x2.toFixed(2)} y2={y2.toFixed(2)}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* ok ucu */}
      <circle cx={x2.toFixed(2)} cy={y2.toFixed(2)} r="1.5" fill={color} />
      {/* etiket */}
      <text x="10" y="14" fontSize="7" fill={color} textAnchor="middle"
        fontFamily="monospace" fontWeight="bold">
        {deg.toFixed(0)}°
      </text>
    </svg>
  );
}

type Tab = "table" | "specs" | "ammo" | "notes";

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeCharge, setActiveCharge]     = useState<ChargeName>("Charge 4");
  const [activeTab, setActiveTab]           = useState<Tab>("table");
  const [unit, setUnit]                     = useState<"metric" | "imperial">("metric");
  const [searchRange, setSearchRange]       = useState<string>("");
  const [highlightRow, setHighlightRow]     = useState<number | null>(null);
  const [showVisual, setShowVisual]         = useState<boolean>(true);

  const charges: ChargeName[] = ["Charge 1", "Charge 2", "Charge 3", "Charge 4"];
  const rows     = FIRING_TABLE[activeCharge];
  const filtered = searchRange
    ? rows.filter((r) => String(unit === "metric" ? r.range_m : r.range_yd).includes(searchRange))
    : rows;

  // Charge rengini hex olarak al
  const chargeHex: Record<ChargeName, string> = {
    "Charge 1": "#3b82f6",
    "Charge 2": "#22c55e",
    "Charge 3": "#f97316",
    "Charge 4": "#ef4444",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-600/40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-3xl">
              💣
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-widest text-yellow-400 uppercase">
                  M116 · 75mm Pack Howitzer
                </h1>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded">M1A1</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 tracking-wider">
                ATEŞİ TABLOSU / FIRING TABLE — FT 75-H-1 · 75mm HE M48 Shell
              </p>
            </div>
          </div>
          <div className="md:ml-auto text-right text-xs text-gray-500 space-y-0.5">
            <div>🇺🇸 United States Army</div>
            <div>Hizmet: 1927 – Günümüz</div>
            <div className="text-yellow-600">UNCLASSIFIED / TM 9-1901</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Tab Menü ───────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-700">
          {([
            { key: "table", label: "📊 Atış Tablosu" },
            { key: "specs", label: "⚙️ Teknik Özellikler" },
            { key: "ammo",  label: "🔴 Mühimmat" },
            { key: "notes", label: "📋 Notlar" },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key ? "bg-yellow-500 text-gray-950" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            ATIŞI TABLOSU
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "table" && (
          <div className="space-y-4">

            {/* Charge Seçimi */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {charges.map((c) => (
                <button
                  key={c}
                  onClick={() => { setActiveCharge(c); setSearchRange(""); setHighlightRow(null); }}
                  className={`rounded-xl p-3 border-2 transition-all text-left ${
                    activeCharge === c
                      ? `bg-gradient-to-br ${CHARGE_COLORS[c]} border-transparent shadow-lg`
                      : "bg-gray-900 border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="font-bold text-sm">{c}</div>
                  <div className="text-xs opacity-75 mt-1">MV: {CHARGE_MV[c]}</div>
                  <div className="text-xs opacity-75">Max: {CHARGE_MAX_RANGE[c]}</div>
                </button>
              ))}
            </div>

            {/* Bilgi Bandı */}
            <div className={`rounded-xl p-4 bg-gradient-to-r ${CHARGE_COLORS[activeCharge]} flex flex-wrap items-center gap-4`}>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-75">Seçili Charge</div>
                <div className="text-2xl font-bold">{activeCharge}</div>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div>
                <div className="text-xs opacity-75">Namlı Hız</div>
                <div className="font-semibold">{CHARGE_MV[activeCharge]}</div>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div>
                <div className="text-xs opacity-75">Azami Menzil</div>
                <div className="font-semibold">{CHARGE_MAX_RANGE[activeCharge]}</div>
              </div>
              <div className="w-px h-10 bg-white/20 hidden md:block" />
              <div>
                <div className="text-xs opacity-75">Satır Sayısı</div>
                <div className="font-semibold">{FIRING_TABLE[activeCharge].length} kayıt</div>
              </div>
              {/* Kontroller */}
              <div className="ml-auto flex flex-wrap gap-2 items-center">
                {/* Görsel açı toggle */}
                <button
                  onClick={() => setShowVisual(!showVisual)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                    showVisual ? "bg-white text-gray-900 border-white" : "text-white/70 border-white/30"
                  }`}
                >
                  {showVisual ? "🎯 Görsel Açık" : "🎯 Görsel Kapalı"}
                </button>
                {/* Birim */}
                <div className="flex rounded-lg overflow-hidden border border-white/30">
                  <button onClick={() => setUnit("metric")}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${unit === "metric" ? "bg-white text-gray-900" : "text-white/70"}`}>
                    Metrik
                  </button>
                  <button onClick={() => setUnit("imperial")}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${unit === "imperial" ? "bg-white text-gray-900" : "text-white/70"}`}>
                    İmparial
                  </button>
                </div>
                {/* Arama */}
                <input
                  type="text"
                  placeholder={`Menzil ara (${unit === "metric" ? "m" : "yd"})...`}
                  value={searchRange}
                  onChange={(e) => setSearchRange(e.target.value)}
                  className="bg-white/10 border border-white/30 rounded-lg px-3 py-1 text-xs placeholder-white/50 w-36 focus:outline-none focus:border-white/60"
                />
              </div>
            </div>

            {/* Tablo */}
            <div className="rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="px-3 py-3 text-left text-xs text-yellow-400 uppercase tracking-widest">#</th>
                      <th className="px-3 py-3 text-left text-xs text-yellow-400 uppercase tracking-widest">
                        Menzil<br />
                        <span className="text-gray-500 normal-case font-normal">
                          {unit === "metric" ? "metre (m)" : "yard (yd)"}
                        </span>
                      </th>

                      {/* Atış açısı sütun grubu */}
                      <th className="px-3 py-3 text-left text-xs text-cyan-400 uppercase tracking-widest border-l border-gray-700">
                        {showVisual ? "Atış Açısı" : "Elev (°)"}<br />
                        <span className="text-gray-500 normal-case font-normal">Elevation</span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs text-cyan-400 uppercase tracking-widest">
                        Elev<br />
                        <span className="text-gray-500 normal-case font-normal">(mil)</span>
                      </th>

                      {/* Düşüş açısı sütun grubu */}
                      <th className="px-3 py-3 text-left text-xs text-purple-400 uppercase tracking-widest border-l border-gray-700">
                        {showVisual ? "Düşüş Açısı" : "Fall (°)"}<br />
                        <span className="text-gray-500 normal-case font-normal">Angle of Fall</span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs text-purple-400 uppercase tracking-widest">
                        Fall<br />
                        <span className="text-gray-500 normal-case font-normal">(mil)</span>
                      </th>

                      <th className="px-3 py-3 text-left text-xs text-yellow-400 uppercase tracking-widest border-l border-gray-700">
                        Uçuş Süresi<br />
                        <span className="text-gray-500 normal-case font-normal">ToF (sn)</span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs text-yellow-400 uppercase tracking-widest">
                        Namlı Hız<br />
                        <span className="text-gray-500 normal-case font-normal">ft/s</span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs text-yellow-400 uppercase tracking-widest">
                        Menzil Bandı
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-10 text-gray-500">
                          Menzil bulunamadı
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, idx) => {
                        const maxRange = unit === "metric"
                          ? FIRING_TABLE[activeCharge].at(-1)!.range_m
                          : FIRING_TABLE[activeCharge].at(-1)!.range_yd;
                        const currRange = unit === "metric" ? row.range_m : row.range_yd;
                        const pct = Math.round((currRange / maxRange) * 100);
                        const isHighlight = highlightRow === idx;
                        const hx = chargeHex[activeCharge];

                        return (
                          <tr
                            key={idx}
                            onClick={() => setHighlightRow(isHighlight ? null : idx)}
                            className={`border-b border-gray-800 cursor-pointer transition-colors ${
                              isHighlight
                                ? "bg-yellow-500/15 border-yellow-500/30"
                                : idx % 2 === 0
                                ? "bg-gray-900/40 hover:bg-gray-800/60"
                                : "bg-gray-900/20 hover:bg-gray-800/40"
                            }`}
                          >
                            {/* # */}
                            <td className="px-3 py-2 text-gray-500 text-xs">{idx + 1}</td>

                            {/* Menzil */}
                            <td className="px-3 py-2 font-bold text-white">
                              {unit === "metric"
                                ? `${row.range_m.toLocaleString()} m`
                                : `${row.range_yd.toLocaleString()} yd`}
                            </td>

                            {/* Atış açısı — görsel veya sayı */}
                            <td className="px-3 py-2 border-l border-gray-800">
                              {showVisual ? (
                                <div className="flex items-center gap-1">
                                  <CannonAngle deg={row.elevation_deg} color={hx} />
                                  <span className="text-cyan-300 text-xs font-bold">{row.elevation_deg.toFixed(1)}°</span>
                                </div>
                              ) : (
                                <span className="text-cyan-300 font-bold">{row.elevation_deg.toFixed(1)}°</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-cyan-400 font-bold">{row.elevation_mil}</td>

                            {/* Düşüş açısı */}
                            <td className="px-3 py-2 border-l border-gray-800">
                              {showVisual ? (
                                <div className="flex items-center gap-1">
                                  <FallAngle deg={row.fall_deg} color="#a78bfa" />
                                  <span className="text-purple-300 text-xs font-bold">{row.fall_deg.toFixed(1)}°</span>
                                </div>
                              ) : (
                                <span className="text-purple-300 font-bold">{row.fall_deg.toFixed(1)}°</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-purple-400 font-bold">{row.fall_mil}</td>

                            {/* ToF */}
                            <td className="px-3 py-2 text-amber-300 border-l border-gray-800">
                              {row.tof.toFixed(1)} s
                            </td>

                            {/* MV */}
                            <td className="px-3 py-2 text-green-300">{row.mv}</td>

                            {/* Menzil bandı */}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 rounded-full h-2 w-20">
                                  <div
                                    className={`h-2 rounded-full bg-gradient-to-r ${CHARGE_COLORS[activeCharge]}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sütun Açıklaması */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
                <span><b className="text-cyan-300">Atış Açısı (Elevation)</b> — Namlu ile yatay düzlem arasındaki açı. Küçük görselde sarı çizgi.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span><b className="text-purple-300">Düşüş Açısı (Angle of Fall)</b> — Merminin hedefe çarparken yaptığı açı. Uzak menzilde çok daha dik olur.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <span><b className="text-amber-300">ToF</b> — Time of Flight, merminin uçuş süresi (saniye).</span>
              </div>
            </div>

            {/* Seçili Satır Detayı */}
            {highlightRow !== null && filtered[highlightRow] && (() => {
              const r = filtered[highlightRow];
              const hx = chargeHex[activeCharge];
              return (
                <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-5">
                  <div className="text-yellow-400 font-bold text-sm mb-4 flex items-center gap-2">
                    <span>📍</span> Seçili Atış Verisi — {activeCharge}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: "Menzil", value: `${r.range_m.toLocaleString()} m / ${r.range_yd.toLocaleString()} yd` },
                      { label: "Atış Açısı (°)", value: `${r.elevation_deg.toFixed(1)}°` },
                      { label: "Atış Açısı (mil)", value: `${r.elevation_mil} mil` },
                      { label: "Düşüş Açısı (°)", value: `${r.fall_deg.toFixed(1)}°` },
                      { label: "Düşüş Açısı (mil)", value: `${r.fall_mil} mil` },
                      { label: "Uçuş Süresi", value: `${r.tof.toFixed(1)} sn` },
                      { label: "Namlı Hız", value: `${r.mv} ft/s` },
                      { label: "Elev–Fall Farkı", value: `+${(r.fall_deg - r.elevation_deg).toFixed(1)}°` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-900/60 rounded-lg p-3">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-lg font-bold text-yellow-300">{value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Yan yana büyük görseller */}
                  <div className="flex flex-wrap gap-6 items-center justify-center mt-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-cyan-400 font-bold">ATİŞ AÇISI</span>
                      <svg width="140" height="100" viewBox="0 0 140 100">
                        <line x1="4" y1="85" x2="136" y2="85" stroke="#374151" strokeWidth="2" />
                        {/* tekerlekler */}
                        <circle cx="24" cy="88" r="7" fill="#374151" stroke="#6b7280" strokeWidth="1.5" />
                        <circle cx="44" cy="88" r="7" fill="#374151" stroke="#6b7280" strokeWidth="1.5" />
                        {/* laveta */}
                        <rect x="18" y="80" width="42" height="8" rx="2" fill="#374151" />
                        {/* açı yayı */}
                        {(() => {
                          const rad = (r.elevation_deg * Math.PI) / 180;
                          const arcR = 28;
                          const cx2 = 24, cy2 = 80;
                          const ax = cx2 + arcR * Math.cos(rad);
                          const ay = cy2 - arcR * Math.sin(rad);
                          return (
                            <>
                              <path d={`M ${cx2 + arcR} ${cy2} A ${arcR} ${arcR} 0 0 0 ${ax.toFixed(1)} ${ay.toFixed(1)}`}
                                fill="none" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="3,3" />
                              {/* açı etiketi */}
                              <text x={cx2 + arcR + 5} y={cy2 + 4} fontSize="10" fill="#6b7280" fontFamily="monospace">{r.elevation_deg.toFixed(0)}°</text>
                            </>
                          );
                        })()}
                        {/* namlu */}
                        {(() => {
                          const rad = (r.elevation_deg * Math.PI) / 180;
                          const L2 = 70;
                          const cx2 = 24, cy2 = 80;
                          return <line x1={cx2} y1={cy2} x2={(cx2 + L2 * Math.cos(rad)).toFixed(1)} y2={(cy2 - L2 * Math.sin(rad)).toFixed(1)}
                            stroke={hx} strokeWidth="5" strokeLinecap="round" />;
                        })()}
                      </svg>
                      <span className="text-2xl font-bold text-cyan-300">{r.elevation_deg.toFixed(1)}°</span>
                      <span className="text-xs text-gray-500">{r.elevation_mil} mil</span>
                    </div>
                    <div className="text-gray-600 text-2xl font-bold">→</div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-purple-400 font-bold">DÜŞÜŞ AÇISI</span>
                      <svg width="140" height="100" viewBox="0 0 140 100">
                        <line x1="4" y1="85" x2="136" y2="85" stroke="#374151" strokeWidth="2" />
                        {/* hedef */}
                        <circle cx="120" cy="85" r="5" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="115" y1="85" x2="125" y2="85" stroke="#ef4444" strokeWidth="1.5" />
                        <line x1="120" y1="80" x2="120" y2="90" stroke="#ef4444" strokeWidth="1.5" />
                        {/* düşüş yolu */}
                        {(() => {
                          const rad = (r.fall_deg * Math.PI) / 180;
                          const L2 = 68;
                          const tx = 120, ty = 85;
                          const sx = tx - L2 * Math.cos(rad);
                          const sy = ty - L2 * Math.sin(rad);
                          // yay
                          const arcR = 24;
                          const ax = tx - arcR * Math.cos(rad);
                          const ay = ty - arcR * Math.sin(rad);
                          return (
                            <>
                              {/* yay */}
                              <path d={`M ${tx} ${ty - arcR} A ${arcR} ${arcR} 0 0 1 ${ax.toFixed(1)} ${ay.toFixed(1)}`}
                                fill="none" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="3,3" />
                              <text x={tx - arcR - 14} y={ty - arcR + 10} fontSize="10" fill="#6b7280" fontFamily="monospace">{r.fall_deg.toFixed(0)}°</text>
                              {/* düşüş çizgisi */}
                              <line x1={sx.toFixed(1)} y1={sy.toFixed(1)} x2={tx} y2={ty}
                                stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
                              {/* ok ucu (başlangıç) */}
                              <circle cx={sx.toFixed(1)} cy={sy.toFixed(1)} r="3.5" fill="#a78bfa" />
                            </>
                          );
                        })()}
                      </svg>
                      <span className="text-2xl font-bold text-purple-300">{r.fall_deg.toFixed(1)}°</span>
                      <span className="text-xs text-gray-500">{r.fall_mil} mil</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="text-xs text-gray-600 text-center">
              ⚠️ Standart koşullar: deniz seviyesi, 15°C, %78 nem, rüzgarsız — M48 HE Shell.
              Gerçek atış değerleri meteoroloji, namlu aşınması ve rakıma göre farklılık gösterebilir.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TEKNİK ÖZELLİKLER
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-5 py-3 text-yellow-400 text-sm font-bold uppercase tracking-widest">Teknik Özellikler</div>
                <div className="divide-y divide-gray-800">
                  {WEAPON_SPECS.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center px-5 py-3 hover:bg-gray-800/40 transition-colors">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-sm font-semibold text-white text-right max-w-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-700 overflow-hidden">
                  <div className="bg-gray-800 px-5 py-3 text-yellow-400 text-sm font-bold uppercase tracking-widest">Charge Kademeleri</div>
                  <div className="p-4 space-y-3">
                    {charges.map((c) => (
                      <div key={c} className="flex items-center gap-3">
                        <div className={`w-20 text-xs font-bold px-2 py-1 rounded text-center border ${CHARGE_BADGE[c]}`}>{c}</div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-400">Namlı Hız</div>
                          <div className="font-semibold text-sm">{CHARGE_MV[c]}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Max Menzil</div>
                          <div className="font-semibold text-sm text-yellow-300">{CHARGE_MAX_RANGE[c]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-3">
                  <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">Genel Performans</div>
                  {[
                    { label: "Min. Menzil (Ch.1)",  value: "~700 m" },
                    { label: "Max. Menzil (Ch.4)",  value: "8,787 m" },
                    { label: "Min. Yükseliş",       value: "-5° (−89 mil)" },
                    { label: "Max. Yükseliş",       value: "+45° (+800 mil)" },
                    { label: "Azami Atış Hızı",     value: "6 atım/dak" },
                    { label: "Sürekli Atış Hızı",   value: "3 atım/dak" },
                    { label: "Max. Uçuş Süresi",    value: "~37.5 sn (Ch.4)" },
                    { label: "Toplam Menzil Bandı", value: "700 m — 8,787 m" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-bold text-green-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Varyantlar */}
            <div className="rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-5 py-3 text-yellow-400 text-sm font-bold uppercase tracking-widest">Varyantlar</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      {["Model","Laveta","Tekerlekler","Ağırlık","Yükseliş","Traverse","Not"].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-xs text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {[
                      { model:"M1A1 / M1",  laveta:"Kutu laveta M1",   tekerlek:"Ahşap (çelik jant)", agirlik:"576 kg",   yukselis:"+5° / +45°",  traverse:"6°",  not:"Orijinal varyant" },
                      { model:"M1A1 / M8",  laveta:"Ayrık laveta M8",  tekerlek:"Çelik (pnömatik)",   agirlik:"653 kg",   yukselis:"+9° / +50°",  traverse:"45°", not:"Hava indirme (airborne)" },
                      { model:"M1A1 / M3A3",laveta:"Ayrık laveta M3A3",tekerlek:"Pnömatik",           agirlik:"1,009 kg", yukselis:"+9° / +50°",  traverse:"45°", not:"Ağır laveta varyantı" },
                      { model:"M3 / M3A1",  laveta:"Özel (airborne)",  tekerlek:"Pnömatik",           agirlik:"~607 kg",  yukselis:"+5° / +45°",  traverse:"6°",  not:"Kısa namlu, azaltılmış menzil" },
                    ].map((v) => (
                      <tr key={v.model} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-4 py-3 font-bold text-yellow-300">{v.model}</td>
                        <td className="px-4 py-3 text-gray-300">{v.laveta}</td>
                        <td className="px-4 py-3 text-gray-300">{v.tekerlek}</td>
                        <td className="px-4 py-3 text-gray-300">{v.agirlik}</td>
                        <td className="px-4 py-3 text-cyan-300">{v.yukselis}</td>
                        <td className="px-4 py-3 text-cyan-300">{v.traverse}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{v.not}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MÜHİMMAT
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "ammo" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(AMMO_DATA).map(([key, ammo]) => (
                <div key={key} className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-gray-800">
                    <div className={`w-8 h-16 rounded ${ammo.color} flex-shrink-0`} />
                    <div>
                      <div className="font-bold text-white">{ammo.name}</div>
                      <div className="text-xs text-gray-400">{ammo.nameEn}</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { label: "Kod",     value: key },
                      { label: "Ağırlık", value: `${ammo.weight_kg} kg / ${ammo.weight_lb} lb` },
                      { label: "Füny",    value: ammo.fuze },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-white font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800 px-5 py-3 text-yellow-400 text-sm font-bold uppercase tracking-widest">
                M48 HE Shell — Charge / Menzil Özeti
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      {["Charge","Namlı Hız (ft/s)","Namlı Hız (m/s)","Min. Menzil","Max. Menzil"].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-xs text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {[
                      { c:"Charge 1", fps:700,  ms:213, min:"700 m / 765 yd",     max:"2,900 m / 3,171 yd" },
                      { c:"Charge 2", fps:850,  ms:259, min:"900 m / 984 yd",     max:"4,200 m / 4,593 yd" },
                      { c:"Charge 3", fps:1050, ms:320, min:"1,200 m / 1,312 yd", max:"5,600 m / 6,124 yd" },
                      { c:"Charge 4", fps:1250, ms:381, min:"1,500 m / 1,641 yd", max:"8,787 m / 9,610 yd" },
                    ].map((row) => (
                      <tr key={row.c} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-4 py-3 font-bold">
                          <span className={`px-2 py-1 rounded text-xs border ${CHARGE_BADGE[row.c as ChargeName]}`}>{row.c}</span>
                        </td>
                        <td className="px-4 py-3 text-green-300 font-semibold">{row.fps}</td>
                        <td className="px-4 py-3 text-green-400">{row.ms}</td>
                        <td className="px-4 py-3 text-gray-300">{row.min}</td>
                        <td className="px-4 py-3 text-yellow-300 font-semibold">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-red-700/40 bg-red-900/10 p-5 space-y-3">
              <div className="text-red-400 font-bold text-sm uppercase tracking-widest">⚠️ M66 HE-AT — Tanksavar Notu</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {[
                  { label:"Menzil",    value:"7,200 m / 7,900 yd (max)" },
                  { label:"Namlı Hız",value:"305 m/s (1,000 ft/s)" },
                  { label:"Zırh Delme",value:'3"–4" (76–102 mm) / 0°–60° her menzilde' },
                  { label:"Füny",     value:"M62 — Taban delici (BD)" },
                  { label:"Kullanım", value:"Hafif zırhlı araç & hafif bunkere karşı" },
                  { label:"Not",      value:"Charge 4 ile atılır; farklı atış tablosu uygulanır" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-semibold text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            NOTLAR
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            {[
              {
                icon:"📌", title:"Tablonun Kullanımı",
                color:"border-blue-700/40 bg-blue-900/10", titleColor:"text-blue-300",
                items:[
                  "Tablodaki değerler standart atmosferik koşullar için geçerlidir (deniz seviyesi, 15°C, %78 nem, rüzgar yok).",
                  "Atış açısı (Elevation): namlu ile yatay düzlem arasındaki açı — derece ve mil cinsinden verilmiştir.",
                  "Düşüş açısı (Angle of Fall): merminin hedefle temas ettiği andaki yörüngesi ile yatay düzlem arasındaki açı.",
                  "Düşüş açısı her zaman atış açısından büyüktür; kısa mesafelerde yakın, uzun mesafelerde çok daha dik olur.",
                  "US sistemi: 1 derece = ~17.78 mil (6400 mil tam çember).",
                  "Menzil değerleri ±1% tolerans payına sahiptir.",
                ],
              },
              {
                icon:"📐", title:"Atış / Düşüş Açısı İlişkisi",
                color:"border-cyan-700/40 bg-cyan-900/10", titleColor:"text-cyan-300",
                items:[
                  "Düz atış (flat trajectory, Ch.4 kısa menzil): Elevation ≈ Fall, fark küçük (~1–2°).",
                  "Orta menzil (Ch.4 ~5000 m): Elevation ~29°, Fall ~38° — fark ~9°.",
                  "Uzak menzil (Ch.4 ~8787 m): Elevation ~68°, Fall ~80° — mermi neredeyse düşey düşer.",
                  "Düşüş açısı ne kadar dikse hasar alanı o kadar dar ve derindir (sığaklara karşı daha etkili).",
                  "Alçak elevation + düşük fall = düz yörünge → zırhlı hedef etkisi artar (M66 AT).",
                ],
              },
              {
                icon:"⚙️", title:"Atış Prosedürü",
                color:"border-green-700/40 bg-green-900/10", titleColor:"text-green-300",
                items:[
                  "Emniyet mesafesi: Dost kuvvetlerden en az 200 m (kırmızı hat).",
                  "Çatal: İlk 4'er (400 m) / ikinci 2'şer (200 m) / son 1'er (100 m) seri.",
                  "Kısa ateş (direct fire): 300 m altı mesafe — yalnızca Charge 1 veya 2 kullanılır.",
                  "Sürekli atış: max 3 atım/dak; kısa: 6 atım/dak (namlu ısınmasına dikkat).",
                ],
              },
              {
                icon:"🌡️", title:"Meteoroloji Düzeltmeleri",
                color:"border-orange-700/40 bg-orange-900/10", titleColor:"text-orange-300",
                items:[
                  "+10°C sıcaklık artışı → ~+1% menzil artışı (barut genleşmesi).",
                  "Kuyruk rüzgarı (15 km/h) → ~+150 m menzil; başa rüzgar → ~−150 m.",
                  "Rakım her 1,000 m artışı → ~+2% menzil artışı (hava yoğunluğu azalması).",
                  "Namlu aşınması: Her 1,000 atım sonrası namlı hızı ~5–10 ft/s düşer.",
                ],
              },
              {
                icon:"📖", title:"Referanslar",
                color:"border-purple-700/40 bg-purple-900/10", titleColor:"text-purple-300",
                items:[
                  "TM 9-1901 — Artillery Ammunition, US Army, 1944",
                  "FM 6-40 — Field Artillery Gunnery, US Army",
                  "Firing Tables FT 75-H-1, US Ordnance Department",
                  "lonesentry.com — 75mm Pack Howitzer M1A1 Characteristics",
                  "grokipedia.com — M116 Howitzer Ballistic Performance",
                  "historyofwar.org — 75mm Pack Howitzer M1",
                ],
              },
            ].map(({ icon, title, color, titleColor, items }) => (
              <div key={title} className={`rounded-xl border ${color} p-5 space-y-3`}>
                <div className={`font-bold text-sm uppercase tracking-widest ${titleColor}`}>{icon} {title}</div>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-gray-600 flex-shrink-0 mt-0.5">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-xs text-gray-500 space-y-1">
              <div className="text-gray-400 font-semibold">⚠️ Uyarı / Disclaimer</div>
              <p>Bu sayfa kamuya açık tarihi kaynaklardan derlenen referans niteliğindeki veriler içermektedir.
              Firing Table değerleri yalnızca eğitim ve tarihsel araştırma amaçlıdır.
              Operasyonel kullanım için resmi ordu yayınları esas alınmalıdır.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-10 border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        M116 75mm Pack Howitzer — Atış Tablosu Referans Uygulaması · Veriler: TM 9-1901 / FT 75-H-1
      </footer>
    </div>
  );
}
