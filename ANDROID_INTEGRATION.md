# دليل دمج تطبيق أندرويد الخارجي مع منصة الفضفضة والمصارحة
### دليل توثيقي شامل للمطورين لتمكين التوافق التام بين المنصة الويب والمحمول

يرسم هذا الدليل خريطة طريق متكاملة للمطورين لربط تطبيق أندرويد (رين تيك / محمول) خارجي بالبنية التحتية الخلفية للمنصة. يتم الدمج والربط عبر قناتين متكاملتين لضمان المزامنة الآنية والسرية المطلقة للبيانات:
1. **الاتصال المباشر بقاعدة بيانات Firebase (Firestore & Authentication)** لسحب وعرض وتحديث البيانات الآنية.
2. **استهلاك واجهات البرمجة التطبيقية (RESTful APIs)** لإجراء العمليات الخلفية المعقدة (المصارحات السرية، إدارة الغرف والموافقة المزدوجة، والتحكم الإداري).

---

## 1. دمج قاعدة بيانات Firebase المباشرة (Firestore & Auth)

تعتمد المنصة على بنية تحتية مرنة في **Firebase Cloud Firestore** لإتاحة الاتصال وتحديث البيانات بخصائص الوقت الفعلي (Real-time).

### أ. ملف الإعداد والمكتبات المطلوبة في أندرويد
يجب أولاً تنزيل ملف الإعداد الكود `google-services.json` من لوحة تحكم مشروع Firebase ووضعه داخل مجلد `app/` الخاص بمشروع أندرويد، ثم إرفاق المكتبات التالية في ملف `build.gradle.kts` (أو `build.gradle` للوحدة):

```kotlin
dependencies {
    // Firebase BoM
    implementation(platform("com.google.firebase:firebase-bom:33.1.0"))
    
    // SDKs المطلوبة
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
}
```

### ب. هيكلية المخطط وجداول البيانات (Firestore Schemas)
يتطابق تطبيق أندرويد مباشرة مع المجموعات (Collections) التالية المعرفة في `firebase-blueprint.json`:

#### 1. معلومات الحساب والمستخدمين (`/users/{userId}`)
تحتوي على بيانات الهوية والبلد المفضل:
*   `id`: `String` (معرف المستخدم من Firebase Auth)
*   `username`: `String` (اسم مستخدم فريد ومسبوق بـ `@`)
*   `age`: `Int` (عمر المستخدم)
*   `country`: `String` (بلد الإقامة الافتراضي لفلترة غرف ومجتمعات الدول)
*   `language`: `String` (اللغة المفضلة)
*   `isPaid`: `Boolean` (مؤشر الاشتراك الفاخر)
*   `createdAt`: `String` (بصيغة ISO 8601 UTC)

#### 2. صندوق الرسائل المجهولة والفضفضة السيرية (`/anonMessages/{msgId}`)
تخزن رسائل الصراحة القادمة للمستخدمين دون تخزين أي مرجع مرسل لحماية الخصوصية:
*   `id`: `String` (معرف الرسالة)
*   `userId`: `String` (معرف المستخدم المستلم للرسالة)
*   `message`: `String` (محتوى الفضفضة)
*   `createdAt`: `String` (بصيغة ISO 8601 UTC)

#### 3. رواق المصارحة ومجتمعات الدول (`/posts/{postId}`)
يحتوي على المنشورات العامة المنشورة في المجتمعات المشتركة لتبادل الدعم النفسي:
*   `id`: `String` (معرف المنشور)
*   `author`: `String` (اسم الكاتب المستعار أو `"زائرة مجهولة"` للسرية المطلقة)
*   `content`: `String` (محتوى المنشور)
*   `category`: `String` (التسمية التخصصية: `"دعم نفسي"`، `"علاقات"`، `"فضفضة حرة"`، `"اكتئاب وحزن"`، `"عام"`)
*   `country`: `String` (الغرفة التابعة للبلد مثل `"مصر"`، `"السعودية"`، إلخ)
*   `likes`: `Int` (عدد الإعجابات)
*   `createdAt`: `String` (تاريخ الإنشاء)

