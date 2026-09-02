import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Check, ChevronDown, Clock3, LayoutDashboard, Menu, MapPin, Sparkles, Users, X, Zap } from 'lucide-react';
import { PLANS } from '../../config/plans';
import { money } from '../../components/ui';

const businessTypes = ['Society','Beach Tennis','Quadras','Piscinas','Salões','Chácaras','Auditórios','Espaços de eventos'];
const faqs = [
  ['Preciso instalar alguma coisa?','Não. O sistema funciona no navegador e pode ser usado pelo celular ou computador.'],
  ['Meu cliente precisa criar conta?','Não. Ele acessa sua página pública, escolhe o espaço, a data e solicita a reserva.'],
  ['Posso cadastrar mais de uma quadra ou ambiente?','Sim. A quantidade de espaços depende do seu plano.'],
  ['Posso cobrar por hora, diária ou pacote?','Sim. Você escolhe o modelo de cobrança de cada espaço: valor fixo por horário, por hora, por diária ou por pacote fechado.'],
  ['Consigo bloquear horários específicos?','Sim. Você pode manter horários recorrentes e bloquear períodos excepcionais como manutenção ou eventos privados.'],
  ['Posso personalizar minha página?','Sim. Nome, logo, capa, cor principal, contato, Instagram e endereço já fazem parte da personalização.'],
];

