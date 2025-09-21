// Simplified download utility using WXT's cross-browser support

export interface DownloadRequest {
  action: 'downloadFile';
  data: ArrayBuffer;
  filename: string;
  mimeType?: string;
}

export async function downloadFile(blob: Blob, filename: string): Promise<void> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const response = await browser.runtime.sendMessage({
      action: 'downloadFile',
      data: arrayBuffer,
      filename: filename,
      mimeType: blob.type
    } as DownloadRequest);

    if (response?.status === 'ok') {
      return;
    }
  } catch (error) {
    console.warn('Background download failed, using fallback:', error);
  }

  // Fallback: DOM download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}