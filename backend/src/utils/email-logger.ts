import fs from "fs";
import path from "path";


const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "email.log");


const ensureLogDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};


export const logEmail = (data: {
  type: "TEST" | "REAL";
  to: string;
  subject: string;
  status: "SENT" | "FAILED";
  error?: string;
}) => {
  try {
    ensureLogDir();

    const entry = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    fs.appendFileSync(
      LOG_FILE,
      JSON.stringify(entry) + "\n",
      { encoding: "utf-8" }
    );

    console.log("📧 EMAIL LOG:", entry);
  } catch (err) {
    console.error(" Failed to write email log:", err);
  }
};
