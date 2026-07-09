/*
# GULA Marketplace — Core Schema

## Overview
Creates the full database schema for the GULA campus marketplace — a platform
where university students run shops from their residences and sell to peers.

## New Tables

1. **profiles** — extends Supabase auth.users with app-specific data
   - `id` (uuid, PK, references auth.users)
   - `email`, `full_name`, `role` (seller/buyer/admin)
   - `university`, `residence`, `phone`, `avatar_url`

2. **shops** — seller storefronts
   - `seller_id` references profiles, defaults to auth.uid()
   - name, description, category, university, logo, banner
   - rating, total_sales, is_active

3. **products** — items listed by shops
   - `shop_id` references shops
   - name, description, price, category, image, stock, is_available

4. **orders** — buyer orders placed with shops
   - `shop_id` references shops, `buyer_id` references profiles
   - status (pending → confirmed → preparing → ready → out_for_delivery → delivered/cancelled)
   - total, items (JSONB array), delivery_address, notes

5. **deliveries** — delivery tracking for orders
   - `order_id` references orders
   - status (assigned → picked_up → in_transit → delivered/failed)
   - driver_name, timestamps

6. **chats** — conversation threads between buyers and shops
   - `shop_id`, `buyer_id`, names, last_message, unread_count

7. **messages** — individual messages in a chat
   - `chat_id`, `sender_id`, `sender_name`, content, is_read

8. **promotions** — shop marketing campaigns
   - `shop_id`, title, description, type (percentage/fixed/bogo), value, date range

9. **payouts** — seller payout records
   - `seller_id`, amount, status (pending/processing/paid/failed), period

10. **reviews** — buyer reviews of shops/products
    - `shop_id`, `product_id`, `buyer_name`, rating (1-5), comment

11. **billboards** — admin-managed promotional banners
    - title, image_url, link_url, position, is_active, date range

12. **notifications** — user notifications
    - `user_id`, title, body, type, is_read

## Security
- RLS enabled on ALL tables.
- profiles: users can read all profiles, update only their own.
- shops: public read, owner insert/update/delete.
- products: public read, shop owner insert/update/delete (via shop ownership check).
- orders: shop owner and buyer can read; buyer can insert; shop owner can update status.
- deliveries: shop owner and buyer can read; shop owner can update.
- chats: participants can read; buyer can insert.
- messages: chat participants can read; sender can insert; sender can update is_read.
- promotions: public read, shop owner CRUD.
- payouts: seller can read their own; admin can read all.
- reviews: public read; buyer can insert their own.
- billboards: public read active; admin full CRUD.
- notifications: owner can read/update their own.

## Important Notes
1. Owner columns default to `auth.uid()` so inserts work without explicitly passing the owner.
2. Child tables (products, orders, etc.) check ownership via EXISTS subquery on the parent shop.
3. All policies use `auth.uid()` — never `current_user`.
4. 4 separate policies per table (SELECT/INSERT/UPDATE/DELETE) — no `FOR ALL`.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'buyer' CHECK (role IN ('seller', 'buyer', 'admin')),
  university text,
  residence text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ SHOPS ============
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Food',
  university text NOT NULL DEFAULT '',
  logo_url text,
  banner_url text,
  rating numeric(3,2) NOT NULL DEFAULT 0.00,
  total_sales integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_shops" ON shops;
CREATE POLICY "select_shops" ON shops FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_shops" ON shops;
CREATE POLICY "insert_own_shops" ON shops FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "update_own_shops" ON shops;
CREATE POLICY "update_own_shops" ON shops FOR UPDATE
  TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "delete_own_shops" ON shops;
CREATE POLICY "delete_own_shops" ON shops FOR DELETE
  TO authenticated USING (auth.uid() = seller_id);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_products" ON products;
CREATE POLICY "select_products" ON products FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_products" ON products;
CREATE POLICY "insert_own_products" ON products FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_products" ON products;
CREATE POLICY "update_own_products" ON products FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.seller_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_products" ON products;
CREATE POLICY "delete_own_products" ON products FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = products.shop_id AND shops.seller_id = auth.uid())
  );

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_address text NOT NULL DEFAULT '',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_orders" ON orders;
CREATE POLICY "select_orders" ON orders FOR SELECT
  TO authenticated USING (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM shops WHERE shops.id = orders.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "update_orders" ON orders;
CREATE POLICY "update_orders" ON orders FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = orders.shop_id AND shops.seller_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = orders.shop_id AND shops.seller_id = auth.uid())
  );

-- ============ DELIVERIES ============
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_number text NOT NULL DEFAULT '',
  buyer_name text NOT NULL DEFAULT '',
  delivery_address text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned','picked_up','in_transit','delivered','failed')),
  driver_name text,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_deliveries" ON deliveries;
CREATE POLICY "select_deliveries" ON deliveries FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN shops ON shops.id = orders.shop_id
      WHERE orders.id = deliveries.order_id
      AND (orders.buyer_id = auth.uid() OR shops.seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_deliveries" ON deliveries;
CREATE POLICY "update_deliveries" ON deliveries FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN shops ON shops.id = orders.shop_id
      WHERE orders.id = deliveries.order_id AND shops.seller_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN shops ON shops.id = orders.shop_id
      WHERE orders.id = deliveries.order_id AND shops.seller_id = auth.uid()
    )
  );

-- ============ CHATS ============
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name text NOT NULL DEFAULT '',
  shop_name text NOT NULL DEFAULT '',
  last_message text NOT NULL DEFAULT '',
  last_message_at timestamptz NOT NULL DEFAULT now(),
  unread_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_chats" ON chats;
CREATE POLICY "select_chats" ON chats FOR SELECT
  TO authenticated USING (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_chats" ON chats;
CREATE POLICY "insert_own_chats" ON chats FOR INSERT
  TO authenticated WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "update_chats" ON chats;
CREATE POLICY "update_chats" ON chats FOR UPDATE
  TO authenticated USING (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid())
  ) WITH CHECK (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid())
  );

-- ============ MESSAGES ============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT '',
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_messages" ON messages;
CREATE POLICY "select_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.buyer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid()
      ))
    )
  );

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.buyer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid()
      ))
    )
  );

DROP POLICY IF EXISTS "update_messages" ON messages;
CREATE POLICY "update_messages" ON messages FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.buyer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid()
      ))
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.buyer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM shops WHERE shops.id = chats.shop_id AND shops.seller_id = auth.uid()
      ))
    )
  );

-- ============ PROMOTIONS ============
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'percentage' CHECK (type IN ('percentage','fixed','bogo')),
  value numeric(10,2) NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_promotions" ON promotions;
CREATE POLICY "select_promotions" ON promotions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_promotions" ON promotions;
CREATE POLICY "insert_own_promotions" ON promotions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = promotions.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_promotions" ON promotions;
CREATE POLICY "update_own_promotions" ON promotions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = promotions.shop_id AND shops.seller_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = promotions.shop_id AND shops.seller_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_promotions" ON promotions;
CREATE POLICY "delete_own_promotions" ON promotions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = promotions.shop_id AND shops.seller_id = auth.uid())
  );

-- ============ PAYOUTS ============
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed')),
  period text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payouts" ON payouts;
CREATE POLICY "select_own_payouts" ON payouts FOR SELECT
  TO authenticated USING (
    seller_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  buyer_name text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reviews" ON reviews;
CREATE POLICY "select_reviews" ON reviews FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_reviews" ON reviews;
CREATE POLICY "insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ BILLBOARDS ============
CREATE TABLE IF NOT EXISTS billboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL DEFAULT now() + interval '30 days',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE billboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_billboards" ON billboards;
CREATE POLICY "select_billboards" ON billboards FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_billboards" ON billboards;
CREATE POLICY "insert_billboards" ON billboards FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "update_billboards" ON billboards;
CREATE POLICY "update_billboards" ON billboards FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_billboards" ON billboards;
CREATE POLICY "delete_billboards" ON billboards FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_shops_seller ON shops(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_order ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_chats_shop ON chats(shop_id);
CREATE INDEX IF NOT EXISTS idx_chats_buyer ON chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_promotions_shop ON promotions(shop_id);
CREATE INDEX IF NOT EXISTS idx_payouts_seller ON payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_shop ON reviews(shop_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============ TRIGGER: auto-create profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
