import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

/**
 * Cron-задача: физическое удаление todos, помеченных deletedAt старше 15 дней.
 *
 * Защита: Vercel при вызове cron-задачи кладёт CRON_SECRET в заголовок
 * `Authorization: Bearer <CRON_SECRET>`. Без него — 401.
 * Это machine-to-machine вызов, сессия пользователя не требуется.
 *
 * Расписание задаётся в vercel.json (schedule: "0 3 * * *" — каждый день в 03:00 UTC).
 *
 * Локальный тест (в next dev cron НЕ запускается автоматически):
 *   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/gc-todos
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  const result = await prisma.todo.deleteMany({
    where: { deletedAt: { lte: cutoff } },
  });

  return NextResponse.json({ deleted: result.count, cutoff });
}
