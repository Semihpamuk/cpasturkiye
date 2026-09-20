import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";

// data/ klasörünün tamamını (json'lar + receipts/ + logos/) tek bir .tar.gz
// olarak üretir. Harici paket yerine sistemdeki `tar` kullanılır: node:alpine
// imajında busybox tar, Windows 10+'da bsdtar hazır gelir.

const DATA_DIR = path.join(process.cwd(), "data");

// data/ tipik olarak birkaç MB; bellekte tutmak sorun değil. Yine de kaçak bir
// büyümeye karşı (ör. yüzlerce dekont) makul bir üst sınır koyuyoruz.
const MAX_ARCHIVE_BYTES = 200 * 1024 * 1024;

export class BackupError extends Error {}

export function backupFileName(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `cpasturkiye-yedek-${stamp}.tar.gz`;
}

export async function createBackupArchive(): Promise<Buffer> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    throw new BackupError("data/ klasörü bulunamadı — henüz kayıt oluşmamış olabilir.");
  }

  return new Promise<Buffer>((resolve, reject) => {
    execFile(
      "tar",
      ["-czf", "-", "-C", DATA_DIR, "."],
      { encoding: "buffer", maxBuffer: MAX_ARCHIVE_BYTES },
      (error, stdout, stderr) => {
        if (error) {
          const detail = Buffer.isBuffer(stderr) ? stderr.toString("utf-8").trim() : "";
          reject(new BackupError(`tar başarısız: ${detail || error.message}`));
          return;
        }
        resolve(stdout);
      }
    );
  });
}
