import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {billingApi} from '../../api/services';

export default function BillingResultPage(){
  const checkoutId=localStorage.getItem('pending_checkout_id');
  const [status,setStatus]=useState<string>('PAYMENT_PENDING');
  const [error,setError]=useState('');

  useEffect(()=>{
    if(!checkoutId) return;
    let cancelled=false;
    let timer:number|undefined;
    const poll=async()=>{
      try{
        const result=await billingApi.checkoutStatus(checkoutId);
        if(cancelled) return;
        setStatus(result.status);
        if(result.status==='ACTIVE'){
          localStorage.removeItem('pending_checkout_id');
          localStorage.setItem('needs_onboarding','true');
        } else timer=window.setTimeout(poll,3000);
      }catch(e:any){setError(e.message);}
    };
    poll();
    return()=>{cancelled=true;if(timer) window.clearTimeout(timer)};
  },[checkoutId]);

  const active=status==='ACTIVE';
  const ended=status==='CANCELLED' || status==='EXPIRED';
  return <div className="auth-page"><div className="auth-card">
    <div className="lp-brand">Agenda<span>Hub</span></div>
    {!checkoutId ? <><h1>Pagamento</h1><p>Não encontramos um checkout pendente neste navegador.</p><Link className="btn primary full" to="/register">Escolher um plano</Link></> : active ? <>
      <h1>Assinatura ativada 🎉</h1><p>Pagamento confirmado. Sua conta está liberada.</p><Link className="btn primary full" to="/login">Entrar no sistema</Link>
    </> : ended ? <><h1>Checkout encerrado</h1><p>O pagamento não foi concluído. Você pode iniciar uma nova contratação.</p><Link className="btn primary full" to="/register">Escolher um plano</Link></> : <>
      <h1>Aguardando confirmação</h1><p>Seu pagamento está sendo processado. Esta página verifica automaticamente a confirmação.</p><div className="alert">Assim que o Asaas confirmar o pagamento, seu acesso será liberado.</div>
    </>}
    {error&&<p className="muted">{error}</p>}
  </div></div>
}
