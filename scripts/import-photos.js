#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import sharp from 'sharp';
import { Command } from 'commander';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file if it exists
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Get database URL from environment
const dbUrl = process.env.NETLIFY_DATABASE_URL ?? process.env.DATABASE_URL;

let db = null;
let client = null;

if (dbUrl) {
  client = neon(dbUrl);
  db = drizzle(client, { schema });
} else {
  console.warn('⚠️  No DATABASE_URL nor NETLIFY_DATABASE_URL set - database operations will be skipped');
}

// Supported image extensions
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Function to slugify a string
function slugify(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// Function to get image dimensions and metadata
async function getImageInfo(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const { width, height, format } = metadata;
    const aspectRatio = width && height ? (width / height).toFixed(2) : null;
    
    return {
      width,
      height,
      format,
      aspectRatio,
      orientation: metadata.orientation || 1
    };
  } catch {
    return {
      width: null,
      height: null,
      format: null,
      aspectRatio: null,
      orientation: 1
    };
  }
}

// Function to process and save image with lossless compression
async function processAndSaveImage(sourcePath, galleryFolder, filename, quality = 90, compression = 9, optimize = true) {
  const photosDir = path.join(__dirname, '..', 'static', 'photos');
  const galleryDir = path.join(photosDir, galleryFolder);
  const destPath = path.join(galleryDir, filename);
  
  // Ensure photos directory and gallery subfolder exist
  await fs.mkdir(galleryDir, { recursive: true });
  
  // Get file extension to determine format
  const ext = path.extname(sourcePath).toLowerCase();
  
  try {
    // If optimization is disabled, just copy the file
    if (!optimize) {
      await fs.copyFile(sourcePath, destPath);
      return `photos/${filename}`;
    }
    
    // Process image with Sharp based on format
    let processedImage;
    
    if (ext === '.jpg' || ext === '.jpeg') {
      processedImage = sharp(sourcePath)
        .jpeg({ 
          quality: quality,
          progressive: true,
          mozjpeg: true
        });
    } else if (ext === '.png') {
      processedImage = sharp(sourcePath)
        .png({ 
          compressionLevel: compression,
          progressive: true
        });
    } else if (ext === '.webp') {
      processedImage = sharp(sourcePath)
        .webp({ 
          quality: quality,
          lossless: true
        });
    } else if (ext === '.gif') {
      // For GIF, we'll just copy it as-is since Sharp doesn't support GIF optimization
      await fs.copyFile(sourcePath, destPath);
      return `photos/${filename}`;
    } else {
      // For other formats, copy as-is
      await fs.copyFile(sourcePath, destPath);
      return `photos/${filename}`;
    }
    
    // Save processed image
    await processedImage.toFile(destPath);
    
    return destPath;
  } catch (error) {
    console.warn(`⚠️  Could not process ${sourcePath}, copying original: ${error.message}`);
    // Fallback to copying original file
    await fs.copyFile(sourcePath, destPath);
    return destPath;
  }
}

// Function to generate gallery subfolder and filename
function generateGalleryPath(galleryName, originalPath) {
  const ext = path.extname(originalPath).toLowerCase();
  const baseName = path.basename(originalPath, ext);
  
  // Preserve original filename casing but make it URL-safe
  // Replace spaces and special characters with hyphens, but keep original case
  const safeFilename = baseName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const filename = `${safeFilename}${ext}`;
  
  // Create a safe folder name from gallery name (still lowercase for consistency)
  const safeGalleryName = slugify(galleryName);

  return {
    folderName: safeGalleryName,
    filename: filename,
    fullPath: `${safeGalleryName}/${filename}`
  };
}

// Function to expand glob patterns
async function expandGlobPatterns(patterns) {
  const expandedPaths = [];
  
  for (const pattern of patterns) {
    try {
      const matches = await glob(pattern, { 
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**']
      });
      expandedPaths.push(...matches);
    } catch {
      console.warn(`⚠️  Could not expand pattern "${pattern}"`);
    }
  }
  
  return expandedPaths;
}

