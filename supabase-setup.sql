-- إعداد قاعدة البيانات لتطبيق تحفيظ الشرقية
-- هذا الملف يحتوي على جميع الجداول والبيانات المطلوبة

-- تفعيل Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret-key';

-- إنشاء جدول الفروع
CREATE TABLE IF NOT EXISTS public.branches (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    twitter VARCHAR(500),
    whatsapp VARCHAR(20),
    instagram VARCHAR(500),
    location VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    region VARCHAR(100),
    established VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'branch' CHECK (role IN ('admin', 'branch')),
    branch_id VARCHAR(50) REFERENCES public.branches(id),
    last_login TIMESTAMP WITH TIME ZONE,
    last_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول طلبات التحديث
CREATE TABLE IF NOT EXISTS public.update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id VARCHAR(50) REFERENCES public.branches(id),
    request_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_by UUID REFERENCES auth.users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES auth.users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- إنشاء جدول سجل الأحداث
CREATE TABLE IF NOT EXISTS public.event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إعداد Row Level Security

-- تفعيل RLS للجداول
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول للفروع
-- المستخدمون يمكنهم قراءة جميع الفروع
CREATE POLICY "Allow read access to branches" ON public.branches
FOR SELECT USING (true);

-- المدراء يمكنهم تحديث الفروع
CREATE POLICY "Allow admins to update branches" ON public.branches
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- سياسات الوصول للمستخدمين
-- المستخدمون يمكنهم قراءة بياناتهم فقط
CREATE POLICY "Users can read own data" ON public.users
FOR SELECT USING (auth.uid() = id);

-- المدراء يمكنهم قراءة جميع البيانات
CREATE POLICY "Admins can read all users" ON public.users
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- سياسات طلبات التحديث
-- مستخدمو الفروع يمكنهم إنشاء طلبات تحديث لفروعهم
CREATE POLICY "Branch users can create update requests" ON public.update_requests
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND (users.role = 'admin' OR users.branch_id = branch_id)
    )
);

-- المستخدمون يمكنهم قراءة طلبات التحديث الخاصة بفروعهم
CREATE POLICY "Users can read relevant update requests" ON public.update_requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND (users.role = 'admin' OR users.branch_id = branch_id)
    )
);

