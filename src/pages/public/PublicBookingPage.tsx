import {useEffect,useMemo,useState} from 'react';
import {useParams} from 'react-router-dom';
import {publicApi} from '../../api/services';
import type {Addon,PageGalleryImage,PageHighlight,PageSettings,PublicPageData,Venue,VenuePackage} from '../../types';
import {Field,money} from '../../components/ui';
import {CalendarDays,Clock,MapPin,CheckCircle2,ChevronRight,Plus,Minus,ArrowRight,Check,Wifi,Users,Image as ImageIcon} from 'lucide-react';
import './PublicBookingPage.css';

type AddonSelection={addon:Addon;quantity:number};
const icons=[Check,Wifi,Users,CalendarDays];

function BookingForm({slug,venues}:{slug:string;venues:Venue[]}){
  const [venueId,setVenueId]=useState<number>();
  const [date,setDate]=useState('');
  const [slots,setSlots]=useState<string[]>([]);
  const [slot,setSlot]=useState('');
  const [duration,setDuration]=useState(60);
  const [selectedPackage,setSelectedPackage]=useState<number>();
  const [packages,setPackages]=useState<VenuePackage[]>([]);
  const [addons,setAddons]=useState<Addon[]>([]);
  const [addonSelections,setAddonSelections]=useState<AddonSelection[]>([]);
  const [form,setForm]=useState({customerName:'',customerPhone:'',customerEmail:'',notes:''});
  const [done,setDone]=useState(false);
  const [error,setError]=useState('');
  const [loadingSlots,setLoadingSlots]=useState(false);

  useEffect(()=>{if(venues[0])setVenueId(venues[0].id)},[venues]);
  const venue=useMemo(()=>venues.find(v=>v.id===venueId),[venues,venueId]);
  const pricingType=venue?.pricingType||'FIXED_SLOT';

  useEffect(()=>{
    if(!venue)return;
    setDuration(venue.minimumDurationMinutes||venue.slotDurationMinutes||venue.durationMinutes||60);
    setSelectedPackage(undefined);setAddonSelections([]);setPackages([]);setAddons([]);
    Promise.all([
      publicApi.packages(slug,venue.id).catch(()=>[]),
      publicApi.addons(slug,venue.id).catch(()=>[])
    ]).then(([p,a])=>{setPackages(p);setAddons(a)});
  },[slug,venueId]);

  useEffect(()=>{
    if(!venueId||!date)return;
    setLoadingSlots(true);setError('');
    const params:Record<string,number>={};
    if(pricingType==='HOURLY')params.durationMinutes=duration;
    if(pricingType==='PACKAGE'&&selectedPackage)params.packageId=selectedPackage;
    publicApi.slots(slug,venueId,date,params)
      .then(s=>{setSlots(s);setSlot('')})
      .catch((e:any)=>setError(e.message||'Não foi possível consultar horários'))
      .finally(()=>setLoadingSlots(false));
  },[slug,venueId,date,duration,selectedPackage,pricingType]);

  const base=useMemo(()=>{
    if(!venue)return 0;
    if(pricingType==='HOURLY')return Number(venue.basePrice??venue.price)*(duration/60);
    if(pricingType==='DAILY')return Number(venue.dailyPrice??venue.price);
    if(pricingType==='PACKAGE')return Number(packages.find(p=>p.id===selectedPackage)?.price??0);
    return Number(venue.basePrice??venue.price);
  },[venue,pricingType,duration,packages,selectedPackage]);

  const extras=addonSelections.reduce((sum,s)=>sum+Number(s.addon.price)*s.quantity,0);
  const toggleAddon=(addon:Addon)=>setAddonSelections(c=>c.some(x=>x.addon.id===addon.id)?c.filter(x=>x.addon.id!==addon.id):[...c,{addon,quantity:1}]);
  const changeQty=(id:number,delta:number)=>setAddonSelections(c=>c.map(x=>x.addon.id===id?{...x,quantity:Math.max(1,x.quantity+delta)}:x));
  const time=(value:string)=>value.slice(11,16);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!venueId||!slot){setError('Escolha um horário disponível antes de continuar.');return}
    setError('');
    try{
      await publicApi.book(slug,{venueId,...form,startDateTime:slot,durationMinutes:pricingType==='HOURLY'?duration:undefined,packageId:selectedPackage,addons:addonSelections.map(x=>({addonId:x.addon.id,quantity:x.quantity}))});
      setDone(true);
    }catch(e:any){setError(e.message||'Não foi possível concluir a reserva.')}
  }

  if(done)return <section className="public-booking-success"><CheckCircle2 size={58}/><h2>Reserva recebida!</h2><p>Seu pedido foi registrado com sucesso. O estabelecimento poderá entrar em contato para confirmação.</p><button onClick={()=>{setDone(false);setDate('');setSlot('')}}>Fazer outra reserva</button></section>;

  return <section id="reservar" className="public-booking-section">
    <div className="public-section-head centered">
      <span>Reserve agora</span><h2>Escolha seu momento.</h2><p>Veja os horários disponíveis em tempo real e faça sua solicitação online.</p>
    </div>
    {error&&<div className="public-error">{error}</div>}
    <div className="booking-flow-modern">
      <div className="booking-config">
        <div className="booking-step-title">1. Escolha o espaço</div>
        <div className="public-venues">{venues.map(v=><button type="button" key={v.id} className={venueId===v.id?'public-venue selected':'public-venue'} onClick={()=>setVenueId(v.id)}>
          <CalendarDays/><strong>{v.name}</strong><small>{v.description||v.type}</small>
          <b>{v.pricingType==='HOURLY'?`${money(v.basePrice??v.price)}/hora`:v.pricingType==='DAILY'?`${money(v.dailyPrice??v.price)}/dia`:money(v.basePrice??v.price)}</b>
        </button>)}</div>
        {venue&&pricingType==='HOURLY'&&<><div className="booking-step-title">2. Duração</div><div className="duration-options">
          {Array.from({length:Math.max(1,Math.floor(((venue.maximumDurationMinutes||240)-(venue.minimumDurationMinutes||60))/(venue.durationStepMinutes||60))+1)},(_,i)=>(venue.minimumDurationMinutes||60)+i*(venue.durationStepMinutes||60)).map(min=><button type="button" key={min} className={duration===min?'selected':''} onClick={()=>setDuration(min)}>{min/60}h</button>)}
        </div></>}
        {venue&&pricingType==='PACKAGE'&&<><div className="booking-step-title">2. Pacote</div><div className="duration-options">{packages.map(p=><button type="button" key={p.id} className={selectedPackage===p.id?'selected':''} onClick={()=>setSelectedPackage(p.id)}>{p.name} · {money(p.price)}</button>)}</div></>}
        <div className="booking-step-title">3. Data e horário</div>
        <input className="public-date" type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/>
        <div className="slots">{!date?<p>Selecione uma data para consultar a disponibilidade.</p>:loadingSlots?<p>Buscando horários...</p>:slots.length?slots.map(s=><button type="button" key={s} className={slot===s?'selected':''} onClick={()=>setSlot(s)}><Clock size={15}/>{time(s)}</button>):<p>Nenhum horário disponível nesta data.</p>}</div>
        {addons.length>0&&<div className="public-addons"><div className="booking-step-title">Adicionais</div>{addons.map(a=>{const selected=addonSelections.find(x=>x.addon.id===a.id);return <div className={selected?'addon-row selected':'addon-row'} key={a.id}><button type="button" onClick={()=>toggleAddon(a)}><span><strong>{a.name}</strong><small>{a.description}</small></span><b>+ {money(a.price)}</b></button>{selected&&a.pricingType==='PER_UNIT'&&<div className="qty"><button type="button" onClick={()=>changeQty(a.id,-1)}><Minus/></button><span>{selected.quantity}</span><button type="button" onClick={()=>changeQty(a.id,1)}><Plus/></button></div>}</div>})}</div>}
      </div>
      <form className="public-booking-card" onSubmit={submit}>
        <div className="booking-step-title">Seus dados</div>
        <Field label="Nome"><input required value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})}/></Field>
        <Field label="WhatsApp / telefone"><input required value={form.customerPhone} onChange={e=>setForm({...form,customerPhone:e.target.value})}/></Field>
        <Field label="E-mail (opcional)"><input type="email" value={form.customerEmail} onChange={e=>setForm({...form,customerEmail:e.target.value})}/></Field>
        <Field label="Observação (opcional)"><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field>
        <div className="booking-total"><span>Total estimado</span><strong>{money(base+extras)}</strong></div>
        <button className="public-cta full" disabled={!slot}>Solicitar reserva <ChevronRight/></button>
      </form>
    </div>
  </section>
}

