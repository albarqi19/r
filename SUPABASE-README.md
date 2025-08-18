# مشروع تحفيظ الشرقية - Supabase

## إعداد المشروع مع Supabase

### 1. إعدادات قاعدة البيانات

- **Supabase URL**: https://aydtrypogxbqmvbqerce.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDY1ODMsImV4cCI6MjA3MTA4MjU4M30.J_bb8_J3eYW5XQ2D3oXLId8bHO4vYW5j9ZwdtUlZ0CA
- **Project ID**: aydtrypogxbqmvbqerce

### 2. تثبيت Supabase CLI

```bash
# للويندوز - استخدم Chocolatey
choco install supabase

# أو قم بتحميل ملف exe مباشرة من:
# https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.exe
```

### 3. ربط المشروع

```bash
# ربط المشروع
supabase link --project-ref aydtrypogxbqmvbqerce

# إنشاء migration جديد
supabase migration new initial-setup

# تطبيق المخطط على قاعدة البيانات
supabase db push
```

### 4. إعداد قاعدة البيانات

قم بتشغيل ملف `supabase-setup.sql` في Supabase Dashboard أو استخدم:

```bash
psql -h aws-0-eu-west-1.pooler.supabase.com -p 5432 -d postgres -U postgres.aydtrypogxbqmvbqerce -f supabase-setup.sql
```

### 5. الفروع المتوفرة

المشروع يحتوي على 11 فرع:

1. **غرب الدمام** (garb-dammam)
2. **شرق الدمام** (sharq-dammam)
3. **الرفيعة** (rafeia)
4. **بقيق** (baqiq)
5. **عنك** (anak)
6. **وادي المياه** (wadi-almyah)
7. **الخبر** (khobar)
8. **الصرار** (alsarar)
9. **رأس تنورة** (ras-tanura)
10. **قرية** (qarya)
11. **التعيرية** (altairiya)

### 6. بنية قاعدة البيانات

#### جداول رئيسية:

- **branches**: معلومات الفروع
- **users**: بيانات المستخدمين
- **update_requests**: طلبات التحديث
- **event_logs**: سجل الأحداث

#### أنواع المستخدمين:

- **admin**: مدير عام (يمكنه الموافقة على التحديثات)
- **branch**: مستخدم فرع (يمكنه إرسال طلبات تحديث)

### 7. المصادقة والأمان

- تم تفعيل Row Level Security (RLS)
- سياسات أمان محددة لكل جدول
- تشفير البيانات الحساسة

### 8. كيفية التشغيل

1. افتح مجلد المشروع في متصفح ويب
2. انتقل إلى `public/index.html` للواجهة الرئيسية
3. استخدم `public/auth/login.html` لتسجيل الدخول
4. لوحة المدير متاحة في `public/admin/index.html`

### 9. إنشاء مستخدمين

لإنشاء مستخدمين جدد، استخدم Supabase Auth وقم بإضافة البيانات في جدول users:

```sql
-- إنشاء مستخدم مدير
INSERT INTO public.users (id, email, role)
VALUES ('user-uuid-here', 'admin@tahfeez-sharqiya.com', 'admin');

-- إنشاء مستخدم فرع
INSERT INTO public.users (id, email, role, branch_id)
VALUES ('user-uuid-here', 'garb@tahfeez-sharqiya.com', 'branch', 'garb-dammam');
```

### 10. خصائص المشروع

- ✅ تم تحويل جميع خدمات Firebase إلى Supabase
- ✅ دعم جميع الفروع الـ11
- ✅ نظام موافقات التحديث
- ✅ واجهة إدارية شاملة
- ✅ تصميم متجاوب مع الهواتف
- ✅ دعم اللغة العربية بالكامل
- ✅ سياسات الأمان والخصوصية

### 11. الاستضافة

يمكن استضافة المشروع على:

- **Supabase Hosting** (مُوصى به)
- **Vercel**
- **Netlify**
- **GitHub Pages**
- أي خدمة استضافة ثابتة أخرى

### 12. مراقبة الأداء

استخدم Supabase Dashboard لمراقبة:

- إحصائيات قاعدة البيانات
- سجلات الأخطاء
- أداء الاستعلامات
- معدلات الاستخدام
