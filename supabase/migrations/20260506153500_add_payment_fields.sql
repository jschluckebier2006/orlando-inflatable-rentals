-- Add 'awaiting_payment' to the booking_status enum
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'awaiting_payment' BEFORE 'pending';
