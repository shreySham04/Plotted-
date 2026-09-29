import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export class ExtensionService {
  private static extensionDir = path.resolve(process.cwd(), 'extension');

  /**
   * Reads all files from the real extension directory
   */
  static getFiles(): Record<string, string> {
    const files: Record<string, string> = {};

    function readDirRecursive(dir: string, base: string = '') {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          readDirRecursive(fullPath, relPath);
        } else if (entry.isFile() && !entry.name.endsWith('.png')) {
          files[relPath] = fs.readFileSync(fullPath, 'utf-8');
        }
      }
    }

    readDirRecursive(this.extensionDir);
    return files;
  }

  /**
   * Generates a ready-to-unzip bundle from the actual extension directory
   */
  static async generateZipBuffer(): Promise<Buffer> {
    const zip = new JSZip();
    const files = this.getFiles();

    for (const [filename, content] of Object.entries(files)) {
      zip.file(filename, content);
    }

    // Add minimal valid 1x1 transparent PNG icon placeholder
    const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const iconFolder = zip.folder("icons");
    if (iconFolder) {
      iconFolder.file("icon16.png", base64Png, { base64: true });
      iconFolder.file("icon48.png", base64Png, { base64: true });
      iconFolder.file("icon128.png", base64Png, { base64: true });
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
  }
}
