import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendRequestBody {
  email: string;
  phone: string;
  url: string;
  platform: string;
  annualSavings: number;
  monthlySavings: number;
  currentCost: number;
  nuvemCost: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendRequestBody = await req.json();
    const { email, phone, url, platform, annualSavings, monthlySavings, currentCost, nuvemCost } = body;

    if (!email || !phone) {
      return Response.json({ error: "Email e telefone são obrigatórios" }, { status: 400 });
    }

    const fmt = (v: number) =>
      v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    const platformNames: Record<string, string> = {
      shopify: "Shopify",
      tray: "Tray",
      woocommerce: "WooCommerce",
      "loja-integrada": "Loja Integrada",
      outra: "Outra plataforma",
    };

    const platformName = platformNames[platform] || platform;

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e,#2337ff);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">
              ROI da Migração
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
              Seu relatório personalizado de migração
            </p>
          </td>
        </tr>

        <!-- Main savings highlight -->
        <tr>
          <td style="padding:36px 40px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #22c55e;border-radius:10px;padding:24px;text-align:center;">
              <tr><td>
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#16a34a;">
                  Economia anual estimada
                </p>
                <p style="margin:0;font-size:36px;font-weight:800;color:#16a34a;">
                  R$ ${fmt(annualSavings)}
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Cost comparison -->
        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="background:#fef2f2;border-radius:8px;padding:20px;text-align:center;vertical-align:top;">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">
                    ${platformName}
                  </p>
                  <p style="margin:0;font-size:28px;font-weight:800;color:#ef4444;">
                    R$ ${fmt(currentCost)}/mês
                  </p>
                </td>
                <td width="4%" style="text-align:center;vertical-align:middle;color:#9ca3af;font-size:20px;">
                  →
                </td>
                <td width="48%" style="background:#f0fdf4;border-radius:8px;padding:20px;text-align:center;vertical-align:top;">
                  <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">
                    Nuvemshop Next
                  </p>
                  <p style="margin:0;font-size:28px;font-weight:800;color:#22c55e;">
                    R$ ${fmt(nuvemCost)}/mês
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:0 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;">
              <tr><td>
                <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1a1a2e;">
                  Detalhes da análise
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#4b5563;">
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">Loja analisada</td>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#1a1a2e;">${url}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">Plataforma atual</td>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#1a1a2e;">${platformName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">Economia mensal</td>
                    <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#16a34a;">R$ ${fmt(monthlySavings)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;">Contato</td>
                    <td style="padding:6px 0;text-align:right;font-weight:600;color:#1a1a2e;">${phone}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 32px;text-align:center;">
            <p style="margin:0 0 16px;font-size:15px;color:#4b5563;">
              Nossa equipe de especialistas em migração entrará em contato pelo WhatsApp para agendar sua demonstração gratuita.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Nuvemshop Next &bull; nuvemshop.com.br
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: "ROI da Migração <onboarding@resend.dev>",
      to: [email],
      subject: `Você pode economizar R$ ${fmt(annualSavings)}/ano migrando para Nuvemshop`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send email error:", err);
    return Response.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}
