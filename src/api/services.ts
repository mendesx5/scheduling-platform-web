import { api } from './client';
import type * as T from '../types';

export const authApi={
  login:(data:{email:string;password:string})=>api<{token:string;type:string}>('/auth/login',{method:'POST',body:JSON.stringify(data)}),
  register:(data:any)=>api<{tenantId:number;checkoutId:string;checkoutUrl:string;plan:string}>('/tenants/register',{method:'POST',body:JSON.stringify(data)}),
  platformLogin:(data:{email:string;password:string})=>api<{token:string;type:string}>('/platform/auth/login',{method:'POST',body:JSON.stringify(data)})
};
export const planApi={ current:()=>api<{plan:T.Plan;limits:{maxVenues:number;maxUsers:number;maxAddons:number;maxPackages:number;maxGalleryImages:number};features:{advancedPricing:boolean;removeBranding:boolean;employeeRole:boolean}}>('/plan') };
export const tenantApi={ me:()=>api<T.Tenant>('/tenants/me'), update:(data:Partial<T.Tenant>)=>api<T.Tenant>('/tenants/me',{method:'PUT',body:JSON.stringify(data)}) };
export const usersApi={ list:()=>api<T.User[]>('/users'), create:(data:{name:string;email:string;password:string;role:T.Role})=>api<T.User>('/users',{method:'POST',body:JSON.stringify(data)}) };
export const venuesApi={ list:()=>api<T.Venue[]>('/venues'), get:(id:number)=>api<T.Venue>(`/venues/${id}`), create:(data:Partial<T.Venue>)=>api<T.Venue>('/venues',{method:'POST',body:JSON.stringify(data)}), update:(id:number,data:Partial<T.Venue>)=>api<T.Venue>(`/venues/${id}`,{method:'PUT',body:JSON.stringify(data)}), remove:(id:number)=>api<void>(`/venues/${id}`,{method:'DELETE'}) };
export const availabilityApi={ list:(venueId:number)=>api<T.Availability[]>(`/venues/${venueId}/availabilities`), create:(venueId:number,data:Partial<T.Availability>)=>api<T.Availability>(`/venues/${venueId}/availabilities`,{method:'POST',body:JSON.stringify(data)}), remove:(venueId:number,id:number)=>api<void>(`/venues/${venueId}/availabilities/${id}`,{method:'DELETE'}) };
export const blockedApi={ list:(venueId:number)=>api<T.BlockedPeriod[]>(`/venues/${venueId}/blocked-periods`), create:(venueId:number,data:Partial<T.BlockedPeriod>)=>api<T.BlockedPeriod>(`/venues/${venueId}/blocked-periods`,{method:'POST',body:JSON.stringify(data)}), remove:(venueId:number,id:number)=>api<void>(`/venues/${venueId}/blocked-periods/${id}`,{method:'DELETE'}) };
export const bookingsApi={ list:()=>api<T.Booking[]>('/bookings'), update:(id:number,data:{status?:T.BookingStatus;paymentStatus?:T.PaymentStatus})=>api<T.Booking>(`/bookings/${id}`,{method:'PATCH',body:JSON.stringify(data)}) };
export const customersApi={ list:()=>api<T.Customer[]>('/customers') };
export const subscriptionApi={ me:()=>api<T.Subscription>('/subscription'), cancel:()=>api<void>('/billing/cancel',{method:'POST'}) };
export const billingApi={ checkoutStatus:(checkoutId:string)=>api<{status:T.SubscriptionStatus;plan:T.Plan}>(`/billing/checkouts/${encodeURIComponent(checkoutId)}`) };
export const pageSettingsApi={
  get:()=>api<T.PageSettings>('/page-settings'),
  save:(data:Partial<T.PageSettings>)=>api<T.PageSettings>('/page-settings',{method:'PUT',body:JSON.stringify(data)}),
  gallery:()=>api<T.PageGalleryImage[]>('/page-settings/gallery'),
  saveGallery:(items:T.PageGalleryImage[])=>api<T.PageGalleryImage[]>('/page-settings/gallery',{method:'PUT',body:JSON.stringify(items)}),
  highlights:()=>api<T.PageHighlight[]>('/page-settings/highlights'),
  saveHighlights:(items:T.PageHighlight[])=>api<T.PageHighlight[]>('/page-settings/highlights',{method:'PUT',body:JSON.stringify(items)}),
  uploadImage:(file:File)=>{const form=new FormData();form.append('file',file);return api<{url:string}>('/page-settings/images',{method:'POST',body:form})}
};
export const calendarApi={ month:(start:string,end:string)=>api<T.Booking[]>(`/bookings/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`) };

