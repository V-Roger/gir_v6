# Photo Import Script

This script allows you to import photos into your Svelte app's gallery system. It will:

1. Process and optimize image files with lossless compression
2. Save optimized images to the `static/photos/` directory
3. Create a new gallery in the database
4. Store photo metadata in the database
5. Associate photos with the gallery

## Prerequisites

1. **Database URL**: Set either `DATABASE_URL` or `NETLIFY_DATABASE_URL` environment variable

2. **Dependencies**: Install with `pnpm install`

## Usage

### Using npm script (recommended)

```bash
pnpm gallery:import --name "Gallery Name" --description "Gallery Description" --paths "./photos/*.jpg"
```

### Direct execution

```bash
node scripts/import-photos.js --name "Gallery Name" --description "Gallery Description" --paths "./photos/*.jpg"
```

## Examples

### Import all JPG files from a directory

```bash
pnpm gallery:import --name "Summer 2024" --description "Photos from summer vacation" --paths "./photos/*.jpg"
```

### Import multiple specific files

```bash
pnpm gallery:import --name "Portraits" --description "Professional portraits" --paths "./portraits/photo1.jpg" "./portraits/photo2.jpg"
```

### Import multiple file types

```bash
pnpm gallery:import --name "Wedding" --description "Wedding photos" --paths "./wedding/*.{jpg,png}"
```

### Import from multiple directories

```bash
pnpm gallery:import --name "Mixed Collection" --description "Various photos" --paths "./photos/*.jpg" "./screenshots/*.png"
```

### Custom quality and compression

```bash
pnpm gallery:import --name "High Quality" --description "High quality photos" --paths "./photos/*.jpg" --quality 95 --compression 6
```

### Dry run (preview without importing)

```bash
pnpm gallery:import --name "Test Gallery" --description "Test import" --paths "./photos/*.jpg" --dry-run
```

### Skip optimization

```bash
pnpm gallery:import --name "Original Files" --description "Keep original quality" --paths "./photos/*.jpg" --no-optimize
```

## Supported Formats

- JPG/JPEG
- PNG
- GIF
- WebP

## Features

- **Named CLI arguments**: Clear, self-documenting command-line interface
- **Gallery subfolder organization**: Photos are organized in subfolders by gallery name
- **Original filename preservation**: Keeps original filenames without renaming
- **Image optimization**: Lossless compression and format-specific optimization
- **Image dimension extraction**: Extracts width, height, and aspect ratio
- **Glob pattern support**: Use wildcards to select multiple files
- **Error handling**: Gracefully handles missing files and unsupported formats
- **Progress tracking**: Shows progress for each image being processed
- **Dry run mode**: Preview what would be imported without actually importing
- **Customizable quality**: Adjust JPEG quality and PNG compression levels
- **Optimization toggle**: Option to skip image optimization

## Output

The script will:

1. Create a new gallery entry in the database
2. Process and optimize all images with lossless compression
3. Save optimized images to `static/photos/[gallery-name]/` with original filenames
4. Create photo entries in the database with relative paths
5. Associate all photos with the gallery

## File Organization

Photos are organized in subfolders based on the gallery name:

```
static/photos/
├── summer-2024/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.png
├── portraits/
│   ├── portrait1.jpg
│   └── portrait2.jpg
└── wedding/
    ├── ceremony.jpg
    └── reception.jpg
```

Gallery folder names are automatically generated from the gallery name:

- Converted to lowercase
- Special characters replaced with hyphens
- Multiple hyphens collapsed to single
- Leading/trailing hyphens removed

## Image Optimization

The script optimizes images based on their format:

- **JPEG**: 90% quality, progressive encoding, MozJPEG optimization
- **PNG**: Maximum compression (level 9), progressive encoding
- **WebP**: 90% quality with lossless option enabled
- **GIF**: Copied as-is (no optimization available)
- **Other formats**: Copied as-is

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NETLIFY_DATABASE_URL`: Alternative database URL (used if `DATABASE_URL` is not set)

## Troubleshooting

### "No DATABASE_URL nor NETLIFY_DATABASE_URL set"

Set your database URL environment variable:

```bash
export DATABASE_URL="postgresql://user:password@host:port/database"
```

### "Could not get image info..."

This usually means the file is corrupted, inaccessible, or not a valid image format.

### "No files found matching the provided patterns"

Check that your file paths are correct and the files exist. Use absolute paths if needed.

### "Unsupported file type"

Only the supported formats listed above are accepted. Convert your images to a supported format first.