#### 4. غرف المحادثات الثنائية المغلقة ذات القبول المزدوج (`/chats/{chatId}`)
تمثل الشراكات الحوارية الآمنة بعد موافقة الطرفين؛ لضمان عدم إزعاج الفتيات:
*   `id`: `String` (معرف غرفة الدردشة)
*   `userA`: `String` (معرف المبادرة بالطلب)
*   `userB`: `String` (معرف الشخص المستهدف)
*   `acceptedA`: `Boolean` (موافقة العضوة أ)
*   `acceptedB`: `Boolean` (موافقة العضوة ب)
*   `lastMessage`: `String` (آخر رسالة لغرض المعاينة)
*   `createdAt`: `String` (تاريخ الإنشاء للغرفة)

---

### ج. أمثلة برمجية في Kotlin لقراءة وتوثيق Firestore

#### تهيئة الاتصال بقاعدة البيانات في كود أندرويد:
```kotlin
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

class FirebaseManager {
    private val db: FirebaseFirestore = Firebase.firestore

    // استماع آني لمنشورات رواق المصارحة لبلد محدد ومجتمع محدد
    fun listenToCommunityPosts(
        country: String,
        category: String,
        onUpdate: (List<Post>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        var query = db.collection("posts")
            .whereEqualTo("country", country)
        
        if (category != "الكل") {
            query = query.whereEqualTo("category", category)
        }
        
        query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                onError(error)
                return@addSnapshotListener
            }
            if (snapshot != null) {
                val postsList = snapshot.documents.mapNotNull { doc ->
                    doc.toObject(Post::class.java)?.copy(id = doc.id)
                }
                onUpdate(postsList)
            }
        }
    }
}

// نموذج البيانات للمنشور
data class Post(
    val id: String = "",
    val author: String = "",
    val content: String = "",
    val category: String = "",
    val country: String = "",
    val likes: Int = 0,
    val createdAt: String = ""
)
```

---

## 2. مرجع واجهات البرمجة التطبيقية (REST API Reference)

يوفر خادم المنصة الرئيسي مجموعة كاملة من المسارات التفاعلية للتعامل مع البيانات والعمليات الحساسة التي تتطلب حماية ومصادقة خلفية.

### أولاً: معلومات خادم الويب الأساسية
*   **رابط الخادم الافتراضي (Base URL):** `https://[YOUR_RUN_APP_URL]`
*   **ترويسة نوع المحتوى (Headers):** `Content-Type: application/json`

---

### ثانياً: تفصيل مسارات وواجهات الـ API

#### 1. تسجيل مستخدمة جديدة (User Registration)
لإنشاء حساب فتاة جديد وتسكين بيانات منطقتها وعمرها بنجاح وبسرية.
*   **المسار:** `POST /api/register`
*   **جسم الطلب (Body):**
```json
{
  "username": "fatima_99",
  "age": 24,
  "country": "السعودية"
}
```
*   **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "تم التسجيل بنجاح! 🌸",
  "userId": "usr_abc123xyz",
  "username": "fatima_99"
}
```

#### 2. تسجيل الدخول (User Login)
للوصول السريع إلى الريدم ولوحة التحكم عبر الاسم والتحقق.
*   **المسار:** `POST /api/login`
*   **جسم الطلب (Body):**
```json
{
  "username": "fatima_99"
}
```
*   **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "تم تسجيل الدخول بنجاح! 🔓",
  "userId": "usr_abc123xyz",
  "username": "fatima_99",
  "age": 24,
  "country": "السعودية"
}
```

---

#### 3. إكمال وتعديل الملف الشخصي الكامل (Profile Completion & Management)

يستخدم مابعد تسجيل الدخول أو عند الدمج الفوري بواسطة حسابات جوجل لتحديث الصورة الرمزية، الاسم المستعار، البلد، السيرة الذاتية والموافقة على البنود.

*   **تحديث معلومات الملف الشخصي:**
    *   **المسار:** `POST /api/profile/update`
    *   **جسم الطلب (Body):**
    ```json
    {
      "userId": "usr_abc123xyz",
      "displayName": "فاطمة الزهراء",
      "username": "fatima_99",
      "age": "18 - 25 سنة (شابة يافعة)",
      "country": "السعودية",
      "bio": "مهتمة بالدعم النفسي والإرشاد الأسري الفعال 🌸",
      "avatarEmoji": "🌸"
    }
    ```
    *   **الاستجابة الناجحة (200 OK):**
    ```json
    {
      "success": true,
      "userId": "usr_abc123xyz",
      "username": "fatima_99",
      "displayName": "فاطمة الزهراء",
      "avatarEmoji": "🌸",
      "bio": "مهتمة بالدعم النفسي والإرشاد الأسري الفعال 🌸",
      "age": "18 - 25 سنة (شابة يافعة)",
      "country": "السعودية",
      "isOnboarded": true
    }
    ```

