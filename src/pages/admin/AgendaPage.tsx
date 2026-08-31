import {useEffect,useMemo,useState} from 'react';
import {bookingsApi,venuesApi} from '../../api/services';
import type {Booking,Venue} from '../../types';
import {Badge,Card,dateTime,Empty} from '../../components/ui';
import {ChevronLeft,ChevronRight} from 'lucide-react';

const tone=(s:string)=>s==='CONFIRMED'||s==='COMPLETED'?'success':s==='PENDING'?'warning':s==='CANCELLED'?'danger':'neutral';
const iso=(d:Date)=>d.toISOString().slice(0,10);
export default function AgendaPage(){
  const [bookings,setBookings]=useState<Booking[]>([]); const [venues,setVenues]=useState<Venue[]>([]); const [venue,setVenue]=useState('ALL'); const [cursor,setCursor]=useState(new Date());
  useEffect(()=>{Promise.all([bookingsApi.list(),venuesApi.list()]).then(([b,v])=>{setBookings(b);setVenues(v)})},[]);
  const days=useMemo(()=>{const start=new Date(cursor); start.setDate(cursor.getDate()-cursor.getDay()); return Array.from({length:7},(_,i)=>{const d=new Date(start); d.setDate(start.getDate()+i); return d})},[cursor]);
  const filtered=bookings.filter(b=>b.status!=='CANCELLED'&&(venue==='ALL'||String(b.venueId)===venue));
  return <><div className="page-head"><div><h1>Agenda</h1><p>Veja todas as reservas da semana por espaço.</p></div><select value={venue} onChange={e=>setVenue(e.target.value)}><option value="ALL">Todos os espaços</option>{venues.map(v=><option value={v.id} key={v.id}>{v.name}</option>)}</select></div>
  <Card><div className="calendar-toolbar"><button className="icon" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth(),cursor.getDate()-7))}><ChevronLeft/></button><strong>{days[0].toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})} — {days[6].toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}</strong><button className="icon" onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth(),cursor.getDate()+7))}><ChevronRight/></button></div>
  <div className="week-grid">{days.map(d=>{const items=filtered.filter(b=>iso(new Date(b.startDateTime))===iso(d)).sort((a,b)=>+new Date(a.startDateTime)-+new Date(b.startDateTime));return <section className="day-column" key={iso(d)}><header><b>{d.toLocaleDateString('pt-BR',{weekday:'short'})}</b><span>{d.getDate()}</span></header><div>{items.length?items.map(b=><article className="calendar-event" key={b.id}><strong>{new Date(b.startDateTime).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</strong><small>{venues.find(v=>v.id===b.venueId)?.name||`Espaço #${b.venueId}`}</small><Badge tone={tone(b.status) as any}>{b.status}</Badge></article>):<span className="day-empty">Livre</span>}</div></section>})}</div></Card>
  <div className="mobile-agenda"><Card>{filtered.length?<div className="stack">{filtered.filter(b=>new Date(b.startDateTime)>=days[0]&&new Date(b.startDateTime)<=new Date(days[6].getTime()+86400000)).sort((a,b)=>+new Date(a.startDateTime)-+new Date(b.startDateTime)).map(b=><div className="row-item" key={b.id}><span><strong>{venues.find(v=>v.id===b.venueId)?.name||`#${b.venueId}`}</strong><small>{dateTime(b.startDateTime)}</small></span><Badge tone={tone(b.status) as any}>{b.status}</Badge></div>)}</div>:<Empty title="Semana livre" description="Nenhuma reserva para os filtros selecionados."/>}</Card></div></>}