// Main import function
async function importPhotos(galleryName, galleryDescription, imagePaths, quality = 90, compression = 9, optimize = true) {
  try {
    console.log(`\n🚀 Starting photo import for gallery: "${galleryName}"`);
    console.log(`📝 Description: ${galleryDescription}`);
    console.log(`📸 Found ${imagePaths.length} images to import\n`);
    
    // Validate image files
    const validImages = [];
    for (const imagePath of imagePaths) {
      const ext = path.extname(imagePath).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        console.warn(`⚠️  Skipping ${imagePath}: Unsupported file type`);
        continue;
      }
      
      try {
        await fs.access(imagePath);
        validImages.push(imagePath);
      } catch {
        console.warn(`⚠️  Skipping ${imagePath}: File not found`);
      }
    }
    
    if (validImages.length === 0) {
      console.error('❌ No valid images found to import');
      process.exit(1);
    }
    
    console.log(`✅ Validated ${validImages.length} images\n`);
    
    // Create gallery in database
    let gallery = null;
    if (db) {
      console.log('📊 Creating gallery in database...');
      const [galleryResult] = await db.insert(schema.galleries).values({
        slug: slugify(galleryName),
        name: galleryName,
        description: galleryDescription,
        photos: []
      }).returning();
      gallery = galleryResult;
      console.log(`✅ Created gallery with ID: ${gallery.id}\n`);
    } else {
      console.log('📊 Skipping database operations (no database connection)\n');
    }
    
    // Process each image
    const photoIds = [];
    
    for (let i = 0; i < validImages.length; i++) {
      const imagePath = validImages[i];
      const { folderName, filename } = generateGalleryPath(galleryName, imagePath);
      
      console.log(`📸 Processing ${i + 1}/${validImages.length}: ${path.basename(imagePath)}`);
      
      // Process and save image with optimization
      const relativePath = await processAndSaveImage(imagePath, folderName, filename, quality, compression, optimize);
      console.log(`  ✅ Processed and saved to: ${relativePath}`);
      
      // Get image info
      const imageInfo = await getImageInfo(imagePath);
      console.log(`  📊 Image info: ${imageInfo.width}x${imageInfo.height} (${imageInfo.aspectRatio}:1 ratio)`);
      
      // Create photo entry in database
      if (db) {
        const [photo] = await db.insert(schema.photos).values({
          path: `photos/${folderName}/${filename}`,
          description: `Imported from ${path.basename(imagePath)}`
        }).returning();
        
        photoIds.push(photo.id);
        console.log(`  💾 Created photo entry with ID: ${photo.id}\n`);
      } else {
        console.log(`  💾 Skipping database entry (no database connection)\n`);
      }
    }
    
    // Update gallery with photo IDs
    if (db && gallery) {
      console.log('🔗 Associating photos with gallery...');
      await db.update(schema.galleries)
        .set({ photos: photoIds })
        .where(eq(schema.galleries.id, gallery.id));
      
      console.log(`✅ Successfully imported ${photoIds.length} photos into gallery "${galleryName}"`);
      console.log(`🎉 Gallery ID: ${gallery.id}`);
    } else {
      console.log(`✅ Successfully processed ${photoIds.length} photos for gallery "${galleryName}"`);
    }
    console.log(`📁 Photos stored in: static/photos/`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

// CLI argument parsing with Commander
function parseArguments() {
  const program = new Command();
  
  program
    .name('import-photos')
    .description('Import photos into your Svelte app gallery system')
    .version('1.0.0')
    .requiredOption('-n, --name <name>', 'Gallery name')
    .requiredOption('-d, --description <description>', 'Gallery description')
    .requiredOption('-p, --paths <paths...>', 'Image file paths or glob patterns')
    .option('-f, --format <formats>', 'Comma-separated list of supported formats', SUPPORTED_EXTENSIONS.join(','))
    .option('-q, --quality <number>', 'JPEG quality (1-100)', '90')
    .option('-c, --compression <number>', 'PNG compression level (0-9)', '9')
    .option('--no-optimize', 'Skip image optimization')
    .option('--dry-run', 'Show what would be imported without actually importing')
    .parse();
  
  const options = program.opts();
  
  // Validate quality
  const quality = parseInt(options.quality);
  if (quality < 1 || quality > 100) {
    console.error('❌ Quality must be between 1 and 100');
    process.exit(1);
  }
  
  // Validate compression
  const compression = parseInt(options.compression);
  if (compression < 0 || compression > 9) {
    console.error('❌ Compression level must be between 0 and 9');
    process.exit(1);
  }
  
  return {
    galleryName: options.name,
    galleryDescription: options.description,
    imagePaths: options.paths,
    quality,
    compression,
    optimize: options.optimize,
    dryRun: options.dryRun
  };
}

// Main execution
async function main() {
  try {
    const options = parseArguments();
    
    // Expand glob patterns
    console.log('🔍 Expanding file patterns...');
    const expandedPaths = await expandGlobPatterns(options.imagePaths);
    
    if (expandedPaths.length === 0) {
      console.error('❌ No files found matching the provided patterns');
      process.exit(1);
    }
    
    console.log(`✅ Found ${expandedPaths.length} files to process\n`);
    
    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be imported\n');
      for (const path of expandedPaths) {
        const { folderName, filename } = generateGalleryPath(options.galleryName, path);
        console.log(`📸 Would import: ${path}`);
        console.log(`   → Would save as: ${folderName}/${filename}`);
      }
      console.log(`\n📊 Would create gallery: "${options.galleryName}"`);
      console.log(`📝 Description: "${options.galleryDescription}"`);
      console.log(`🎯 Quality: ${options.quality}, Compression: ${options.compression}`);
      console.log(`⚙️  Optimization: ${options.optimize ? 'enabled' : 'disabled'}`);
      return;
    }
    
    await importPhotos(
      options.galleryName, 
      options.galleryDescription, 
      expandedPaths,
      options.quality,
      options.compression,
      options.optimize
    );
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 