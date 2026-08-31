import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {addonsApi,availabilityApi,blockedApi,packagesApi,policiesApi,venuesApi} from '../../api/services';
import type {Addon,Availability,BlockedPeriod,Venue,VenueBookingPolicy,VenuePackage} from '../../types';
import {Badge,Card,Field,dateTime,money} from '../../components/ui';
import {ArrowLeft,CalendarClock,Clock3,Gift,LockKeyhole,PackageOpen,Settings2} from 'lucide-react';
import {FEATURES} from '../../config/features';
const days=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
const dayLabel:Record<string,string>={MONDAY:'Segunda',TUESDAY:'Terça',WEDNESDAY:'Quarta',THURSDAY:'Quinta',FRIDAY:'Sexta',SATURDAY:'Sábado',SUNDAY:'Domingo'};
type Tab='availability'|'blocked'|'packages'|'addons'|'policy';

export default function VenueSchedulePage(){
  const id=Number(useParams().id);
  const [venue,setVenue]=useState<Venue>();
  const [tab,setTab]=useState<Tab>('availability');
  const [av,setAv]=useState<Availability[]>([]);
  const [bl,setBl]=useState<BlockedPeriod[]>([]);
  const [packages,setPackages]=useState<VenuePackage[]>([]);
  const [addons,setAddons]=useState<Addon[]>([]);
  const [futureUnavailable,setFutureUnavailable]=useState<Record<string,boolean>>({});
  const [a,setA]=useState<any>({dayOfWeek:'MONDAY',startTime:'08:00',endTime:'18:00'});
  const [b,setB]=useState<any>({startDateTime:'',endDateTime:'',reason:''});
  const [pkg,setPkg]=useState<any>({name:'',durationMinutes:120,price:0,active:true});
  const [addon,setAddon]=useState<any>({name:'',pricingType:'FIXED',price:0,active:true});
  const [policy,setPolicy]=useState<VenueBookingPolicy>({venueId:id,requiresApproval:true,minimumAdvanceMinutes:120,maximumAdvanceDays:60,cancellationAllowed:true,cancellationDeadlineHours:24});
  // Per-tab error messages, so a failed create shows *why* it failed instead of silently doing nothing.
  const [errors,setErrors]=useState<Record<string,string>>({});
  const setErr=(key:string,msg:string)=>setErrors(x=>({...x,[key]:msg}));
  const clearErr=(key:string)=>setErrors(x=>({...x,[key]:''}));

  const loadCore=()=>Promise.all([venuesApi.get(id),availabilityApi.list(id),blockedApi.list(id)]).then(([v,a,b])=>{setVenue(v);setAv(a);setBl(b)});
  useEffect(()=>{loadCore()},[id]);

  useEffect(()=>{
    if(!FEATURES.advancedPricingApi){if(tab==='packages'||tab==='addons'||tab==='policy')setFutureUnavailable(x=>({...x,[tab]:true}));return;}
    if(tab==='packages')packagesApi.list(id).then(setPackages).catch(()=>setFutureUnavailable(x=>({...x,packages:true})));
    if(tab==='addons')addonsApi.list(id).then(setAddons).catch(()=>setFutureUnavailable(x=>({...x,addons:true})));
    if(tab==='policy')policiesApi.get(id).then(setPolicy).catch(()=>setFutureUnavailable(x=>({...x,policy:true})));
  },[tab,id]);

  const tabs:[Tab,string,any][]=[['availability','Disponibilidade',Clock3],['blocked','Bloqueios',LockKeyhole],['packages','Pacotes',PackageOpen],['addons','Adicionais',Gift],['policy','Regras',Settings2]];

  return <>
    <div className="page-head"><div><Link className="back-link" to="/app/venues"><ArrowLeft size={16}/> Espaços</Link><h1>{venue?.name||'Gerenciar espaço'}</h1><p>{venue?.description||'Horários, bloqueios, preços e regras deste espaço.'}</p></div><Link className="btn ghost" to={`/app/venues/${id}/edit`}>Editar informações</Link></div>
    <div className="venue-summary"><Card><small>Modelo de cobrança</small><strong>{venue?.pricingType==='HOURLY'?'Por hora':venue?.pricingType==='DAILY'?'Diária':venue?.pricingType==='PACKAGE'?'Pacotes':'Horário fixo'}</strong></Card><Card><small>Valor base</small><strong>{money(venue?.basePrice??venue?.dailyPrice??venue?.price??0)}</strong></Card><Card><small>Status</small><Badge tone={venue?.active?'success':'neutral'}>{venue?.active?'Ativo':'Inativo'}</Badge></Card></div>
    <div className="tabs">{tabs.map(([key,label,Icon])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}><Icon/>{label}</button>)}</div>

    {tab==='availability'&&<div className="split">
      <Card>
        <h2>Adicionar disponibilidade</h2>
        <p className="muted form-note">Defina os períodos em que este espaço normalmente pode receber reservas. Use 00:00 como horário de fim para representar "aberto até meia-noite". O sistema ainda não aceita intervalos que cruzam a virada do dia (ex.: 22h até 03h do dia seguinte).</p>
        <form onSubmit={async e=>{e.preventDefault();clearErr('availability');try{await availabilityApi.create(id,a);await loadCore()}catch(err:any){setErr('availability',err.message||'Não foi possível adicionar este horário.')}}}>
          <Field label="Dia"><select value={a.dayOfWeek} onChange={e=>setA({...a,dayOfWeek:e.target.value})}>{days.map(d=><option key={d} value={d}>{dayLabel[d]}</option>)}</select></Field>
          <div className="form-grid"><Field label="Início"><input type="time" value={a.startTime} onChange={e=>setA({...a,startTime:e.target.value})}/></Field><Field label="Fim"><input type="time" value={a.endTime} onChange={e=>setA({...a,endTime:e.target.value})}/></Field></div>
          {errors.availability&&<div className="alert danger">{errors.availability}</div>}
          <button className="btn primary full">Adicionar horário</button>
        </form>
      </Card>
      <Card><h2>Semana configurada</h2><div className="schedule-list">{days.map(day=><div className="schedule-day" key={day}><strong>{dayLabel[day]}</strong><div>{av.filter(x=>x.dayOfWeek===day).length?av.filter(x=>x.dayOfWeek===day).map(x=><span key={x.id}>{x.startTime.slice(0,5)} — {x.endTime.slice(0,5)} <button onClick={async()=>{await availabilityApi.remove(id,x.id);loadCore()}}>×</button></span>):<small>Fechado</small>}</div></div>)}</div></Card>
    </div>}

    {tab==='blocked'&&<div className="split">
      <Card>
        <h2>Bloquear período</h2><p className="muted form-note">Use para manutenção, eventos internos ou qualquer indisponibilidade excepcional.</p>
        <form onSubmit={async e=>{e.preventDefault();clearErr('blocked');try{await blockedApi.create(id,{...b,startDateTime:new Date(b.startDateTime).toISOString(),endDateTime:new Date(b.endDateTime).toISOString()});setB({startDateTime:'',endDateTime:'',reason:''});await loadCore()}catch(err:any){setErr('blocked',err.message||'Não foi possível bloquear este período.')}}}>
          <Field label="Início"><input type="datetime-local" required value={b.startDateTime} onChange={e=>setB({...b,startDateTime:e.target.value})}/></Field>
          <Field label="Fim"><input type="datetime-local" required value={b.endDateTime} onChange={e=>setB({...b,endDateTime:e.target.value})}/></Field>
          <Field label="Motivo"><input value={b.reason} onChange={e=>setB({...b,reason:e.target.value})} placeholder="Manutenção"/></Field>
          {errors.blocked&&<div className="alert danger">{errors.blocked}</div>}
          <button className="btn primary full">Bloquear período</button>
        </form>
      </Card>
      <Card><h2>Próximos bloqueios</h2><div className="stack">{bl.length?bl.map(x=><div className="row-item" key={x.id}><span><strong>{x.reason||'Bloqueio'}</strong><small>{dateTime(x.startDateTime)} → {dateTime(x.endDateTime)}</small></span><button className="linkbtn danger-text" onClick={async()=>{await blockedApi.remove(id,x.id);loadCore()}}>Remover</button></div>):<div className="empty"><CalendarClock/><strong>Nenhum bloqueio</strong><span>O espaço segue a disponibilidade semanal.</span></div>}</div></Card>
    </div>}

    {tab==='packages'&&<FutureFeature unavailable={futureUnavailable.packages} title="Pacotes de duração" description="Crie opções fechadas como 2 horas por R$ 150 ou 4 horas por R$ 270. O frontend está pronto; falta o endpoint correspondente na API.">
      <div className="split">
        <Card>
          <h2>Novo pacote</h2>
          <form onSubmit={async e=>{e.preventDefault();clearErr('packages');try{const r=await packagesApi.create(id,pkg);setPackages(x=>[...x,r]);setPkg({name:'',durationMinutes:120,price:0,active:true})}catch(err:any){setErr('packages',err.message||'Não foi possível criar este pacote.')}}}>
            <Field label="Nome"><input value={pkg.name} onChange={e=>setPkg({...pkg,name:e.target.value})} placeholder="Pacote 2 horas"/></Field>
            <div className="form-grid"><Field label="Duração (min)"><input type="number" value={pkg.durationMinutes} onChange={e=>setPkg({...pkg,durationMinutes:Number(e.target.value)})}/></Field><Field label="Preço"><input type="number" step="0.01" value={pkg.price} onChange={e=>setPkg({...pkg,price:Number(e.target.value)})}/></Field></div>
            {errors.packages&&<div className="alert danger">{errors.packages}</div>}
            <button className="btn primary full">Adicionar pacote</button>
          </form>
        </Card>
        <Card><h2>Pacotes</h2>{packages.map(x=><div className="row-item" key={x.id}><span><strong>{x.name}</strong><small>{x.durationMinutes} min · {money(x.price)}</small></span><button className="linkbtn danger-text" onClick={async()=>{await packagesApi.remove(id,x.id);setPackages(p=>p.filter(i=>i.id!==x.id))}}>Remover</button></div>)}</Card>
      </div>
    </FutureFeature>}

    {tab==='addons'&&<FutureFeature unavailable={futureUnavailable.addons} title="Adicionais" description="Itens opcionais que entram no total da reserva, como churrasqueira, piscina, cadeiras ou equipamentos.">
      <div className="split">
        <Card>
          <h2>Novo adicional</h2>
          <form onSubmit={async e=>{e.preventDefault();clearErr('addons');try{const r=await addonsApi.create(id,addon);setAddons(x=>[...x,r]);setAddon({name:'',pricingType:'FIXED',price:0,active:true})}catch(err:any){setErr('addons',err.message||'Não foi possível criar este adicional.')}}}>
            <Field label="Nome"><input value={addon.name} onChange={e=>setAddon({...addon,name:e.target.value})}/></Field>
            <Field label="Cobrança"><select value={addon.pricingType} onChange={e=>setAddon({...addon,pricingType:e.target.value})}><option value="FIXED">Valor fixo</option><option value="PER_HOUR">Por hora</option><option value="PER_UNIT">Por unidade</option></select></Field>
            <Field label="Preço"><input type="number" step="0.01" value={addon.price} onChange={e=>setAddon({...addon,price:Number(e.target.value)})}/></Field>
            {errors.addons&&<div className="alert danger">{errors.addons}</div>}
            <button className="btn primary full">Adicionar</button>
          </form>
        </Card>
        <Card><h2>Adicionais disponíveis</h2>{addons.map(x=><div className="row-item" key={x.id}><span><strong>{x.name}</strong><small>{x.pricingType} · {money(x.price)}</small></span><button className="linkbtn danger-text" onClick={async()=>{await addonsApi.remove(id,x.id);setAddons(p=>p.filter(i=>i.id!==x.id))}}>Remover</button></div>)}</Card>
      </div>
    </FutureFeature>}

    {tab==='policy'&&<FutureFeature unavailable={futureUnavailable.policy} title="Regras de reserva" description="Controle antecedência, aprovação e cancelamento. O formulário já define o contrato que será implementado no backend.">
      <Card className="policy-card">
        <div className="form-grid">
          <Field label="Antecedência mínima (min)"><input type="number" value={policy.minimumAdvanceMinutes} onChange={e=>setPolicy({...policy,minimumAdvanceMinutes:Number(e.target.value)})}/></Field>
          <Field label="Máximo de dias no futuro"><input type="number" value={policy.maximumAdvanceDays} onChange={e=>setPolicy({...policy,maximumAdvanceDays:Number(e.target.value)})}/></Field>
          <Field label="Prazo para cancelar (h)"><input type="number" value={policy.cancellationDeadlineHours} onChange={e=>setPolicy({...policy,cancellationDeadlineHours:Number(e.target.value)})}/></Field>
        </div>
        <label className="check"><input type="checkbox" checked={policy.requiresApproval} onChange={e=>setPolicy({...policy,requiresApproval:e.target.checked})}/> Precisa de aprovação manual</label>
        <label className="check"><input type="checkbox" checked={policy.cancellationAllowed} onChange={e=>setPolicy({...policy,cancellationAllowed:e.target.checked})}/> Permitir cancelamento conforme prazo</label>
        {errors.policy&&<div className="alert danger">{errors.policy}</div>}
        <button className="btn primary" onClick={()=>{clearErr('policy');policiesApi.save(id,policy).catch((err:any)=>setErr('policy',err.message||'Não foi possível salvar as regras.'))}}>Salvar regras</button>
      </Card>
    </FutureFeature>}
  </>
}

function FutureFeature({unavailable,title,description,children}:{unavailable?:boolean;title:string;description:string;children:any}){
  if(unavailable)return <Card className="future-feature"><div className="future-icon"><Settings2/></div><span className="badge warning">Frontend pronto · API pendente</span><h2>{title}</h2><p>{description}</p><div className="future-contract">Esta tela será habilitada automaticamente quando implementarmos os endpoints do backend na próxima etapa.</div></Card>;
  return <>{children}</>;
}