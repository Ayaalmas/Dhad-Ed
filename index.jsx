import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const svgIcons = {
  arabic: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 4H5.5C4.12 4 3 5.12 3 6.5V17.5C3 18.88 4.12 20 5.5 20H18.5C19.88 20 21 18.88 21 17.5V6.5C21 5.12 19.88 4 18.5 4zM9 17v-4.5H7V11h5v1.5H10V17H9zm5-2.5c0 .83-.67 1.5-1.5 1.5S11 15.33 11 14.5s.67-1.5 1.5-1.5S14 13.67 14 14.5z"/></svg>,
  math: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4-4h2v2H7v-2zm4 0h2v2h-2v-2zm4-4h-2V7h2v2z"/></svg>,
  science: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a6.5 6.5 0 0 0-4.6 11.1L3 18.1c-.6.6-.6 1.5 0 2.1.6.6 1.5.6 2.1 0l4.6-4.6c2.8 1.8 6.5 1 8.2-1.7S19.1 7.1 16.3 5C15.2 3.5 13.7 2.5 12 2.5zM12 4a5 5 0 0 1 3.5 8.5 5 5 0 0 1-8.5-3.5A5 5 0 0 1 12 4z"/></svg>,
  islamic: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v2h18V7L12 2zM5 10v9h14v-9H5zm4 7H7v-5h2v5zm4 0h-2v-5h2v5zm4 0h-2v-5h2v5z"/></svg>,
  english: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.25 5.09c-.01.01-.01.02-.02.03l-4.23 8.46c-.05.11-.08.23-.08.36v.03c0 .34.28.62.62.62h.9c.2 0 .38-.11.48-.28l.8-1.6h3.4l.8 1.6c.1.17.28.28.48.28h.9c.34 0 .62-.28.62-.62v-.03c0-.13-.03-.25-.08-.36L14.25 5.09zM12 7.18l1.63 3.27h-3.26L12 7.18zM4 20h16v2H4z"/></svg>,
  socialStudies: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15.87 5H14v.07zm3.5 1.46c.92.83 1.64 1.86 2.13 3.01h-2.13v-3.01zm-3.5 3.01H14V12h2.12c-.05.5-.14.99-.27 1.48l-1.85-1.48zm0 3.52 1.85 1.48c.13.49.22.98.27 1.48H14v-2.96zm3.63 4.46c-.49 1.15-1.21 2.18-2.13 3.01v-3.01h2.13z"/></svg>,
  physicsChemistry: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 11h-1.3c-.2-1.3-.8-2.5-1.5-3.5L16.4 6 15 4.6l-1.9 1.9C12.3 6.2 11.2 5.5 10 5.2V4h-2v1.2c-1.2.3-2.3 1-3.1 1.9L3 5.2 1.6 6.6l1.2 1.2c-.7 1-1.3 2.2-1.5 3.5H0v2h1.3c.2 1.3.8 2.5 1.5 3.5L1.6 18 3 19.4l1.9-1.9c.8.9 1.9 1.6 3.1 1.9V21h2v-1.2c-1.2-.3-2.3-1-3.1-1.9l1.9 1.9 1.4-1.4-1.2-1.2c.7-1 1.3-2.2 1.5-3.5H20v-2h-2zm-8 5.5c-2.5 0-4.5-2-4.5-4.5S7.5 7.5 10 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/></svg>,
  biology: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 12c0-2.3-1.2-4.4-3-5.5.5-1 .5-2.2 0-3.2-1.2-2.3-4-3.8-7-3.8s-5.8 1.5-7 3.8c-.5 1-.5 2.2 0 3.2 1.8 1.1 3 3.1 3 5.5s-1.2 4.4-3 5.5c-.5 1-.5 2.2 0 3.2 1.2 2.3 4 3.8 7 3.8s5.8-1.5 7-3.8c.5-1 .5-2.2 0-3.2-1.8-1.1-3-3.1-3-5.5z"/></svg>,
  historyGeography: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15.87 5H14v.07zm3.5 1.46c.92.83 1.64 1.86 2.13 3.01h-2.13v-3.01zm-3.5 3.01H14V12h2.12c-.05.5-.14.99-.27 1.48l-1.85-1.48zm0 3.52 1.85 1.48c.13.49.22.98.27 1.48H14v-2.96zm3.63 4.46c-.49 1.15-1.21 2.18-2.13 3.01v-3.01h2.13z"/></svg>,
  physics: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><ellipse cx="12" cy="12" rx="3" ry="7" transform="rotate(-45 12 12)"/><ellipse cx="12" cy="12" rx="3" ry="7" transform="rotate(45 12 12)"/></svg>,
  chemistry: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 11h-1.3c-.2-1.3-.8-2.5-1.5-3.5L16.4 6 15 4.6l-1.9 1.9C12.3 6.2 11.2 5.5 10 5.2V4h-2v1.2c-1.2.3-2.3 1-3.1 1.9L3 5.2 1.6 6.6l1.2 1.2c-.7 1-1.3 2.2-1.5 3.5H0v2h1.3c.2 1.3.8 2.5 1.5 3.5L1.6 18 3 19.4l1.9-1.9c.8.9 1.9 1.6 3.1 1.9V21h2v-1.2c-1.2-.3-2.3-1-3.1-1.9l1.9 1.9 1.4-1.4-1.2-1.2c.7-1 1.3-2.2 1.5-3.5H20v-2h-2zm-8 5.5c-2.5 0-4.5-2-4.5-4.5S7.5 7.5 10 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/></svg>,
};

const LoadingSpinner = () => (
  <div className="spinner-overlay">
      <div className="spinner"></div>
  </div>
);

