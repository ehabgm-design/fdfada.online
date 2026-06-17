import { useState, useEffect } from "react";
import { Copy, DiscAlbum, CheckCircle2, Crown, Sparkles, Gem, ShieldAlert } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Store() {
  const [userId, setUserId] = useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [activePack, setActivePack] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    fetch("/api/paypal/config")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPaypalConfig(data);
        setLoading(false);
      });
  }, []);

  const handleCapture = async (orderId: string, packId: string) => {
    try {
      const res = await fetch("/api/payments/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId, packId })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`🎉 تمت عملية الدفع بنجاح! رصيدك الحالي: ${data.coins} كوينز.`);
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(data.error || "فشل التحقق من الدفع.");
      }
    } catch (e) {
      setErrorMsg("حدث خطأ أثناء معالجة الدفع.");
    }
  };

  const PACKS = [
    { id: "15coins", name: "محفظة البداية - 15 كوينز", priceKey: 'coinPrice15', icon: Sparkles, color: "amber" },
    { id: "50coins", name: "محفظة التألق - 50 كوينز", priceKey: 'coinPrice50', icon: DiscAlbum, color: "orange" },
    { id: "120coins", name: "المحفظة الفاخرة - 120 كوينز", priceKey: 'coinPrice120', icon: Gem, color: "teal" },
    { id: "golden", name: "الباقة الذهبية (شهر)", priceKey: 'goldenPrice', icon: Crown, color: "yellow" },
    { id: "diamond", name: "العضوية الماسية (شهر)", priceKey: 'diamondPrice', icon: Crown, color: "purple" }
  ];

  if (loading) return <div className="p-12 text-center text-slate-500">جاري تحميل الباقات والدفع الآمن...</div>;
  if (!userId) return <div className="p-12 text-center font-bold text-slate-700">الرجاء تسجيل الدخول أولاً للوصول إلى المتجر.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
      <div className="mb-10 text-right">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-end gap-2 mb-2">
          متجر المنصة الآمن <ShieldAlert className="text-teal-600" />
        </h1>
        <p className="text-slate-500 text-sm">احصلي على كوينز وتطويرات لعضويتك بكل سرية وآمان عن طريق بوابة PayPal العالمية.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold text-center flex items-center justify-center gap-2">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right rtl">
        {PACKS.map(pack => {
          const Icon = pack.icon;
          const price = paypalConfig?.prices?.[pack.priceKey];

          return (
            <div key={pack.id} className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all bg-white shadow-sm ${activePack === pack.id ? 'border-teal-500 scale-105 shadow-xl' : 'border-slate-100 hover:border-slate-300'}`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${pack.color}-100 text-${pack.color}-600`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{pack.name}</h3>
                <p className="text-2xl font-black text-slate-900 font-mono">${price}</p>
                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {pack.id.includes("coins") ? (
                    <>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> رصيد يضاف فوراً لمحفظتك</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> لا تنتهي صلاحية الكوينز</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> استخدميها في الدردشات أو الهدايا</p>
                    </>
                  ) : pack.id === "golden" ? (
                    <>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> شارة الباقة الذهبية في ملفك</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> أولوية في الظهور بالردود</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> صلاحية 30 يوماً</p>
                    </>
                  ) : (
                    <>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> شارة العضوية الماسية المميزة</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> إمكانيات غير محدودة للدردشة</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 text-${pack.color}-500`} /> صلاحية 30 يوماً</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                {activePack === pack.id && paypalConfig?.clientId ? (
                  <PayPalScriptProvider options={{ clientId: paypalConfig.clientId, currency: "USD", intent: "capture" }}>
                    <PayPalButtons 
                      style={{ layout: "horizontal", height: 40, color: "black", tagline: false }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: price.toString(), currency_code: "USD" },
                            description: pack.name,
                            custom_id: `${userId}|${pack.id}`
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return handleCapture(data.orderID, pack.id);
                      }}
                      onCancel={() => {
                        setActivePack(null);
                        setErrorMsg("تم إلغاء عملية الدفع.");
                      }}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        setErrorMsg("حدث خطأ في بطاقة الدفع أو الاتصال بـ PayPal.");
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <button 
                    onClick={() => {
                      setActivePack(pack.id);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition active:scale-95"
                  >
                    شراء الآن بصلاحية وسرية
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  );
}
