-- Add payment fields to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_reference UUID,
  ADD COLUMN IF NOT EXISTS marz_transaction_uuid VARCHAR(100);

-- payment_status and payment_method already exist, but ensure correct values
-- Update payment_status check constraint to include marz statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'PROCESSING', 'SANDBOX'));

-- Index for webhook lookups by reference
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_marz_uuid ON orders(marz_transaction_uuid);

-- Verify
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'orders' ORDER BY ordinal_position;
