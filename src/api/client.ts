const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export class ApiError extends Error { constructor(public status:number, message:string){super(message)} }
export async function api<T>(path:string, init:RequestInit = {}, platform=false):Promise<T>{
  const token = localStorage.getItem(platform?'platform_token':'tenant_token');
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type') && init.body) headers.set('Content-Type','application/json');
  if (token) headers.set('Authorization',`Bearer ${token}`);
  const res = await fetch(`${API_URL}${path}`, {...init, headers});
  if (res.status===204) return undefined as T;
  if (!res.ok){
    let msg='Erro ao processar solicitação';
    const txt = await res.text();
    if (txt) {
      try { const body = JSON.parse(txt); msg = body.message || body.error || msg; }
      catch { msg = txt; }
    }
    throw new ApiError(res.status,msg);
  }
  return res.json();
}