/**
 * Full Loom demo seed for Ana (admin), Miguel (agent), Sofia (buyer).
 * Safe to re-run — skips existing emails / references / titled records.
 *
 * Usage: node helpers/seedDemoData.js
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const DEMO_PROPS_DIR = path.join(
  __dirname,
  "../../client/public/demo-props"
);
/** Prefer real Unsplash property photos (real-*.jpg); fall back to local assets. */
const DEMO_IMAGE_FILES = [
  ...Array.from({ length: 12 }, (_, i) =>
    path.join(DEMO_PROPS_DIR, `real-${i + 1}.jpg`)
  ),
  path.join(__dirname, "../../client/public/property.jpg"),
  path.join(__dirname, "../../client/public/property-big.png"),
].filter((f) => fs.existsSync(f));

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".csv") return "text/csv";
  if (ext === ".xlsx") {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (ext === ".xls") return "application/vnd.ms-excel";
  return "image/jpeg";
}

async function uploadToGridFs(filePath, filename) {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "filesBucket",
  });
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentTypeFor(filePath),
    });
    fs.createReadStream(filePath)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve(uploadStream.id));
  });
}

/** Always refresh demo listing photos so blank/wrong assets are replaced. */
async function ensurePropertyImages(doc, index) {
  const picks = [
    DEMO_IMAGE_FILES[index % DEMO_IMAGE_FILES.length],
    DEMO_IMAGE_FILES[(index + 1) % DEMO_IMAGE_FILES.length],
    DEMO_IMAGE_FILES[(index + 2) % DEMO_IMAGE_FILES.length],
  ].filter(Boolean);
  if (!picks.length) {
    console.warn("No demo image files found under client/public/demo-props");
    return doc;
  }
  const ids = [];
  const types = [];
  for (let i = 0; i < picks.length; i++) {
    const id = await uploadToGridFs(
      picks[i],
      `${doc.reference || "prop"}-${Date.now()}-${i}${path.extname(picks[i])}`
    );
    ids.push(id);
    types.push(contentTypeFor(picks[i]));
  }
  doc.propertyImgId = ids;
  doc.fileType = types;
  await doc.save();
  console.log(`Images attached: ${doc.reference} (${ids.length})`);
  return doc;
}

const { CONST } = require("./constant");
const { USER } = require("../app/userService/model/userModel");
const { DISTRICT } = require("../app/uploadData/models.js/district.model.js");
const { PROPERTY } = require("../app/property/model/property.model");
const PRODUCT = require("../app/product/model/product.model");
const { FAVOURITE } = require("../app/favourite/model/favourite.model");
const { CART } = require("../app/cart/model/cart.model");
const { SEARCH } = require("../app/search/model/search.model");
const { ORDER } = require("../app/order/model/order.model");
const { Payment } = require("../app/payment/model/payment.model");
const { FAQ_MODEL } = require("../app/faq/model/faq.model");
const { PAGE_MODEL } = require("../app/cms/model/page.model");
const { CATEGORY } = require("../app/category/model/category.model");
const { Notification } = require("../app/notification/model/notification.model");
const { CONTACTUS } = require("../app/contactUs/model/contactUs.model");

const DISTRICTS = [
  "Lisboa",
  "Porto",
  "Faro",
  "Braga",
  "Setúbal",
  "Coimbra",
  "Aveiro",
];

const DEMO_USERS = [
  {
    fullName: "Ana Admin",
    firstName: "Ana",
    lastName: "Admin",
    email: "ana@privatemarket.local",
    password: "Ana@123456",
    roleId: CONST.ADMIN,
  },
  {
    fullName: "Miguel Agent",
    firstName: "Miguel",
    lastName: "Agent",
    email: "miguel@privatemarket.local",
    password: "Miguel@123",
    roleId: CONST.AGENT,
    companyName: "Lisboa Realty",
    mobile: 912345678,
  },
  {
    fullName: "Sofia Buyer",
    firstName: "Sofia",
    lastName: "Buyer",
    email: "sofia@privatemarket.local",
    password: "Sofia@123",
    roleId: CONST.USER,
    mobile: 913456789,
  },
];