export default function PublicBookingPage(){
  const {slug=''}=useParams();
  const [page,setPage]=useState<PublicPageData>();
  const [error,setError]=useState('');

  useEffect(()=>{publicApi.page(slug).then(setPage).catch((e:any)=>setError(e.message||'Página não encontrada'))},[slug]);
  if(error)return <div className="public-page-error">{error}</div>;
  if(!page)return <div className="public-page-loading">Carregando...</div>;

  const {tenant,settings,gallery,highlights,venues}=page;
  const s:PageSettings={
    backgroundColor:'#fffdf8',surfaceColor:'#ffffff',textColor:'#172018',
    primaryColor:tenant.primaryColor||'#244b36',secondaryColor:'#dbe8c9',accentColor:'#d6a85f',
    heroTitle:`Seu próximo momento começa aqui.`,
    heroSubtitle:'Escolha seu espaço, veja a disponibilidade e reserve online de forma simples.',
    heroCtaText:'Reservar agora',aboutTitle:'Um espaço pensado para bons momentos.',
    inclusionsTitle:'O que você encontra aqui',galleryTitle:'Conheça cada detalhe',
    showAbout:true,showVenues:true,showInclusions:true,showGallery:true,showLocation:true,...settings
  };
  const css={'--pp-bg':s.backgroundColor,'--pp-surface':s.surfaceColor,'--pp-text':s.textColor,'--pp-primary':s.primaryColor,'--pp-secondary':s.secondaryColor,'--pp-accent':s.accentColor} as React.CSSProperties;
  const scroll=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  return <div className={`public-lp template-${(s.template||'MODERN').toLowerCase()}`} style={css}>
    <header className="public-nav">
      <button className="public-brand" onClick={()=>scroll('inicio')}>{tenant.logoUrl?<img src={tenant.logoUrl}/>:<span>{tenant.name.slice(0,1)}</span>}<strong>{tenant.name}</strong></button>
      <nav><button onClick={()=>scroll('espacos')}>Espaços</button>{s.showAbout&&<button onClick={()=>scroll('sobre')}>Sobre</button>}{s.showGallery&&<button onClick={()=>scroll('galeria')}>Galeria</button>}<button onClick={()=>scroll('reservar')}>Reservar</button></nav>
      <button className="public-cta nav-cta" onClick={()=>scroll('reservar')}>{s.heroCtaText}</button>
    </header>

    <section id="inicio" className="public-hero-lp" style={s.heroImageUrl?{backgroundImage:`linear-gradient(90deg,rgba(10,18,13,.78),rgba(10,18,13,.28)),url(${s.heroImageUrl})`}:undefined}>
      <div className="hero-content">
        <span className="hero-kicker">{'Experiências e reservas online'}</span>
        <h1>{s.heroTitle}</h1><p>{s.heroSubtitle}</p>
        <div className="hero-actions"><button className="public-cta" onClick={()=>scroll('reservar')}>{s.heroCtaText}<ArrowRight/></button>{tenant.address&&<button className="public-outline" onClick={()=>scroll('localizacao')}><MapPin/>Como chegar</button>}</div>
      </div>
      <div className="hero-badge">{venues.length} {venues.length===1?'espaço disponível':'espaços disponíveis'}<span>✦</span> Reserva online</div>
    </section>

    {s.showAbout&&<section id="sobre" className="public-section split-section">
      <div className="about-image">{s.aboutImageUrl?<img src={s.aboutImageUrl}/>:<div className="image-placeholder"><ImageIcon size={42}/></div>}</div>
      <div><div className="public-section-head"><span>Sobre o espaço</span><h2>{s.aboutTitle}</h2></div><p className="about-text">{s.aboutText||tenant.address||'Personalize esta seção contando a história, o diferencial e a experiência que seu espaço oferece.'}</p>
      <button className="text-link" onClick={()=>scroll('reservar')}>Ver disponibilidade <ArrowRight/></button></div>
    </section>}

    {s.showVenues&&<section id="espacos" className="public-section">
      <div className="public-section-head"><span>Nossos espaços</span><h2>Escolha o ambiente ideal.</h2><p>Cada espaço pode ter sua própria forma de cobrança, duração, disponibilidade e adicionais.</p></div>
      <div className="lp-venue-grid">{venues.map(v=><article key={v.id} className="lp-venue-card"><div className="venue-card-cover"><span>{v.type}</span></div><div><h3>{v.name}</h3><p>{v.description||'Um ambiente preparado para sua experiência.'}</p><div className="venue-price">{v.pricingType==='HOURLY'?`${money(v.basePrice??v.price)} / hora`:v.pricingType==='DAILY'?`${money(v.dailyPrice??v.price)} / diária`:money(v.basePrice??v.price)}</div><button onClick={()=>scroll('reservar')}>Reservar este espaço <ArrowRight/></button></div></article>)}</div>
    </section>}

    {s.showInclusions&&<section id="incluso" className="public-inclusions">
      <div className="public-section-head"><span>Já vem incluso</span><h2>{s.inclusionsTitle}</h2><p>{s.inclusionsSubtitle||'Mostre aos seus clientes tudo que torna sua experiência especial.'}</p></div>
      <div className="highlight-grid">{(highlights.length?highlights:[{title:'Estrutura completa',description:'Personalize os itens incluídos no espaço.'},{title:'Reserva online',description:'Disponibilidade consultada em tempo real.'},{title:'Experiência personalizada',description:'Informações claras para seus clientes.'}]).map((h,i)=>{const Icon=icons[i%icons.length];return <article key={h.id||h.title}><Icon/><h3>{h.title}</h3><p>{h.description}</p></article>})}</div>
    </section>}

    {s.showGallery&&<section id="galeria" className="public-section">
      <div className="public-section-head"><span>Galeria</span><h2>{s.galleryTitle}</h2><p>{s.gallerySubtitle||'Mostre o seu ambiente antes mesmo do cliente chegar.'}</p></div>
      <div className="public-gallery">{gallery.length?gallery.map((g:PageGalleryImage,i)=><figure key={g.id||i}><img src={g.imageUrl} alt={g.altText||'Imagem do espaço'}/></figure>):<div className="gallery-empty">Adicione fotos no editor da sua página.</div>}</div>
    </section>}

    {s.showLocation&&tenant.address&&<section id="localizacao" className="public-location"><div><MapPin/><span>Localização</span><h2>Fácil de encontrar.</h2><p>{tenant.address}</p></div>{tenant.phone&&<a className="public-cta" href={`https://wa.me/${tenant.phone.replace(/\D/g,'')}`} target="_blank">Falar no WhatsApp</a>}</section>}

    <BookingForm slug={slug} venues={venues}/>
    <footer className="public-footer-lp"><strong>{tenant.name}</strong><span>Reservas online</span>{tenant.instagram&&<span>{tenant.instagram}</span>}</footer>
  </div>
}
