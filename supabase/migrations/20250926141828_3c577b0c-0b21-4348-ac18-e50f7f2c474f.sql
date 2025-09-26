-- Create a function that triggers WhatsApp notifications for new bookings
CREATE OR REPLACE FUNCTION notify_whatsapp_new_booking()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically send WhatsApp notifications when bookings are created
CREATE TRIGGER trigger_whatsapp_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_whatsapp_new_booking();