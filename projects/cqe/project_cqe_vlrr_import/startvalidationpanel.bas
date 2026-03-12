Option Explicit

' ====== 可調整區 ======
Private Const PWD As String = "CQE"
Private Const FIRST_DATA_ROW As Long = 3
Private Const COL_UPDATED As Long = 22           ' V 欄
Private Const TRACK_LAST_COL As Long = 21        ' A:U 做快照比對
' ======================

' ====== 主入口：輸入密碼 → 只解除保護 → 開啟面板 ======
Public Sub StartValidationPanel()
    Dim ws As Worksheet
    Dim inputPwd As String
    
    Set ws = ActiveSheet
    
    inputPwd = InputBox( _
        "請輸入密碼以解除保護（第 3 列以下將可編輯）：" & vbCrLf & _
        "Enter password to unprotect (rows 3+ will be editable):")
    If inputPwd <> PWD Then
        MsgBox "密碼錯誤，無法解鎖。" & vbCrLf & _
               "Incorrect password.", vbCritical
        Exit Sub
    End If
    
    On Error Resume Next
    ws.Unprotect password:=PWD      ' 只解除保護，不改 Locked 狀態
    On Error GoTo 0
    
    MsgBox "已解鎖，現在第 3 列以下也可編輯；第 1–2 列仍照原設定。" & vbCrLf & _
           "Unprotected: rows 3+ are now editable; rows 1–2 keep original setting.", _
           vbInformation, "已解鎖 / Unlocked"
    
    ValidationPanel.Show vbModeless
End Sub

' ====== 鎖定：1–2 列可編輯，3 列以下鎖定 ======
Public Sub LockSheetForData()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    On Error Resume Next
    ws.Unprotect password:=PWD
    On Error GoTo 0
    
    ' 先全部鎖住，再開放 1–2 列
    ws.Cells.Locked = True
    ws.Rows("1:2").Locked = False
    
    ProtectSheetTight ws, PWD
    
    MsgBox "已鎖定：第 1–2 列可編輯，第 3 列以下鎖定。" & vbCrLf & _
           "Sheet locked: rows 1–2 editable, rows 3+ locked.", _
           vbInformation, "已鎖定 / Locked"
End Sub

' ====== 驗證：刷黑→快照上藍→規則標紅→V欄(僅變更時)→存快照 ======
Public Sub ValidateAllRows(lst As Object)
    Dim ws As Worksheet
    Dim lastRow As Long, r As Long
    Dim updater As String
    
    Set ws = ActiveSheet
    updater = GetModifierName()
    lastRow = GetLastUsedRow(ws)
    
    ' 驗證前：整張表 A:V 全刷黑
    If lastRow >= 1 Then
        ws.Range(ws.Cells(1, 1), ws.Cells(lastRow, COL_UPDATED)).Font.Color = RGB(0, 0, 0)
    End If
    
    ' A:U 與快照不同 → 藍色（新列亦視為全部不同→藍）
    ApplyChangeColoring ws, FIRST_DATA_ROW, lastRow, 1, TRACK_LAST_COL
    
    ' 規則驗證（不合格 → 紅，覆蓋藍）
    For r = FIRST_DATA_ROW To lastRow
        If RowHasAnyValue(ws, r) Then
            ValidateRowOne ws, r, lst
            ' 只有 A:U 有變更時才更新 V 欄（字串 + 藍色）；無變更則完全不動 V
            If RowChangedAgainstSnapshot(ws, r, 1, TRACK_LAST_COL) Then
                ws.Cells(r, COL_UPDATED).Value = Format(Date, "yyyy/mm/dd") & " " & updater & " updated"
                ws.Cells(r, COL_UPDATED).Font.Color = RGB(0, 0, 255)
            End If
        End If
    Next r
    
    If lst.ListCount = 0 Then
        MsgBox "驗證完成，未發現異常。" & vbCrLf & _
               "Validation completed, no issues.", vbInformation
    Else
        MsgBox "驗證完成，請查看清單並雙擊跳轉。" & vbCrLf & _
               "Validation done. See list, double-click to jump.", vbInformation
    End If
    
    ' 保存目前 A:U 成為新快照（供下次比較）
    SaveSnapshot ws, FIRST_DATA_ROW, lastRow, 1, TRACK_LAST_COL
