export type UserRole = 'admin' | 'propietario' | 'arrendatario';
export type VehicleType = 'auto' | 'moto' | 'camioneta' | 'colectivo';
export type VehicleStatus = 'disponible' | 'alquilado' | 'mantenimiento' | 'verificacion';
export type ReservationStatus = 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada' | 'disputa';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

export interface Vehicle {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vehicle_type: VehicleType;
  daily_price: number;
  city: string;
  address: string;
  status: VehicleStatus;
  is_verified: boolean;
}

export interface Reservation {
  id: string;
  vehicle_id: string;
  owner_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vehicle_type: VehicleType;
  color: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  mileage: number;
  daily_price: number;
  city: string;
  address: string;
  description: string;
  features: string[];
}
