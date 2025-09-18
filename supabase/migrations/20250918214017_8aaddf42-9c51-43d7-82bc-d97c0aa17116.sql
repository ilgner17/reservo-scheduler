-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  profession TEXT,
  bio TEXT,
  phone TEXT,
  pix_key TEXT,
  slug TEXT UNIQUE,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  working_hours JSONB DEFAULT '{"monday":{"start":"09:00","end":"18:00","enabled":true},"tuesday":{"start":"09:00","end":"18:00","enabled":true},"wednesday":{"start":"09:00","end":"18:00","enabled":true},"thursday":{"start":"09:00","end":"18:00","enabled":true},"friday":{"start":"09:00","end":"18:00","enabled":true},"saturday":{"start":"09:00","end":"12:00","enabled":false},"sunday":{"start":"09:00","end":"12:00","enabled":false}}',
  settings JSONB DEFAULT '{"booking_advance_days":30,"min_notice_hours":2,"auto_confirm":true}',
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'professional', 'premium')),
  monthly_bookings_limit INTEGER DEFAULT 5,
  monthly_bookings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('stripe', 'pix')),
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  provider_id TEXT,
  proof_url TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public profiles are viewable by slug" ON public.profiles FOR SELECT USING (slug IS NOT NULL);

-- Services policies
CREATE POLICY "Users can manage their own services" ON public.services FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Services are viewable for booking" ON public.services FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Professionals can view their bookings" ON public.bookings FOR SELECT USING (auth.uid() = professional_id);
CREATE POLICY "Professionals can manage their bookings" ON public.bookings FOR ALL USING (auth.uid() = professional_id);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Payments policies
CREATE POLICY "Users can view payments for their bookings" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = payments.booking_id AND bookings.professional_id = auth.uid())
);
CREATE POLICY "Anyone can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update payments for their bookings" ON public.payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = payments.booking_id AND bookings.professional_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, profession)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'profession', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_slug ON public.profiles(slug);
CREATE INDEX idx_services_user_id ON public.services(user_id);
CREATE INDEX idx_bookings_professional_id ON public.bookings(professional_id);
CREATE INDEX idx_bookings_start_at ON public.bookings(start_at);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);

-- Insert default service for new users
CREATE OR REPLACE FUNCTION public.create_default_service()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.services (user_id, name, description, duration_minutes, price_cents)
  VALUES (
    NEW.user_id,
    'Consulta',
    'Consulta padrão',
    60,
    5000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for default service creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_service();