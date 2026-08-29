export type Role = 'OWNER'|'MANAGER'|'EMPLOYEE';
export type BookingStatus = 'PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED';
export type PaymentStatus = 'PENDING'|'PAID'|'REFUNDED';
export type TenantStatus = 'ACTIVE'|'SUSPENDED';
export type Plan = 'STARTER'|'PRO'|'BUSINESS';
export type SubscriptionStatus = 'ACTIVE'|'TRIAL'|'PAST_DUE'|'CANCELLED'|'EXPIRED';
export interface Tenant { id:number; name:string; slug:string; logoUrl?:string; coverUrl?:string; primaryColor?:string; phone?:string; instagram?:string; address?:string; status:TenantStatus; plan:Plan; createdAt?:string }
export interface User { id:number; tenantId:number; name:string; email:string; role:Role }
export interface Venue { id:number; tenantId:number; name:string; description?:string; type:string; price:number; durationMinutes:number; active:boolean }
export interface Availability { id:number; tenantId:number; venueId:number; dayOfWeek:string; startTime:string; endTime:string }
export interface BlockedPeriod { id:number; tenantId:number; venueId:number; startDateTime:string; endDateTime:string; reason?:string }
export interface Customer { id:number; tenantId:number; name:string; phone:string; email?:string }
export interface Booking { id:number; tenantId:number; venueId:number; customerId:number; startDateTime:string; endDateTime:string; status:BookingStatus; totalAmount:number; paymentStatus:PaymentStatus; createdAt?:string }
export interface Subscription { id?:number; tenantId?:number; plan:Plan; status:SubscriptionStatus; startDate:string; endDate?:string|null }
export interface PlatformMetrics { tenants:number; activeTenants:number; subscriptions:number; bookings:number; grossBookingValue:number }
