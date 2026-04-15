import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "email.log");

const MAX_DAYS = 30;
const MAX_LOGS = 1000;

const ensureLogDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};

export const logEmail = async (data: {
  type: "TEST" | "REAL";
  to: string;
  subject: string;
  status: "SENT" | "FAILED";
  error?: string;
}) => {
  try {
    ensureLogDir();

    const now = new Date();

    const entry = {
      ...data,
      timestamp: now.toISOString(),
    };

    let logs: any[] = [];

    if (fs.existsSync(LOG_FILE)) {
      const fileContent = await fs.promises.readFile(LOG_FILE, "utf-8");

      logs = fileContent
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAYS);

    logs = logs.filter((log) => {
      if (!log.timestamp) return false;

      const logDate = new Date(log.timestamp);

      if (isNaN(logDate.getTime())) return false;

      return logDate >= cutoffDate;
    });

    logs.push(entry);

    if (logs.length > MAX_LOGS) {
      logs = logs.slice(-MAX_LOGS);
    }

    await fs.promises.writeFile(
      LOG_FILE,
      logs.map((l) => JSON.stringify(l)).join("\n") + "\n",
      "utf-8",
    );

    console.log("📧 EMAIL LOG:", entry);
  } catch (err) {
    console.error("Failed to write email log:", err);
  }
};
