// ─── Types ───────────────────────────────────────────────────────────────────

export interface HotspotData {
  id: string;
  label: string;
  part: string;
  partEn: string;
  status: "Na stanju" | "Po porudžbini" | "Rasprodato";
  oem: string;
  description: string;
  position: [number, number, number];
  focusPosition: [number, number, number];
}

export interface CatalogPart {
  name: string;
  oem: string;
  status: "Na stanju" | "Po porudžbini";
  price: string;
}

export interface CatalogModel {
  id: string;
  brand: string;
  model: string;
  year: string;
  slug: string;
  parts: CatalogPart[];
}

// ─── Hotspot Mock Data ───────────────────────────────────────────────────────

export const HOTSPOTS: HotspotData[] = [
  {
    id: "steering",
    label: "01",
    part: "Airbag Volana",
    partEn: "Steering Wheel Airbag",
    status: "Na stanju",
    oem: "5G0880201",
    description:
      "Drajverski vazdušni jastuk. Aktivira se pri frontalnom sudaru. Kompatibilan sa VW Golf 7, Audi A3 8V.",
    position: [0, 0.55, 1.1],
    focusPosition: [0.5, 1.2, 2.8],
  },
  {
    id: "dashboard",
    label: "02",
    part: "Airbag Table",
    partEn: "Dashboard Airbag",
    status: "Na stanju",
    oem: "5G0880204A",
    description:
      "Suvozačev vazdušni jastuk integrisan u tablu. Veći volumen od drajverskog. Za Golf 7 i Octavia A7.",
    position: [1.1, 0.35, 0.2],
    focusPosition: [2.2, 1.0, 2.5],
  },
  {
    id: "curtain",
    label: "03",
    part: "Bočni Zavesni Airbag",
    partEn: "Side Curtain Airbag",
    status: "Po porudžbini",
    oem: "5G0880741",
    description:
      "Bočni zavesni vazdušni jastuk. Pruža zaštitu glave pri bočnom udaru. Montira se u krovni okvir.",
    position: [-1.5, 0.75, 0.4],
    focusPosition: [-2.8, 1.3, 2.5],
  },
];

// ─── Catalog Mock Data ───────────────────────────────────────────────────────

export const CATALOG: CatalogModel[] = [
  {
    id: "golf7",
    brand: "Volkswagen",
    model: "Golf 7",
    year: "2012–2019",
    slug: "vw-golf-7",
    parts: [
      {
        name: "Airbag Volana",
        oem: "5G0880201",
        status: "Na stanju",
        price: "12.500 RSD",
      },
      {
        name: "Airbag Table",
        oem: "5G0880204A",
        status: "Na stanju",
        price: "15.800 RSD",
      },
      {
        name: "Bočni Zavesni",
        oem: "5G0880741",
        status: "Po porudžbini",
        price: "14.200 RSD",
      },
      {
        name: "Pojas Pretenzioner",
        oem: "5G0888613",
        status: "Na stanju",
        price: "8.900 RSD",
      },
    ],
  },
  {
    id: "a4b9",
    brand: "Audi",
    model: "A4 B9",
    year: "2015–2023",
    slug: "audi-a4-b9",
    parts: [
      {
        name: "Airbag Volana",
        oem: "8W0880201",
        status: "Na stanju",
        price: "18.900 RSD",
      },
      {
        name: "Airbag Table",
        oem: "8W0880204",
        status: "Na stanju",
        price: "22.500 RSD",
      },
      {
        name: "Kolenski Airbag",
        oem: "8W0880842",
        status: "Po porudžbini",
        price: "16.700 RSD",
      },
      {
        name: "Bočni u Sedištu",
        oem: "8W0880241",
        status: "Na stanju",
        price: "15.300 RSD",
      },
    ],
  },
  {
    id: "octavia-a7",
    brand: "Škoda",
    model: "Octavia A7",
    year: "2013–2020",
    slug: "skoda-octavia-a7",
    parts: [
      {
        name: "Airbag Volana",
        oem: "5E0880201",
        status: "Na stanju",
        price: "11.200 RSD",
      },
      {
        name: "Airbag Table",
        oem: "5E0880204",
        status: "Po porudžbini",
        price: "14.500 RSD",
      },
      {
        name: "Bočni Zavesni",
        oem: "5E0880741",
        status: "Na stanju",
        price: "13.800 RSD",
      },
      {
        name: "Pojas Pretenzioner",
        oem: "5E0888613",
        status: "Na stanju",
        price: "7.600 RSD",
      },
    ],
  },
];

// ─── QR Placeholder Pattern (deterministic) ─────────────────────────────────

export const QR_PATTERN = [
  1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1,
];