*   **جلب وتحميل تفاصيل الملف الشخصي (شاملاً الدعم اللاتيني المعرف):**
    *   **المسار:** `GET /api/profile/:userId` (يقبل ممر معرف المستخدم أو اسم المستخدم الفريد `@`)
    *   **مثال:** `GET /api/profile/usr_abc123xyz` أو `GET /api/profile/fatima_99`
    *   **الاستجابة الناجحة (200 OK):**
    ```json
    {
      "success": true,
      "userId": "usr_abc123xyz",
      "username": "fatima_99",
      "displayName": "فاطمة الزهراء",
      "age": "18 - 25 سنة (شابة يافعة)",
      "country": "السعودية",
      "avatarEmoji": "🌸",
      "bio": "مهتمة بالدعم النفسي والإرشاد الأسري الفعال 🌸",
      "isPaid": false,
      "isOnboarded": true
    }
    ```

---

#### 4. صندوق الفضفضة والمصارحة (Anonymous Inbox)

*   **أرسل رسالة غير معروفة لملف عضوة أخرى:**
    *   **المسار:** `POST /api/messages/:username` (مثال `/api/messages/fatima_99`)
    *   **جسم الطلب (Body):**
    ```json
    {
      "message": "شكراً لكِ على تعليقك الداعم في مجتمع العلاقات، تمنياتي لك بسعادة دائمة!"
    }
    ```
    *   **الاستجابة (200 OK):** `{"message": "تم إرسال رسالتك السرية بنجاح! 🤫"}`

*   **تحميل وعرض صندوق الرسائل الواردة المجهولة للعضوة:**
    *   **المسار:** `GET /api/messages/:userId` (مثال `/api/messages/usr_abc123xyz`)
    *   **الاستجابة (200 OK):**
    ```json
    {
      "messages": [
        {
          "id": "msg_98765",
          "userId": "usr_abc123xyz",
          "message": "شكراً لكِ على تعليقك الداعم...",
          "createdAt": "2026-06-16T10:00:00.000Z"
        }
      ]
    }
    ```

*   **حذف رسالة مصارحة واردة مجهولة:**
    *   **المسار:** `DELETE /api/messages/:msgId`
    *   **الاستجابة (200):** `{"message": "تم حذف رسالة الصراحة بنجاح."}`

---

#### 5. رواق المصارحة العام (Community Feed)

*   **جلب منشورات المجتمعات المشتركة لغرف الدول:**
    *   **المسار:** `GET /api/community/posts`
    *   **المتغيرات الإضافية (Query Parameters):**
        *   `country`: اسم الدولة المستهدفة (مثل `"مصر"`، `"السعودية"`) أو `"الكل"` لجلب كافة الدول.
        *   `category`: الموضوع الفرعي (مثل `"دعم نفسي"`، `"علاقات"`) أو `"الكل"`.
    *   **الاستجابة الناجحة (200 OK):**
    ```json
    {
      "posts": [
        {
          "id": "post_h68d9w",
          "author": "fatima_99",
          "content": "هل هناك نصائح لتخطي ضغوطات التخرج والبحث العملي؟",
          "category": "عام",
          "country": "السعودية",
          "likes": 3,
          "createdAt": "2026-06-16T12:30:00.000Z"
        }
      ]
    }
    ```

*   **نشر منشور فضفضة جديد في مجتمعات الدول:**
    *   **المسار:** `POST /api/community/posts`
    *   **جسم الطلب (Body):**
    ```json
    {
      "content": "أصعب ما في الحياة هو التظاهر بالقوة أمام الجميع بينما تنهار قلوبنا سراً.",
      "author": "fatima_99",
      "category": "فضفضة حرة",
      "country": "السعودية"
    }
    ```
    *   **ملاحظة:** لإخفاء الهوية بالكامل، يمكن إرسال `"auto"` أو ترك الكاتب فارغاً فيقوم الخادم تلقائياً بتعيينه كـ `"زائرة مجهولة"`.

