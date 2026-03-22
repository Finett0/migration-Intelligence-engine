import { verifySession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

const PAGE_SIZE = 20;

export default async function LeadsPage({ searchParams }: Props) {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() || "";

  const where = q
    ? {
        OR: [
          { url: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { score: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      _count: { select: { events: true } },
      events: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  const total = await prisma.lead.count({ where });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function scoreColor(score: number) {
    if (score >= 9) return "bg-green-100 text-green-700";
    if (score >= 4) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-500">{total} leads encontrados</p>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/leads"
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900"
            >
              Leads
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Search */}
        <form className="mb-6">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por URL ou email..."
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </form>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plataforma</th>
                <th className="px-4 py-3">Eventos</th>
                <th className="px-4 py-3">Última Atividade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${scoreColor(lead.score)}`}
                    >
                      {lead.score}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {lead.url}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lead.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {lead.platform || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lead._count.events}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {lead.events[0]
                      ? new Date(lead.events[0].createdAt).toLocaleString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    Nenhum lead encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/leads?page=${p}${q ? `&q=${q}` : ""}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
