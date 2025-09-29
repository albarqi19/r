-- إنشاء جدول تسجيل النشاطات
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'login', 'approve_request', 'reject_request', 'update_data', 'logout'
    description TEXT NOT NULL,
    branch_id TEXT, -- اختياري: لتحديد الفرع المرتبط
    metadata JSONB, -- بيانات إضافية (request_id, old_value, new_value, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس لتسريع الاستعلامات
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_branch_id ON activity_logs(branch_id);

-- إضافة RLS (Row Level Security)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- السماح للمديرين بقراءة جميع النشاطات
CREATE POLICY "Admins can view all activities"
    ON activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'admin@tahfeez-sharqiya.com'
        )
    );

-- السماح لمديري الفروع برؤية نشاطات فرعهم فقط
CREATE POLICY "Branch managers can view their branch activities"
    ON activity_logs
    FOR SELECT
    USING (
        user_id = auth.uid()
        OR branch_id IN (
            SELECT branch_id FROM users WHERE id = auth.uid()
        )
    );

-- السماح بإدراج النشاطات (للجميع المسجلين)
CREATE POLICY "Authenticated users can insert their activities"
    ON activity_logs
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- إضافة بعض النشاطات التجريبية
INSERT INTO activity_logs (user_email, action_type, description, branch_id, metadata) VALUES
    ('admin@tahfeez-sharqiya.com', 'login', 'تسجيل دخول المدير', NULL, '{"ip": "192.168.1.1", "device": "Desktop"}'::jsonb),
    ('garb@tahfeez-sharqiya.com', 'login', 'تسجيل دخول مدير فرع غرب الدمام', 'garb-dammam', '{"ip": "192.168.1.5"}'::jsonb),
    ('admin@tahfeez-sharqiya.com', 'approve_request', 'تم اعتماد تحديث فرع الرفيعة', 'rafeia', '{"request_id": "req_001", "changes": "social_media"}'::jsonb),
    ('khobar@tahfeez-sharqiya.com', 'update_data', 'تحديث بيانات التواصل', 'khobar', '{"fields": ["phone", "whatsapp"]}'::jsonb);

COMMENT ON TABLE activity_logs IS 'جدول تسجيل جميع نشاطات المستخدمين في النظام';
COMMENT ON COLUMN activity_logs.action_type IS 'نوع النشاط: login, logout, approve_request, reject_request, update_data';
COMMENT ON COLUMN activity_logs.metadata IS 'بيانات إضافية بصيغة JSON مثل IP, device, request_id, etc';
