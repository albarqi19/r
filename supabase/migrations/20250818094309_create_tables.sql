-- إنشاء جدول الفروع
CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    twitter TEXT,
    whatsapp TEXT,
    instagram TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    region TEXT,
    established TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID
);

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'branch',
    branch_id TEXT,
    last_login TIMESTAMPTZ,
    last_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول طلبات التحديث
CREATE TABLE IF NOT EXISTS update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id TEXT NOT NULL,
    request_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    requested_by UUID,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejected_by UUID,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT
);

-- إدراج بيانات الفروع
INSERT INTO branches (id, name, twitter, whatsapp, instagram, location, email, phone, status, region, established) VALUES
('garb-dammam', 'فرع غرب الدمام', 'https://x.com/Org2Qer', '966138360356', 'https://www.instagram.com/org2qer/', 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9', 'garb@tahfeez-sharqiya.com', '966138360356', 'active', 'الدمام', '1388'),
('sharq-dammam', 'فرع شرق الدمام', 'https://x.com/sharq_dammam', '966138365678', 'https://www.instagram.com/sharq_dammam/', 'https://maps.app.goo.gl/example_sharq', 'sharq@tahfeez-sharqiya.com', '966138365678', 'active', 'الدمام', '1392'),
('rafeia', 'فرع الرفيعة', 'https://x.com/rafeia_tahfeez', '966138367777', 'https://www.instagram.com/rafeia_tahfeez/', 'https://maps.app.goo.gl/example_rafeia', 'rafeia@tahfeez-sharqiya.com', '966138367777', 'active', 'الرفيعة', '1397'),
('baqiq', 'فرع بقيق', 'https://x.com/baqiq_tahfeez', '966138369999', 'https://www.instagram.com/baqiq_tahfeez/', 'https://maps.app.goo.gl/example_baqiq', 'baqiq@tahfeez-sharqiya.com', '966138369999', 'active', 'بقيق', '1395'),
('anak', 'فرع عنك', 'https://x.com/anak_tahfeez', '966138361111', 'https://www.instagram.com/anak_tahfeez/', 'https://maps.app.goo.gl/example_anak', 'anak@tahfeez-sharqiya.com', '966138361111', 'active', 'عنك', '1400'),
('wadi-almiyah', 'فرع وادي المياه', 'https://x.com/wadi_almiyah_tahfeez', '966138362222', 'https://www.instagram.com/wadi_almiyah_tahfeez/', 'https://maps.app.goo.gl/example_wadi_almiyah', 'wadi.almiyah@tahfeez-sharqiya.com', '966138362222', 'active', 'وادي المياه', '1402'),
('khobar', 'فرع الخبر', 'https://x.com/khobar_tahfeez', '966138361234', 'https://www.instagram.com/khobar_tahfeez/', 'https://maps.app.goo.gl/example_khobar', 'khobar@tahfeez-sharqiya.com', '966138361234', 'active', 'الخبر', '1390'),
('alsarar', 'فرع الصرار', 'https://x.com/alsarar_tahfeez', '966138363333', 'https://www.instagram.com/alsarar_tahfeez/', 'https://maps.app.goo.gl/example_alsarar', 'alsarar@tahfeez-sharqiya.com', '966138363333', 'active', 'الصرار', '1405'),
('ras-tanura', 'فرع رأس تنورة', 'https://x.com/ras_tanura_tahfeez', '966138364444', 'https://www.instagram.com/ras_tanura_tahfeez/', 'https://maps.app.goo.gl/example_ras_tanura', 'ras.tanura@tahfeez-sharqiya.com', '966138364444', 'active', 'رأس تنورة', '1408'),
('qaryah', 'فرع قرية', 'https://x.com/qaryah_tahfeez', '966138365555', 'https://www.instagram.com/qaryah_tahfeez/', 'https://maps.app.goo.gl/example_qaryah', 'qaryah@tahfeez-sharqiya.com', '966138365555', 'active', 'قرية', '1410'),
('altaeriah', 'فرع التعيرية', 'https://x.com/altaeriah_tahfeez', '966138366666', 'https://www.instagram.com/altaeriah_tahfeez/', 'https://maps.app.goo.gl/example_altaeriah', 'altaeriah@tahfeez-sharqiya.com', '966138366666', 'active', 'التعيرية', '1412')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    twitter = EXCLUDED.twitter,
    whatsapp = EXCLUDED.whatsapp,
    instagram = EXCLUDED.instagram,
    location = EXCLUDED.location,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    region = EXCLUDED.region,
    established = EXCLUDED.established,
    updated_at = NOW();

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status);
CREATE INDEX IF NOT EXISTS idx_branches_region ON branches(region);
CREATE INDEX IF NOT EXISTS idx_update_requests_status ON update_requests(status);
CREATE INDEX IF NOT EXISTS idx_update_requests_branch ON update_requests(branch_id);

-- تمكين RLS (Row Level Security)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_requests ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات
CREATE POLICY "Allow public read access to branches" ON branches
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to read users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to read update requests" ON update_requests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to insert update requests" ON update_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
