src/Cache/Routines/Nt/MedicalRecord.mac
Set systemCode = $ListGet(piParameterList, 24)
→Lengthチェックをしておいた方が良いと思います。

GetMedicalRecordSystemCode(piDocumentNo) Public
→piDocumentNoは主キーでグローバル参照する前に
　パラメータの""チェックをしておいた方が良いと思います。

src/WebService/CmMultiView/Views/CmMultiView/CmMultiView.vbhtml