End Sub

' ====== 逐列規則驗證：錯誤 → 紅 + 加入清單 ======
Private Sub ValidateRowOne(ws As Worksheet, ByVal r As Long, lst As Object)
    ' A
    If Not Check_A(ws, r) Then
        MarkError ws, r, "A", "A 必須等於 B 或 C；否則 A/B/C 同為 ""TBD""。" & _
                         vbCrLf & "A must equal B or C; else A/B/C all ""TBD"".", lst
    End If
    ' B
    If Not Check_B(ws, r) Then
        MarkError ws, r, "B", "B=實PN → C 必須有 L6 PN，且不可為 ""-"" 或空白。" & _
                         vbCrLf & "If B is real PN, C must be L6 PN (not '-' or blank).", lst
    End If
    ' C
    If Not Check_C(ws, r) Then
        MarkError ws, r, "C", "C=實PN/TBD；若 C='-'，O 必填說明。" & _
                         vbCrLf & "C may be PN/TBD; if '-', O is required.", lst
    End If
    ' D
    If Not Check_D(ws, r) Then
        MarkError ws, r, "D", "D 不可空白、不可 N/A 或 ""-""；未指定可 ""TBD""。" & _
                         vbCrLf & "D cannot be blank/N.A./'-'; use ""TBD"" if unspecified.", lst
    End If
    ' E
    If Not Check_E(ws, r) Then
        MarkError ws, r, "E", "E 不得出現全大寫 ""KOSTAL""（請改為 ""Kostal""）。" & _
                         vbCrLf & "E must not contain all-caps 'KOSTAL' (use 'Kostal').", lst
    End If
    ' G
    If Not Check_NotBlankOrTBD(ws, r, "G") Then
        MarkError ws, r, "G", "G 不可空白；未排定可填 ""TBD""。" & _
                         vbCrLf & "G cannot be blank; 'TBD' allowed.", lst
    End If
    ' H
    If Not Check_NotBlankOrTBD(ws, r, "H") Then
        MarkError ws, r, "H", "H 不可空白；未排定可填 ""TBD""。" & _
                         vbCrLf & "H cannot be blank; 'TBD' allowed.", lst
    End If
    ' I
    If Not Check_I(ws, r) Then
        MarkError ws, r, "I", "I 必須為數字或 ""TBD""。" & _
                         vbCrLf & "I must be numeric or 'TBD'.", lst
    End If
    ' J
    If Not Check_NotBlank(ws, r, "J") Then
        MarkError ws, r, "J", "J 不可空白。" & vbCrLf & "J cannot be blank.", lst
    End If
    ' L
    If Not Check_NotBlank(ws, r, "L") Then
        MarkError ws, r, "L", "L 不可空白（可為 N/A、TBD 或清單）。" & _
                         vbCrLf & "L cannot be blank (N/A/TBD/list allowed).", lst
    End If
    ' M
    If Not Check_NotBlank(ws, r, "M") Then
        MarkError ws, r, "M", "M 不可空白。" & vbCrLf & "M cannot be blank.", lst
    End If
    ' N
    If Not Check_NotBlank(ws, r, "N") Then
        MarkError ws, r, "N", "N 不可空白。" & vbCrLf & "N cannot be blank.", lst
    End If
    ' O（C = "-" 時必填）
    If Not Check_O_when_C_Dash(ws, r) Then
        MarkError ws, r, "O", "C = ""-"" 時，O 必須填寫說明（請與 EPM 確認）。" & _
                         vbCrLf & "When C = '-', O must have remark (check with EPM).", lst
    End If
    ' P~S
    If Not Check_NotBlank(ws, r, "P") Then MarkError ws, r, "P", "P/CQE 不可空白。" & vbCrLf & "P cannot be blank.", lst
    If Not Check_NotBlank(ws, r, "Q") Then MarkError ws, r, "Q", "Q/EPM 不可空白。" & vbCrLf & "Q cannot be blank.", lst
    If Not Check_NotBlank(ws, r, "R") Then MarkError ws, r, "R", "R/MPM 不可空白。" & vbCrLf & "R cannot be blank.", lst
    If Not Check_NotBlank(ws, r, "S") Then MarkError ws, r, "S", "S/MPE 不可空白。" & vbCrLf & "S cannot be blank.", lst
