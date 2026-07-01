/**
 * Migration script: uploads local /uploads/* images to Cloudinary
 * and updates the database with the new URLs.
 *
 * Run:  node seeders/migrateImages.js
 *
 * Requires .env with MONGO_URI and Cloudinary credentials.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('../configs/cloudinary');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const GalleryImage = require('../models/Gallery');

dotenv.config();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

async function uploadToCloudinary(localPath, folder) {
  const result = await cloudinary.uploader.upload(localPath, {
    folder: `ginoong-barbero/${folder}`,
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  });
  return result.secure_url;
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  // --- Services ---
  const services = await Service.find({ image: { $regex: /^\/uploads\// } });
  console.log(`Found ${services.length} services with local image paths`);
  for (const svc of services) {
    const filename = path.basename(svc.image);
    const localPath = path.join(UPLOADS_DIR, 'services', filename);
    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP ${svc.name} — file not found: ${localPath}`);
      skipped++;
      continue;
    }
    try {
      const url = await uploadToCloudinary(localPath, 'services');
      svc.image = url;
      await svc.save();
      console.log(`  OK   ${svc.name} -> ${url}`);
      migrated++;
    } catch (err) {
      console.log(`  FAIL ${svc.name} — ${err.message}`);
      failed++;
    }
  }

  // --- Barbers ---
  const barbers = await Barber.find({ profileImage: { $regex: /^\/uploads\// } });
  console.log(`\nFound ${barbers.length} barbers with local image paths`);
  for (const barb of barbers) {
    const filename = path.basename(barb.profileImage);
    const localPath = path.join(UPLOADS_DIR, 'barbers', filename);
    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP ${barb.name} — file not found: ${localPath}`);
      skipped++;
      continue;
    }
    try {
      const url = await uploadToCloudinary(localPath, 'barbers');
      barb.profileImage = url;
      await barb.save();
      console.log(`  OK   ${barb.name} -> ${url}`);
      migrated++;
    } catch (err) {
      console.log(`  FAIL ${barb.name} — ${err.message}`);
      failed++;
    }
  }

  // --- Gallery ---
  const gallery = await GalleryImage.find({ url: { $regex: /^\/uploads\// } });
  console.log(`\nFound ${gallery.length} gallery images with local paths`);
  for (const img of gallery) {
    const filename = path.basename(img.url);
    const localPath = path.join(UPLOADS_DIR, 'gallery', filename);
    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP ${img.title} — file not found: ${localPath}`);
      skipped++;
      continue;
    }
    try {
      const url = await uploadToCloudinary(localPath, 'gallery');
      img.url = url;
      await img.save();
      console.log(`  OK   ${img.title} -> ${url}`);
      migrated++;
    } catch (err) {
      console.log(`  FAIL ${img.title} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, Failed: ${failed}`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