const SubjectsView = ({ itemInfo, onBack, onRegister }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="section subjects-section" id="subjects">
      <div className="container">
        <div className="subjects-header">
          <h2 className="section-title">مواد {itemInfo.title}</h2>
          <button onClick={onBack} className="btn subjects-back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"/></svg>
            <span>العودة</span>
          </button>
        </div>
        {(itemInfo.subjectDetails && itemInfo.subjectDetails.length > 0) ? (
          <div className="grid subjects-grid">
            {itemInfo.subjectDetails.map((subject, index) => (
              <div key={index} className="subject-card">
                <div className="subject-card-icon" style={{ backgroundColor: itemInfo.color }}>
                  {svgIcons[subject.iconKey]}
                </div>
                <div className="subject-card-content">
                  <h3 className="subject-card-title">{subject.name}</h3>
                  <p className="subject-card-description">{subject.description}</p>
                  <button onClick={() => onRegister(subject.name)} className="btn btn-secondary subject-card-cta" style={{ backgroundColor: itemInfo.color }}>
                    سجل في المادة
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results-container" style={{ marginTop: '2rem' }}>
            <h3>قريباً...</h3>
            <p>يجري حالياً إعداد تفاصيل المواد الخاصة بهذا البرنامج. شكراً لاهتمامكم!</p>
          </div>
        )}
      </div>
    </section>
  );
};

const RegistrationInfoPanel = ({ currentStep }) => {
    const infoPanelSteps = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>, title: 'بياناتك الشخصية آمنة', description: 'نحن نستخدم أحدث معايير الأمان لحماية معلوماتك. ابدأ بإنشاء ملف الطالب الخاص بك.' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-12.5L14 4.5l-2.5 5-5-2.5 5 2.5zm5 5L10 19.5l2.5-5 5 2.5-5-2.5z"/></svg>, title: 'تحديد المسار التعليمي المثالي', description: 'تساعدنا هذه المعلومات في اقتراح البرامج والمواد التي تناسب مستوى الطالب وأهدافه التعليمية.' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>, title: 'على بعد خطوة من الانطلاق!', description: 'سنستخدم هذه المعلومات للتواصل معكم لتأكيد التسجيل، وإعلامكم بمواعيد الفصول وأي تحديثات هامة.' }
    ];
    const stepInfo = infoPanelSteps[currentStep - 1];

    return (
        <div className="registration-info-panel">
            <div className="info-panel-content-wrapper" key={currentStep}>
                <div className="info-panel-icon">{stepInfo.icon}</div>
                <h2 className="info-panel-title">{stepInfo.title}</h2>
                <p className="info-panel-description">{stepInfo.description}</p>
            </div>
        </div>
    );
};

const RegistrationView = ({ classes, onBackToMain, showToast }) => {
  const academicLevels = classes.map(c => c.title);
  const curricula = ['المنهج السوري', 'المنهج السعودي', 'المنهج الإماراتي', 'المنهج التركي', 'مناهج دولية'];
  const programs = ['التعليم التعويضي المسرّع', 'تعليم اللغة العربية لغير الناطقين', 'برامج علاجية استشارية', 'دورات تدريبية إضافية', 'تسجيل عام (غير محدد)'];
  const countryCodes = [ { code: '+963', name: 'سوريا' }, { code: '+90', name: 'تركيا' }, { code: '+962', name: 'الأردن' }, { code: '+34', name: 'إسبانيا' }, { code: '+61', name: 'أستراليا' }, { code: '+49', name: 'ألمانيا' }, { code: '+971', name: 'الإمارات' }, { code: '+973', name: 'البحرين' }, { code: '+32', name: 'بلجيكا' }, { code: '+216', name: 'تونس' }, { code: '+213', name: 'الجزائر' }, { code: '+45', name: 'الدنمارك' }, { code: '+966', name: 'السعودية' }, { code: '+46', name: 'السويد' }, { code: '+86', name: 'الصين' }, { code: '+964', name: 'العراق' }, { code: '+44', name: 'المملكة المتحدة' }, { code: '+212', name: 'المغرب' }, { code: '+52', name: 'المكسيك' }, { code: '+47', name: 'النرويج' }, { code: '+43', name: 'النمسا' }, { code: '+91', name: 'الهند' }, { code: '+31', name: 'هولندا' }, { code: '+1', name: 'الولايات المتحدة' }, { code: '+81', name: 'اليابان' }, { code: '+39', name: 'إيطاليا' }, { code: '+33', name: 'فرنسا' }, { code: '+358', name: 'فنلندا' }, { code: '+974', name: 'قطر' }, { code: '+1', name: 'كندا' }, { code: '+965', name: 'الكويت' }, { code: '+961', name: 'لبنان' }, { code: '+218', name: 'ليبيا' }, { code: '+60', name: 'ماليزيا' }, { code: '+20', name: 'مصر' }, { code: '+41', name: 'سويسرا' }, { code: '+968', name: 'عُمان' } ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState({ fullName: '', dob: '', gender: 'ذكر', birthPlace: '', residence: '', academicLevel: '', curriculum: '', program: '', email: '', countryCode: '+963', phone: '' });
  const [dobParts, setDobParts] = useState({ day: '', month: '', year: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 5 - i);
  const months = [ { value: 1, name: 'يناير' }, { value: 2, name: 'فبراير' }, { value: 3, name: 'مارس' }, { value: 4, name: 'أبريل' }, { value: 5, name: 'مايو' }, { value: 6, name: 'يونيو' }, { value: 7, name: 'يوليو' }, { value: 8, name: 'أغسطس' }, { value: 9, name: 'سبتمبر' }, { value: 10, name: 'أكتوبر' }, { value: 11, name: 'نوفمبر' }, { value: 12, name: 'ديسمبر' } ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const validateAllFields = () => {
    const newErrors = {};
    if (!formState.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    else if (formState.fullName.trim().split(' ').length < 2) newErrors.fullName = 'الرجاء إدخال الاسم الكامل (اسمين على الأقل)';

    const { day, month, year } = dobParts;
    if (!day || !month || !year) { newErrors.dob = 'الرجاء إكمال تاريخ الميلاد';
    } else {
        const numericYear = parseInt(year); const numericMonth = parseInt(month); const numericDay = parseInt(day);
        const dob = new Date(numericYear, numericMonth - 1, numericDay);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (dob.getFullYear() !== numericYear || dob.getMonth() !== numericMonth - 1 || dob.getDate() !== numericDay) { newErrors.dob = 'تاريخ الميلاد غير صالح (مثال: 31 أبريل).';
        } else if (dob > today) { newErrors.dob = 'تاريخ الميلاد لا يمكن أن يكون في المستقبل.';
        } else {
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) { age--; }
            if (age < 5) { newErrors.dob = 'يجب أن يكون عمر الطالب 5 سنوات على الأقل للتسجيل.'; }
        }
    }
    
    if (!formState.academicLevel) newErrors.academicLevel = 'يرجى اختيار المستوى الدراسي';
    if (!formState.curriculum) newErrors.curriculum = 'يرجى اختيار المنهج الدراسي';
    if (!formState.program) newErrors.program = 'يرجى اختيار البرنامج المطلوب';
    
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!formState.email || !emailRegex.test(formState.email)) newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
    
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!formState.phone || !phoneRegex.test(formState.phone)) newErrors.phone = 'الرجاء إدخال رقم هاتف صحيح';

    return newErrors;
  }

  const handleNextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handlePrevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAllFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
            }
            showToast('تم إرسال طلب التسجيل بنجاح! سنتواصل معكم قريباً.', 'success');
            setTimeout(() => onBackToMain(), 2000); // Go back after toast is visible for a bit
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    } else {
        const stepsFields = [ ['fullName', 'dob'], ['academicLevel', 'curriculum', 'program'], ['email', 'phone'] ];
        const firstErrorStep = stepsFields.findIndex(stepFields => stepFields.some(field => Object.prototype.hasOwnProperty.call(validationErrors, field))) + 1;
        if (firstErrorStep > 0) setCurrentStep(firstErrorStep);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
    if(errors[name]) setErrors(prevErrors => { const newErrors = { ...prevErrors }; delete newErrors[name]; return newErrors; });
  };
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDobParts = { ...dobParts, [name]: value };
    setDobParts(newDobParts);

    const { year, month, day } = newDobParts;
    if (year && month && day) {
        const fullDob = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        setFormState(prevState => ({ ...prevState, dob: fullDob }));
        if (errors.dob) setErrors(prev => { const newErrors = { ...prev }; delete newErrors.dob; return newErrors; });
    } else {
         setFormState(prevState => ({ ...prevState, dob: '' }));
    }
  };
  
  const stepTitles = ["المعلومات الشخصية", "الخلفية التعليمية", "معلومات التواصل"];

  return (
    <div className="registration-page-wrapper">
      <div className="registration-card">
        <RegistrationInfoPanel currentStep={currentStep} />
        <div className="registration-form-panel">
          <button className="close-registration-btn" onClick={onBackToMain} aria-label="العودة للصفحة الرئيسية">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
          <h1 className="form-panel-title">إنشاء حساب جديد</h1>
          <div className="progress-bar">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1; const isActive = currentStep === stepNumber; const isCompleted = currentStep > stepNumber;
              return (
                <React.Fragment key={index}>
                  <div className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="step-number">{isCompleted ? '✔' : stepNumber}</div>
                    <div className="step-title">{title}</div>
                  </div>
                  {index < stepTitles.length - 1 && <div className="step-connector"></div>}
                </React.Fragment>
              );
            })}
          </div>

          <form className="registration-form" onSubmit={handleSubmit} noValidate>
            <div className="form-steps-container" style={{'--current-step': currentStep}}>
              <div className="form-step" data-step="1">
                <div className="form-grid">
                  <div className={`form-group full-width ${errors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="fullName">الاسم الكامل للطالب</label>
                    <input type="text" id="fullName" name="fullName" value={formState.fullName} onChange={handleChange} required />
                    {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                  </div>

                  <div className={`form-group full-width dob-group ${errors.dob ? 'has-error' : ''}`}>
                    <label>تاريخ الميلاد</label>
                    <div className="date-of-birth-group">
                      <select name="day" value={dobParts.day} onChange={handleDateChange} required>
                          <option value="" disabled>اليوم</option>
                          {days.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                      <select name="month" value={dobParts.month} onChange={handleDateChange} required>
                          <option value="" disabled>الشهر</option>
                          {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                      </select>
                      <select name="year" value={dobParts.year} onChange={handleDateChange} required>
                          <option value="" disabled>السنة</option>
                          {years.map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                    </div>
                    {errors.dob && <p className="form-error">{errors.dob}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label>الجنس</label>
                    <div className="gender-options">
                        <label className={formState.gender === 'ذكر' ? 'selected' : ''}>
                          <input type="radio" name="gender" value="ذكر" checked={formState.gender === 'ذكر'} onChange={handleChange} /> ذكر
                        </label>
                        <label className={formState.gender === 'أنثى' ? 'selected' : ''}>
                          <input type="radio" name="gender" value="أنثى" checked={formState.gender === 'أنثى'} onChange={handleChange} /> أنثى
                        </label>
                    </div>
                  </div>
                  <div className="form-group"><label htmlFor="birthPlace">مكان الولادة (اختياري)</label><input type="text" id="birthPlace" name="birthPlace" value={formState.birthPlace} onChange={handleChange} /></div>
                  <div className="form-group"><label htmlFor="residence">مكان الإقامة الحالي (اختياري)</label><input type="text" id="residence" name="residence" value={formState.residence} onChange={handleChange}/></div>
                </div>
              </div>

              <div className="form-step" data-step="2">
                 <div className="form-grid">
                    <div className={`form-group full-width ${errors.academicLevel ? 'has-error' : ''}`}>
                        <label htmlFor="academicLevel">المستوى الدراسي</label>
                        <select id="academicLevel" name="academicLevel" value={formState.academicLevel} onChange={handleChange} required>
                            <option value="" disabled></option>
                            {academicLevels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                        {errors.academicLevel && <p className="form-error">{errors.academicLevel}</p>}
                    </div>
                     <div className={`form-group full-width ${errors.curriculum ? 'has-error' : ''}`}>
                        <label htmlFor="curriculum">المنهج الدراسي المتبع</label>
                        <select id="curriculum" name="curriculum" value={formState.curriculum} onChange={handleChange} required>
                            <option value="" disabled></option>
                            {curricula.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.curriculum && <p className="form-error">{errors.curriculum}</p>}
                    </div>
                    <div className={`form-group full-width ${errors.program ? 'has-error' : ''}`}>
                        <label htmlFor="program">البرنامج الذي ترغب فيه</label>
                        <select id="program" name="program" value={formState.program} onChange={handleChange} required>
                            <option value="" disabled></option>
                            {programs.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {errors.program && <p className="form-error">{errors.program}</p>}
                    </div>
                </div>
              </div>
              
              <div className="form-step" data-step="3">
                 <div className="form-grid">
                    <div className={`form-group full-width ${errors.email ? 'has-error' : ''}`}>
                        <label htmlFor="email">بريد ولي الأمر الإلكتروني</label>
                        <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} required />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                    <div className={`form-group full-width ${errors.phone ? 'has-error' : ''}`}>
                        <label htmlFor="phone">رقم واتساب ولي الأمر</label>
                        <div className="phone-input-group">
                            <select className="country-code-select" name="countryCode" value={formState.countryCode} onChange={handleChange}>
                              {countryCodes.map(c => <option key={c.code+c.name} value={c.code}>{c.name} ({c.code})</option>)}
                            </select>
                            <input type="tel" id="phone" name="phone" value={formState.phone} onChange={handleChange} required/>
                        </div>
                        {errors.phone && <p className="form-error">{errors.phone}</p>}
                    </div>
                </div>
              </div>
            </div>

            <div className="form-navigation">
              {currentStep > 1 && <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>السابق</button>}
              {currentStep < 3 ? <button type="button" className="btn btn-primary" onClick={handleNextStep}>التالي</button> : 
              <button type="submit" className="btn btn-primary register-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'جار الإرسال...' : 'إتمام التسجيل'}
                {isSubmitting && <span className="spinner"></span>}
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
  
const Logo = ({ src = "img/logo-blue.png", className, ...props }) => (
  <img src={src} alt="شعار منصة ضاد" className={className} {...props} />
);

const App = () => {
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Data state
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [activeCourseFilter, setActiveCourseFilter] = useState('الكل');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  
  const [currentView, setCurrentView] = useState('main');
  const [detailsViewItem, setDetailsViewItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [player, setPlayer] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrent, setVideoCurrent] = useState(0);
  const [isPlayerApiBlocked, setIsPlayerApiBlocked] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactCountryCode, setContactCountryCode] = useState('+963');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  
  const [registerStudentName, setRegisterStudentName] = useState('');
  const [registerParentName, setRegisterParentName] = useState('');
  const [registerCountryCode, setRegisterCountryCode] = useState('+963');
  const [registerWhatsapp, setRegisterWhatsapp] = useState('');
  
  const [contactNameError, setContactNameError] = useState('');
  const [contactEmailError, setContactEmailError] = useState('');
  const [contactWhatsappError, setContactWhatsappError] = useState('');
  const [contactMessageError, setContactMessageError] = useState('');
  const [registerStudentNameError, setRegisterStudentNameError] = useState('');
  const [registerParentNameError, setRegisterParentNameError] = useState('');
  const [registerWhatsappError, setRegisterWhatsappError] = useState('');

  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const classesListRef = useRef(null);
  const classItemRefs = useRef(new Map());
  const [scrollState, setScrollState] = useState({ canScrollPrev: false, canScrollNext: false });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => { setToast({ show: false, message: '', type: 'success' }); }, 4000);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [classesResponse, coursesResponse] = await Promise.all([
                fetch('http://localhost:3001/api/classes'),
                fetch('http://localhost:3001/api/courses')
            ]);
            if (!classesResponse.ok || !coursesResponse.ok) {
                throw new Error('فشلت عملية جلب البيانات من الخادم.');
            }
            const classesData = await classesResponse.json();
            const coursesData = await coursesResponse.json();
            setClasses(classesData);
            setCourses(coursesData);
        } catch (err) {
            setError(err.message);
            console.error(err);
            showToast(err.message || 'حدث خطأ ما. يرجى التحقق من اتصالك بالإنترنت.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [showToast]);

  useEffect(() => {
    const container = classesListRef.current;
    if (!container) return;
    const checkScrollability = () => {
      const scrollableWidth = container.scrollWidth - container.clientWidth;
      const currentScroll = Math.round(Math.abs(container.scrollLeft));
      if (scrollableWidth < 1) { setScrollState({ canScrollPrev: false, canScrollNext: false }); return; }
      const canScrollPrev = currentScroll > 0;
      const canScrollNext = currentScroll < scrollableWidth;
      setScrollState({ canScrollPrev, canScrollNext });
    };
    checkScrollability();
    container.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);
    const timeoutId = setTimeout(checkScrollability, 100);
    return () => { clearTimeout(timeoutId); container.removeEventListener('scroll', checkScrollability); window.removeEventListener('resize', checkScrollability); };
  }, [classes]);

  useEffect(() => {
    const container = classesListRef.current;
    const item = classItemRefs.current.get(selectedClassIndex);
    if (container && item) {
      const containerWidth = container.offsetWidth;
      const itemWidth = item.offsetWidth;
      const itemOffsetLeft = item.offsetLeft;
      const scrollPosition = itemOffsetLeft + itemWidth / 2 - containerWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [selectedClassIndex]);

  const handleScroll = (direction) => {
    const container = classesListRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({ left: direction === 'prev' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  };

  const countryCodes = [ { code: '+963', name: 'سوريا' }, { code: '+90', name: 'تركيا' }, { code: '+962', name: 'الأردن' }, { code: '+34', name: 'إسبانيا' }, { code: '+61', name: 'أستراليا' }, { code: '+49', name: 'ألمانيا' }, { code: '+971', name: 'الإمارات' }, { code: '+973', name: 'البحرين' }, { code: '+32', name: 'بلجيكا' }, { code: '+216', name: 'تونس' }, { code: '+213', name: 'الجزائر' }, { code: '+45', name: 'الدنمارك' }, { code: '+966', name: 'السعودية' }, { code: '+46', name: 'السويد' }, { code: '+86', name: 'الصين' }, { code: '+964', name: 'العراق' }, { code: '+44', name: 'المملكة المتحدة' }, { code: '+212', name: 'المغرب' }, { code: '+52', name: 'المكسيك' }, { code: '+47', name: 'النرويج' }, { code: '+43', name: 'النمسا' }, { code: '+91', name: 'الهند' }, { code: '+31', name: 'هولندا' }, { code: '+1', name: 'الولايات المتحدة' }, { code: '+81', name: 'اليابان' }, { code: '+39', name: 'إيطاليا' }, { code: '+33', name: 'فرنسا' }, { code: '+358', name: 'فنلندا' }, { code: '+974', name: 'قطر' }, { code: '+1', name: 'كندا' }, { code: '+965', name: 'الكويت' }, { code: '+961', name: 'لبنان' }, { code: '+218', name: 'ليبيا' }, { code: '+60', name: 'ماليزيا' }, { code: '+20', name: 'مصر' }, { code: '+41', name: 'سويسرا' }, { code: '+968', name: 'عُمان' } ];

  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href || href === '#') return;
    
    const scrollToTarget = () => {
        const targetElement = document.querySelector(href);
        if (targetElement) {
            const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    if (currentView !== 'main') {
      setCurrentView('main');
      setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget();
    }
  };

  const handleMobileLinkClick = (e) => {
    handleSmoothScroll(e);
    setIsMobileMenuOpen(false);
  };
  
  const openRegisterModal = (title, subtitle) => {
    setModalTitle(title);
    setModalSubtitle(subtitle);
    setIsRegisterModalOpen(true);
  };
  
  const navigateToRegister = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('register');
  }

  const handleBackToMainFromRegister = () => {
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    setModalTitle(''); setModalSubtitle(''); setRegisterStudentName(''); setRegisterParentName(''); setRegisterWhatsapp(''); setRegisterCountryCode('+963');
    setRegisterStudentNameError(''); setRegisterParentNameError(''); setRegisterWhatsappError('');
  };

  useEffect(() => {
    document.body.style.overflow = (isMobileMenuOpen || isRegisterModalOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isRegisterModalOpen]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (headerRef.current) headerRef.current.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);
  
  const handlePlayVideo = () => { if (player) { player.unMute(); player.playVideo(); } };
  const handlePauseVideo = () => { if (player) player.pauseVideo(); };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    const m = Math.floor(sec / 60);
    return `${m}:${s}`;
  };

  const handleSeekByClick = (e) => {
    if (!player) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const dur = player.getDuration() || videoDuration;
    if (dur && !isNaN(dur)) {
      const target = pct * dur;
      player.seekTo(target, true);
      setVideoCurrent(target);
    }
  };

  useEffect(() => {
    if (currentView !== 'main' || isLoading) return; 

    const onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-player', {
        videoId: '9RJKoxZ1b50', playerVars: { autoplay: 0, mute: 1, loop: 1, playlist: '9RJKoxZ1b50', controls: 1, rel: 0, playsinline: 1, showinfo: 0, modestbranding: 1 },
        events: {
          onReady: (event) => { setPlayer(event.target); event.target.mute(); setVideoDuration(event.target.getDuration()); },
          onStateChange: (event) => {
            const YT = window.YT;
            if (YT) setIsVideoPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) { firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady; }
      // Fallback: if API blocked by extensions, show warning after timeout
      const apiTimeout = window.setTimeout(() => {
        if (!window.YT || !window.YT.Player) setIsPlayerApiBlocked(true);
      }, 4000);
      return () => window.clearTimeout(apiTimeout);
    } else { onYouTubeIframeAPIReady(); }
  }, [currentView, isLoading]);

  // Poll current time while video is playing
  useEffect(() => {
    if (!player) return;
    let intervalId;
    const tick = () => {
      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        if (!isNaN(cur)) setVideoCurrent(cur);
        if (!isNaN(dur) && dur !== 0) setVideoDuration(dur);
      } catch {}
    };
    tick();
    intervalId = window.setInterval(tick, 500);
    return () => { if (intervalId) window.clearInterval(intervalId); };
  }, [player]);
  
  useEffect(() => {
    if (currentView !== 'main' || isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId; let particles = [];
    const random = (min, max) => Math.random() * (max - min) + min;

    class Particle {
        constructor(x, y, radius, color, speedX, speedY) { this.x = x; this.y = y; this.radius = radius; this.color = color; this.speedX = speedX; this.speedY = speedY; }
        draw() { if (!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); ctx.closePath(); }
        update() {
            if (!canvas) return;
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.speedX = -this.speedX;
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.speedY = -this.speedY;
            this.x += this.speedX; this.y += this.speedY; this.draw();
        }
    }

    const init = () => {
        if (!canvas) return;
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
        const colors = ['rgba(0, 121, 107, 0.4)', 'rgba(247, 148, 29, 0.4)'];
        for (let i = 0; i < particleCount; i++) {
            const radius = random(1, 2.5); const x = random(radius, canvas.width - radius); const y = random(radius, canvas.height - radius);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speedX = random(-0.2, 0.2); const speedY = random(-0.2, 0.2);
            if (speedX === 0 || speedY === 0) continue;
            particles.push(new Particle(x, y, radius, color, speedX, speedY));
        }
    };

    const connect = () => {
        if (!ctx) return;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = Math.sqrt((particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2);
                if (distance < 120) {
                    const opacityValue = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(0, 121, 107, ${opacityValue})`; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                }
            }
        }
    };
    const animate = () => { if (!ctx || !canvas) return; ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => p.update()); connect(); animationFrameId = requestAnimationFrame(animate); };
    const handleResize = () => { cancelAnimationFrame(animationFrameId); init(); animate(); };
    init(); animate();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); };
  }, [currentView, isLoading]);

  useEffect(() => {
    if (currentView !== 'main' || isLoading) {
      document.querySelectorAll('nav a[href^="#"]').forEach(link => link.classList.remove('active'));
      setIndicatorStyle({ opacity: 0 });
      return;
    }
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
          const desktopLink = navRef.current?.querySelector(`a[href="#${id}"]`);
          if (desktopLink) setIndicatorStyle({ left: `${desktopLink.offsetLeft}px`, width: `${desktopLink.offsetWidth}px`, opacity: 1 });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));

    setTimeout(() => {
        const initialActiveLink = document.querySelector('.header-nav-desktop a.active') || document.querySelector('.header-nav-desktop a');
        if (initialActiveLink) setIndicatorStyle({ left: `${initialActiveLink.offsetLeft}px`, width: `${initialActiveLink.offsetWidth}px`, opacity: 1 });
    }, 100);

    return () => sections.forEach(section => observer.unobserve(section));
  }, [currentView, isLoading]);

  useEffect(() => {
    if (currentView !== 'main' || !navRef.current) return;
    const handleResize = () => {
        const activeLink = navRef.current?.querySelector('a.active');
        if (activeLink) {
            setIndicatorStyle({ transition: 'none', left: `${activeLink.offsetLeft}px`, width: `${activeLink.offsetWidth}px`, opacity: 1 });
            setTimeout(() => setIndicatorStyle(prev => ({ ...prev, transition: '' })), 100);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]);

  useEffect(() => {
    if (currentView !== 'main' || isLoading) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => observer.observe(item));
    return () => items.forEach(item => observer.unobserve(item));
  }, [currentView, isLoading]);
 
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuresData = [
    { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>, title: 'التعلم التفاعلي', description: 'بيئة تعليمية محفزة تشجع على المشاركة والتفكير النقدي من خلال الأنشطة والأدوات التفاعلية.' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-4 6c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg>, title: 'معلمون خبراء', description: 'نخبة من المعلمين المتخصصين أصحاب الكفاءة العالية لضمان أفضل تجربة تعليمية.' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>, title: 'توظيف المستحدثات الرقمية', description: 'نستخدم أحدث التقنيات والأدوات الرقمية لجعل عملية التعلم أكثر فعالية ومتعة.' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>, title: 'مناهج عالمية معتمدة', description: 'نعتمد على مناهج عالمية معتمدة مع تكييفها لتلبية احتياجات طلابنا وثقافتهم.' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>, title: 'تعلم متمركز على المتعلم', description: 'تعليم يراعي حاجات المتعلم اللغوية والنفسية والعمرية لضمان تطوره الشامل.' }
  ];
  const howItWorksData = [
    { number: '01', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>, title: 'أنشئ حسابك', description: 'ابدأ رحلتك بخطوة بسيطة: سجل بياناتك الأساسية وانضم إلى مجتمعنا التعليمي في أقل من دقيقة.' },
    { number: '02', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-12.5L14 4.5l-2.5 5-5-2.5 5 2.5zm5 5L10 19.5l2.5-5 5 2.5-5-2.5z"/></svg>, title: 'حدد مسارك', description: 'لا داعي للحيرة، اختبارنا التفاعلي يحدد مستواك بدقة ويوجهك نحو البرنامج الأنسب لك.' },
    { number: '03', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>, title: 'انطلق في التعلم', description: 'كل شيء جاهز الآن! انضم لصفوفك المباشرة، تفاعل مع المعلمين، واستكشف مكتبتنا الغنية بالمواد التعليمية.' }
  ];

  const courseFilters = isLoading ? [] : ['الكل', ...Array.from(new Set(courses.map(c => c.category)))];
  const selectedClass = classes[selectedClassIndex];
  const registrationSubtitle = "يرجى ملء النموذج التالي لإتمام عملية التسجيل. سنتواصل معك قريباً.";
  const isRegistration = modalTitle.startsWith('تسجيل في: ') || modalTitle === 'انضم إلينا الآن';
  
  useEffect(() => {
    const timer = setTimeout(() => setActiveSearchTerm(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (activeSearchTerm) {
        setActiveCourseFilter('الكل');
        const normalizedQuery = activeSearchTerm.toLowerCase();
        const matchingClassIndex = classes.findIndex(cls => cls.title.toLowerCase().includes(normalizedQuery) || cls.icon.includes(normalizedQuery) || cls.number.includes(normalizedQuery));
        const matchingCourses = courses.filter(course => course.title.toLowerCase().includes(normalizedQuery) || course.details.toLowerCase().includes(normalizedQuery) || course.category.toLowerCase().includes(normalizedQuery));
        if (matchingClassIndex !== -1) { setSelectedClassIndex(matchingClassIndex); setNoResultsFound(false);
        } else setNoResultsFound(matchingCourses.length === 0);
    } else setNoResultsFound(false);
  }, [activeSearchTerm, classes, courses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    setActiveSearchTerm(trimmedQuery);
    if (!trimmedQuery) return;
    setCurrentView('main');
    const normalizedQuery = trimmedQuery.toLowerCase();
    const matchingClassIndex = classes.findIndex(cls => cls.title.toLowerCase().includes(normalizedQuery) || cls.icon.includes(normalizedQuery) || cls.number.includes(normalizedQuery));
    const targetSectionId = matchingClassIndex !== -1 ? 'classes' : 'programs';
    setTimeout(() => {
      const targetElement = document.getElementById(targetSectionId);
      if (targetElement) {
          const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 80;
          const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchTerm('');
    document.querySelector('.hero-search-input')?.focus();
  };

  const filteredCourses = courses
      .filter(course => activeCourseFilter === 'الكل' || course.category === activeCourseFilter)
      .filter(course => {
          const term = activeSearchTerm.toLowerCase();
          return term === '' || course.title.toLowerCase().includes(term) || (course.details && course.details.toLowerCase().includes(term)) || course.category.toLowerCase().includes(term);
      });

  const validatePhoneNumber = (phone) => /^[0-9]{7,15}$/.test(phone);
  const validateEmail = (email) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactNameError(''); setContactEmailError(''); setContactWhatsappError(''); setContactMessageError('');
    let isValid = true;
    if (!contactName.trim()) { setContactNameError('الاسم الكامل مطلوب.'); isValid = false; }
    if (!validateEmail(contactEmail)) { setContactEmailError('الرجاء إدخال بريد إلكتروني صحيح.'); isValid = false; }
    if (!validatePhoneNumber(contactWhatsapp)) { setContactWhatsappError('يرجى إدخال رقم هاتف صحيح (7-15 أرقام).'); isValid = false; }
    if (!contactMessage.trim()) { setContactMessageError('الرسالة مطلوبة.'); isValid = false; }
    if (!isValid) return;
    setIsContactSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            countryCode: contactCountryCode,
            phone: contactWhatsapp,
            message: contactMessage,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال الرسالة.');
      }
      showToast('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!', 'success');
      setContactName(''); setContactEmail(''); setContactMessage(''); setContactWhatsapp(''); setContactCountryCode('+963');
    } catch (error) { showToast(error.message || 'حدث خطأ ما. يرجى التحقق من اتصالك بالإنترنت.', 'error');
    } finally { setIsContactSubmitting(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterStudentNameError(''); setRegisterParentNameError(''); setRegisterWhatsappError('');
    let isValid = true;
    if (!registerStudentName.trim()) { setRegisterStudentNameError('اسم الطالب مطلوب.'); isValid = false; }
    if (!registerParentName.trim()) { setRegisterParentNameError('اسم ولي الأمر مطلوب.'); isValid = false; }
    if (!validatePhoneNumber(registerWhatsapp)) { setRegisterWhatsappError('يرجى إدخال رقم هاتف صحيح (7-15 أرقام).'); isValid = false; }
    if (!isValid) return;
    setIsRegisterSubmitting(true);
    const course = modalTitle.replace('تسجيل في: ', '');
    try {
      const response = await fetch('http://localhost:3001/api/quick-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              studentName: registerStudentName,
              parentName: registerParentName,
              countryCode: registerCountryCode,
              phone: registerWhatsapp,
              course: course,
          }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل التسجيل.');
      }
      closeRegisterModal();
      showToast('تم إرسال طلب التسجيل بنجاح!', 'success');
    } catch (error) { showToast(error.message || 'حدث خطأ ما. يرجى التحقق من اتصالك بالإنترنت.', 'error');
    } finally { setIsRegisterSubmitting(false); }
  };
  
  const handleViewDetails = (item) => { setDetailsViewItem(item); setCurrentView('subjects'); };

  const handleBackToMain = () => {
    const targetSectionId = detailsViewItem?.category ? 'programs' : 'classes';
    setCurrentView('main'); setDetailsViewItem(null);
    setTimeout(() => {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            const headerHeight = headerRef.current?.offsetHeight ?? 80;
            const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }, 100);
  };

  const handleRegisterForSubject = (subjectName) => {
    if (detailsViewItem) openRegisterModal(`تسجيل في: ${detailsViewItem.title} - ${subjectName}`, registrationSubtitle);
  };
  
  const handleLogoClick = () => {
    if (currentView !== 'main') {
        setCurrentView('main');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-overlay">خطأ في تحميل البيانات: {error}</div>;
  }
  
  return (
    <React.Fragment>
      {currentView !== 'register' && (
        <header className="app-header" ref={headerRef}>
            <div className="header-container">
            <div className="header-brand-text" onClick={handleLogoClick} aria-label="ضـاد . Dhad" style={{cursor: 'pointer'}}>
             ضـاد<span className="brand-dot">.</span>Dhad
            </div>
            <nav className="header-nav-desktop" ref={navRef}>
                <a href="#home" onClick={handleSmoothScroll}>الرئيسية</a>
                <a href="#classes" onClick={handleSmoothScroll}>الصفوف</a>
                <a href="#programs" onClick={handleSmoothScroll}>البرامج</a>
                <a href="#features" onClick={handleSmoothScroll}>لماذا نحن؟</a>
                <a href="#contact-us" onClick={handleSmoothScroll}>تواصل معنا</a>
                <div className="nav-indicator" style={indicatorStyle}></div>
            </nav>
            <div className="header-actions">
                <button onClick={navigateToRegister} className="btn btn-primary">سجل الآن</button>
                <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMobileMenuOpen}>
                <span></span><span></span><span></span>
                </button>
            </div>
            </div>
        </header>
      )}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#home" onClick={handleMobileLinkClick}>الرئيسية</a>
          <a href="#classes" onClick={handleMobileLinkClick}>الصفوف</a>
          <a href="#programs" onClick={handleMobileLinkClick}>البرامج</a>
          <a href="#features" onClick={handleMobileLinkClick}>لماذا نحن؟</a>
          <a href="#contact-us" onClick={handleMobileLinkClick}>تواصل معنا</a>
          <button className="btn btn-primary" onClick={() => { navigateToRegister(); setIsMobileMenuOpen(false); }}>سجل الآن</button>
        </nav>
      </div>
      <main>
        {currentView === 'main' && (
          <React.Fragment>
             <section className="hero-section" id="home">
                <canvas ref={canvasRef} id="hero-particles"></canvas>
                <div className="hero-shape shape-1"></div> <div className="hero-shape shape-2"></div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title"><span className="title-main">جسركم للاندماج</span><br/>في <span className="title-accent">التعليم السوري</span></h1>
                        <p className="hero-subtitle">نحن هنا لمساعدة الطلاب السوريين العائدين والمتأثرين بالظروف على الاندماج بسلاسة في المناهج الدراسية السورية، مع برامج دعم متخصصة.</p>
                        <form className={`hero-search-form ${noResultsFound ? 'no-results' : ''}`} onSubmit={handleSearchSubmit}>
                            <input type="text" placeholder="ابحث عن صفك أو برنامجك..." className="hero-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button type="button" className={`hero-search-clear-btn ${searchQuery ? 'visible' : ''}`} onClick={handleClearSearch} aria-label="مسح البحث">&times;</button>
                            <button type="submit" className={`btn btn-primary hero-search-btn ${!searchQuery ? 'can-bounce' : ''}`}>ابحث</button>
                        </form>
                        <div className="hero-social-proof">
                            <div className="student-avatars">
                                <img src="https://i.pravatar.cc/40?u=1" alt="Student avatar 1"/>
                                <img src="https://i.pravatar.cc/40?u=2" alt="Student avatar 2"/>
                                <img src="https://i.pravatar.cc/40?u=3" alt="Student avatar 3"/>
                            </div>
                            <span>انضم لأكثر من <strong>5000</strong> طالب يتعلمون معنا!</span>
                        </div>
                    </div>
                    <div className="hero-image-container">
                        <div id="youtube-player"></div>
                        {!isVideoPlaying && <button className="video-play-button" onClick={handlePlayVideo} aria-label="تشغيل الفيديو"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></button>}
                        {isVideoPlaying && <button className="video-pause-button" onClick={handlePauseVideo} aria-label="إيقاف مؤقت"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>}
                    </div>
                </div>
            </section>
            <section id="classes" className="section">
              <div className="container">
                <h2 className="section-title">الصفوف الدراسية</h2>
                <p className="section-subtitle">اختر الصف المناسب من القائمة لاستعراض تفاصيله وخطة الدراسة المخصصة له.</p>
                <div className="classes-layout-container">
                    <div className={`classes-scroll-wrapper ${scrollState.canScrollPrev ? 'can-scroll-prev' : ''} ${scrollState.canScrollNext ? 'can-scroll-next' : ''}`}>
                      <button className={`classes-scroll-btn prev visible`} onClick={() => handleScroll('prev')} disabled={!scrollState.canScrollPrev} aria-label="الصف السابق">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                      </button>
                      <div className="classes-list" ref={classesListRef}>
                          {classes.map((cls, index) => (
                            <div key={index} className={`class-list-item ${index === selectedClassIndex ? 'active' : ''}`} onClick={() => setSelectedClassIndex(index)}
                              style={{ '--class-color': cls.color, '--class-color-light': `${cls.color}20` }}
                              ref={node => { const map = classItemRefs.current; if (node) map.set(index, node); else map.delete(index); }}>
                              <div className="class-list-icon" style={{ backgroundColor: cls.color }}>{cls.icon}</div>
                              <span>{cls.title}</span>
                            </div>
                          ))}
                      </div>
                      <button className={`classes-scroll-btn next visible`} onClick={() => handleScroll('next')} disabled={!scrollState.canScrollNext} aria-label="الصف التالي">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                      </button>
                    </div>
                    {selectedClass && (
                        <div className="class-details-panel" key={selectedClassIndex} style={{ '--class-color': selectedClass.color }}>
                            <div className="class-details-header">
                              <div className="class-card-icon" style={{ backgroundColor: selectedClass.color }}>{selectedClass.icon}</div>
                              <h3 className="class-card-title">{selectedClass.title}</h3>
                            </div>
                            <div className="class-details-info">
                              <p className="class-card-description">{selectedClass.description}</p>
                              <div className="class-details-footer">
                                <span className="class-card-subjects">{selectedClass.subjects}</span>
                                <a href="#subjects" onClick={(e) => { e.preventDefault(); handleViewDetails(selectedClass); }} className="btn btn-secondary" style={{backgroundColor: selectedClass.color}}>عرض التفاصيل</a>
                              </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </section>
            <section id="programs" className="section courses-section">
                <div className="container">
                    <h2 className="section-title">{activeSearchTerm && !noResultsFound ? `نتائج البحث عن: "${activeSearchTerm}"` : 'برامجنا الرئيسية'}</h2>
                    <p className="section-subtitle">{!activeSearchTerm && 'برامج مصممة لسد الفجوات التعليمية وتوفير الدعم اللازم للنجاح الأكاديمي.'}</p>
                    <div className="course-filters">
                      {courseFilters.map(filter => (
                        <button
                          key={filter}
                          className={`filter-btn ${activeCourseFilter === filter ? 'active' : ''}`}
                          onClick={() => setActiveCourseFilter(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    {noResultsFound ? (
                         <div className="no-results-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.49-1.49-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                            <h3>لم نجد ما تبحث عنه</h3>
                            <p>لم نتمكن من العثور على أي نتائج تطابق بحثك عن "<strong>{activeSearchTerm}</strong>".</p>
                            <p className="no-results-suggestion">جرّب البحث بكلمات أخرى أو تحقق من الأخطاء الإملائية.</p>
                        </div>
                    ) : 
                    
                    
                    (
                        <div className="grid courses-grid">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course, index) => (
                                    <div key={index} className="course-card">
                                        <div className={`course-card-icon-wrapper ${course.gradient}`}>
                                            <div dangerouslySetInnerHTML={{ __html: course.iconSvg }} />
                                            <span className="course-card-category">{course.category}</span>
                                        </div>
                                        <div className="course-card-content">
                                            <h3 className="course-card-title">{course.title}</h3>
                                            <p className="course-card-details">{course.details}</p>
                                            <div className="course-card-footer">
                                                {course.subjectDetails && course.subjectDetails.length > 0 ? (
                                                  <a href="#" onClick={(e) => { e.preventDefault(); handleViewDetails(course); }} className="btn btn-secondary course-card-cta">عرض التفاصيل</a>
                                                ) : (
                                                  <a href="#" onClick={(e) => { e.preventDefault(); openRegisterModal(`تسجيل في: ${course.title}`, registrationSubtitle); }} className="btn btn-secondary course-card-cta">سجل الآن</a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (<p className="no-results-message">{activeSearchTerm ? 'لا توجد نتائج تطابق بحثك في هذه الفئة.' : 'لا توجد برامج في هذه الفئة حالياً.'}</p>)}
                        </div>
                    )}
                    {!activeSearchTerm && !noResultsFound && <div className="view-all-courses-container"><a href="#" className="btn btn-primary">عرض كل البرامج</a></div>}
                </div>
            </section>
            <section className="section placement-test-section">
                <div className="container placement-test-card">
                    <div className="placement-test-content">
                        <h2 className="section-title">لست متأكداً من المستوى المناسب؟</h2>
                        <p className="placement-test-description">لا تقلق! نقدم اختبار تحديد مستوى دقيق وشامل يساعدك في اختيار الصف أو البرنامج الأنسب لقدراتك واحتياجاتك، مما يضمن لك بداية صحيحة وفعالة.</p>
                        <button className="btn btn-primary placement-test-cta">ابدأ اختبار تحديد المستوى</button>
                    </div>
                    <div className="placement-test-visual"><div className="placement-test-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div></div>
                </div>
            </section>
            <section id="features" className="section">
                <div className="container">
                    <h2 className="section-title">لماذا تختار منصة ضاد؟</h2><p className="section-subtitle">نقدم تعليماً عالي الجودة يتجاوز حدود الفصول الدراسية التقليدية.</p>
                    <div className="grid features-grid">{featuresData.map((feature, index) => (<div key={index} className="feature-card"><div className="feature-card-icon">{feature.icon}</div><h3 className="feature-card-title">{feature.title}</h3><p className="feature-card-description">{feature.description}</p></div>))}</div>
                </div>
            </section>
            <section id="how-it-works" className="section how-it-works-section">
              <div className="container">
                <h2 className="section-title">كيف تبدأ رحلتك؟</h2><p className="section-subtitle">ثلاث خطوات بسيطة تفصلك عن بداية رحلة تعليمية ممتعة وفعالة.</p>
                <div className="how-it-works-timeline">{howItWorksData.map((step, index) => (<div key={index} className="timeline-item"><div className="timeline-node">{step.icon}</div><div className="timeline-content"><h3 className="timeline-title">{step.title}</h3><p className="timeline-description">{step.description}</p></div></div>))}</div>
              </div>
            </section>
            <section id="contact-us" className="section contact-section">
              <div className="container">
                <div className="section-header"><h2 className="section-title">تواصل معنا</h2><p className="section-subtitle">هل لديك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك. املأ النموذج أدناه أو استخدم إحدى طرق التواصل المباشرة.</p></div>
                <div className="contact-card">
                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                            <div className={`form-group ${contactNameError ? 'has-error' : ''}`}><input type="text" id="name" name="name" required placeholder=" " value={contactName} onChange={(e) => setContactName(e.target.value)} /><label htmlFor="name">الاسم الكامل</label><svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><p className="form-hint">الرجاء إدخال اسمك الثلاثي.</p>{contactNameError && <p className="form-error">{contactNameError}</p>}</div>
                            <div className={`form-group ${contactEmailError ? 'has-error' : ''}`}><input type="email" id="email" name="email" required placeholder=" " value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /><label htmlFor="email">البريد الإلكتروني</label><svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><p className="form-hint">مثال: user@example.com</p>{contactEmailError && <p className="form-error">{contactEmailError}</p>}</div>
                            <div className={`form-group ${contactWhatsappError ? 'has-error' : ''}`}><div className="phone-group"><select className="country-code-select" value={contactCountryCode} onChange={(e) => setContactCountryCode(e.target.value)} aria-label="Country Code">{countryCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}</select><input type="tel" id="whatsapp" name="whatsapp" value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder=" " required /><label htmlFor="whatsapp">رقم الواتساب</label><svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.27-.13-1.62-.8-1.87-.89-.25-.09-.44-.13-.62.13-.18.27-.71.89-.87 1.08-.16.18-.32.2-.6.06-.28-.13-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.92-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.41.13-.1.18-.18.27-.31.09-.13.04-.25 0-.38-.05-.13-.62-1.5-1.02-2.05-.18-.22-.37-.27-.51-.27-.14 0-.3 0-.44.02-.6.09-1.05.5-1.21 1.25-.13.58.27 2.16.32 2.31.3.75 1.5 3.12 3.65 4.35 1.25.75 2.2 1.05 2.8.9.7-.15 1.5-.7 1.75-1.3.25-.6.25-1.15.18-1.25z"/></svg></div><p className="form-hint">سيتم استخدام هذا الرقم للتواصل معك بشكل مباشر.</p>{contactWhatsappError && <p className="form-error">{contactWhatsappError}</p>}</div>
                            <div className={`form-group ${contactMessageError ? 'has-error' : ''}`}><textarea id="message" name="message" rows={5} required placeholder=" " value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}></textarea><label htmlFor="message">رسالتك</label><svg className="form-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg><p className="form-hint">لا تتردد في كتابة أي استفسار لديك.</p>{contactMessageError && <p className="form-error">{contactMessageError}</p>}</div>
                            <button type="submit" className="btn btn-primary" disabled={isContactSubmitting}>{isContactSubmitting ? 'جار الإرسال...' : 'إرسال الرسالة'}{isContactSubmitting && <span className="spinner"></span>}</button>
                        </form>
                    </div>
                    <div className="contact-separator"><span>أو</span></div>
                    <div className="contact-direct-wrapper">
                      <a href="mailto:info@dhad.com?subject=Inquiry%20from%20DHAD%20platform" className="contact-info-block"><div className="info-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zM12 11 4 6h16l-8 5z"/></svg></div><div className="info-text"><h4>راسلنا عبر البريد الإلكتروني</h4><span>info@dhad.com</span></div></a>
                      <a href="https://wa.me/963987654321" target="_blank" rel="noopener noreferrer" className="contact-info-block"><div className="info-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.27-.13-1.62-.8-1.87-.89-.25-.09-.44-.13-.62.13-.18.27-.71.89-.87 1.08-.16.18-.32.2-.6.06-.28-.13-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.92-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.41.13-.1.18-.18.27-.31.09-.13.04-.25 0-.38-.05-.13-.62-1.5-1.02-2.05-.18-.22-.37-.27-.51-.27-.14 0-.3 0-.44.02-.6.09-1.05.5-1.21 1.25-.13.58.27 2.16.32 2.31.3.75 1.5 3.12 3.65 4.35 1.25.75 2.2 1.05 2.8.9.7-.15 1.5-.7 1.75-1.3.25-.6.25-1.15.18-1.25z"/></svg></div><div className="info-text"><h4>تحدث معنا عبر الواتساب</h4><span>+963 987 654 321</span></div></a>
                    </div>
                     <div className="contact-social-block">
                      <h4>تابعنا على وسائل التواصل</h4>
                      <ul className="social-list contact-social">
                        <li>
                          <a className="social-item facebook" href="https://www.facebook.com/share/16ESACcfxJ/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <span className="social-icon" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M18 2h-2.5A3.5 3.5 0 0 0 12 5.5V9H9v3h3v9h3v-9h3l1-3h-4V6.5c0-.83.67-1.5 1.5-1.5H18z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a className="social-item instagram" href="https://www.instagram.com/dhadedu4?igsh=MWIxMDhweHpsYjh6dA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <span className="social-icon" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.8"/>
                                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
                                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                              </svg>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a className="social-item youtube" href="https://youtube.com/@dhadedu?si=WTCUJeYylCcTTEaP" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <span className="social-icon" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <rect x="2.5" y="5.5" width="19" height="13" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
                                <polygon points="10 15 15 12 10 9" fill="currentColor"/>
                              </svg>
                            </span>
                          </a>
                        </li>
                        <li>
                          <a className="social-item linkedin" href="https://www.linkedin.com/company/%D8%B6%D8%A7%D8%AF-dhad/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <span className="social-icon" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <rect x="3" y="9" width="4" height="12" fill="none" stroke="currentColor" stroke-width="1.8"/>
                                <circle cx="5" cy="5" r="2" fill="currentColor"/>
                                <path d="M16 9a5 5 0 0 1 5 5v7h-4v-7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7h-4v-7a5 5 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        )}
        {currentView === 'subjects' && detailsViewItem && <SubjectsView itemInfo={detailsViewItem} onBack={handleBackToMain} onRegister={handleRegisterForSubject} />}
        {currentView === 'register' && <RegistrationView classes={classes} onBackToMain={handleBackToMainFromRegister} showToast={showToast} />}
      </main>
      {currentView !== 'register' && (
        <footer className="app-footer">
            <div className="container">
            <div className="footer-top">
            <div className="footer-grid">
                <div className="footer-column"><div className="footer-brand-text" aria-label="ضـاد . Dhad">ضـاد<span className="brand-dot">.</span>Dhad</div><p className="footer-about">منصة تعليمية تهدف إلى دعم الطلاب السوريين وتسهيل اندماجهم في النظام الأكاديمي السوري </p></div>
                <div className="footer-column"><h3 className="footer-heading">روابط سريعة</h3><ul className="footer-links"><li><a href="#home" onClick={handleSmoothScroll}>الرئيسية</a></li><li><a href="#classes" onClick={handleSmoothScroll}>الصفوف</a></li><li><a href="#programs" onClick={handleSmoothScroll}>البرامج</a></li><li><a href="#features" onClick={handleSmoothScroll}>لماذا نحن؟</a></li></ul></div>
                <div className="footer-column"><h3 className="footer-heading">برامجنا</h3><ul className="footer-links"><li><a href="#programs" onClick={(e) => { handleSmoothScroll(e); setActiveCourseFilter('التعليم التعويضي المسرّع');}}>التعليم التعويضي</a></li><li><a href="#programs" onClick={(e) => { handleSmoothScroll(e); setActiveCourseFilter('تعليم اللغة العربية لغير الناطقين');}}>العربية لغير الناطقين</a></li><li><a href="#programs" onClick={(e) => { handleSmoothScroll(e); setActiveCourseFilter('برامج علاجية استشارية');}}>برامج علاجية</a></li><li><a href="#programs" onClick={(e) => { handleSmoothScroll(e); setActiveCourseFilter('دورات تدريبية إضافية');}}>دورات إضافية</a></li></ul></div>
                <div className="footer-column">
                  <h3 className="footer-heading">تابعنا</h3>
                  <ul className="social-list">
                    <li>
                      <a className="social-item facebook" href="https://www.facebook.com/share/16ESACcfxJ/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <span className="social-icon" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M18 2h-2.5A3.5 3.5 0 0 0 12 5.5V9H9v3h3v9h3v-9h3l1-3h-4V6.5c0-.83.67-1.5 1.5-1.5H18z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="social-item instagram" href="https://www.instagram.com/dhadedu4?igsh=MWIxMDhweHpsYjh6dA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <span className="social-icon" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.8"/>
                            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="social-item youtube" href="https://youtube.com/@dhadedu?si=WTCUJeYylCcTTEaP" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <span className="social-icon" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <rect x="2.5" y="5.5" width="19" height="13" rx="3" ry="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
                            <polygon points="10 15 15 12 10 9" fill="currentColor"/>
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="social-item linkedin" href="https://www.linkedin.com/company/%D8%B6%D8%A7%D8%AF-dhad/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <span className="social-icon" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <rect x="3" y="9" width="4" height="12" fill="none" stroke="currentColor" stroke-width="1.8"/>
                            <circle cx="5" cy="5" r="2" fill="currentColor"/>
                            <path d="M16 9a5 5 0 0 1 5 5v7h-4v-7a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7h-4v-7a5 5 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
            </div>
            </div>
            <div className="footer-bottom"><p> {new Date().getFullYear()} &copy; منصة ضاد التعليمية </p></div>
            </div>
        </footer>
      )}
      {isRegisterModalOpen && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeRegisterModal} aria-label="إغلاق">&times;</button>
            <h2 className="modal-title">{modalTitle.includes('-') ? (<React.Fragment>{modalTitle.split('-')[0]} - <span>{modalTitle.split('-')[1]}</span></React.Fragment>) : (isRegistration ? <span>{modalTitle}</span> : modalTitle)}</h2>
            <p className="modal-subtitle">{modalSubtitle}</p>
            <form className="registration-form" onSubmit={handleRegisterSubmit} noValidate>
              <div className="form-group"><label htmlFor="modal-student-name">اسم الطالب</label><input type="text" id="modal-student-name" name="student-name" required value={registerStudentName} onChange={(e) => setRegisterStudentName(e.target.value)} className={registerStudentNameError ? 'input-error' : ''}/>{registerStudentNameError && <p className="form-error">{registerStudentNameError}</p>}</div>
              <div className="form-group"><label htmlFor="modal-parent-name">اسم ولي الأمر</label><input type="text" id="modal-parent-name" name="parent-name" required value={registerParentName} onChange={(e) => setRegisterParentName(e.target.value)} className={registerParentNameError ? 'input-error' : ''}/>{registerParentNameError && <p className="form-error">{registerParentNameError}</p>}</div>
              <div className="form-group"><label htmlFor="modal-whatsapp">رقم واتساب ولي الأمر</label><div className={`input-with-prefix ${registerWhatsappError ? 'input-error' : ''}`}><select className="country-code-select" value={registerCountryCode} onChange={(e) => setRegisterCountryCode(e.target.value)}>{countryCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}</select><input type="tel" id="modal-whatsapp" name="whatsapp" required value={registerWhatsapp} onChange={(e) => setRegisterWhatsapp(e.target.value)} placeholder="789 123 456"/></div>{registerWhatsappError && <p className="form-error">{registerWhatsappError}</p>}</div>
              <button type="submit" className="btn btn-primary form-submit-btn" disabled={isRegisterSubmitting}>
                {isRegisterSubmitting ? 'جار الإرسال...' : 'إرسال طلب التسجيل'}
                {isRegisterSubmitting && <span className="spinner"></span>}
              </button>
            </form>
          </div>
        </div>
      )}
      {currentView !== 'register' && showBackToTop && <button onClick={scrollToTop} className="fab" aria-label="العودة للأعلى"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41-1.41z"/></svg></button>}
      {toast.show && <div className={`toast-notification ${toast.type} ${toast.show ? 'show' : ''}`} role="alert"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>{toast.message}</span></div>}
    </React.Fragment>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}