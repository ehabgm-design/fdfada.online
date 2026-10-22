import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Shield, Lock, CheckCircle, ArrowRight, FileText } from "lucide-react";
import { WHATSAPP_NUMBER, getWhatsAppUrl, WhatsAppIcon } from "../components/WhatsAppSupport";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "سياسة الخصوصية والأمان - فضفضة أونلاين | Fdfada Online";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 rtl text-right" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 w-fit px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            <span>توثيق حماية البيانات والشفافية الرسمية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            سياسة الخصوصية والأمان <span className="text-plum">• فضفضة أونلاين</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            نطاقنا الرسمي: <strong className="text-teal-700 font-mono">https://www.fdfada.online</strong>. نحن نؤمن بأن الخصوصية النفسية والسرية التامة هي أساس الأمان والتمكين الوجداني لكل زائر وعضو.
          </p>
          <div className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <span>تاريخ التحديث الأخير: أكتوبر 2026</span>
            <span>الامتثال لمعايير الأمان و Google Cloud</span>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>1. مقدمة توضيحية وهدف المنصة</span>
            </h2>
            <p>
              تعتبر منصة <strong>فضفضة أونلاين (Fdfada Online)</strong> مساحة رقمية آمنة ومصممة خصيصاً لتوفير بيئة بوح وتفريغ نفسي ودعم وجداني مجهول أو بمزيد من الخصوصية للفتيات والسيدات في الوطن العربي. هدفنا الرئيسي هو تخفيف الضغوط النفسية، إتاحة صندوق صراحة مجهول لإرسال واستقبال الرسائل، وتوفير أدوات الذكاء الاصطناعي الوجداني ومجتمعات الدعم السكيني بكل سرية وأمان تام دون أي أحكام أو تطفل.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>2. البيانات التي يتم جمعها وكيفية التعامل معها</span>
            </h2>
            <p>
              نحن نلتزم بأعلى معايير الحد الأدنى من جمع البيانات:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-4 text-slate-600">
              <li>
                <strong>البيانات الاختيارية عند التسجيل:</strong> مثل اسم المستخدم، اسم العرض، البريد الإلكتروني (اختياري تماماً)، أو رمز الدولة والرمز الأفاتار الرمزي، وذلك لتأمين حسابك وصندوق رسائلك المجهول.
              </li>
              <li>
                <strong>الرسائل والبوح المجهول:</strong> يتم التعامل مع نصوص البوح والرسائل بسرية تامة وتشفير كامل، ولا يتم ربط النصوص بهوية حقيقية إلا إذا اختار المستخدم ذلك بمحض إرادته.
              </li>
              <li>
                <strong>ملفات تعريف الارتباط (Cookies) وأكواد التحليل:</strong> نستخدم ملفات تعريف الارتباط التقنية البسيطة فقط للحفاظ على جلسة تسجيل الدخول وتفضيلات التصفح، وتحسين تجربة الأداء والسرعة وفق معايير Google Cloud.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>3. كيفية استخدام البيانات والغايات منها</span>
            </h2>
            <p>
              نؤكد لكم بكل وضوح: <strong>لا تُستخدم بياناتكم أو رسائلكم لأي غايات تجارية إطلاقاً، ولا يتم بيع أو مشاركة أي بيانات شخصية مع أي أطراف ثالثة.</strong>
            </p>
            <p>
              نستخدم البيانات التقنية المحصورة فقط للأغراض التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-4 text-slate-600">
              <li>تشغيل المنصة واستقرار خوادمها على السحابة الآمنة.</li>
              <li>تأمين الحسابات ومنع الهجمات أو الاختراقات أو محاولات التطفل.</li>
              <li>تحسين جودة الخدمة النفسية التفاعلية ومقترحات مؤشر الوجدان.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>4. أمان وحماية البيانات والتشفير</span>
            </h2>
            <p>
              تلتزم منصة فضفضة أونلاين بتطبيق أحدث معايير التشفير الرقمي (SSL/TLS) وبروتوكولات حماية قواعد البيانات لمنع أي وصول غير مصرح به. رسائل الصراحة والبوح تخضع لسياسات تخزين آمنة وحذف تلقائي عند الطلب، مما يضمن خصوصية الزوار والعضوات بالكامل.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>5. وسائل التواصل والدعم الرسمي (واتساب)</span>
            </h2>
            <p>
              إذا كان لديكم أي استفسارات تتعلق بسيصوصية الخصوصية، أو رغبة في طلب مساعدة نفسية مباشرة وموثوقة مع شخص مستمع عبر الواتساب، يمكنكم التواصل معنا حصراً عبر الرقم الرسمي المعتمد:
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">رقم التواصل المعتمد للخصوصية والبوح:</p>
                  <p className="text-base font-black text-emerald-900 font-mono dir-ltr">{WHATSAPP_NUMBER}</p>
                </div>
              </div>
              <a 
                href={getWhatsAppUrl("مرحباً، لدي استفسار بخصوص سياسة الخصوصية والبيانات في منصة فضفضة أونلاين 🌸")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                تواصل واتساب 💬
              </a>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>6. التعديلات والتحديثات المستمرة</span>
            </h2>
            <p>
              قد يتم تحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة أي تطورات تقنية أو قانونية أو تحسينات في الخدمات. ننصح بمراجعة هذه الصفحة دورياً للاطلاع على أحدث الإصدارات. استمرارك في استخدام منصة <strong>fdfada.online</strong> يعتبر موافقة صريحة على هذه السياسة.
            </p>
          </section>

        </div>

        {/* Footer Navigation Back */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-plum transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">fdfada.online</span>
        </div>

      </div>
    </div>
  );
}
