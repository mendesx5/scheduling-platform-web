import {useEffect,useState} from 'react';
import {pageSettingsApi,tenantApi} from '../../api/services';
import type {PageGalleryImage,PageHighlight,PageSettings,Tenant} from '../../types';
import {Field} from '../../components/ui';
import {Check,ExternalLink,ImagePlus,LayoutTemplate,Plus,Save,Trash2,Upload} from 'lucide-react';
import './PageEditorPage.css';

const defaults:PageSettings={
  template:'MODERN',backgroundColor:'#fffdf8',surfaceColor:'#ffffff',textColor:'#172018',
  primaryColor:'#244b36',secondaryColor:'#dbe8c9',accentColor:'#d6a85f',
  heroTitle:'Seu próximo momento começa aqui.',heroSubtitle:'Escolha seu espaço, veja a disponibilidade e reserve online.',
  heroCtaText:'Reservar agora',aboutTitle:'Um espaço pensado para bons momentos.',
  inclusionsTitle:'O que você encontra aqui',galleryTitle:'Conheça cada detalhe',
  showAbout:true,showVenues:true,showInclusions:true,showGallery:true,showLocation:true
};
const templates=['MODERN','ELEGANT','NATURE'] as const;

export default function PageEditorPage(){
  const [settings,setSettings]=useState<PageSettings>(defaults);
  const [gallery,setGallery]=useState<PageGalleryImage[]>([]);
  const [highlights,setHighlights]=useState<PageHighlight[]>([]);
  const [tenant,setTenant]=useState<Tenant>();
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');

  useEffect(()=>{Promise.all([pageSettingsApi.get(),pageSettingsApi.gallery(),pageSettingsApi.highlights(),tenantApi.me()]).then(([s,g,h,t])=>{setSettings({...defaults,...s});setGallery(g);setHighlights(h);setTenant(t)}).catch((e:any)=>setError(e.message))},[]);
  const set=(key:keyof PageSettings,value:any)=>setSettings(p=>({...p,[key]:value}));

  async function save(){
    setSaving(true);setError('');setMessage('');
    try{
      await Promise.all([pageSettingsApi.save(settings),pageSettingsApi.saveGallery(gallery),pageSettingsApi.saveHighlights(highlights)]);
      setMessage('Página salva com sucesso.');
    }catch(e:any){setError(e.message||'Não foi possível salvar as alterações.')}finally{setSaving(false)}
  }
  async function upload(file:File,applyTo:'hero'|'about'|'gallery'){
    try{
      const {url}=await pageSettingsApi.uploadImage(file);
      if(applyTo==='hero')set('heroImageUrl',url);
      else if(applyTo==='about')set('aboutImageUrl',url);
      else setGallery(g=>[...g,{imageUrl:url,altText:'Foto do espaço',sortOrder:g.length}]);
    }catch(e:any){setError(e.message)}
  }
  const preview=tenant?`/${tenant.slug}`:'#';

  return <div className="page-editor">
    <div className="page-editor-head"><div><span>MINHA PÁGINA</span><h1>Crie a página do seu negócio</h1><p>Monte uma Landing Page completa sem precisar escrever código.</p></div><div className="editor-head-actions"><a href={preview} target="_blank" className="btn ghost"><ExternalLink size={17}/>Visualizar</a><button className="btn primary" onClick={save} disabled={saving}><Save size={17}/>{saving?'Salvando...':'Salvar página'}</button></div></div>
    {error&&<div className="alert danger">{error}</div>}{message&&<div className="alert success">{message}</div>}

    <section className="editor-card"><div className="editor-card-title"><LayoutTemplate/><div><h2>Template e identidade</h2><p>Escolha uma base visual e personalize completamente as cores.</p></div></div>
      <div className="template-grid">{templates.map(t=><button key={t} className={settings.template===t?'template-option active':'template-option'} onClick={()=>set('template',t)}><div className={`template-thumb ${t.toLowerCase()}`}/><strong>{t==='MODERN'?'Modern':t==='ELEGANT'?'Elegant':'Nature'}</strong><small>{t==='MODERN'?'Arenas e quadras':t==='ELEGANT'?'Eventos e premium':'Piscinas e lazer'}</small>{settings.template===t&&<Check/>}</button>)}</div>
      <div className="color-grid">{[
        ['backgroundColor','Fundo da página'],['surfaceColor','Cards e superfícies'],['textColor','Cor do texto'],
        ['primaryColor','Cor primária'],['secondaryColor','Cor secundária'],['accentColor','Cor de destaque']
      ].map(([key,label])=><label key={key} className="color-field"><span>{label}</span><input type="color" value={(settings as any)[key]||'#ffffff'} onChange={e=>set(key as keyof PageSettings,e.target.value)}/><code>{(settings as any)[key]}</code></label>)}</div>
    </section>

    <section className="editor-card"><div className="editor-card-title"><ImagePlus/><div><h2>Banner principal</h2><p>A primeira impressão da sua Landing Page.</p></div></div>
      <div className="editor-two-col"><div><Field label="Título principal"><input value={settings.heroTitle||''} onChange={e=>set('heroTitle',e.target.value)}/></Field><Field label="Subtítulo"><textarea value={settings.heroSubtitle||''} onChange={e=>set('heroSubtitle',e.target.value)}/></Field><Field label="Texto do botão"><input value={settings.heroCtaText||''} onChange={e=>set('heroCtaText',e.target.value)}/></Field></div><ImageControl url={settings.heroImageUrl} onUrl={v=>set('heroImageUrl',v)} onUpload={f=>upload(f,'hero')}/></div>
    </section>

    <section className="editor-card"><div className="editor-card-title"><LayoutTemplate/><div><h2>Sobre o seu espaço</h2><p>Conte a história e explique por que seu ambiente é especial.</p></div></div>
      <div className="editor-two-col"><div><Field label="Título"><input value={settings.aboutTitle||''} onChange={e=>set('aboutTitle',e.target.value)}/></Field><Field label="Texto"><textarea rows={7} value={settings.aboutText||''} onChange={e=>set('aboutText',e.target.value)}/></Field></div><ImageControl url={settings.aboutImageUrl} onUrl={v=>set('aboutImageUrl',v)} onUpload={f=>upload(f,'about')}/></div>
    </section>

    <section className="editor-card"><div className="editor-card-title"><Plus/><div><h2>O que vem incluso</h2><p>Crie os destaques que aparecerão como cards na página.</p></div></div>
      <div className="form-grid"><Field label="Título da seção"><input value={settings.inclusionsTitle||''} onChange={e=>set('inclusionsTitle',e.target.value)}/></Field><Field label="Subtítulo"><input value={settings.inclusionsSubtitle||''} onChange={e=>set('inclusionsSubtitle',e.target.value)}/></Field></div>
      <div className="repeat-list">{highlights.map((h,i)=><div className="repeat-row" key={i}><input placeholder="Ex.: Piscina e deck" value={h.title} onChange={e=>setHighlights(x=>x.map((v,n)=>n===i?{...v,title:e.target.value}:v))}/><input placeholder="Descrição" value={h.description||''} onChange={e=>setHighlights(x=>x.map((v,n)=>n===i?{...v,description:e.target.value}:v))}/><button onClick={()=>setHighlights(x=>x.filter((_,n)=>n!==i))}><Trash2/></button></div>)}</div>
      <button className="btn ghost" onClick={()=>setHighlights(x=>[...x,{title:'Novo item',description:'Descreva o que está incluso.',sortOrder:x.length}])}><Plus size={16}/>Adicionar item</button>
    </section>

    <section className="editor-card"><div className="editor-card-title"><ImagePlus/><div><h2>Galeria de fotos</h2><p>Adicione fotos por upload ou URL. A página monta automaticamente uma galeria elegante.</p></div></div>
      <div className="gallery-editor">{gallery.map((g,i)=><div className="gallery-edit-item" key={i}><img src={g.imageUrl}/><div><input value={g.imageUrl} placeholder="URL da imagem" onChange={e=>setGallery(x=>x.map((v,n)=>n===i?{...v,imageUrl:e.target.value}:v))}/><input value={g.altText||''} placeholder="Descrição da foto" onChange={e=>setGallery(x=>x.map((v,n)=>n===i?{...v,altText:e.target.value}:v))}/></div><button onClick={()=>setGallery(x=>x.filter((_,n)=>n!==i))}><Trash2/></button></div>)}</div>
      <div className="upload-row"><label className="btn ghost"><Upload size={16}/>Enviar foto<input hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],'gallery')}/></label><button className="btn ghost" onClick={()=>setGallery(x=>[...x,{imageUrl:'',altText:'Foto do espaço',sortOrder:x.length}])}><Plus size={16}/>Adicionar URL</button></div>
    </section>

    <section className="editor-card"><div className="editor-card-title"><Check/><div><h2>Seções visíveis</h2><p>Ative apenas o que faz sentido para seu negócio.</p></div></div>
      <div className="toggle-grid">{[
        ['showAbout','Sobre o espaço'],['showVenues','Nossos espaços'],['showInclusions','O que está incluso'],['showGallery','Galeria'],['showLocation','Localização']
      ].map(([key,label])=><label className="section-toggle" key={key}><input type="checkbox" checked={Boolean((settings as any)[key])} onChange={e=>set(key as keyof PageSettings,e.target.checked)}/><span>{label}</span></label>)}</div>
    </section>
  </div>
}
function ImageControl({url,onUrl,onUpload}:{url?:string;onUrl:(v:string)=>void;onUpload:(f:File)=>void}){return <div className="image-control">{url?<img src={url}/>:<div className="image-placeholder"><ImagePlus/></div>}<input placeholder="Cole a URL da imagem" value={url||''} onChange={e=>onUrl(e.target.value)}/><label className="btn ghost"><Upload size={16}/>Enviar imagem<input hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&onUpload(e.target.files[0])}/></label></div>}
