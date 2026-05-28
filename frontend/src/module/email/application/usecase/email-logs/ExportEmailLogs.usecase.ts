import type { EmailLog } from "@/types/admin/email-log.types";


export class ExportEmailLogsUseCase {
  execute(logs: EmailLog[]) {
    const csv =
      "Type,To,Subject,Status,Time,Error\n" +
      logs
        .map(
          (l) =>
            `${l.type},${l.to},${l.subject},${l.status},${l.timeStamp},${l.error ?? ""}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `email-logs-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }
}
