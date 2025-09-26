-- Update the function to fix security warning by setting proper search path
CREATE OR REPLACE FUNCTION public.notify_whatsapp_new_booking()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Make an HTTP request to the WhatsApp webhook edge function
  PERFORM
    net.http_post(
      url := 'https://xeglrbkhionhsutfiken.supabase.co/functions/v1/whatsapp-webhook',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'bookingId', NEW.id,
        'action', 'novo_agendamento'
      )
    );
  
  RETURN NEW;
END;
$$;