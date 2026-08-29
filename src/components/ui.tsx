import type { ReactNode } from 'react';
export const Card=({children,className=''}:{children:ReactNode;className?:string})=><div className={`card ${className}`}>{children}</div>;
export const Empty=({title,description}:{title:string;description:string})=><div className="empty"><strong>{title}</strong><span>{description}</span></div>;
export const Badge=({children,tone='neutral'}:{children:ReactNode;tone?:'success'|'warning'|'danger'|'neutral'})=><span className={`badge ${tone}`}>{children}</span>;
export const Field=({label,children}:{label:string;children:ReactNode})=><label className="field"><span>{label}</span>{children}</label>;
export const money=(n:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n||0));
export const dateTime=(s:string)=>new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(s));
