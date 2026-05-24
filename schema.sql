-- Kategori Tablosu
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

-- Menü Öğeleri Tablosu
CREATE TABLE public.menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT false,
    image_url TEXT
);

-- Rezervasyonlar Tablosu
CREATE TABLE public.reservations (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Örnek Kategoriler Ekleyelim
INSERT INTO public.categories (name, slug) VALUES 
('Ana Yemekler', 'ana-yemekler'),
('Çorbalar', 'corbalar'),
('Et & Tavuk', 'et-tavuk'),
('Makarna & Pilav', 'makarna-pilav'),
('Tatlılar', 'tatlilar'),
('İçecekler', 'icecekler');

-- Örnek Menü Ürünleri (Sadece ana yemekler için örnek veriler)
INSERT INTO public.menu_items (category_id, name, price, description, is_popular) VALUES 
(1, 'Güveç', 327.75, 'Etli. Günlük hazırlanır.', false),
(1, 'Orman Kebabı', 424.75, 'Günlük hazırlanır.', false),
(1, 'Zeytinyağlı Dolma', 214.75, 'Günlük hazırlanır.', true);

-- RLS (Row Level Security) Ayarları - Anonim (herkese açık) okuma/yazma izni için
-- Gelişmiş güvenlik için ileride bu politikalar sıkılaştırılabilir.

-- Categories için herkesin okumasına izin ver:
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);

-- Menu Items için herkesin okumasına izin ver:
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.menu_items FOR SELECT USING (true);

-- Reservations için herkesin eklemesine (insert) izin ver:
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all users" ON public.reservations FOR INSERT WITH CHECK (true);
