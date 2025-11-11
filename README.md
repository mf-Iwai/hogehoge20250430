INSERT INTO Mst.EnvironmentSetup
(ID, SubId, Process, ProcessDetail, Item, EnableFlg, Value1, Value2, Value3, Value4, Value5, Contents1, Contents2, Contents3, Contents4, Contents5, Note, RevisionInfo_AssignCode, RevisionInfo_AssignName, RevisionInfo_DateTime, RevisionInfo_LicenseCode, RevisionInfo_LicenseName, RevisionInfo_PositionCode, RevisionInfo_PositionName, RevisionInfo_TerminalId, RevisionInfo_UserId, RevisionInfo_UserName)
VALUES('Nt||Settings||ProgressNote||ViewType', 'Nt', 'Settings', 'ProgressNote', 'ViewType', 1, '1', '1', NULL, NULL, NULL, 'Windows("0":規定/"1":江川/"2":札幌HC)', 'スマホ("0":規定/"1":江川/"2":札幌HC)', NULL, NULL, NULL, '表示ビューパターン', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '狩野');

# hogehoge20250430

<Setting>																																		
	<!-- 出力先フォルダパス -->																																	
	<FolderPath>　未定　</FolderPath>																																	
</Setting>																																		
<Message>																																		
	<!-- 取り込み確認 -->																																	
	<SaveCheckM>　経過記録を保存しますか？※取り込み完了後に再取り込みは行えません　</SaveCheckM>																																	
	<!-- ファイル削除確認 -->																																	
	<DeleteCheckM>　選択した経過記録を削除しようとしています。実行しますか？　</DeleteCheckM>																																	
</Message>																																		
<ErrorMessage>																																		
	<!-- 患者基本情報の取得失敗 -->																																	
	<PatientIdNotFoundM>　患者基本情報取得に失敗しました　</PatientIdNotFoundM>																																	
	<!-- 設定ファイルの取得失敗 -->																																	
	<SettingFileNotFoundM>　設定ファイルの取得に失敗しました　</SettingFileNotFoundM>																																	
	<!-- ファイルが見つからない -->																																	
	<FileNotFoundM>　ファイルが存在しません　</FileNotFoundM>																																	
	<!-- データの読み込み失敗 -->																																	
	<DataLoadErrorM>　ファイルの読み込みに失敗しました　</DataLoadErrorM>																																	
	<!-- 版数が古い-->																																	
	<seqErrorM>　保存データが現在の版数より古いため保存できません　</seqErrorM>																																	
	<!-- 保存処理失敗-->																																	
	<SaveErrorM>　保存処理に失敗しました　</SaveErrorM>																																	
	<!-- データの改ざん-->																																	
	<SaveErrorSecurityM>　データの改ざんがあります。保存処理に失敗しました　</SaveErrorSecurityM>																																	
	<!-- ファイル削除に失敗-->																																	
	<FileDeleteErrorM>　ファイルの削除に失敗しました。ファイルを開いている場合は閉じて再実行してください　</FileDeleteErrorM>																																	
</ErrorMessage>																																		