End Sub

' ====== 變更著色（A:U 與快照不同 → 藍） ======
Private Sub ApplyChangeColoring(ws As Worksheet, firstRow As Long, lastRow As Long, firstCol As Long, lastCol As Long)
    Dim snapWs As Worksheet
    Dim snapArr As Variant, curArr As Variant
    Dim r As Long, C As Long, nRows As Long, nCols As Long
    Dim rng As Range
    
    If lastRow < firstRow Then Exit Sub
    Set rng = ws.Range(ws.Cells(firstRow, firstCol), ws.Cells(lastRow, lastCol))
    curArr = rng.Value2
    
    Set snapWs = EnsureSnapshotSheet(ws)
    snapArr = LoadSnapshotArray(snapWs)
    
    nRows = UBound(curArr, 1)
    nCols = UBound(curArr, 2)
    
    ' 無快照 → 視為全部新資料 → 全藍
    If IsEmpty(snapArr) Then
        For r = 1 To nRows
            For C = 1 To nCols
                rng.Cells(r, C).Font.Color = RGB(0, 0, 255)
            Next C
        Next r
        Exit Sub
    End If
    
    ' 有快照 → 逐格比對
    Dim sRows As Long, sCols As Long
    Dim curVal As Variant, snapVal As Variant
    sRows = UBound(snapArr, 1)
    sCols = UBound(snapArr, 2)
    
    For r = 1 To nRows
        For C = 1 To nCols
            curVal = curArr(r, C)
            If r <= sRows And C <= sCols Then
                snapVal = snapArr(r, C)
            Else
                snapVal = vbNullString
            End If
            If ValuesDifferent(curVal, snapVal) Then
                rng.Cells(r, C).Font.Color = RGB(0, 0, 255) ' 不同 → 藍
            End If
        Next C
    Next r
End Sub

' 判斷該列(A:U)相對快照是否有變更（用於是否更新 V 欄）
Private Function RowChangedAgainstSnapshot(ws As Worksheet, ByVal r As Long, _
                                          ByVal firstCol As Long, ByVal lastCol As Long) As Boolean
    Dim snapWs As Worksheet
    Dim snapArr As Variant
    Dim sRows As Long, sCols As Long
    Dim C As Long
    Dim snapRow As Long
    Dim curVal As Variant, snapVal As Variant
    
    Set snapWs = EnsureSnapshotSheet(ws)
    snapArr = LoadSnapshotArray(snapWs)
    
    If IsEmpty(snapArr) Then
        RowChangedAgainstSnapshot = True
        Exit Function
    End If
    
    sRows = UBound(snapArr, 1)
    sCols = UBound(snapArr, 2)
    snapRow = r - (FIRST_DATA_ROW - 1)   ' 快照第1列對應工作表的第 FIRST_DATA_ROW 列
    
    If snapRow < 1 Then
        RowChangedAgainstSnapshot = True
        Exit Function
    End If
    
    For C = firstCol To lastCol
        curVal = ws.Cells(r, C).Value2
        If snapRow <= sRows And C <= sCols Then
            snapVal = snapArr(snapRow, C)
        Else
            snapVal = vbNullString
        End If
        If ValuesDifferent(curVal, snapVal) Then
            RowChangedAgainstSnapshot = True
            Exit Function
        End If
    Next C
End Function

Private Function ValuesDifferent(A As Variant, B As Variant) As Boolean
    If IsError(A) Xor IsError(B) Then
        ValuesDifferent = True
    ElseIf IsError(A) And IsError(B) Then
        ValuesDifferent = False
    Else
        ValuesDifferent = (CStr(A) <> CStr(B))
    End If
End Function

