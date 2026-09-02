export type Role = 'OWNER'|'MANAGER'|'EMPLOYEE';
export type BookingStatus = 'PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED';
export type PaymentStatus = 'PENDING'|'PAID'|'REFUNDED';
export type TenantStatus = 'ACTIVE'|'SUSPENDED'|'PENDING_PAYMENT';
export type Plan = 'STARTER'|'PRO'|'BUSINESS';
export type SubscriptionStatus = 'ACTIVE'|'TRIAL'|'PAYMENT_PENDING'|'PAST_DUE'|'CANCELLED'|'EXPIRED'|'SUSPENDED';
export type PricingType = 'FIXED_SLOT'|'HOURLY'|'DAILY'|'PACKAGE';
export type AddonPricingType = 'FIXED'|'PER_HOUR'|'PER_UNIT';

export interface Tenant {
  id:number; name:string; slug:string; logoUrl?:string; coverUrl?:string;
  primaryColor?:string; phone?:string; instagram?:string; address?:string; timezone?:string; dateFormat?:string; timeFormat?:string; weekStartsOn?:string; notifyNewBooking?:boolean; notifyCancellation?:boolean; notifyBookingReminder?:boolean; notifyEmail?:boolean; notifyWhatsapp?:boolean;
  status:TenantStatus; plan:Plan; createdAt?:string
}
export interface User { id:number; tenantId:number; name:string; email:string; username?:string; language?:'pt-BR'|'en-US'|'es-ES'; active:boolean; role:Role }

export interface Venue {
  id:number; tenantId:number; name:string; description?:string; type:string;
  price:number; durationMinutes:number; active:boolean; pricingType?:PricingType;
  basePrice?:number; slotDurationMinutes?:number; minimumDurationMinutes?:number;
  maximumDurationMinutes?:number; durationStepMinutes?:number; dailyPrice?:number;
  minimumDays?:number; maximumDays?:number; maxGuests?:number;
  requiresApproval?:boolean; requiresPayment?:boolean;
}
export interface VenuePackage { id:number; tenantId:number; venueId:number; name:string; description?:string; durationMinutes:number; price:number; active:boolean }
export interface Addon { id:number; tenantId:number; venueId:number; name:string; description?:string; pricingType:AddonPricingType; price:number; active:boolean }
export interface VenueBookingPolicy { id?:number; tenantId?:number; venueId:number; requiresApproval:boolean; minimumAdvanceMinutes:number; maximumAdvanceDays:number; cancellationAllowed:boolean; cancellationDeadlineHours:number }
export interface Availability { id:number; tenantId:number; venueId:number; dayOfWeek:string; startTime:string; endTime:string }
export interface BlockedPeriod { id:number; tenantId:number; venueId:number; startDateTime:string; endDateTime:string; reason?:string }
export interface Customer { id:number; tenantId:number; name:string; phone:string; email?:string }
export interface BookingAddon { id?:number; addonId:number; quantity:number; unitPrice?:number; totalPrice?:number; addonName?:string }
export interface Booking { id:number; tenantId:number; venueId:number; customerId:number; startDateTime:string; endDateTime:string; status:BookingStatus; totalAmount:number; paymentStatus:PaymentStatus; createdAt?:string; baseAmount?:number; addonsAmount?:number; discountAmount?:number; notes?:string; addons?:BookingAddon[] }
export interface Subscription { id?:number; tenantId?:number; plan:Plan; status:SubscriptionStatus; startDate?:string|null; endDate?:string|null; nextBillingDate?:string|null; lastBillingDate?:string|null; asaasCheckoutId?:string|null; billingCycle?:string; pendingPlan?:Plan|null; pendingBillingCycle?:string|null }
export interface PlatformMetrics { tenants:number; activeTenants:number; trialTenants:number; payingTenants:number; bookings:number; grossBookingValue:number; mrr:number; apiRequests30d:number }
export interface DashboardAnalytics {period:string;start:string;end:string;reservations:number;revenue:number;customers:number;activeVenues:number;occupationRate:number;points:{date:string;bookings:number;revenue:number;customers:number}[];previousReservations?:number;previousRevenue?:number}
export interface PlatformUsagePoint {date:string;requests:number;bookingsCreated:number;bookingsCancelled:number;activeUsers:number;customersCreated:number;revenue:number}
export interface PlatformAlert {tenantId:number;tenantName:string;type:string;message:string;recommendation:string}
export interface UserProfile {name:string;email:string;username?:string;language:string}

export interface PageSettings {
  id?:number;
  tenantId?:number;
  template?:'MODERN'|'ELEGANT'|'NATURE';
  backgroundColor?:string;
  surfaceColor?:string;
  textColor?:string;
  primaryColor?:string;
  secondaryColor?:string;
  accentColor?:string;
  heroTitle?:string;
  heroSubtitle?:string;
  heroImageUrl?:string;
  heroCtaText?:string;
  aboutTitle?:string;
  aboutText?:string;
  aboutImageUrl?:string;
  inclusionsTitle?:string;
  inclusionsSubtitle?:string;
  galleryTitle?:string;
  gallerySubtitle?:string;
  showAbout?:boolean;
  showVenues?:boolean;
  showInclusions?:boolean;
  showGallery?:boolean;
  showLocation?:boolean;
}
export interface PageGalleryImage { id?:number; imageUrl:string; altText?:string; sortOrder?:number }
export interface PageHighlight { id?:number; title:string; description?:string; icon?:string; sortOrder?:number }
export interface PublicPageData {
  tenant:Tenant;
  settings:PageSettings;
  gallery:PageGalleryImage[];
  highlights:PageHighlight[];
  venues:Venue[];
  brandingRemoved:boolean;
}