export default function LandingPage(){
  const [menu,setMenu]=useState(false);
  const [cycle,setCycle]=useState<'MONTHLY'|'YEARLY'>('MONTHLY');
  return <div className="landing">
    <header className="lp-header"><div className="lp-wrap lp-nav">
      <Link className="lp-brand" to="/">Agenda<span>Hub</span></Link>
      <nav className={menu?'lp-links open':'lp-links'}>
        <a href="#recursos" onClick={()=>setMenu(false)}>Recursos</a><a href="#como-funciona" onClick={()=>setMenu(false)}>Como funciona</a><a href="#para-quem" onClick={()=>setMenu(false)}>Para quem é</a><a href="#planos" onClick={()=>setMenu(false)}>Planos</a><a href="#faq" onClick={()=>setMenu(false)}>FAQ</a>
      </nav>
      <div className="lp-actions"><Link className="lp-login" to="/login">Entrar</Link><Link className="btn primary" to="/register">Começar agora</Link><button className="lp-menu" aria-label="Abrir menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div>
    </div></header>

    <main>
      <section className="lp-hero"><div className="lp-wrap hero-grid"><div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> Reservas organizadas. Negócio no controle.</div>
        <h1>Seu espaço disponível para reservas <em>24 horas por dia.</em></h1>
        <p>Centralize horários, clientes e reservas em uma página própria para o seu negócio — sem depender de conversas intermináveis no WhatsApp.</p>
        <div className="hero-actions"><Link className="btn primary big" to="/register">Criar minha conta</Link><a className="btn soft big" href="#como-funciona">Ver como funciona</a></div>
        <div className="hero-proof"><span><Check/> Página própria</span><span><Check/> Sem instalação</span><span><Check/> Feito para celular</span></div>
      </div><ProductMockup/></div></section>

      <section className="lp-strip"><div className="lp-wrap"><span>Feito para negócios que alugam tempo e espaço</span><div>{businessTypes.map(x=><b key={x}>{x}</b>)}</div></div></section>

      <section id="como-funciona" className="lp-section"><div className="lp-wrap"><SectionHead eyebrow="Simples desde o primeiro dia" title="Do cadastro à primeira reserva em poucos passos" description="Você configura o negócio uma vez. Depois, sua página trabalha por você."/>
        <div className="steps">{[
          ['01','Cadastre seu negócio','Adicione informações, contato e identidade visual.'],
          ['02','Configure seus espaços','Crie Quadra 1, Quadra 2, salão, piscina ou qualquer outro ambiente.'],
          ['03','Defina horários e preços','Configure disponibilidade, bloqueios e o modelo de cobrança de cada espaço.'],
          ['04','Compartilhe sua página','Seus clientes escolhem data e horário e a reserva chega direto ao seu painel.'],
        ].map(([n,t,d])=><article className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      </div></section>

      <section id="recursos" className="lp-section alt"><div className="lp-wrap"><SectionHead eyebrow="Uma operação mais organizada" title="Tudo que você precisa para gerenciar suas reservas" description="Cada assinante administra o próprio sistema, com seus espaços, horários, clientes e identidade."/>
        <div className="feature-grid">{[
          [CalendarCheck,'Reservas online','Receba solicitações e acompanhe pendentes, confirmadas e concluídas.'],
          [Clock3,'Agenda e bloqueios','Defina disponibilidade recorrente e bloqueie períodos específicos.'],
          [MapPin,'Múltiplos espaços','Cadastre ambientes independentes com preço e agenda próprios.'],
          [Zap,'Preços flexíveis','Estrutura preparada para valor fixo, por hora, diária ou pacotes.'],
          [Users,'Clientes e equipe','Mantenha sua base de clientes e controle os acessos da equipe.'],
          [LayoutDashboard,'Painel completo','Veja reservas, receita registrada e próximos horários em um só lugar.'],
        ].map(([Icon,t,d]:any)=><article className="feature" key={t}><span><Icon/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
      </div></section>

      <section id="para-quem" className="lp-section"><div className="lp-wrap audience"><div><SectionHead eyebrow="Um sistema, vários negócios" title="Se você aluga um espaço, o AgendaHub se adapta." description="Cada ambiente pode ter suas próprias regras, disponibilidade e forma de cobrança."/><div className="audience-tags">{businessTypes.map(x=><span key={x}>{x}</span>)}</div></div><div className="public-preview"><div className="preview-cover"><small>SUA PÁGINA</small><h3>Arena Central</h3><p>Nova Cruz, RN</p></div><div className="preview-body"><b>Escolha o espaço</b><div className="preview-venues"><span className="selected">Quadra 1<small>R$ 80/h</small></span><span>Quadra 2<small>R$ 70/h</small></span></div><b>Horários disponíveis</b><div className="preview-slots"><span>18:00</span><span>19:00</span><span>20:00</span></div></div></div></div></section>

      <section className="lp-section demo-section"><div className="lp-wrap demo-grid"><div className="demo-copy"><div className="eyebrow">Seu negócio, sua operação</div><h2>Um painel simples para quem precisa resolver, não complicar.</h2><p>Use pelo celular para confirmar reservas, bloquear horários, consultar clientes e acompanhar seus espaços.</p><ul><li><Check/> Dashboard operacional</li><li><Check/> Reservas e status de pagamento</li><li><Check/> Agenda por espaço</li><li><Check/> Personalização da página pública</li></ul></div><DashboardMockup/></div></section>

      <section id="planos" className="lp-section"><div className="lp-wrap"><SectionHead eyebrow="Planos para cada fase" title="Comece pequeno e cresça quando precisar" description="A principal diferença está na quantidade de espaços, usuários e recursos de personalização da operação."/>
        <div className="billing-toggle"><button type="button" className={cycle==='MONTHLY'?'active':''} onClick={()=>setCycle('MONTHLY')}>Mensal</button><button type="button" className={cycle==='YEARLY'?'active':''} onClick={()=>setCycle('YEARLY')}>Anual <small>2 meses grátis</small></button></div>
        <div className="pricing-grid">{PLANS.map(plan=><article className={plan.highlighted?'price-card featured':'price-card'} key={plan.value}>{plan.highlighted&&<div className="popular">Mais escolhido</div>}<span className="plan-name">{plan.label}</span><p>{plan.description}</p><div className="price"><strong>{money(cycle==='YEARLY'?plan.annualPrice/12:plan.price)}</strong><small>/mês{cycle==='YEARLY'?' no plano anual':''}</small></div><Link className={plan.highlighted?'btn primary full':'btn soft full'} to={`/register?plan=${plan.value}&cycle=${cycle}`}>Começar com {plan.label}</Link><ul>{plan.features.map(f=><li key={f}><Check/>{f}</li>)}{plan.comingSoon?.map(f=><li className="soon" key={f}><Sparkles/>{f} <small>em breve</small></li>)}</ul></article>)}</div>
        <p className="pricing-note">Valores e recursos são a proposta comercial inicial e podem ser ajustados antes do lançamento.</p>
      </div></section>

      <section id="faq" className="lp-section alt"><div className="lp-wrap faq-grid"><div><SectionHead eyebrow="Dúvidas comuns" title="Antes de começar" description="O essencial para entender como a plataforma funciona."/></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown/></summary><p>{a}</p></details>)}</div></div></section>

      <section className="lp-final"><div className="lp-wrap"><div><span>Pronto para organizar suas reservas?</span><h2>Transforme seu WhatsApp em uma operação mais simples.</h2></div><Link className="btn light big" to="/register">Criar minha conta</Link></div></section>
    </main>

    <footer className="lp-footer"><div className="lp-wrap footer-grid"><div><Link className="lp-brand light" to="/">Agenda<span>Hub</span></Link><p>Gestão e reservas para espaços alugáveis.</p></div><div><b>Produto</b><a href="#recursos">Recursos</a><a href="#planos">Planos</a><a href="#faq">FAQ</a></div><div><b>Acesso</b><Link to="/login">Entrar</Link><Link to="/register">Criar conta</Link></div><div><b>Legal</b><Link to="/privacidade">Privacidade</Link><Link to="/termos">Termos de uso</Link></div></div><div className="lp-wrap footer-bottom">© {new Date().getFullYear()} AgendaHub. Todos os direitos reservados.</div></footer>
  </div>
}

function SectionHead({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <div className="section-head"><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>}
function ProductMockup(){return <div className="product-mock"><div className="mock-window"><div className="mock-top"><i/><i/><i/><span>app.agendahub.com</span></div><div className="mock-shell"><aside><b>AH</b><span className="on"/><span/><span/><span/></aside><div className="mock-main"><small>Visão geral</small><h3>Bom dia, Arena Central 👋</h3><div className="mock-stats"><span><small>Reservas hoje</small><b>12</b></span><span><small>Pendentes</small><b>4</b></span><span><small>Receita</small><b>R$ 1.840</b></span></div><div className="mock-list"><b>Próximas reservas</b><span><i/>18:00 <em>Quadra 1</em><strong>Confirmada</strong></span><span><i/>19:00 <em>Quadra 2</em><strong>Pendente</strong></span><span><i/>20:00 <em>Beach Tennis</em><strong>Confirmada</strong></span></div></div></div></div><div className="floating-card"><CalendarCheck/><div><b>Nova reserva</b><small>Quadra 1 · 18:00</small></div></div></div>}
function DashboardMockup(){return <div className="dashboard-demo"><div className="demo-sidebar"><b>AgendaHub</b><span className="active">Visão geral</span><span>Reservas</span><span>Agenda</span><span>Espaços</span><span>Clientes</span></div><div className="demo-main"><div className="demo-top"><div><small>Painel</small><b>Arena Central</b></div><i/></div><div className="demo-kpis"><span><small>Hoje</small><b>12 reservas</b></span><span><small>Pendentes</small><b>4</b></span><span><small>Espaços</small><b>3 ativos</b></span></div><div className="demo-table"><b>Hoje</b>{['18:00 · João · Quadra 1','19:00 · Maria · Quadra 2','20:00 · Pedro · Beach Tennis'].map((x,i)=><span key={x}>{x}<em>{i===1?'Pendente':'Confirmada'}</em></span>)}</div></div></div>}
