import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { BackupError, backupFileName, createBackupArchive } from "@/lib/backup";

// data/ klasörünün tamamını .tar.gz olarak indirir — yalnızca admin oturumuyla.
// Sunucudan bağımsız, elle alınan "sigorta" yedeği; otomatik günlük yedek için
// bkz. scripts/backup.sh.
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const archive = await createBackupArchive();
    return new NextResponse(new Uint8Array(archive), {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${backupFileName()}"`,
        "Content-Length": String(archive.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    const message = err instanceof BackupError ? err.message : "Yedek oluşturulamadı";
    console.error("[backup]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
