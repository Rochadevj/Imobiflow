import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-lg md:text-xl text-white/90">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground mb-6">
              A Alexandre Andrade Imóveis coleta informações quando você se cadastra em nosso site, 
              entra em contato conosco ou interage com nossos serviços. As informações coletadas incluem:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone</li>
              <li>Informações sobre imóveis de interesse</li>
              <li>Dados de navegação (cookies, endereço IP, tipo de navegador)</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">2. Como Usamos suas Informações</h2>
            <p className="text-muted-foreground mb-6">
              As informações coletadas são utilizadas para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Fornecer e melhorar nossos serviços imobiliários</li>
              <li>Responder às suas solicitações e perguntas</li>
              <li>Enviar informações sobre imóveis que correspondam ao seu perfil</li>
              <li>Personalizar sua experiência no site</li>
              <li>Enviar comunicações de marketing (com seu consentimento)</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground mb-6">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto nos seguintes casos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Com seu consentimento explícito</li>
              <li>Para prestadores de serviços que nos auxiliam nas operações do negócio</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteger nossos direitos, privacidade, segurança ou propriedade</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">4. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground mb-6">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. 
              Cookies são pequenos arquivos de dados armazenados no seu dispositivo que nos ajudam a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Lembrar suas preferências e configurações</li>
              <li>Entender como você usa nosso site</li>
              <li>Melhorar o desempenho do site</li>
              <li>Fornecer conteúdo relevante</li>
            </ul>
            <p className="text-muted-foreground mb-8">
              Você pode configurar seu navegador para recusar cookies, mas isso pode limitar 
              algumas funcionalidades do site.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">5. Segurança dos Dados</h2>
            <p className="text-muted-foreground mb-8">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
              informações pessoais contra acesso não autorizado, perda, destruição ou alteração. 
              No entanto, nenhum método de transmissão pela internet é 100% seguro.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-6">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Confirmar a existência de tratamento de dados pessoais</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
              <li>Solicitar a portabilidade dos dados</li>
              <li>Revogar o consentimento</li>
              <li>Opor-se ao tratamento de dados</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mb-4">7. Retenção de Dados</h2>
            <p className="text-muted-foreground mb-8">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
              as finalidades descritas nesta política, salvo quando a lei exigir um período maior.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">8. Alterações nesta Política</h2>
            <p className="text-muted-foreground mb-8">
              Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que 
              você revise esta página regularmente para se manter informado sobre como protegemos 
              suas informações.
            </p>

            <h2 className="text-2xl font-bold text-foreground mb-4">9. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
              entre em contato conosco:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="text-muted-foreground mb-2">
                <strong>Alexandre Andrade Corretor de Imóveis</strong>
              </p>
              <p className="text-muted-foreground mb-2">
                CRECI: 078852
              </p>
              <p className="text-muted-foreground mb-2">
                Telefone/WhatsApp: (51) 991288418
              </p>
              <p className="text-muted-foreground mb-2">
                Canoas, Rio Grande do Sul
              </p>
            </div>

            <div className="border-t pt-8 mt-8">
              <p className="text-sm text-muted-foreground">
                Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de 
                Dados (LGPD - Lei nº 13.709/2018) e outras legislações aplicáveis.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
