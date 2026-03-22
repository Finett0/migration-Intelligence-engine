import { verifySession } from "@/lib/admin-auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EVENT_POINTS } from "@/lib/scoring";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/admin/login");

  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) notFound();

  const eventTypeLabels: Record<string, string> = {
    analysis: "Análise",
    pdf_download: "PDF Download",
    email_sent: "Email Enviado",
    email_open: "Email Aberto",
  };

  const eventTypeColors: Record<string, string> = {
    analysis: "bg-indigo-100 text-indigo-700 border-indigo-200",
    pdf_download: "bg-purple-100 text-purple-700 border-purple-200",
    email_sent: "bg-green-100 text-green-700 border-green-200",
    email_open: "bg-orange-100 text-orange-700 border-orange-200",
  };

  function scoreColor(score: number) {
    if (score >= 9) return "bg-green-100 text-green-700";
    if (score >= 4) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              &larr; Leads
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-700">Detalhe</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/leads"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
            >
              Leads
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Lead Info */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{lead.url}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Criado em{" "}
                {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${scoreColor(lead.score)}`}
            >
              Score: {lead.score}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Telefone
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.phone || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Plataforma
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.platform || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Faturamento
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {lead.revenue || "—"}
              </p>
            </div>
          </div>

          {lead.pains.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Dores
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {lead.pains.map((pain) => (
                  <span
                    key={pain}
                    className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600"
                  >
                    {pain}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Composição do Score
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["analysis", "pdf_download", "email_sent", "email_open"] as const).map(
              (type) => {
                const count = lead.events.filter((e) => e.type === type).length;
                const points = (EVENT_POINTS[type] ?? 0) * count;
                return (
                  <div
                    key={type}
                    className="rounded-lg border border-gray-100 p-3 text-center"
                  >
                    <p className="text-xs text-gray-500">
                      {eventTypeLabels[type]}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{count}x</p>
                    <p className="text-xs text-gray-400">
                      +{points} pts
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Event Timeline */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Timeline de Eventos ({lead.events.length})
          </h2>
          <div className="relative flex flex-col gap-0">
            {lead.events.map((event, i) => (
              <div key={event.id} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full border-2 ${
                      eventTypeColors[event.type]?.split(" ")[0] ??
                      "bg-gray-100"
                    } border-white ring-2 ring-gray-200`}
                  />
                  {i < lead.events.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200" />
                  )}
                </div>

                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        eventTypeColors[event.type] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {eventTypeLabels[event.type] ?? event.type}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      +{EVENT_POINTS[event.type] ?? 0} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(event.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {lead.events.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhum evento registrado.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
