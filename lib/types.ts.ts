// lib/types.ts
// Tipos TypeScript para toda la plataforma

export type UserRole = 'admin' | 'propietario' | 'arrendatario';

export type VehicleType = 'auto' | 'moto' | 'camioneta' | 'colectivo';

export type VehicleStatus = 'disponible' | 'alquilado' | 'mantenimiento' | 'verificacion';

export type ReservationStatus = 
  | 'pendiente' 
  | 'confirmada' 
  | 'en_curso' 
  | 'completada' 
  | 'cancelada' 
  | 'disputa';

export type DocumentType = 'cedula_anverso' | 'cedula_reverso' | 'licencia' | 'comprobante_domicilio';

export type TransactionType = 
  | 'alquiler_pago' 
  | 'comisión_plataforma' 
  | 'reembolso_deposito' 
  | 'reembolso_comisión';

// ==========================================
// USUARIOS
// ==========================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  cedula_number: string | null;
  cedula_verified: boolean;
  birth_date: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  bank_account_owner: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  total_trips: number;
  average_rating: number | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface UserStats {
  id: string;
  full_name: string | null;
  role: UserRole;
  total_vehicles: number;
  total_rentals: number;
  total_owned_rentals: number;
  average_rating: number | null;
  total_trips: number;
  created_at: string;
}

// ==========================================
// VEHÍCULOS
// ==========================================

export interface Vehicle {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string | null;
  vehicle_type: VehicleType;
  color: string | null;
  fuel_type: string;
  transmission: string;
  seats: number;
  mileage: number;
  daily_price: number;
  hourly_price: number | null;
  weekly_price: number | null;
  monthly_price: number | null;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  title_url: string | null;
  insurance_policy_url: string | null;
  insurance_expires: string | null;
  status: VehicleStatus;
  is_verified: boolean;
  verification_date: string | null;
  description: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleWithImages extends Vehicle {
  images: VehicleImage[];
  owner: User;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  uploaded_at: string;
}

// ==========================================
// DOCUMENTOS
// ==========================================

export interface Document {
  id: string;
  user_id: string;
  doc_type: DocumentType;
  document_url: string;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// RESERVACIONES
// ==========================================

export interface Reservation {
  id: string;
  vehicle_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  daily_price: number;
  num_days: number;
  base_price: number;
  insurance_cost: number;
  platform_fee: number;
  total_cost: number;
  guarantee_deposit: number;
  status: ReservationStatus;
  all_documents_verified: boolean;
  verified_at: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface ReservationWithDetails extends Reservation {
  vehicle_name: string;
  vehicle_type: VehicleType;
  renter_name: string;
  owner_name: string;
}

// ==========================================
// CALIFICACIONES
// ==========================================

export interface Rating {
  id: string;
  reservation_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number; // 1-5
  comment: string | null;
  cleanliness: number | null;
  communication: number | null;
  accuracy: number | null;
  created_at: string;
}

// ==========================================
// TRANSACCIONES
// ==========================================

export interface Transaction {
  id: string;
  reservation_id: string | null;
  from_user_id: string;
  to_user_id: string;
  transaction_type: TransactionType;
  amount: number;
  status: 'pendiente' | 'completado' | 'fallido';
  description: string | null;
  created_at: string;
  completed_at: string | null;
}

// ==========================================
// ESTADOS DE SESIÓN
// ==========================================

export interface AuthSession {
  user: User | null;
  session: any; // Sesión de Supabase
  loading: boolean;
}

// ==========================================
// FORMULARIOS
// ==========================================

export interface RegisterFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  full_name: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string;
  vehicle_type: VehicleType;
  color?: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  mileage: number;
  daily_price: number;
  city: string;
  address: string;
  description?: string;
  features: string[];
}

export interface ReservationFormData {
  vehicle_id: string;
  start_date: string;
  end_date: string;
  notes?: string;
}

export interface RatingFormData {
  reservation_id: string;
  rating: number;
  comment?: string;
  cleanliness?: number;
  communication?: number;
  accuracy?: number;
}

// ==========================================
// RESPUESTAS DE API
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================

export interface VehicleSearchFilters {
  vehicle_type?: VehicleType;
  city?: string;
  min_price?: number;
  max_price?: number;
  start_date?: string;
  end_date?: string;
  search?: string; // Para búsqueda en marca/modelo
}

export interface ReservationFilters {
  status?: ReservationStatus;
  start_date?: string;
  end_date?: string;
  owner_id?: string;
  renter_id?: string;
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export interface AdminDashboardStats {
  total_users: number;
  total_vehicles: number;
  total_reservations: number;
  total_commission: number;
  active_users_today: number;
  pending_verifications: number;
  revenue_this_month: number;
  revenue_this_year: number;
}

export interface OwnerDashboardStats {
  total_vehicles: number;
  active_listings: number;
  total_rentals: number;
  earnings_this_month: number;
  earnings_total: number;
  upcoming_rentals: Reservation[];
  rating: number;
}

export interface RenterDashboardStats {
  total_rentals: number;
  upcoming_rentals: Reservation[];
  completed_rentals: Reservation[];
  average_rating: number;
  documents_verified: boolean;
}