-- المدراء فقط يمكنهم تحديث حالة الطلبات
CREATE POLICY "Admins can update request status" ON public.update_requests
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- سياسات سجل الأحداث
-- المدراء فقط يمكنهم قراءة سجل الأحداث
CREATE POLICY "Admins can read event logs" ON public.event_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- جميع المستخدمين يمكنهم إنشاء سجلات أحداث
CREATE POLICY "Users can create event logs" ON public.event_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_branches_status ON public.branches(status);
CREATE INDEX IF NOT EXISTS idx_branches_region ON public.branches(region);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_branch_id ON public.users(branch_id);
CREATE INDEX IF NOT EXISTS idx_update_requests_status ON public.update_requests(status);
CREATE INDEX IF NOT EXISTS idx_update_requests_branch_id ON public.update_requests(branch_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_user_id ON public.event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_created_at ON public.event_logs(created_at);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- إدخال البيانات الأولية للفروع
INSERT INTO public.branches (id, name, twitter, whatsapp, instagram, location, email, phone, status, region, established) VALUES
('garb-dammam', 'فرع غرب الدمام', 'https://x.com/Org2Qer', '966138360356', 'https://www.instagram.com/org2qer/', 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9', 'garb@tahfeez-sharqiya.com', '966138360356', 'active', 'الدمام', '1388'),
('sharq-dammam', 'فرع شرق الدمام', 'https://x.com/sharq_dammam', '966138365678', 'https://www.instagram.com/sharq_dammam/', 'https://maps.app.goo.gl/example_sharq', 'sharq@tahfeez-sharqiya.com', '966138365678', 'active', 'الدمام', '1392'),
('rafeia', 'فرع الرفيعة', 'https://x.com/rafeia_tahfeez', '966138367777', 'https://www.instagram.com/rafeia_tahfeez/', 'https://maps.app.goo.gl/example_rafeia', 'rafeia@tahfeez-sharqiya.com', '966138367777', 'active', 'الرفيعة', '1397'),
('baqiq', 'فرع بقيق', 'https://x.com/baqiq_tahfeez', '966138369999', 'https://www.instagram.com/baqiq_tahfeez/', 'https://maps.app.goo.gl/example_baqiq', 'baqiq@tahfeez-sharqiya.com', '966138369999', 'active', 'بقيق', '1395'),
('anak', 'فرع عنك', 'https://x.com/anak_tahfeez', '966138361111', 'https://www.instagram.com/anak_tahfeez/', 'https://maps.app.goo.gl/example_anak', 'anak@tahfeez-sharqiya.com', '966138361111', 'active', 'عنك', '1400'),
('wadi-almyah', 'فرع وادي المياه', 'https://x.com/wadi_almyah_tahfeez', '966138362222', 'https://www.instagram.com/wadi_almyah_tahfeez/', 'https://maps.app.goo.gl/example_wadi_almyah', 'wadi-almyah@tahfeez-sharqiya.com', '966138362222', 'active', 'وادي المياه', '1402'),
('khobar', 'فرع الخبر', 'https://x.com/khobar_tahfeez', '966138361234', 'https://www.instagram.com/khobar_tahfeez/', 'https://maps.app.goo.gl/example_khobar', 'khobar@tahfeez-sharqiya.com', '966138361234', 'active', 'الخبر', '1390'),
('alsarar', 'فرع الصرار', 'https://x.com/alsarar_tahfeez', '966138363333', 'https://www.instagram.com/alsarar_tahfeez/', 'https://maps.app.goo.gl/example_alsarar', 'alsarar@tahfeez-sharqiya.com', '966138363333', 'active', 'الصرار', '1405'),
('ras-tanura', 'فرع رأس تنورة', 'https://x.com/ras_tanura_tahfeez', '966138364444', 'https://www.instagram.com/ras_tanura_tahfeez/', 'https://maps.app.goo.gl/example_ras_tanura', 'ras-tanura@tahfeez-sharqiya.com', '966138364444', 'active', 'رأس تنورة', '1398'),
('qarya', 'فرع قرية', 'https://x.com/qarya_tahfeez', '966138365555', 'https://www.instagram.com/qarya_tahfeez/', 'https://maps.app.goo.gl/example_qarya', 'qarya@tahfeez-sharqiya.com', '966138365555', 'active', 'قرية', '1403'),
('altairiya', 'فرع التعيرية', 'https://x.com/altairiya_tahfeez', '966138366666', 'https://www.instagram.com/altairiya_tahfeez/', 'https://maps.app.goo.gl/example_altairiya', 'altairiya@tahfeez-sharqiya.com', '966138366666', 'active', 'التعيرية', '1406')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    twitter = EXCLUDED.twitter,
    whatsapp = EXCLUDED.whatsapp,
    instagram = EXCLUDED.instagram,
    location = EXCLUDED.location,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    status = EXCLUDED.status,
    region = EXCLUDED.region,
    established = EXCLUDED.established,
    updated_at = NOW();

-- إنشاء مستخدم إداري تجريبي
-- يجب تشغيل هذا بعد تسجيل المستخدم في Supabase Auth
-- INSERT INTO public.users (id, email, role) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'admin@tahfeez-sharqiya.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- إنشاء مستخدمين للفروع (تجريبي)
-- INSERT INTO public.users (id, email, role, branch_id) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'garb@tahfeez-sharqiya.com', 'branch', 'garb-dammam'),
-- ('22222222-2222-2222-2222-222222222222', 'khobar@tahfeez-sharqiya.com', 'branch', 'khobar'),
-- ('33333333-3333-3333-3333-333333333333', 'sharq@tahfeez-sharqiya.com', 'branch', 'sharq-dammam'),
-- ('44444444-4444-4444-4444-444444444444', 'baqiq@tahfeez-sharqiya.com', 'branch', 'baqiq'),
-- ('55555555-5555-5555-5555-555555555555', 'rafeia@tahfeez-sharqiya.com', 'branch', 'rafeia')
-- ON CONFLICT (id) DO UPDATE SET branch_id = EXCLUDED.branch_id;