/** Endpoints below are frontend contracts for the next API evolution. */
export const packagesApi={ list:(venueId:number)=>api<T.VenuePackage[]>(`/venues/${venueId}/packages`), create:(venueId:number,data:Partial<T.VenuePackage>)=>api<T.VenuePackage>(`/venues/${venueId}/packages`,{method:'POST',body:JSON.stringify(data)}), remove:(venueId:number,id:number)=>api<void>(`/venues/${venueId}/packages/${id}`,{method:'DELETE'}) };
export const addonsApi={ list:(venueId:number)=>api<T.Addon[]>(`/venues/${venueId}/addons`), create:(venueId:number,data:Partial<T.Addon>)=>api<T.Addon>(`/venues/${venueId}/addons`,{method:'POST',body:JSON.stringify(data)}), remove:(venueId:number,id:number)=>api<void>(`/venues/${venueId}/addons/${id}`,{method:'DELETE'}) };
export const policiesApi={ get:(venueId:number)=>api<T.VenueBookingPolicy>(`/venues/${venueId}/policy`), save:(venueId:number,data:Partial<T.VenueBookingPolicy>)=>api<T.VenueBookingPolicy>(`/venues/${venueId}/policy`,{method:'PUT',body:JSON.stringify(data)}) };

export const publicApi={
  tenant:(slug:string)=>api<T.Tenant>(`/public/${slug}`),
  settings:(slug:string)=>api<any>(`/public/${slug}/settings`),
  page:(slug:string)=>api<T.PublicPageData>(`/public/${slug}/page`),
  venues:(slug:string)=>api<T.Venue[]>(`/public/${slug}/venues`),
  slots:(slug:string,venueId:number,date:string,params?:Record<string,string|number>)=>{const q=new URLSearchParams({date,...Object.fromEntries(Object.entries(params||{}).map(([k,v])=>[k,String(v)]))});return api<string[]>(`/public/${slug}/venues/${venueId}/slots?${q}`)},
  packages:(slug:string,venueId:number)=>api<T.VenuePackage[]>(`/public/${slug}/venues/${venueId}/packages`),
  addons:(slug:string,venueId:number)=>api<T.Addon[]>(`/public/${slug}/venues/${venueId}/addons`),
  quote:(slug:string,data:any)=>api<{baseAmount:number;addonsAmount:number;totalAmount:number;startDateTime:string;endDateTime:string}>(`/public/${slug}/quote`,{method:'POST',body:JSON.stringify(data)}),
  book:(slug:string,data:any)=>api<T.Booking>(`/public/${slug}/bookings`,{method:'POST',body:JSON.stringify(data)})
};
export const platformApi={ metrics:()=>api<T.PlatformMetrics>('/platform/admin/metrics',{},true), tenants:()=>api<T.Tenant[]>('/platform/admin/tenants',{},true), suspension:(id:number,suspended:boolean)=>api<T.Tenant>(`/platform/admin/tenants/${id}/suspension?suspended=${suspended}`,{method:'PATCH'},true), subscription:(id:number,data:T.Subscription)=>api<T.Subscription>(`/platform/admin/tenants/${id}/subscription`,{method:'PUT',body:JSON.stringify(data)},true) };