const PROPERTIES = [
  {
    name: "Modern Apartment in Chiado",
    description:
      "Bright 2-bedroom apartment near Chiado with balcony and renovated kitchen.",
    place: "Lisboa",
    district: "Lisboa",
    municipality: "Lisboa",
    parish: "Misericórdia",
    street: "Rua Garrett",
    postalCode: "1200-203",
    price: 485000,
    rooms: 2,
    baths: 1,
    floor: 3,
    gross_area: 92,
    net_area: 78,
    year_of_construction: 1998,
    energy_class: "B",
    type_of_real_estate: "FLAT / APARTMENT",
    elevator: "Yes",
    condition: ["Good"],
    expectedRentalYield: 4.2,
    daysToSale: 45,
    priceEstimation: 490000,
    priceDelta: -1.0,
    location: { type: "Point", coordinates: [-9.1427, 38.7108] },
        other_features_real_estate: ['Balcony', 'Fitted wardrobes'],
    other_features_building: [],
    reference: "PM-LIS-001",
  },
  {
    name: "River View Flat — Porto Ribeira",
    description: "Charming flat overlooking the Douro. Great investment.",
    place: "Porto",
    district: "Porto",
    municipality: "Porto",
    parish: "Cedofeita",
    street: "Rua da Ribeira",
    postalCode: "4050-512",
    price: 320000,
    rooms: 1,
    baths: 1,
    floor: 2,
    gross_area: 65,
    net_area: 55,
    year_of_construction: 2005,
    energy_class: "C",
    type_of_real_estate: "FLAT / APARTMENT",
    elevator: "No",
    condition: ["Good"],
    expectedRentalYield: 5.1,
    daysToSale: 62,
    priceEstimation: 310000,
    priceDelta: 3.2,
    location: { type: "Point", coordinates: [-8.611, 41.1405] },
        other_features_real_estate: ['Terrace'],
    other_features_building: [],
    reference: "PM-POR-002",
  },
  {
    name: "Algarve Villa with Pool — Faro",
    description: "Spacious villa with private pool, garden, and parking.",
    place: "Faro",
    district: "Faro",
    municipality: "Loulé",
    parish: "Quarteira",
    street: "Avenida Infante de Sagres",
    postalCode: "8125-302",
    price: 750000,
    rooms: 4,
    baths: 3,
    floor: 0,
    gross_area: 220,
    net_area: 190,
    year_of_construction: 2012,
    energy_class: "A",
    type_of_real_estate: "DUPLEX",
    elevator: "No",
    condition: ["Needs renovating"],
    expectedRentalYield: 3.8,
    daysToSale: 90,
    priceEstimation: 720000,
    priceDelta: 4.2,
    location: { type: "Point", coordinates: [-8.1, 37.067] },
        other_features_real_estate: ['Terrace', 'Parking space/Single garage'],
    other_features_building: ['Swimming pool', 'Garden area'],
    reference: "PM-FAR-003",
  },
  {
    name: "Studio near Universidade — Coimbra",
    description: "Compact studio ideal for students. Near campus.",
    place: "Coimbra",
    district: "Coimbra",
    municipality: "Coimbra",
    parish: "Sé Nova",
    street: "Rua da Sofia",
    postalCode: "3000-390",
    price: 145000,
    rooms: 0,
    baths: 1,
    floor: 1,
    gross_area: 38,
    net_area: 32,
    year_of_construction: 1985,
    energy_class: "D",
    type_of_real_estate: "STUDIO APARTMENT/LOFT",
    elevator: "No",
    condition: ["Needs renovating"],
    expectedRentalYield: 6.5,
    daysToSale: 55,
    priceEstimation: 140000,
    priceDelta: 3.6,
    location: { type: "Point", coordinates: [-8.4265, 40.2033] },
        other_features_real_estate: ['Fitted wardrobes'],
    other_features_building: [],
    reference: "PM-COI-004",
  },
  {
    name: "Family Home — Braga Centro",
    description: "Quiet family home with courtyard, 3 bedrooms.",
    place: "Braga",
    district: "Braga",
    municipality: "Braga",
    parish: "São Vicente",
    street: "Rua do Souto",
    postalCode: "4700-028",
    price: 275000,
    rooms: 3,
    baths: 2,
    floor: 0,
    gross_area: 140,
    net_area: 120,
    year_of_construction: 1990,
    energy_class: "C",
    type_of_real_estate: "FLAT / APARTMENT",
    elevator: "No",
    condition: ["Good"],
    expectedRentalYield: 4.8,
    daysToSale: 70,
    priceEstimation: 268000,
    priceDelta: 2.6,
    location: { type: "Point", coordinates: [-8.4269, 41.5454] },
        other_features_real_estate: ['Parking space/Single garage', 'Storeroom'],
    other_features_building: ['Garden area'],
    reference: "PM-BRA-005",
  },
  {
    name: "Penthouse Cascais Sea View",
    description: "Luxury penthouse with terrace and ocean view.",
    place: "Lisboa",
    district: "Lisboa",
    municipality: "Cascais",
    parish: "Cascais e Estoril",
    street: "Avenida Dom Carlos I",
    postalCode: "2750-310",
    price: 980000,
    rooms: 3,
    baths: 2,
    floor: 8,
    gross_area: 160,
    net_area: 140,
    year_of_construction: 2018,
    energy_class: "A",
    type_of_real_estate: "PENTHOUSE",
    elevator: "Yes",
    condition: ["New"],
    expectedRentalYield: 3.2,
    daysToSale: 110,
    priceEstimation: 995000,
    priceDelta: -1.5,
    location: { type: "Point", coordinates: [-9.4215, 38.6979] },
        other_features_real_estate: ['Air conditioning', 'Balcony', 'Terrace'],
    other_features_building: ['Swimming pool'],
    reference: "PM-CAS-006",
  },
  {
    name: "Setúbal Waterfront Apartment",
    description: "Sunny 2-bed near the marina and ferry.",
    place: "Setúbal",
    district: "Setúbal",
    municipality: "Setúbal",
    parish: "São Sebastião",
    street: "Avenida Luísa Todi",
    postalCode: "2900-451",
    price: 265000,
    rooms: 2,
    baths: 1,
    floor: 4,
    gross_area: 85,
    net_area: 72,
    year_of_construction: 2008,
    energy_class: "B",
    type_of_real_estate: "FLAT / APARTMENT",
    elevator: "Yes",
    condition: ["Good"],
    expectedRentalYield: 5.0,
    daysToSale: 48,
    priceEstimation: 255000,
    priceDelta: 3.9,
    location: { type: "Point", coordinates: [-8.8882, 38.5244] },
        other_features_real_estate: ['Balcony'],
    other_features_building: [],
    reference: "PM-SET-007",
  },
  {
    name: "Aveiro Canal House",
    description: "Character townhouse by the canals — needs light renovation.",
    place: "Aveiro",
    district: "Aveiro",
    municipality: "Aveiro",
    parish: "Glória e Vera Cruz",
    street: "Rua João Mendonça",
    postalCode: "3800-200",
    price: 210000,
    rooms: 3,
    baths: 1,
    floor: 0,
    gross_area: 110,
    net_area: 95,
    year_of_construction: 1972,
    energy_class: "E",
    type_of_real_estate: "FLAT / APARTMENT",
    elevator: "No",
    condition: ["Needs renovating"],
    expectedRentalYield: 5.4,
    daysToSale: 85,
    priceEstimation: 198000,
    priceDelta: 6.1,
    location: { type: "Point", coordinates: [-8.6538, 40.6405] },
        other_features_real_estate: ['Terrace'],
    other_features_building: ['Garden area'],
    reference: "PM-AVE-008",
  },
];

