import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const sections = [
  {
    title: "1. Informações coletadas",
    body: "Coletamos dados fornecidos por você em formulários (nome, email, telefone) e dados técnicos de navegação para funcionamento da plataforma.",
  },
  {
    title: "2. Finalidade de uso",
    body: "Utilizamos esses dados para responder contatos, organizar atendimento imobiliário, melhorar a experiência do site e cumprir obrigações legais.",
  },
  {
    title: "3. Compartilhamento",
    body: "Não vendemos seus dados. O compartilhamento ocorre apenas com fornecedores necessários para operação ou quando houver exigência legal.",
  },
  {
    title: "4. Cookies",
    body: "Utilizamos cookies para lembrar preferências, medir desempenho e melhorar navegação. O usuário pode ajustar cookies no navegador.",
  },
  {
    title: "5. Segurança",
    body: "Aplicamos controles técnicos e organizacionais para proteger as informações, incluindo autenticação, controle de acesso e monitoramento.",
  },
  {
    title: "6. Direitos LGPD",
    body: "Você pode solicitar acesso, correção, exclusão, portabilidade ou revogação de consentimento conforme a Lei 13.709/2018.",
  },
  {
    title: "7. Atualizações",
    body: "Esta política pode ser atualizada periodicamente. Sempre que houver mudanças relevantes, publicaremos a nova versão nesta página.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-10 md:pt-14">
          <div className="hero-surface p-7 md:p-10">
            <h1 className="text-3xl font-semibold text-white md:text-5xl">Política de Privacidade</h1>
            <p className="mt-3 text-sm text-white/80 md:text-base">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
            <p className="mt-4 max-w-3xl text-sm text-white/85">
              Este documento explica como a Imobiflow (demo) trata dados pessoais no contexto da plataforma
              imobiliária apresentada neste projeto.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="section-shell p-6 md:p-8">
            <div className="space-y-4">
              {sections.map((section) => (
                <article key={section.title} className="surface-card-muted p-5">
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">Contato para privacidade</h3>
              <div className="mt-3 space-y-1 text-sm text-white/80">
                <p>Imobiflow (demo)</p>
                <p>CRECI: 000000-XX (demo)</p>
                <p>E-mail: contato@imobiflow.com</p>
                <p>Telefone/WhatsApp: (00) 00000-0000</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
