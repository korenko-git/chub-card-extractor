import * as fs from 'fs';
import * as crypto from 'crypto';

/**
 * Calculate MD5 hash of a file
 */
export function getFileHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * Get file size in KB
 */
export function getFileSizeKB(filePath: string): number {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}