import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para a Home
            </Button>
        </Link>
        <div className="mb-8 text-center">
            <Shield className="w-16 h-16 mx-auto text-cyan-600 mb-4" />
            <h1 className="text-4xl font-bold text-slate-900">Política de Privacidade</h1>
            <p className="text-slate-500 mt-2">Última atualização: 16 de outubro de 2025</p>
        </div>

        <div className="prose prose-slate max-w-none lg:prose-lg">
            <section>
              <h2>1. Introdução</h2>
              <p>
                A Toca Experience ("nós", "nossos" ou "empresa") valoriza sua privacidade e se compromete 
                a proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos 
                e compartilhamos suas informações quando você utiliza nosso aplicativo MeAjudaToca 
                ("aplicativo") e nossos serviços.
              </p>
              <p>
                Ao utilizar nosso aplicativo, você concorda com a coleta e uso de informações de acordo 
                com esta política. Processamos seus dados pessoais apenas para os fins descritos nesta 
                política e de acordo com a Lei Geral de Proteção de Dados (LGPD) e outras leis de 
                proteção de dados aplicáveis.
              </p>
            </section>
            
            <section>
              <h2>2. Dados que Coletamos</h2>
              <p>Podemos coletar os seguintes tipos de informações:</p>
              
              <h3>2.1 Informações que você nos fornece:</h3>
              <ul>
                <li>Informações de cadastro (nome, e-mail, telefone, endereço)</li>
                <li>Informações de perfil para prestadores de serviço (experiência, especialidades)</li>
                <li>Conteúdo que você gera (avaliações, comentários, fotos de serviços)</li>
                <li>Informações de pagamento (processadas por gateways de pagamento seguros)</li>
                <li>Comunicações com nosso suporte e outros usuários</li>
              </ul>
              
              <h3>2.2 Informações coletadas automaticamente:</h3>
              <ul>
                <li>Dados de localização (com seu consentimento)</li>
                <li>Informações do dispositivo (modelo, sistema operacional)</li>
                <li>Dados de uso e interação com o aplicativo</li>
                <li>Logs e registros de erros</li>
              </ul>
            </section>
            
            <section>
              <h2>3. Como Usamos Seus Dados</h2>
              <p>Utilizamos suas informações para:</p>
              <ul>
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar agendamentos e pagamentos</li>
                <li>Conectar clientes e prestadores de serviço</li>
                <li>Personalizar sua experiência no aplicativo</li>
                <li>Enviar comunicações sobre serviços, atualizações e promoções</li>
                <li>Garantir a segurança da plataforma e prevenir fraudes</li>
                <li>Cumprir obrigações legais e resolver disputas</li>
              </ul>
            </section>
            
            <section>
              <h2>4. Compartilhamento de Dados</h2>
              <p>Podemos compartilhar suas informações com:</p>
              <ul>
                <li>Outros usuários da plataforma (ex.: cliente e prestador em um agendamento)</li>
                <li>Processadores de pagamento para viabilizar transações</li>
                <li>Prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Autoridades quando legalmente exigido</li>
              </ul>
              <p>
                Não vendemos ou alugamos seus dados pessoais para terceiros para fins de marketing.
              </p>
            </section>
            
            <section>
              <h2>5. Seus Direitos</h2>
              <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
              <ul>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos ou incorretos</li>
                <li>Eliminação de dados desnecessários ou excessivos</li>
                <li>Portabilidade dos dados para outro serviço</li>
                <li>Revogação do consentimento a qualquer momento</li>
                <li>Informações sobre compartilhamento de dados</li>
              </ul>
              <p>
                Para exercer seus direitos, entre em contato conosco pelo e-mail:
                <a href="mailto:privacidade@tocaexperience.com"> privacidade@tocaexperience.com</a>
              </p>
            </section>
            
            <section>
              <h2>6. Segurança de Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais contra 
                acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, 
                controles de acesso e auditorias regulares.
              </p>
            </section>
            
            <section>
              <h2>7. Período de Retenção</h2>
              <p>
                Mantemos seus dados pessoais apenas pelo tempo necessário para os fins descritos nesta 
                política ou conforme exigido por lei. Os critérios para determinar o período de retenção 
                incluem obrigações legais e interesses legítimos do negócio.
              </p>
            </section>
            
            <section>
              <h2>8. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
                sobre mudanças significativas através de um aviso no aplicativo ou por e-mail.
              </p>
            </section>
            
            <section>
              <h2>9. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato conosco:
              </p>
              <p>
                <strong>Toca Experience</strong><br />
                Encarregado de Dados (DPO): João Silva<br />
                E-mail: <a href="mailto:dpo@tocaexperience.com">dpo@tocaexperience.com</a><br />
                Endereço: Rua Principal, 123, Quadrado, Trancoso - BA<br />
                Telefone: (73) 3333-4444
              </p>
            </section>
        </div>
      </div>
    </div>
  );
}