async function upsertUser(user) {
  const existing = await USER.findOne({ email: user.email });
  if (existing) {
    // Keep password in sync for demos
    existing.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS || "10")
    );
    existing.fullName = user.fullName;
    existing.firstName = user.firstName;
    existing.lastName = user.lastName;
    existing.roleId = user.roleId;
    existing.state = CONST.ACTIVE;
    existing.isVerified = CONST.VERIFIED;
    if (user.companyName) existing.companyName = user.companyName;
    if (user.mobile) existing.mobile = user.mobile;
    // Local Stripe stub customer id (real Stripe not required for demos)
    if (!existing.customerId) {
      existing.customerId = `cus_demo_${existing._id}`;
    }
    await existing.save();
    console.log(`User updated: ${user.email}`);
    return existing;
  }
  const created = await USER.create({
    ...user,
    password: await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS || "10")
    ),
    state: CONST.ACTIVE,
    isVerified: CONST.VERIFIED,
  });
  if (!created.customerId) {
    created.customerId = `cus_demo_${created._id}`;
    await created.save();
  }
  console.log(`Created user: ${user.email}`);
  return created;
}

async function seed() {
  if (!process.env.DB_URL) {
    console.error("DB_URL missing. Copy server/.env.example to server/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URL);
  console.log("Connected:", process.env.DB_URL);

  const users = {};
  for (const u of DEMO_USERS) {
    users[u.email] = await upsertUser(u);
  }

  const admin = users["ana@privatemarket.local"];
  const agent = users["miguel@privatemarket.local"];
  const buyer = users["sofia@privatemarket.local"];

  // --- Districts ---
  for (const title of DISTRICTS) {
    if (await DISTRICT.findOne({ title })) continue;
    await DISTRICT.create({
      title,
      createdBy: admin._id,
      stateId: CONST.ACTIVE,
    });
    console.log(`District: ${title}`);
  }

  // --- Miguel's properties ---
  const propertyDocs = [];
  let propIndex = 0;
  for (const p of PROPERTIES) {
    let doc = await PROPERTY.findOne({ reference: p.reference });
    if (doc) {
      doc.createdBy = agent._id;
      doc.username = agent.fullName;
      doc.email = agent.email;
      doc.mobile = String(agent.mobile || "");
      doc.state = CONST.ACTIVE;
      // Keep listing filter fields in sync with seed (types, condition, features, sizes)
      Object.assign(doc, {
        name: p.name,
        description: p.description,
        place: p.place,
        district: p.district,
        municipality: p.municipality,
        parish: p.parish,
        street: p.street,
        postalCode: p.postalCode,
        price: p.price,
        rooms: p.rooms,
        baths: p.baths,
        floor: p.floor,
        gross_area: p.gross_area,
        net_area: p.net_area,
        type_of_real_estate: p.type_of_real_estate,
        categoryId: p.type_of_real_estate,
        elevator: p.elevator,
        condition: p.condition,
        other_features_real_estate: p.other_features_real_estate || [],
        other_features_building: p.other_features_building || [],
        expectedRentalYield: p.expectedRentalYield,
        daysToSale: p.daysToSale,
        priceEstimation: p.priceEstimation,
        priceDelta: p.priceDelta,
        location: p.location,
      });
      await doc.save();
      console.log(`Property linked to Miguel: ${p.reference}`);
    } else {
      doc = await PROPERTY.create({
        ...p,
        categoryId: p.type_of_real_estate,
        createdBy: agent._id,
        username: agent.fullName,
        email: agent.email,
        mobile: String(agent.mobile || ""),
        state: CONST.ACTIVE,
        image: [],
      });
      console.log(`Property created: ${p.reference}`);
    }
    doc = await ensurePropertyImages(doc, propIndex++);
    propertyDocs.push(doc);
  }

  // --- Ana: categories ---
  const categoryNames = [
    { name: "Residential", description: "Homes and apartments" },
    { name: "Commercial", description: "Shops and offices" },
    { name: "Investment packs", description: "CSV/data products" },
  ];
  const categories = [];
  for (const c of categoryNames) {
    let cat = await CATEGORY.findOne({ name: c.name });
    if (!cat) {
      cat = await CATEGORY.create({
        ...c,
        createdBy: admin._id,
        stateId: CONST.ACTIVE,
      });
      console.log(`Category: ${c.name}`);
    }
    categories.push(cat);
  }

  // --- Ana: FAQ (upsert so re-seed refreshes copy) ---
  const faqs = [
    {
      question: "What is Private Markets?",
      answer:
        "<p>Private Markets is a Portugal-focused marketplace that connects property buyers, investors, and licensed real estate agents. Browse listings, save searches, purchase market data packs, and manage your deals in one place.</p>",
    },
    {
      question: "How do I create an account?",
      answer:
        "<p>Click <strong>Login</strong> in the header, then choose <strong>Register</strong>. You can sign up as a buyer or as a real estate agent. Verify your email with the OTP we send, then complete your profile.</p>",
    },
    {
      question: "How do I list a property as an agent?",
      answer:
        "<p>Log in with an agent account, open <strong>My Property</strong>, and click <strong>Add Property</strong>. Upload photos and documents, fill in location and details, then submit for publishing.</p>",
    },
    {
      question: "How do payments work?",
      answer:
        "<p>Buyers can purchase data packs or full property files from the cart using card payment. After a successful payment you can download your files from <strong>My Files</strong> or the order confirmation screen.</p>",
    },
    {
      question: "Which areas do you cover?",
      answer:
        "<p>We cover mainland Portugal and the islands, including districts such as Lisboa, Porto, Aveiro, Faro, Setúbal, Braga, Coimbra, and more. Use filters or Save Search to follow the areas you care about.</p>",
    },
    {
      question: "What is Save Search?",
      answer:
        "<p>Save Search stores your current filters (location, price, type, etc.) so you can reopen them later and stay notified when matching listings appear.</p>",
    },
    {
      question: "How do I contact support?",
      answer:
        "<p>Use the <strong>Contact Us</strong> form, email <a href=\"mailto:info@privatemarkets.pt\">info@privatemarkets.pt</a>, or call us during business hours. We typically reply within one business day.</p>",
    },
    {
      question: "Can I download property data as Excel or CSV?",
      answer:
        "<p>Yes. After purchasing a data pack or listing file, downloads are available from your account. Supported formats include Excel (.xlsx) and CSV depending on the product.</p>",
    },
  ];
  for (const f of faqs) {
    await FAQ_MODEL.findOneAndUpdate(
      { question: f.question },
      {
        $set: {
          question: f.question,
          answer: f.answer,
          createdBy: admin._id,
          stateId: CONST.ACTIVE,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`FAQ: ${f.question.slice(0, 40)}...`);
  }

  // --- Ana: CMS pages (upsert) ---
  const cmsPages = [
    {
      title: "About Private Markets",
      description: `
        <p><strong>Private Markets</strong> is a modern real estate platform built for Portugal — helping buyers, investors, and licensed agents discover opportunities with clarity and trust.</p>
        <h3>What we do</h3>
        <p>We bring together verified listings, market data packs, and account tools so you can research, shortlist, and purchase property information without friction.</p>
        <ul>
          <li>Browse flats, houses, and business opportunities across Portuguese districts</li>
          <li>Save searches and get notified about matching inventory</li>
          <li>Agents publish and manage listings with documents and media</li>
          <li>Buyers purchase and download structured data files securely</li>
        </ul>
        <h3>Our promise</h3>
        <p>Clear pricing, practical tools, and a focused experience for the Portuguese private property market — whether you are searching for your next home or sourcing investor-ready leads.</p>
        <p>Based in Almada, Portugal. Questions? Reach us via <a href="/contact-us">Contact Us</a>.</p>
      `.trim(),
      typeId: CONST.ABOUT,
    },
    {
      title: "Terms & Conditions",
      description: `
        <p><em>Last updated: October 2026</em></p>
        <p>Welcome to Private Markets. By accessing or using our website and services, you agree to these Terms &amp; Conditions. If you do not agree, please do not use the platform.</p>
        <h3>1. Who we are</h3>
        <p>Private Markets operates an online marketplace for property listings, related documents, and market data products in Portugal.</p>
        <h3>2. Accounts</h3>
        <p>You must provide accurate registration details and keep your login credentials confidential. You are responsible for activity under your account. We may suspend accounts that misuse the service or violate these terms.</p>
        <h3>3. Listings and content</h3>
        <p>Agents are responsible for the accuracy of listing details, photos, and documents they upload. Private Markets may review, refuse, or remove content that is misleading, unlawful, or incomplete.</p>
        <h3>4. Purchases and downloads</h3>
        <p>Paid products (such as data packs or property files) are delivered digitally after successful payment. Fees are shown before checkout. Unless required by law, digital purchases are non-refundable once the download has been made available.</p>
        <h3>5. Acceptable use</h3>
        <p>You may not scrape, reverse engineer, or resell platform data without permission; attempt unauthorized access; or use the service for fraudulent or illegal activity.</p>
        <h3>6. Limitation of liability</h3>
        <p>Listings and data packs are provided for informational purposes. We do not guarantee that any property will meet your expectations or that third-party information is error-free. To the fullest extent permitted by law, Private Markets is not liable for indirect or consequential losses arising from use of the service.</p>
        <h3>7. Changes</h3>
        <p>We may update these terms from time to time. Continued use of the platform after changes means you accept the revised terms.</p>
        <h3>8. Contact</h3>
        <p>Questions about these terms: <a href="mailto:info@privatemarkets.pt">info@privatemarkets.pt</a>.</p>
      `.trim(),
      typeId: CONST.TERMS,
    },
    {
      title: "Privacy Policy",
      description: `
        <p><em>Last updated: October 2026</em></p>
        <p>This Privacy Policy explains how Private Markets collects, uses, and protects your personal data when you use our website and services.</p>
        <h3>1. Data we collect</h3>
        <ul>
          <li>Account details (name, email, role, profile image)</li>
          <li>Property and search preferences you save</li>
          <li>Order and payment-related records (processed via our payment provider)</li>
          <li>Messages you send through Contact Us</li>
          <li>Technical logs needed for security and service reliability</li>
        </ul>
        <h3>2. How we use data</h3>
        <p>We use your data to create and manage accounts, show relevant listings, process purchases and downloads, respond to support requests, and improve the product.</p>
        <h3>3. Legal basis</h3>
        <p>Depending on the activity, we rely on contract performance, legitimate interests (security and product improvement), and consent where required (for example certain cookies).</p>
        <h3>4. Sharing</h3>
        <p>We do not sell your personal data. We may share data with payment processors, hosting providers, and other service partners strictly as needed to operate the platform, or when required by law.</p>
        <h3>5. Retention</h3>
        <p>We keep account and transaction data for as long as your account is active and as required for legal, accounting, or dispute purposes.</p>
        <h3>6. Your rights</h3>
        <p>Subject to applicable law (including GDPR), you may request access, correction, deletion, or restriction of your personal data, and you may object to certain processing. Contact us at <a href="mailto:info@privatemarkets.pt">info@privatemarkets.pt</a>.</p>
        <h3>7. Security</h3>
        <p>We apply reasonable technical and organizational measures to protect your data. No online service can guarantee absolute security.</p>
      `.trim(),
      typeId: CONST.PRIVACY,
    },
    {
      title: "Cookie Policy",
      description: `
        <p><em>Last updated: October 2026</em></p>
        <p>Private Markets uses cookies and similar technologies to keep you signed in, remember preferences, and understand how the site is used.</p>
        <h3>What are cookies?</h3>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site work correctly and can remember choices you make.</p>
        <h3>Cookies we use</h3>
        <ul>
          <li><strong>Essential</strong> — authentication, security, and core navigation. These are required for the service to function.</li>
          <li><strong>Preferences</strong> — language and UI choices so we can remember your settings.</li>
          <li><strong>Analytics</strong> — aggregated usage insights that help us improve pages and flows (where enabled).</li>
        </ul>
        <h3>Managing cookies</h3>
        <p>You can control cookies through your browser settings. Blocking essential cookies may prevent login or checkout from working correctly.</p>
        <h3>Updates</h3>
        <p>We may update this Cookie Policy when our practices change. The date above shows the latest revision.</p>
        <p>For privacy questions, see our <a href="/privacy-policy">Privacy Policy</a> or email <a href="mailto:info@privatemarkets.pt">info@privatemarkets.pt</a>.</p>
      `.trim(),
      typeId: CONST.COOKIES_POLICY,
    },
  ];
  for (const page of cmsPages) {
    await PAGE_MODEL.findOneAndUpdate(
      { typeId: page.typeId },
      {
        $set: {
          title: page.title,
          description: page.description,
          createdBy: admin._id,
          stateId: CONST.ACTIVE,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`CMS: ${page.title}`);
  }

  // --- Ana: products (data packs for "Download full list") ---
  // Soft-delete leftover test junk from earlier manual uploads
  const junkNames = ["Test", "Bad File Type Pack", "Demo Listing Pack"];
  for (const name of junkNames) {
    const junk = await PRODUCT.findOne({ productName: name });
    if (junk && junk.stateId !== CONST.DELETED) {
      junk.stateId = CONST.DELETED;
      await junk.save();
      console.log(`Product soft-deleted: ${name}`);
    }
  }

  const productCoverFiles = {
    lisboa: path.join(__dirname, "../../client/public/csv.png"),
    porto: path.join(__dirname, "../../client/public/xlsl.png"),
    national: path.join(
      __dirname,
      "../../client/public/national-market-pack.png"
    ),
  };
  const productDataFile = [
    path.join(__dirname, "../../client/public/sample-product-data.xlsx"),
    path.join(__dirname, "../../client/public/sample-product-data.csv"),
  ].find((f) => fs.existsSync(f));

  const productSpecs = [
    {
      productName: "Lisboa Leads Pack",
      price: 29,
      cover: productCoverFiles.lisboa,
    },
    {
      productName: "Porto Investor CSV",
      price: 39,
      cover: productCoverFiles.porto,
    },
    {
      productName: "National Market Snapshot",
      price: 49,
      cover: productCoverFiles.national,
    },
  ];
  const products = [];
  for (const spec of productSpecs) {
    let prod = await PRODUCT.findOne({ productName: spec.productName });
    if (!prod) {
      prod = await PRODUCT.create({
        productName: spec.productName,
        price: spec.price,
        createdBy: admin._id,
        productImg: [],
        stateId: CONST.ACTIVE,
      });
      console.log(`Product: ${spec.productName}`);
    }
    // Always refresh demo cover + CSV file so the shop looks Loom-ready
    if (spec.cover && fs.existsSync(spec.cover)) {
      const imgId = await uploadToGridFs(
        spec.cover,
        `product-${spec.productName.replace(/\s+/g, "-").toLowerCase()}${path.extname(spec.cover)}`
      );
      prod.productImg = [imgId];
    }
    if (productDataFile) {
      const ext = path.extname(productDataFile).toLowerCase() || ".xlsx";
      prod.productFile = await uploadToGridFs(
        productDataFile,
        `product-${spec.productName.replace(/\s+/g, "-").toLowerCase()}${ext}`
      );
    }
    prod.price = spec.price;
    prod.createdBy = admin._id;
    prod.stateId = CONST.ACTIVE;
    await prod.save();
    console.log(`Product images: ${spec.productName}`);
    products.push(prod);
  }

  // --- Sofia: favourites (first 3 properties) ---
  for (const prop of propertyDocs.slice(0, 3)) {
    const exists = await FAVOURITE.findOne({
      propertyId: prop._id,
      createdBy: buyer._id,
    });
    if (exists) continue;
    await FAVOURITE.create({
      propertyId: prop._id,
      createdBy: buyer._id,
      isFavourite: CONST.TRUE,
    });
    console.log(`Favourite: ${prop.reference}`);
  }

  // --- Sofia: cart (1 property CSV + 1 product) ---
  const cartItems = [
    {
      propertyId: propertyDocs[0]._id,
      price: 15,
      typeId: CONST.CSV,
      link: propertyDocs[0].reference,
    },
    {
      productId: products[0]._id,
      productPrice: products[0].price,
      price: products[0].price,
      typeId: CONST.PRODUCT,
    },
  ];
  for (const item of cartItems) {
    const query = item.productId
      ? { createdBy: buyer._id, productId: item.productId }
      : { createdBy: buyer._id, propertyId: item.propertyId, typeId: item.typeId };
    if (await CART.findOne(query)) continue;
    await CART.create({
      ...item,
      createdBy: buyer._id,
      state: CONST.ACTIVE,
    });
    console.log(`Cart item for Sofia`);
  }

  // --- Saved searches for Sofia (buyer) AND Miguel (agent) ---
  const searchesByUser = [
    {
      user: buyer,
      items: [
        {
          search: "Lisboa 2 bed under 500k",
          minPrice: 200000,
          maxPrice: 500000,
          propertyType: "FLAT / APARTMENT",
          rooms: ["2"],
          typeId: CONST.ENABLE,
        },
        {
          search: "Algarve villa",
          minPrice: 400000,
          maxPrice: 900000,
          propertyType: "DUPLEX",
          typeId: CONST.ENABLE,
        },
      ],
    },
    {
      user: agent,
      items: [
        {
          search: "Miguel — Cascais luxury",
          minPrice: 500000,
          maxPrice: 1200000,
          propertyType: "PENTHOUSE",
          rooms: ["3"],
          typeId: CONST.ENABLE,
        },
        {
          search: "Miguel — Porto investment",
          minPrice: 150000,
          maxPrice: 400000,
          propertyType: "FLAT / APARTMENT",
          rooms: ["1", "2"],
          typeId: CONST.DISABLE,
        },
      ],
    },
  ];
  for (const block of searchesByUser) {
    for (const s of block.items) {
      if (
        await SEARCH.findOne({ search: s.search, createdBy: block.user._id })
      )
        continue;
      await SEARCH.create({
        ...s,
        createdBy: block.user._id,
        state: CONST.ACTIVE,
      });
      console.log(`Saved search (${block.user.email}): ${s.search}`);
    }
  }

  // --- Sofia: notifications ---
  const notes = [
    {
      title: "New match in Lisboa",
      description: "A 2-bed listing matches your saved search.",
    },
    {
      title: "Cart reminder",
      description: "You have items waiting in your cart.",
    },
  ];
  for (const n of notes) {
    if (
      await Notification.findOne({
        title: n.title,
        to: buyer._id,
      })
    )
      continue;
    await Notification.create({
      ...n,
      from: admin._id,
      to: buyer._id,
      isSeen: false,
      stateId: CONST.NOTIFICATION_STATE.STATE_ID.ACTIVE,
    });
    console.log(`Notification: ${n.title}`);
  }

  // --- Orders + payments (Sofia + Miguel "My Files", Ana sees in admin) ---
  const ordersSpec = [
    {
      orderId: 1001,
      createdBy: buyer._id,
      propertyId: [propertyDocs[0]._id],
      productId: [products[0]._id],
      orderTotal: 44,
      total: 44,
      paymentStatus: CONST.SUCCESS,
    },
    {
      orderId: 1002,
      createdBy: buyer._id,
      productId: [products[1]._id],
      orderTotal: 39,
      total: 39,
      paymentStatus: CONST.PENDING,
    },
    {
      orderId: 2001,
      createdBy: agent._id,
      propertyId: [propertyDocs[1]._id],
      productId: [products[0]._id],
      orderTotal: 54,
      total: 54,
      paymentStatus: CONST.SUCCESS,
    },
    {
      orderId: 2002,
      createdBy: agent._id,
      productId: [products[2]._id],
      orderTotal: 49,
      total: 49,
      paymentStatus: CONST.SUCCESS,
    },
  ];
  for (const o of ordersSpec) {
    if (await ORDER.findOne({ orderId: o.orderId })) continue;
    await ORDER.create({
      ...o,
      stateId: CONST.ACTIVE,
    });
    console.log(`Order #${o.orderId} created`);
  }

  if (!(await Payment.findOne({ paymentIntentId: "pi_demo_loom_001" }))) {
    await Payment.create({
      paymentIntentId: "pi_demo_loom_001",
      chargeId: "ch_demo_loom_001",
      customerId: "cus_sofia_demo",
      amount: 4400,
      currency: "eur",
      paymentMethodId: "pm_card_visa",
      paidBy: buyer._id,
      paidTo: admin._id,
      propertyId: [propertyDocs[0]._id],
      productId: [products[0]._id],
      status: "succeeded",
    });
    console.log("Payment pi_demo_loom_001 created");
  }

  // --- Contact messages for Ana ---
  if (!(await CONTACTUS.findOne({ email: "visitor@example.com" }))) {
    await CONTACTUS.create({
      fullName: "João Visitor",
      firstName: "João",
      lastName: "Visitor",
      email: "visitor@example.com",
      phoneNumber: 910000111,
      countryCode: "+351",
      message: "I am interested in Lisboa listings under €400k.",
      stateId: CONST.NEW,
      createdBy: buyer._id,
    });
    console.log("Contact message created");
  }

  const propCount = await PROPERTY.countDocuments({ createdBy: agent._id });
  const favCount = await FAVOURITE.countDocuments({ createdBy: buyer._id });
  const cartCount = await CART.countDocuments({ createdBy: buyer._id });
  const orderCount = await ORDER.countDocuments();
  const productCount = await PRODUCT.countDocuments();

  console.log("\n=== Seed summary ===");
  console.log(`Miguel properties: ${propCount}`);
  console.log(`Sofia favourites:  ${favCount}`);
  console.log(`Sofia cart items:  ${cartCount}`);
  console.log(`Orders (admin):    ${orderCount}`);
  console.log(`Products (admin):  ${productCount}`);
  console.log("\n=== Demo credentials ===");
  console.log("Admin (Ana):    ana@privatemarket.local / Ana@123456  → /admin/dashboard");
  console.log("Agent (Miguel): miguel@privatemarket.local / Miguel@123 → /customer/property-list");
  console.log("Buyer (Sofia):  sofia@privatemarket.local / Sofia@123  → /customer/home");
  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
