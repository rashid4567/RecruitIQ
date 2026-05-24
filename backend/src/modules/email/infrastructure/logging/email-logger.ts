import fs from "fs";
import path from "path";
const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "email.log");
const ensureDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, {
      recursive: true,
    });
  }
};

export const logEmail = async (data: {
  type: "TEST" | "REAL";
  to: string;
  subject: string;
  status: "SENT" | "FAILED";
  error?: string;
}) => {
  ensureDir();
  const entry = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  await fs.promises.appendFile(LOG_FILE, JSON.stringify(entry) + "\n");
};
