const https = require('https');

// إعدادات Supabase
const SUPABASE_PROJECT_REF = 'aydtrypogxbqmvbqerce';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

/**
 * تنفيذ SQL عبر PostgREST
 */
function executeSQLQuery(sql) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ query: sql });
        
        const options = {
            hostname: `${SUPABASE_PROJECT_REF}.supabase.co`,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Prefer': 'return=representation'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data, success: res.statusCode < 300 });
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * إنشاء الجدول والإعدادات بالكامل
 */
async function setupCompleteSystem() {
    console.log('🚀 بدء إعداد نظام النشاطات التلقائي...\n');

    const sqlStatements = [
        // 1. إنشاء الجدول
        {
            name: 'إنشاء جدول activity_logs',
            sql: `
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
            `
        },
        // 2. إنشاء الفهارس
        {
            name: 'إنشاء الفهارس',
            sql: `
                CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
                CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);
                CREATE INDEX IF NOT EXISTS idx_activity_logs_branch_id ON activity_logs(branch_id);
            `
        },
        // 3. تفعيل RLS
        {
            name: 'تفعيل Row Level Security',
            sql: `ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;`
        },
        // 4. Policy للمدير
        {
            name: 'إضافة Policy للمدير',
            sql: `
                DROP POLICY IF EXISTS "Admins can view all activities" ON activity_logs;
                CREATE POLICY "Admins can view all activities"
                    ON activity_logs FOR SELECT
                    USING (
                        EXISTS (
                            SELECT 1 FROM auth.users
                            WHERE auth.users.id = auth.uid()
                            AND auth.users.email = 'admin@tahfeez-sharqiya.com'
                        )
                    );
            `
        },
        // 5. Policy لمديري الفروع
        {
            name: 'إضافة Policy لمديري الفروع',
            sql: `
                DROP POLICY IF EXISTS "Branch managers can view their activities" ON activity_logs;
                CREATE POLICY "Branch managers can view their activities"
                    ON activity_logs FOR SELECT
                    USING (user_id = auth.uid());
            `
        },
        // 6. Policy للإدراج
        {
            name: 'إضافة Policy للإدراج',
            sql: `
                DROP POLICY IF EXISTS "Authenticated users can insert activities" ON activity_logs;
                CREATE POLICY "Authenticated users can insert activities"
                    ON activity_logs FOR INSERT
                    WITH CHECK (auth.uid() IS NOT NULL);
            `
        }
    ];

    // تنفيذ كل SQL statement
    for (const statement of sqlStatements) {
        console.log(`📝 ${statement.name}...`);
        
        try {
            const result = await executeSQLQuery(statement.sql);
            
            if (result.success) {
                console.log(`   ✅ نجح\n`);
            } else {
                console.log(`   ⚠️  الحالة: ${result.statusCode}`);
                if (result.data) {
                    console.log(`   📄 ${result.data}\n`);
                }
            }
        } catch (error) {
            console.log(`   ❌ خطأ: ${error.message}\n`);
        }
    }

    console.log('═════════════════════════════════════════════════════════\n');
    console.log('⚠️  ملاحظة: إذا فشلت العملية التلقائية، يمكنك تنفيذ SQL يدوياً\n');
    console.log('🔗 Supabase Dashboard SQL Editor:');
    console.log(`https://app.supabase.com/project/${SUPABASE_PROJECT_REF}/sql\n`);
    console.log('📋 انسخ محتوى ملف: create-activity-logs.sql\n');
    console.log('═════════════════════════════════════════════════════════\n');
}

// تشغيل
setupCompleteSystem().catch(console.error);