' ====== 快照保存（A:U，自 FIRST_DATA_ROW 起） ======
Private Sub SaveSnapshot(ws As Worksheet, firstRow As Long, lastRow As Long, firstCol As Long, lastCol As Long)
    Dim snapWs As Worksheet, rng As Range, arr As Variant
    
    Set snapWs = EnsureSnapshotSheet(ws)
    snapWs.Cells.ClearContents
    
    If lastRow < firstRow Then Exit Sub
    Set rng = ws.Range(ws.Cells(firstRow, firstCol), ws.Cells(lastRow, lastCol))
    arr = rng.Value2
    
    snapWs.Range("A1").Resize(UBound(arr, 1), UBound(arr, 2)).Value = arr
End Sub

' 建立/取得對應工作表的隱藏快照表
Private Function EnsureSnapshotSheet(ws As Worksheet) As Worksheet
    Dim snapName As String
    snapName = "_Snapshot_" & ws.Name
    On Error Resume Next
    Set EnsureSnapshotSheet = ThisWorkbook.Worksheets(snapName)
    On Error GoTo 0
    If EnsureSnapshotSheet Is Nothing Then
        Set EnsureSnapshotSheet = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Sheets(ThisWorkbook.Sheets.Count))
        EnsureSnapshotSheet.Name = snapName
        EnsureSnapshotSheet.Visible = xlSheetHidden
    End If
End Function

Private Function LoadSnapshotArray(snapWs As Worksheet) As Variant
    Dim lastR As Long, lastC As Long
    lastR = GetLastUsedRow(snapWs)
    lastC = GetLastUsedCol(snapWs)
    If lastR = 0 Or lastC = 0 Then
        LoadSnapshotArray = Empty
    Else
        LoadSnapshotArray = snapWs.Range(snapWs.Cells(1, 1), snapWs.Cells(lastR, lastC)).Value2
    End If
End Function

' ====== 驗證規則 ======
Private Function Check_A(ws As Worksheet, r As Long) As Boolean
    Dim A$, B$, C$
    A = Trim$(ws.Cells(r, "A").Value)
    B = Trim$(ws.Cells(r, "B").Value)
    C = Trim$(ws.Cells(r, "C").Value)
    If A = "" Then Exit Function
    If IsRealPartNo(B) Then
        Check_A = (A = B)
    ElseIf IsRealPartNo(C) Then
        Check_A = (A = C)
    Else
        Check_A = (UCase$(A) = "TBD" And UCase$(B) = "TBD" And UCase$(C) = "TBD")
    End If
End Function

Private Function Check_B(ws As Worksheet, r As Long) As Boolean
    Dim B$, C$
    B = Trim$(ws.Cells(r, "B").Value)
    C = Trim$(ws.Cells(r, "C").Value)
    If B = "" Then Exit Function
    If IsRealPartNo(B) Then
        ' L10 出貨：C 不可 "-" 或空白（可 TBD 或實 PN）
        Check_B = (UCase$(C) <> "-" And C <> "")
    ElseIf UCase$(B) = "-" Or UCase$(B) = "TBD" Then
        Check_B = True
    End If
End Function

Private Function Check_C(ws As Worksheet, r As Long) As Boolean
    Dim C$, O$
    C = Trim$(ws.Cells(r, "C").Value)
    O = Trim$(ws.Cells(r, "O").Value)
    If C = "" Then Exit Function
    If IsRealPartNo(C) Or UCase$(C) = "TBD" Then
        Check_C = True
    ElseIf UCase$(C) = "-" Then
        Check_C = (O <> "")
    End If
End Function

Private Function Check_D(ws As Worksheet, r As Long) As Boolean
    Dim D$
    D = Trim$(ws.Cells(r, "D").Value)
    If D = "" Then Exit Function
    If UCase$(D) = "N/A" Or D = "-" Then Exit Function
    Check_D = True
End Function

Private Function Check_E(ws As Worksheet, r As Long) As Boolean
    Dim E$
    E = Trim$(ws.Cells(r, "E").Value)
    If E = "" Then Exit Function
    ' 不允許出現全大寫 "KOSTAL"（除非同時含正確大小寫 "Kostal"）
    If InStr(1, E, "KOSTAL", vbTextCompare) > 0 And InStr(E, "Kostal") = 0 Then Exit Function
    Check_E = True
End Function

