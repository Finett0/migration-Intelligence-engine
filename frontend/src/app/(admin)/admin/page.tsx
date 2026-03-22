import { verifySession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  const totalLeads = await prisma.lead.count();
  const totalEvents = await prisma.event.count();
  const eventCounts = await prisma.event.groupBy({
    by: ["type"],
    _count: true,
  });
  const recentLeads = await prisma.lead.findMany({
    orderBy: { score: "desc" },
    take: 10,
    include: { events: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const recentEvents = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { lead: { select: { url: true, email: true } } },
  });

  const counts: Record<string, number> = {};
  for (const e of eventCounts) {
    counts[e.type] = e._count;
  }

  const kpis = [
    { label: "Total Leads", value: totalLeads, color: "bg-blue-500" },
    { label: "Análises", value: counts.analysis ?? 0, color: "bg-indigo-500" },
    { label: "PDFs Baixados", value: counts.pdf_download ?? 0, color: "bg-purple-500" },
    { label: "Emails Enviados", value: counts.email_sent ?? 0, color: "bg-green-500" },
    { label: "Emails Abertos", value: counts.email_open ?? 0, color: "bg-orange-500" },
    { label: "Total Eventos", value: totalEvents, color: "bg-gray-500" },
  ];

  // Funnel data
  const funnel = [
    { label: "Análises", count: counts.analysis ?? 0 },
    { label: "PDFs", count: counts.pdf_download ?? 0 },
    { label: "Emails", count: counts.email_sent ?? 0 },
    { label: "Aberturas", count: counts.email_open ?? 0 },
  ];
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

  const eventTypeLabels: Record<string, string> = {
    analysis: "Análise",
    pdf_download: "PDF Download",
    email_sent: "Email Enviado",
    email_open: "Email Aberto",
  };

  const eventTypeColors: Record<string, string> = {
    analysis: "bg-indigo-100 text-indigo-700",
    pdf_download: "bg-purple-100 text-purple-700",
    email_sent: "bg-green-100 text-green-700",
    email_open: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Migration Intelligence Engine</p>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/leads"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              Leads
            </Link>
            <form
              action={async () => {
                "use server";
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                cookieStore.delete("admin_session");
                redirect("/admin/login");
              }}
            >
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* KPIs */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
              <div className={`mt-2 h-1 w-8 rounded ${kpi.color}`} />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Funnel */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Funil de Conversão
            </h2>
            <div className="flex flex-col gap-3">
              {funnel.map((step) => (
                <div key={step.label}>
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>{step.label}</span>
                    <span className="font-semibold text-gray-900">
                      {step.count}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${Math.max((step.count / maxFunnel) * 100, 2)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Leads */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Top Leads por Score
              </h2>
              <Link
                href="/admin/leads"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {lead.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lead.email || "Sem email"} &middot;{" "}
                      {lead.platform || "—"}
                    </p>
                  </div>
                  <span className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {lead.score}
                  </span>
                </Link>
              ))}
              {recentLeads.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400">
                  Nenhum lead ainda.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Atividade Recente
          </h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 py-2.5"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    eventTypeColors[event.type] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {eventTypeLabels[event.type] ?? event.type}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                  {event.lead.url}
                  {event.lead.email ? ` — ${event.lead.email}` : ""}
                </span>
                <span className="whitespace-nowrap text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhuma atividade ainda.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
