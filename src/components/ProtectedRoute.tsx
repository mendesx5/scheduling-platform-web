import { Navigate,Outlet } from 'react-router-dom'; import { useAuth } from '../contexts/AuthContext';
export function TenantProtected(){return useAuth().tenantToken?<Outlet/>:<Navigate to="/login" replace/>}
export function PlatformProtected(){return useAuth().platformToken?<Outlet/>:<Navigate to="/platform/login" replace/>}
