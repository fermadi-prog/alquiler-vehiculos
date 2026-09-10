CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'propietario', 'arrendatario')),
  phone TEXT,
  avatar_url TEXT,
  cedula_number TEXT UNIQUE,
  cedula_verified BOOLEAN DEFAULT FALSE,
  birth_date DATE,
  country TEXT DEFAULT 'Paraguay',
  city TEXT,
  address TEXT,
  postal_code TEXT,
  bank_account_owner TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  total_trips INT DEFAULT 0,
  average_rating DECIMAL(3,2),
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_is_active ON public.users(is_active);
CREATE INDEX idx_users_cedula ON public.users(cedula_number);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can update any user" ON public.users FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  license_plate TEXT UNIQUE NOT NULL,
  vin TEXT UNIQUE,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('auto', 'moto', 'camioneta', 'colectivo')),
  color TEXT,
  fuel_type TEXT DEFAULT 'gasolina',
  transmission TEXT DEFAULT 'manual',
  seats INT DEFAULT 5,
  mileage INT DEFAULT 0,
  daily_price INT NOT NULL,
  hourly_price INT,
  weekly_price INT,
  monthly_price INT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  title_url TEXT,
  insurance_policy_url TEXT,
  insurance_expires TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'alquilado', 'mantenimiento', 'verificacion')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  description TEXT,
  features TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_price CHECK (daily_price > 0)
);

CREATE INDEX idx_vehicles_owner ON public.vehicles(owner_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_type ON public.vehicles(vehicle_type);
CREATE INDEX idx_vehicles_city ON public.vehicles(city);
CREATE INDEX idx_vehicles_verified ON public.vehicles(is_verified);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified vehicles" ON public.vehicles FOR SELECT USING (is_verified = TRUE OR auth.uid() = owner_id);
CREATE POLICY "Owners can view own vehicles" ON public.vehicles FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert own vehicles" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own vehicles" ON public.vehicles FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete own vehicles" ON public.vehicles FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Admin can do anything with vehicles" ON public.vehicles FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id),
  renter_id UUID NOT NULL REFERENCES public.users(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  daily_price INT NOT NULL,
  num_days INT NOT NULL,
  base_price INT NOT NULL,
  insurance_cost INT DEFAULT 100000,
  platform_fee INT NOT NULL,
  total_cost INT NOT NULL,
  guarantee_deposit INT DEFAULT 500000,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada', 'disputa')),
  all_documents_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_reservations_vehicle ON public.reservations(vehicle_id);
CREATE INDEX idx_reservations_owner ON public.reservations(owner_id);
CREATE INDEX idx_reservations_renter ON public.reservations(renter_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Renters can view own reservations" ON public.reservations FOR SELECT USING (auth.uid() = renter_id);
CREATE POLICY "Owners can view own reservations" ON public.reservations FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all reservations" ON public.reservations FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Renters can create reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Owners can update own reservations status" ON public.reservations FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can update any reservation" ON public.reservations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