Private Function Check_I(ws As Worksheet, r As Long) As Boolean
    Dim Ival$
    Ival = Trim$(ws.Cells(r, "I").Value)
    If Ival = "" Then Exit Function
    If UCase$(Ival) = "TBD" Then
        Check_I = True
    Else
        Check_I = IsNumeric(Ival)
    End If
End Function

Private Function Check_O_when_C_Dash(ws As Worksheet, r As Long) As Boolean
    If UCase$(Trim$(ws.Cells(r, "C").Value)) = "-" Then
        Check_O_when_C_Dash = (Trim$(ws.Cells(r, "O").Value) <> "")
    Else
        Check_O_when_C_Dash = True
    End If
End Function

Private Function Check_NotBlank(ws As Worksheet, r As Long, colLetter As String) As Boolean
    Check_NotBlank = (Trim$(ws.Cells(r, colLetter).Value) <> "")
End Function

Private Function Check_NotBlankOrTBD(ws As Worksheet, r As Long, colLetter As String) As Boolean
    Dim v$
    v = Trim$(ws.Cells(r, colLetter).Value)
    Check_NotBlankOrTBD = (v <> "" And (UCase$(v) = "TBD" Or v <> ""))
End Function

' ====== 工具 ======
Private Sub MarkError(ws As Worksheet, r As Long, colLetter As String, msg As String, lst As Object)
    ws.Cells(r, colLetter).Font.Color = RGB(255, 0, 0)   ' 不合格 → 紅色
    lst.AddItem "Row " & r & " Col " & colLetter & ": " & msg & "|" & ws.Cells(r, colLetter).Address(False, False)
End Sub

Private Function GetLastUsedRow(ws As Worksheet) As Long
    On Error Resume Next
    GetLastUsedRow = ws.Cells.Find(What:="*", After:=ws.Cells(1, 1), LookAt:=xlPart, LookIn:=xlFormulas, _
                                   SearchOrder:=xlByRows, SearchDirection:=xlPrevious, MatchCase:=False).Row
    If Err.Number <> 0 Then GetLastUsedRow = 0: Err.Clear
    On Error GoTo 0
End Function

Private Function GetLastUsedCol(ws As Worksheet) As Long
    On Error Resume Next
    GetLastUsedCol = ws.Cells.Find(What:="*", After:=ws.Cells(1, 1), LookAt:=xlPart, LookIn:=xlFormulas, _
                                   SearchOrder:=xlByColumns, SearchDirection:=xlPrevious, MatchCase:=False).Column
    If Err.Number <> 0 Then GetLastUsedCol = 0: Err.Clear
    On Error GoTo 0
End Function

Private Function RowHasAnyValue(ws As Worksheet, r As Long) As Boolean
    RowHasAnyValue = (Application.WorksheetFunction.CountA(ws.Rows(r)) > 0)
End Function

Private Function GetModifierName() As String
    Dim appUser$, winUser$
    appUser = Trim$(Application.UserName)
    On Error Resume Next
    winUser = Trim$(Environ$("Username"))
    On Error GoTo 0
    If appUser = "" And winUser = "" Then
        GetModifierName = "UnknownUser"
    ElseIf appUser <> "" And winUser <> "" Then
        GetModifierName = appUser & " (" & winUser & ")"
    Else
        GetModifierName = IIf(appUser <> "", appUser, winUser)
    End If
End Function

' 保護：允許調整格式（字色/框線/字型）
Public Sub ProtectSheetTight(ws As Worksheet, ByVal password As String)
    With ws
        .Protect password:=password, _
                 UserInterfaceOnly:=True, _
                 AllowFiltering:=True, _
                 AllowSorting:=True, _
                 AllowFormattingCells:=True, _
                 AllowFormattingColumns:=True, _
                 AllowFormattingRows:=True
        .EnableSelection = xlNoRestrictions
    End With
End Sub

Private Function IsRealPartNo(ByVal s As String) As Boolean
    Dim t$
    t = Trim$(s)
    If t = "" Then Exit Function
    If UCase$(t) = "-" Or UCase$(t) = "TBD" Or UCase$(t) = "N/A" Then Exit Function
    IsRealPartNo = True
End Function


