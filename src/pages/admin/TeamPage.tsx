import {useEffect,useState} from 'react';
import {subscriptionApi,usersApi} from '../../api/services';
import type {Role,Subscription,User} from '../../types';
import {Card,Field,Empty,Badge} from '../../components/ui';
import {useAuth} from '../../contexts/AuthContext';
import {planDefinition} from '../../config/plans';
import {Users} from 'lucide-react';

export default function TeamPage(){
  const [items,setItems]=useState<User[]>([]);
  const [sub,setSub]=useState<Subscription>();
  const [form,setForm]=useState<{name:string;email:string;password:string;role:Role}>({name:'',email:'',password:'',role:'EMPLOYEE'});
  const [error,setError]=useState('');
  const {claims}=useAuth();
  const load=()=>Promise.all([usersApi.list(),subscriptionApi.me()]).then(([u,s])=>{setItems(u);setSub(s)}).catch(()=>setItems([]));
  useEffect(()=>{load()},[]);
  const isOwner=claims?.role==='OWNER';
  const plan=planDefinition(sub?.plan);
  const atLimit=items.length>=plan.maxUsers;

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(atLimit)return;
    setError('');
    try{
      await usersApi.create(form);
      setForm({name:'',email:'',password:'',role:'EMPLOYEE'});
      load();
    }catch(e:any){setError(e.message)}
  };

  return <>
    <div className="page-head"><div><h1>Equipe</h1><p>Gerencie quem pode acessar o painel.</p></div></div>
    <Card className="plan-usage">
      <div><span>Usuários do plano {plan.label}</span><strong>{items.length} de {plan.maxUsers} utilizados</strong></div>
      <div className="usage-track"><span style={{width:`${Math.min(100,(items.length/plan.maxUsers)*100)}%`}}/></div>
    </Card>
    <div className="split">
      <Card className={atLimit?'disabled-section':''}>
        <h2>Novo usuário</h2>
        {atLimit&&<div className="alert warning">Seu plano chegou ao limite de usuários. O backend aplicará esta regra na próxima etapa.</div>}
        <form onSubmit={submit}>
          <Field label="Nome"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
          <Field label="E-mail"><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
          <Field label="Senha"><input required minLength={8} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></Field>
          <Field label="Permissão"><select value={form.role} onChange={e=>setForm({...form,role:e.target.value as Role})}><option value="EMPLOYEE">Funcionário</option>{isOwner&&<><option value="MANAGER">Gerente</option><option value="OWNER">Proprietário</option></>}</select></Field>
          {error&&<div className="alert danger">{error}</div>}
          <button disabled={atLimit} className="btn primary full">Adicionar usuário</button>
        </form>
      </Card>
      <Card>
        <h2>Usuários</h2>
        {!items.length?<Empty title="Sem usuários visíveis" description="Sua permissão pode não permitir listar a equipe."/>:<div className="stack">{items.map(u=><div className="row-item team-row" key={u.id}><div className="avatar"><Users/></div><span><strong>{u.name}</strong><small>{u.email}</small></span><Badge tone={u.role==='OWNER'?'success':'neutral'}>{u.role}</Badge></div>)}</div>}
      </Card>
    </div>
  </>;
}