*   **الإعجاب بمنشور (Like Post):**
    *   **المسار:** `POST /api/community/posts/:postId/like`
    *   **الاستجابة:** `{"message": "شكراً لتقديم الدعم الوجداني! ❤️"}`

---

#### 6. نظام الدردشات السرية والفضفضة المغلقة ثنائية الأطراف (Double Opt-In Chats)

لحماية العضوات والخصوصية، لا يمكن لأي مستخدم بدء محادثة حية مع ناشر آخر في رواق المصارحة إلا بعد مرور الطلب بدورة موافقة مزدوجة بالكامل.

*   **ألف: إرسال دعوة دردشة مجهولة مبدئية:**
    *   **المسار:** `POST /api/chats/request`
    *   **جسم الطلب (Body):**
    ```json
    {
      "userA": "usr_abc123xyz",      // معرف الطالبة
      "usernameB": "sara_heart"     // اسم المستخدم المستهدف
    }
    ```
    *   **الاستجابة الناجحة (200 OK):** `{"message": "تم إرسال دعوة بدء محادثة سرية متبادلة، بانتظار قبول الطرف الآخر."}`

*   **باء: جلب قائمة كافة المحادثات والطلبات المعلقة:**
    *   **المسار:** `GET /api/chats`
    *   **المتغيرات الإضافية (Query Parameters):**
        *   `userId`: معرف حساب المستخدمة الطالبة/المستقبلة.
    *   **الاستجابة الناجحة (200 OK) تعود بقائمة مفصلة بالحالة والأسماء المستعارة للطرف الآخر:**
    ```json
    {
      "chats": [
        {
          "id": "chat_001928",
          "userA": "usr_abc123xyz",
          "userB": "usr_target888",
          "acceptedA": true,
          "acceptedB": false,         // يشير إلى وجود طلب محادثة معلق يحتاج موافقتها المزدوجة
          "otherUsername": "sara_heart",
          "lastMessage": "بدء تواصل آمن...",
          "createdAt": "2026-06-16T13:20:00.000Z"
        }
      ]
    }
    ```

*   **جيم: قبول المحادثة وموافقة الطرف الثاني (Double Opt-In Accept):**
    *   تحويل حالة الدردشة إلى "نشطة ومفتوحة" ثنائية التشفير.
    *   **المسار:** `POST /api/chats/accept`
    *   **جسم الطلب (Body):**
    ```json
    {
      "chatId": "chat_001928",
      "userId": "usr_target888"
    }
    ```
    *   **الاستجابة الناجحة (200 OK):** `{"message": "تم قبول وفك قفل المحادثة بنجاح! أصبحت الغرفة مفتوحة للدردشة الآن."}`

*   **دال: جلب جميع رسائل محادثة نشطة معينة:**
    *   **المسار:** `GET /api/chats/:chatId/messages` (مثال `/api/chats/chat_001928/messages`)
    *   **الاستجابة الناجحة (200 OK):**
    ```json
    {
      "messages": [
        {
          "id": "msg_ch_001",
          "senderId": "usr_abc123xyz",
          "text": "مرحباً بكِ صديقتي، كيف يمكنني مساعدتك اليوم؟",
          "createdAt": "2026-06-16T13:25:00.000Z"
        }
      ]
    }
    ```

*   **هاء: إرسال رسالة إلى دردشة نشطة:**
    *   **المسار:** `POST /api/chats/:chatId/messages` (مثال `/api/chats/chat_001928/messages`)
    *   **جسم الطلب (Body):**
    ```json
    {
      "senderId": "usr_abc123xyz",
      "text": "أتمنى أن تظل فضفضتي سرية ومحمية هنا."
    }
    ```
    *   **الاستجابة الناجحة (200 OK):** `{"message": "تم تسليم الرسالة."}`

---

#### 7. مسار النشر الخارجي للمطورين بصلاحية (External Authorized Support)

يستطيع تطبيق أندرويد الإداري أو الخارجي نشر إرشادات توجيهية أو رسائل دعم مسمومة ومصدق عليها تلقائياً عبر المصادقة برمز المطور (Bearer Token).

*   **المسار:** `POST /api/external/posts`
*   **الترويسات الإلزامية (Required Headers):**
    *   `Authorization: Bearer <DEVELOPER_TOKEN>` (يتم توليده عبر لوحة تحكم الإدارة في الويب)
