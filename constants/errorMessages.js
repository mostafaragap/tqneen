//auth messages
module.exports.loginError = { ar: 'رقم الهاتف او كلمة المرور لا يتطابقان مع اى مستخدم لدينا', en: "invalid phone or password" }
module.exports.userNotFound = { ar: 'عفوا المستخدم غير موجود', en: "user not found" }
module.exports.phoneError = { ar: 'عفوا المستخدم غير موجود', en: "user not found" }
module.exports.otpError = { ar: 'الكود الذى ادخلته غير صحيح', en: "invalid code" }
module.exports.changePasswordError = { ar: 'كلمة السر القديمة غير صحيحة', en: "invalid old password" }
module.exports.phoneExistError = { ar: 'رقم الهاتف موجود بالفعل', en: "phone already exist" }
module.exports.emailError = { ar: ' البريد الاكتروني موجود بالفعل', en: "email already exist" }
module.exports.notVerifyError = { ar: 'عفوا يجب تفعيل الحساب أولا', en: "account not verified" }


//call

module.exports.callError = { ar: 'لقد وصلت للحد الأقصي من الاستشارات المجانية', en: "you exceeded your free trial" }

//Payment


module.exports.paymentError = { ar: "حدث خطأ ما اثناء الدفع الرجاء المحاولة لاحقا", en: "Error happen while pay, please try again" }
module.exports.appointmentError = { ar: "عفوا لم يتم الموافقة على الاستشارة .الرجاء الانتظار لحين الموافقة", en: "appointment not approved yet, please wait for lawyer accept" }

//validation Errors
module.exports.invalidPhoneError = { ar: 'يجب ادخال رقم هاتف صحيح', en: "invalid phone number" }
module.exports.invalidEmailError = { ar: 'يجب ادخال بريد الكتروني صحيح', en: "invalid email address" }

//lawyers
module.exports.lawyerNotFoundError = { ar: 'عفوا المحامى غير موجود او غير متاح حاليا', en: "lawyer are not found or not active now" }


//specializations
module.exports.specialExist = { ar: 'هذا التخصص موجود بالفعل', en: "this special allready exist" }

//topic
module.exports.topicExist = { ar: 'هذا الموضوع موجود بالفعل', en: "this topic allready exist" }


//area
module.exports.areaExist = { ar: 'هذا المكان موجود بالفعل', en: "this area allready exist" }

//city
module.exports.cityExist = { ar: 'هذه البلد موجودة بالفعل', en: "this city allready exist" }


// images
module.exports.imageEror = { ar: 'عفوا حدث خطا اثناء جلب الملف', en: "error while get doc" }
module.exports.deleteImageError = { ar: 'عفوا حدث خطا اثناء جلب الملف', en: "error while get doc" }
module.exports.deleteImageOk = { ar: 'تم الحذف بنجاح', en: "deleted successfuly" }


//appointmet
module.exports.cantAcceptError = { ar: 'لا يمكنك قبول او رفض الاستشارة', en: "you can't accept or reject your appointment" }
module.exports.cantCancelError = { ar: 'لا يمكنك الغاء الاستشارة', en: "you can't canceled your appointment" }

//general
module.exports.successMessage = { ar: 'تم بنجاح', en: "success" }
module.exports.otpSentSuccess = { ar: 'لقد تم ارسال كود التحق اليك', en: "otp sent successfully to you" }

//Requests

module.exports.requestError = { ar: "يوجد طلب سابق بتحديث المستند يرجى الانتظار", en: "you have allready a previous requst for update this document" }

