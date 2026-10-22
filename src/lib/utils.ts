import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseResponseJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!contentType.includes("application/json")) {
    if (res.status === 404) {
      throw new Error("عذراً، مسار الخدمة غير موجود (404). يرجى التأكد من تشغيل الخادم.");
    }
    throw new Error(`تعذر الاتصال بالخادم (${res.status}). يرجى المحاولة لاحقاً.`);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("خطأ في تحليل استجابة الخادم.");
  }
}
