
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

// Startup diagnostics
console.log('[Backend] Booting server...');
console.log('[Backend] __filename:', __filename);
console.log('[Backend] process.cwd():', process.cwd());

// إعداد الاتصال بقاعدة بيانات XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // اسم المستخدم الافتراضي في XAMPP
  password: '',      // عادة كلمة المرور فارغة في XAMPP
  database: 'dhad_db' // اسم قاعدة البيانات التي أنشأتها
});

// إنشاء Pool مع واجهة الوعود للاستعلامات القراءة
const dbPool = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dhad_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

// اختبار الاتصال
db.connect((err) => {
  if (err) {
    console.error('فشل الاتصال بقاعدة البيانات:', err.message);
  } else {
    console.log('تم الاتصال بقاعدة البيانات MySQL بنجاح!');
  }
});

// نقطة استقبال بيانات التسجيل من نموذج التسجيل الرئيسي
app.post('/api/register', (req, res) => {
  const {
    fullName, dob, gender, birthPlace, residence,
    academicLevel, curriculum, program, email, countryCode, phone
  } = req.body;

  // Strengthened validation
  if (!fullName || !dob || !gender || !academicLevel || !curriculum || !program || !email || !countryCode || !phone) {
    return res.status(400).json({ error: 'يرجى ملء جميع الحقول الإلزامية.' });
  }

  db.query(
    `INSERT INTO registrations
    (full_name, dob, gender, birth_place, residence, academic_level, curriculum, program, email, country_code, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [fullName, dob, gender, birthPlace, residence, academicLevel, curriculum, program, email, countryCode, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// نقطة استقبال بيانات التسجيل السريع (المودال)
app.post('/api/quick-register', (req, res) => {
  const { studentName, parentName, countryCode, phone, course } = req.body;
  // Strengthened validation
  if (!studentName || !parentName || !countryCode || !phone || !course) {
    return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة للتسجيل السريع.' });
  }

  db.query(
    'INSERT INTO quick_registrations (student_name, parent_name, country_code, phone, course) VALUES (?, ?, ?, ?, ?)',
    [studentName, parentName, countryCode, phone, course],
    (err, result) => {
      if (err) {
        console.error('خطأ في إدراج التسجيل السريع:', err.message);
        return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الطالب.' });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// نقطة استقبال بيانات نموذج التواصل
app.post('/api/contact', (req, res) => {
  const { name, email, countryCode, phone, message } = req.body;

  // Strengthened validation
  if (!name || !email || !countryCode || !phone || !message) {
    return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة.' });
  }

  db.query(
    'INSERT INTO contact_messages (name, email, country_code, phone, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, countryCode, phone, message],
    (err, result) => {
      if (err) {
        console.error('خطأ في إدراج رسالة التواصل:', err.message);
        return res.status(500).json({ error: 'حدث خطأ أثناء إرسال رسالتك.' });
      }
      res.json({ success: true, message: 'تم إرسال الرسالة بنجاح!', id: result.insertId });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, file: __filename, cwd: process.cwd() });
});
// Endpoint to get all classes with their subjects
app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT
        c.id, c.icon, c.class_number, c.title, c.description, c.color, c.subjects_count_text,
        s.id as subject_id, s.name as subject_name, s.icon_key, s.description as subject_description
      FROM classes c
      LEFT JOIN subjects s ON c.id = s.class_id
      ORDER BY c.display_order ASC, c.id ASC;
    `);

    const classesMap = new Map();
    rows.forEach(row => {
      if (!classesMap.has(row.id)) {
        classesMap.set(row.id, {
          icon: row.icon,
          number: row.class_number,
          title: row.title,
          description: row.description,
          color: row.color,
          subjects: row.subjects_count_text,
          subjectDetails: []
        });
      }

      if (row.subject_id) {
        classesMap.get(row.id).subjectDetails.push({
          name: row.subject_name,
          iconKey: row.icon_key,
          description: row.subject_description
        });
      }
    });

    res.json(Array.from(classesMap.values()));
  } catch (err) {
    console.error('Error fetching classes:', err.message);
    res.status(500).json({ error: 'خطأ في استرجاع بيانات الصفوف.' });
  }
});

// Endpoint to get all courses with their subjects
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT
        c.id, c.icon_svg, c.gradient, c.category, c.title, c.details, c.color,
        cs.id as subject_id, cs.name as subject_name, cs.icon_key, cs.description as subject_description
      FROM courses c
      LEFT JOIN course_subjects cs ON c.id = cs.course_id
      ORDER BY c.display_order ASC, c.id ASC;
    `);

    const coursesMap = new Map();
    rows.forEach(row => {
      if (!coursesMap.has(row.id)) {
        coursesMap.set(row.id, {
          iconSvg: row.icon_svg,
          gradient: row.gradient,
          category: row.category,
          title: row.title,
          details: row.details,
          color: row.color,
          subjectDetails: []
        });
      }

      if (row.subject_id) {
        coursesMap.get(row.id).subjectDetails.push({
          name: row.subject_name,
          iconKey: row.icon_key,
          description: row.subject_description
        });
      }
    });

    res.json(Array.from(coursesMap.values()));
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).json({ error: 'خطأ في استرجاع بيانات البرامج.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