*   **جسم الطلب (Body):**
```json
{
  "content": "رسالة هامة وتوجيهية: تذكري دائماً أن رقم الخط الساخن لدعم العلاقات الأسرية ومكافحة العنف متاح دائماً على مدار الساعة لمساعدتك.",
  "author": "منصة الدعم والتوجيه الأسري",
  "category": "دعم نفسي",
  "country": "الوطن العربي"
}
```
*   **الاستجابة في حال النجاح (200 OK):**
```json
{
  "success": true,
  "message": "تم نشر منشور الدعم الإرشادي الخارجي بنجاح.",
  "postId": "ext_post_77819"
}
```

---

#### 8. روبوت الاستشارة النفسية الذكي وجيميني (AI Counselor Deep Chat)

لتقديم الدعم التعاطفي التلقائي الدافئ في حالة عدم توفر مستشارة حية.

*   **المسار:** `POST /api/gemini/support`
*   **جسم الطلب (Body):**
```json
{
  "userId": "usr_abc123xyz",
  "message": "أشعر بالحزن الشديد والضغط النفسي بسبب امتحانات غداً ولا أستطيع الهدوء."
}
```
*   **الاستجابة الناجحة (200 OK) وتحتوي على استشارة وجدانية وعاطفية دافئة:**
```json
{
  "reply": "يا حبيبتي، خذي شهيقاً عميقاً جداً ثم زفيراً هادئاً. إنني أشعر بك وبمخاوفك الصادقة تماماً، ولكن تذكري دائماً أن جهدك وسعيك هما الأهم، ولن يضيع الله سعيكِ الحثيث أبداً..."
}
```

---

## 3. قيود الأمان وقواعد الـ Zero-Trust في Firestore

يتعين على مطور تطبيق أندرويد الالتزام التام بقواعد التحقق المفروضة في ملف قواعد حماية الفايربايز `firestore.rules` لتجنب رفض الخادم لعمليات الإرسال (Permission Denied).

1.  **سرية وخصوصية الحقول:** يمنع تماماً تعديل حقل `createdAt` أو `id` أو `authorId` الحساسة بعد الإنشاء لضمان عدم تعرض العمليات للاستغلال أو تعديل البيانات التاريخية.
2.  **استخدام الـ Server Timestamps:** في كافة عمليات المزامنة المباشرة، يجب إرسال قيمة حقل الوقت باستخدام علامة خادم فايربايز الخاصة (`FieldValue.serverTimestamp()`) ليتطابق مع القوانين الأمنية الموثقة.
3.  **منع تزوير المعرفات (Identity Spoofing):** يمنع قواعد الأمن في فايربايز كتابة منشور أو رسالة باسم مستخدم آخر؛ حيث يتم فحص تطابق معرف الموثق `request.auth.uid` مع الحقل الداخلي للبيانات الصادرة من قبل تطبيق الجوال.
4.  **الحصانة المطلقة لصناديق الصراحة:** لا يمكن قراءة تفاصيل صناديق الفضفضة والمصارحة إلا من قبل مالك الحساب المستلم حصراً؛ وتمنع العمليات الجماعية للـ List والقراءة لأي طرف ثالث مجهول.

---

## 4. نموذج استدعاء واستهلاك الـ API في أندرويد (Kotlin HttpClient)

مثال على دمج واجهة **روبوت الاستشارة النفسية الذكي (AI Counselor)** في تطبيق أندرويد باستخدام مكتبة **Retrofit**:

```kotlin
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

// 1. واجهة الريتروفيت البرمجية
interface FadfadaApiService {
    @Headers("Content-Type: application/json")
    @POST("/api/gemini/support")
    fun askAiCounselor(@Body payload: AiRequest): Call<AiResponse>
}

// 2. نماذج طبقة نقل البيانات (DTO)
data class AiRequest(
    val userId: String,
    val message: String
)

data class AiResponse(
    val reply: String
)
```

---

مع هذا الدليل التفصيلي، يصبح تطبيق أندرويد والمنصة السحابية في توافق ومزامنة تامة لتقديم بيئة افتراضية تفيض بالأخوة الداعمة في أجواء من الطمأنينة والأمان الشامل! 🌸🔒🌐
