const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// إعدادات Supabase
const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * تنفيذ SQL مباشرة عبر Supabase REST API
 */
async function executeSQL(sqlStatements) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ query: sqlStatements });
        
        const options = {
            hostname: 'aydtrypogxbqmvbqerce.supabase.co',
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve({ success: true, data: data });
                } else {
                    resolve({ success: false, error: data, statusCode: res.statusCode });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

/**
 * إنشاء الجدول باستخدام Supabase client مباشرة
 */
async function createTableDirectly() {
    console.log('🚀 بدء إنشاء جدول النشاطات تلقائياً...\n');

    try {
        // الخطوة 1: إنشاء الجدول
        console.log('📝 الخطوة 1: إنشاء جدول activity_logs...');
        
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS activity_logs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                user_email TEXT NOT NULL,
                action_type TEXT NOT NULL,
                description TEXT NOT NULL,
                branch_id TEXT,
                metadata JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        // تنفيذ مباشر باستخدام supabase.rpc
        let result = await supabase.rpc('exec_sql', { query: createTableSQL });
        
        if (result.error && result.error.message.includes('does not exist')) {
            console.log('⚠️  RPC function غير موجودة، استخدام طريقة بديلة...\n');
            
            // محاولة التحقق من وجود الجدول بطريقة غير مباشرة
            const { data: testData, error: testError } = await supabase
                .from('activity_logs')
                .select('id')
                .limit(1);
            
            if (testError && testError.code === '42P01') {
                console.log('❌ الجدول غير موجود');
                console.log('\n📋 يرجى تنفيذ الـ SQL التالي يدوياً في Supabase Dashboard:\n');
                console.log('═══════════════════════════════════════════════════════════');
                console.log(`
-- إنشاء الجدول
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    branch_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_branch_id ON activity_logs(branch_id);

-- تفعيل RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy للمدير
CREATE POLICY "Admins can view all activities"
    ON activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'admin@tahfeez-sharqiya.com'
        )
    );

-- Policy لمديري الفروع
CREATE POLICY "Branch managers can view their activities"
    ON activity_logs FOR SELECT
    USING (user_id = auth.uid());

-- Policy للإدراج
CREATE POLICY "Authenticated users can insert activities"
    ON activity_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- بيانات تجريبية
INSERT INTO activity_logs (user_email, action_type, description, branch_id, metadata) VALUES
    ('admin@tahfeez-sharqiya.com', 'login', 'تسجيل دخول المدير', NULL, '{"device": "Desktop"}'::jsonb),
    ('garb@tahfeez-sharqiya.com', 'login', 'تسجيل دخول مدير فرع غرب الدمام', 'garb-dammam', '{}'::jsonb),
    ('admin@tahfeez-sharqiya.com', 'approve_request', 'تم اعتماد تحديث فرع الرفيعة', 'rafeia', '{"request_id": "req_001"}'::jsonb);
                `);
                console.log('═══════════════════════════════════════════════════════════\n');
                
                console.log('🔗 رابط Supabase Dashboard:');
                console.log('https://app.supabase.com/project/aydtrypogxbqmvbqerce/editor\n');
                
                return;
            } else if (!testError) {
                console.log('✅ الجدول موجود بالفعل!\n');
            }
        } else {
            console.log('✅ تم إنشاء الجدول بنجاح\n');
        }

        // الخطوة 2: التحقق من البيانات
        console.log('� الخطوة 2: التحقق من البيانات...');
        
        const { data: activities, error: fetchError } = await supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (fetchError) {
            console.error('❌ خطأ في جلب البيانات:', fetchError.message);
        } else {
            console.log(`✅ وجدنا ${activities?.length || 0} نشاط\n`);
            
            if (activities && activities.length > 0) {
                console.log('� آخر النشاطات:');
                activities.forEach((activity, index) => {
                    console.log(`   ${index + 1}. ${activity.description} - ${new Date(activity.created_at).toLocaleString('ar-EG')}`);
                });
                console.log('');
            } else {
                console.log('⚠️  الجدول فارغ، جاري إضافة بيانات تجريبية...\n');
                
                // إضافة بيانات تجريبية
                const { data: inserted, error: insertError } = await supabase
                    .from('activity_logs')
                    .insert([
                        {
                            user_email: 'admin@tahfeez-sharqiya.com',
                            action_type: 'login',
                            description: 'تسجيل دخول المدير',
                            branch_id: null,
                            metadata: { device: 'Desktop', ip: '192.168.1.1' }
                        },
                        {
                            user_email: 'garb@tahfeez-sharqiya.com',
                            action_type: 'login',
                            description: 'تسجيل دخول مدير فرع غرب الدمام',
                            branch_id: 'garb-dammam',
                            metadata: { device: 'Mobile' }
                        },
                        {
                            user_email: 'admin@tahfeez-sharqiya.com',
                            action_type: 'approve_request',
                            description: 'تم اعتماد تحديث فرع الرفيعة',
                            branch_id: 'rafeia',
                            metadata: { request_id: 'req_001' }
                        }
                    ])
                    .select();

                if (insertError) {
                    console.error('❌ خطأ في إضافة البيانات:', insertError.message);
                } else {
                    console.log(`✅ تم إضافة ${inserted?.length || 0} نشاط تجريبي\n`);
                }
            }
        }

        console.log('🎉 تم الإعداد بنجاح! يمكنك الآن استخدام نظام النشاطات\n');

    } catch (error) {
        console.error('❌ خطأ في الإعداد:', error.message);
        console.error('التفاصيل:', error);
    }
}

// تشغيل
createTableDirectly();
