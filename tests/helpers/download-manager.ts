import * as fs from 'fs';
import * as path from 'path';

/**
 * Create downloads directory for test artifacts
 */
export function createDownloadsDir(browserName: string): string {
  const downloadsDir = path.join('test-downloads', browserName);
  
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  
  return downloadsDir;
}

/**
 * Save downloaded file to test artifacts directory
 */
export async function saveDownloadedFile(
  downloadPath: string, 
  cardType: string, 
  browserName: string
): Promise<string> {
  const downloadsDir = createDownloadsDir(browserName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${cardType}_${timestamp}.zip`;
  const savedPath = path.join(downloadsDir, fileName);
  
  // Copy file to our test downloads directory
  fs.copyFileSync(downloadPath, savedPath);
  
  console.log(`💾 Saved to: ${savedPath}`);
  return savedPath;
}

/**
 * Clean old test downloads (keep only last 5 per card type)
 */
export function cleanOldDownloads(browserName: string): void {
  const downloadsDir = path.join('test-downloads', browserName);
  
  if (!fs.existsSync(downloadsDir)) {
    return;
  }
  
  const files = fs.readdirSync(downloadsDir);
  const cardTypes = ['character', 'lorebook', 'preset'];
  
  cardTypes.forEach(cardType => {
    const cardFiles = files
      .filter(f => f.startsWith(cardType))
      .map(f => ({
        name: f,
        path: path.join(downloadsDir, f),
        stats: fs.statSync(path.join(downloadsDir, f))
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
    
    // Keep only last 5 files per card type
    if (cardFiles.length > 5) {
      cardFiles.slice(5).forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`🗑️ Cleaned old download: ${file.name}`);
      });
    }
  });
}