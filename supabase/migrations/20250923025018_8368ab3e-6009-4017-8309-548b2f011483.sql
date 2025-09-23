-- Add WhatsApp integration fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_messages JSONB DEFAULT '{"welcome": "Olá! Seu agendamento foi confirmado.", "reminder": "Lembrete: você tem um agendamento amanhã."}'::jsonb;

-- Add booking types and dynamic pricing
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_type TEXT DEFAULT 'consulta';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS dynamic_price_cents INTEGER;

-- Add revenue tracking
CREATE TABLE IF NOT EXISTS public.revenues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  method TEXT NOT NULL, -- 'pix', 'card', 'cash'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on revenues table
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

-- Create policies for revenues
CREATE POLICY "Users can view their own revenues" 
ON public.revenues 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenues" 
ON public.revenues 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add notification status tracking
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  type TEXT NOT NULL, -- 'whatsapp', 'email', 'sms'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update subscriptions to handle plan limits
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS booking_limit INTEGER;

-- Update triggers for updated_at
CREATE TRIGGER update_revenues_updated_at
BEFORE UPDATE ON public.revenues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();