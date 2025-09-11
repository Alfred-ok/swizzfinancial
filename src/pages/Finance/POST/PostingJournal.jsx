



// import { useEffect, useState, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon, CheckCircle2, Plus, Save, Trash2, Upload, AlertTriangle, FilePlus2 } from "lucide-react";


// // Utility: simple currency formatter
// const fmt = (n) => Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });



// const EMPTY_ROW = { accountId: "", description: "", debit: "", credit: "", department: "" };

// export default function PostingJournal() {
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
//   const [refNo, setRefNo] = useState("");
//   const [memo, setMemo] = useState("");
//   const [lines, setLines] = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
//   const [showDepartments, setShowDepartments] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const [accountOptions, setAccountOptions] = useState([]);

//   // Derived totals
//   const totals = useMemo(() => {
//     const debit = lines.reduce((s, r) => s + Number(r.debit || 0), 0);
//     const credit = lines.reduce((s, r) => s + Number(r.credit || 0), 0);
//     const diff = +(debit - credit).toFixed(2);
//     return { debit, credit, diff };
//   }, [lines]);

//   const balanced = Math.abs(totals.diff) < 0.005 && totals.debit > 0 && totals.credit > 0;

//   // Handlers
//   const updateLine = (idx, patch) => {
//     setLines((prev) => {
//       const copy = [...prev];
//       const current = { ...copy[idx], ...patch };
//       if ("debit" in patch && patch.debit !== "") current.credit = "";
//       if ("credit" in patch && patch.credit !== "") current.debit = "";
//       copy[idx] = current;
//       return copy;
//     });
//   };

//   const addRow = () => setLines((prev) => [...prev, { ...EMPTY_ROW }]);
//   const removeRow = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx));
//   const clearAll = () => {
//     setRefNo("");
//     setMemo("");
//     setLines([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
//     setAttachments([]);
//   };

//   const onImportCSV = () => alert("Import CSV not implemented in demo");
//   const onAttachFiles = (files) => setAttachments((prev) => [...prev, ...Array.from(files || [])]);

//   const saveDraft = () => {
//     const draftPayload = { date, reference: refNo, memo, lines, totals, attachmentsCount: attachments.length };
//     console.log("DRAFT:", draftPayload);
//     alert("Saved as draft (console)");
//   };

//   // POST to API
//   const postJournal = async () => {
//     if (!balanced) return alert("Journal is not balanced!");

//     const apiPayload = lines
//       .filter(l => l.accountId && (l.debit || l.credit))
//       .map(l => ({
//         TotalValue: Number(l.debit || l.credit || 0),
//         DebitAmount: Number(l.debit || 0),
//         CreditAmount: Number(l.credit || 0),
//         BranchId: "branch-guid-or-id", // replace with actual branch ID
//         TransactionCode: 1,
//         PrimaryDescription: memo || l.description || "Journal entry",
//         Reference: refNo || "N/A",
//         ValueDate: date,
//         CreditChartOfAccountId: l.credit ? l.accountId : "",
//         DebitChartOfAccountId: l.debit ? l.accountId : "",
//         ChartOfAccountId: l.accountId,
//         ContraChartOfAccountId: "", // optional
//         Description: l.description || memo || "N/A",
//       }));

//     try {
//       const res = await fetch("https://88dd5e3c1447.ngrok-free.app/api/values/PostJournal", {
//         method: "POST",
//         headers: { "ngrok-skip-browser-warning": "true" },
//         body: JSON.stringify(apiPayload),
//       });
//       const data = await res.json();
//       if (res.ok && data.Success) {
//         alert("Journal posted successfully!");
//         clearAll();
//       } else {
//         console.error("API error:", data);
//         alert("Failed to post journal. See console.");
//       }
//     } catch (err) {
//       console.error("Network error:", err);
//       alert("Network error while posting journal.");
//     }
//   };






//   useEffect(() => {
//   const fetchAccounts = async () => {
//     try {
//       const res = await fetch("https://88dd5e3c1447.ngrok-free.app/api/values/GetChartOfAccount",{
//          headers: { "ngrok-skip-browser-warning": "true" },
//       });
//       const data = await res.json();
//       if (data.Success && Array.isArray(data.Data)) {
//         // Map API data to {id, name, type} format for Select
//         const options = data.Data.map(acc => ({
//           id: acc.Id,
//           name: acc.AccountName,
//           type: acc.AccountTypeDescription,
//         }));
//         setAccountOptions(options);
//       }
//     } catch (err) {
//       console.error("Failed to fetch accounts:", err);
//     }
//   };

//   fetchAccounts();
// }, []);



// console.log(accountOptions);

//   return (
//     <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold tracking-tight">New Journal Entry</h1>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={saveDraft}><Save className="mr-2 h-4 w-4" /> Save draft</Button>
//           <Button disabled={!balanced} onClick={postJournal}><CheckCircle2 className="mr-2 h-4 w-4" /> Post journal</Button>
//         </div>
//       </div>

//       {/* Header Card */}
//       <Card className="shadow-sm">
//         <CardHeader className="pb-2"><CardTitle className="text-base">Header</CardTitle></CardHeader>
//         <CardContent className="grid gap-4 md:grid-cols-4">
//           <div className="space-y-2">
//             <Label htmlFor="date">Date</Label>
//             <div className="flex items-center gap-2">
//               <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" size="icon" aria-label="Quick date"><CalendarIcon className="h-4 w-4" /></Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-56 text-sm">
//                   <div className="space-y-1">
//                     <Button variant="ghost" className="w-full justify-start" onClick={() => setDate(new Date().toISOString().slice(0, 10))}>Today</Button>
//                     <Button variant="ghost" className="w-full justify-start" onClick={() => setDate(new Date(Date.now() - 86400000).toISOString().slice(0, 10))}>Yesterday</Button>
//                     <Button variant="ghost" className="w-full justify-start" onClick={() => setDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10))}>Tomorrow</Button>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="ref">Reference no.</Label>
//             <Input id="ref" placeholder="e.g., JRN-00045" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
//           </div>
//           <div className="md:col-span-2 space-y-2">
//             <Label htmlFor="memo">Memo</Label>
//             <Textarea id="memo" placeholder="Optional note" value={memo} onChange={(e) => setMemo(e.target.value)} />
//           </div>
//           <div className="col-span-4 flex items-center gap-3 pt-2">
//             <Switch id="dept" checked={showDepartments} onCheckedChange={setShowDepartments} />
//             <Label htmlFor="dept">Track by department/class</Label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Line Items Card */}
//       <Card className="shadow-sm">
//         <CardHeader className="pb-2 flex-row items-center justify-between">
//           <CardTitle className="text-base">Line items</CardTitle>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={onImportCSV}><Upload className="mr-2 h-4 w-4" /> Import CSV</Button>
//             <label htmlFor="attach" className="inline-flex">
//               <input id="attach" type="file" multiple className="hidden" onChange={(e) => onAttachFiles(e.target.files)} />
//               <Button variant="outline" asChild><span><FilePlus2 className="mr-2 h-4 w-4" /> Attach files</span></Button>
//             </label>
//             <Button onClick={addRow}><Plus className="mr-2 h-4 w-4" /> Add line</Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="min-w-[220px]">Account</TableHead>
//                   {showDepartments && <TableHead className="min-w-[160px]">Department</TableHead>}
//                   <TableHead className="min-w-[220px]">Description</TableHead>
//                   <TableHead className="w-[140px] text-right">Debit</TableHead>
//                   <TableHead className="w-[140px] text-right">Credit</TableHead>
//                   <TableHead className="w-[60px]" />
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {lines.map((row, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell className="align-top">
//                       <Select value={row.accountId} onValueChange={(v) => updateLine(idx, { accountId: v })}>
//                         <SelectTrigger className="w-full"><SelectValue placeholder="Select account" /></SelectTrigger>
//                         <SelectContent>
//                           {accountOptions.map(a => (
//                             <SelectItem key={a.id} value={a.id}>
//                                 {a.name} ({a.type})
//                             </SelectItem>
//                             ))}
//                         </SelectContent>
//                       </Select>
//                     </TableCell>
//                     {showDepartments && <TableCell className="align-top"><Input placeholder="e.g., Nairobi HQ" value={row.department} onChange={(e) => updateLine(idx, { department: e.target.value })} /></TableCell>}
//                     <TableCell className="align-top"><Input placeholder="Description" value={row.description} onChange={(e) => updateLine(idx, { description: e.target.value })} /></TableCell>
//                     <TableCell className="align-top"><Input inputMode="decimal" type="number" min="0" step="0.01" className="text-right" placeholder="0.00" value={row.debit} onChange={(e) => updateLine(idx, { debit: e.target.value })} /></TableCell>
//                     <TableCell className="align-top"><Input inputMode="decimal" type="number" min="0" step="0.01" className="text-right" placeholder="0.00" value={row.credit} onChange={(e) => updateLine(idx, { credit: e.target.value })} /></TableCell>
//                     <TableCell className="align-top"><Button variant="ghost" size="icon" onClick={() => removeRow(idx)} aria-label="Remove line"><Trash2 className="h-4 w-4" /></Button></TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow>
//                   <TableCell colSpan={showDepartments ? 3 : 2} />
//                   <TableCell className="text-right font-medium">{fmt(totals.debit)}</TableCell>
//                   <TableCell className="text-right font-medium">{fmt(totals.credit)}</TableCell>
//                   <TableCell />
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>
//           <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-2">
//               {balanced ? (
//                 <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Balanced</Badge>
//               ) : (
//                 <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Out of balance {fmt(totals.diff)}</Badge>
//               )}
//               <Separator orientation="vertical" className="h-6" />
//               <span className="text-sm text-muted-foreground">{lines.length} line(s)</span>
//               {!!attachments.length && <span className="text-sm text-muted-foreground">· {attachments.length} attachment(s)</span>}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" onClick={clearAll}>Reset</Button>
//               <Button variant="outline" onClick={saveDraft}><Save className="mr-2 h-4 w-4" /> Save draft</Button>
//               <Button disabled={!balanced} onClick={postJournal}><CheckCircle2 className="mr-2 h-4 w-4" /> Post journal</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tip */}
//       <p className="text-xs text-muted-foreground">
//         Tip: Only one of Debit or Credit can be entered on a line. Totals must balance to enable posting.
//       </p>
//     </div>
//   );
// }



















































import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, Plus, Save, Trash2, Upload, AlertTriangle, FilePlus2 } from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
const EMPTY_ROW = { accountId: "", description: "", debit: "", credit: "", department: "" };

export default function PostingJournal() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [refNo, setRefNo] = useState("");
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
  const [showDepartments, setShowDepartments] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchId, setBranchId] = useState("");

  const totals = useMemo(() => {
    const debit = lines.reduce((s, r) => s + Number(r.debit || 0), 0);
    const credit = lines.reduce((s, r) => s + Number(r.credit || 0), 0);
    const diff = +(debit - credit).toFixed(2);
    return { debit, credit, diff };
  }, [lines]);

  const balanced = Math.abs(totals.diff) < 0.005 && totals.debit > 0 && totals.credit > 0;

  const updateLine = (idx, patch) => {
    setLines((prev) => {
      const copy = [...prev];
      const current = { ...copy[idx], ...patch };
      if ("debit" in patch && patch.debit !== "") current.credit = "";
      if ("credit" in patch && patch.credit !== "") current.debit = "";
      copy[idx] = current;
      return copy;
    });
  };

  const addRow = () => setLines((prev) => [...prev, { ...EMPTY_ROW }]);
  const removeRow = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx));
  const clearAll = () => {
    setRefNo("");
    setMemo("");
    setLines([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
    setAttachments([]);
    setBranchId("");
  };

  const onImportCSV = () => alert("Import CSV not implemented in demo");
  const onAttachFiles = (files) => setAttachments((prev) => [...prev, ...Array.from(files || [])]);

  const saveDraft = () => {
    const draftPayload = { date, reference: refNo, memo, branchId, lines, totals, attachmentsCount: attachments.length };
    console.log("DRAFT:", draftPayload);
    alert("Saved as draft (console)");
  };

  const postJournal = async () => {
    if (!balanced) return alert("Journal is not balanced!");
    if (!branchId) return alert("Branch is required!");

    const apiPayload = lines
      .filter((l) => l.accountId && (l.debit || l.credit))
      .map((l) => ({
        TotalValue: Number(l.debit || l.credit || 0),
        DebitAmount: Number(l.debit || 0),
        CreditAmount: Number(l.credit || 0),
        BranchId: branchId,
        TransactionCode: 1,
        PrimaryDescription: memo || l.description || "Journal entry",
        Reference: refNo || "N/A",
        ValueDate: date,
        CreditChartOfAccountId: l.credit ? l.accountId : "",
        DebitChartOfAccountId: l.debit ? l.accountId : "",
        ChartOfAccountId: l.accountId,
        ContraChartOfAccountId: "",
        Description: l.description || memo || "N/A",
      }));

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/values/PostJournal`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      const data = await res.json();
      if (res.ok && data.Success) {
        alert("Journal posted successfully!");
        clearAll();
      } else {
        console.error("API error:", data);
        alert("Failed to post journal. See console.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error while posting journal.");
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/values/GetChartOfAccount`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await res.json();
        if (data.Success && Array.isArray(data.Data)) {
          setAccountOptions(
            data.Data.map((acc) => ({
              id: acc.Id,
              name: acc.AccountName,
              type: acc.AccountTypeDescription,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      }
    };

    const fetchBranches = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/values/branches`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await res.json();
        if (data.Success && Array.isArray(data.Data)) {
          setBranchOptions(data.Data.map((b) => ({ id: b.Id, description: b.Description })));
        }
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      }
    };

    fetchAccounts();
    fetchBranches();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-2 md:p-8 space-y-4 mt-4 bg-white rounded-2xl shadow-2xl border-1 border-indigo-800">
      <div className="flex items-center justify-between bg-indigo-800 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-semibold tracking-tight p-4 text-white">New Journal Entry</h1>
        <div className="flex items-center gap-2 bg-indigo-800 p-4 rounded-lg shadow-2xl">
          <Button variant="outline" onClick={saveDraft}>
            <Save className="mr-2 h-4 w-4 " /> Save draft
          </Button>
          <Button disabled={!balanced} onClick={postJournal} className="text-white">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Post journal
          </Button>
        </div>
      </div>

      {/* Header */}
      <Card className="shadow-2xl border-1 border-indigo-800">
        <CardHeader className="pb-2 bg-indigo-800 text-white rounded-t-lg">
          <CardTitle className="text-base">Header</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" className="bg-white" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref">Reference no.</Label>
            <Input id="ref" placeholder="e.g., JRN-00045" className="bg-white" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/*
          <div className="md:col-span-1 space-y-2">
            <Label htmlFor="memo">Memo</Label>
            <Textarea id="memo" placeholder="Optional note" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
          <div className="col-span-4 flex items-center gap-3 pt-2">
            <Switch id="dept" checked={showDepartments} onCheckedChange={setShowDepartments} />
            <Label htmlFor="dept">Track by department/class</Label>
          </div>*/}
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="shadow-2xl border-1 border-indigo-800">
        <CardHeader className="pb-2 flex-row items-center justify-between mb-2 bg-indigo-800 rounded-t-lg">
          <CardTitle className="text-base text-white">Line items</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onImportCSV}>
              <Upload className="mr-2 h-4 w-4" /> Import CSV
            </Button>
            <label htmlFor="attach" className="inline-flex">
              <input id="attach" type="file" multiple className="hidden" onChange={(e) => onAttachFiles(e.target.files)} />
              <Button variant="outline" asChild>
                <span>
                  <FilePlus2 className="mr-2 h-4 w-4" /> Attach files
                </span>
              </Button>
            </label>
            <Button onClick={addRow} className="bg-indigo-600">
              <Plus className="mr-2 h-4 w-4" /> Add line
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Account</TableHead>
                  {showDepartments && <TableHead className="min-w-[160px]">Department</TableHead>}
                  <TableHead className="min-w-[220px] ">Description</TableHead>
                  <TableHead className="w-[140px] text-right">Debit</TableHead>
                  <TableHead className="w-[140px] text-right">Credit</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((row, idx) => (
                  <TableRow key={idx} className="bg-gray-200 hover:bg-gray-200 border-white">
                    <TableCell className="align-top">
                      <Select value={row.accountId} onValueChange={(v) => updateLine(idx, { accountId: v })}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name} ({a.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {showDepartments && (
                      <TableCell className="align-top">
                        <Input
                          placeholder="e.g., Nairobi HQ"
                          value={row.department}
                          onChange={(e) => updateLine(idx, { department: e.target.value })}
                        />
                      </TableCell>
                    )}
                    <TableCell className="align-top">
                      <Input
                        placeholder="Description"
                        value={row.description}
                        className="bg-white"
                        onChange={(e) => updateLine(idx, { description: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        inputMode="decimal"
                        type="number"
                        min="0"
                        step="0.01"
                        className="text-right bg-white"
                        placeholder="0.00"
                        value={row.debit}
                        onChange={(e) => updateLine(idx, { debit: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        inputMode="decimal"
                        type="number"
                        min="0"
                        step="0.01"
                        className="text-right bg-white"
                        placeholder="0.00"
                        value={row.credit}
                        onChange={(e) => updateLine(idx, { credit: e.target.value })}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Button variant="ghost" size="icon" onClick={() => removeRow(idx)} aria-label="Remove line">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={showDepartments ? 3 : 2} />
                  <TableCell className="text-right font-medium">{fmt(totals.debit)}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(totals.credit)}</TableCell>
                  <TableCell/>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {balanced ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Balanced
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 p-2 text-white">
                  <AlertTriangle className="h-3.5 w-3.5" /> Out of balance {fmt(totals.diff)}
                </Badge>
              )}
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm text-muted-foreground">{lines.length} line(s)</span>
              {!!attachments.length && (
                <span className="text-sm text-muted-foreground">· {attachments.length} attachment(s)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={clearAll}>
                Reset
              </Button>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="mr-2 h-4 w-4" /> Save draft
              </Button>
              <Button disabled={!balanced} onClick={postJournal}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Post journal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs">
        Tip: Only one of Debit or Credit can be entered on a line. Totals must balance to enable posting.
      </p>
    </div>
  );
}
