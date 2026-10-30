/* HRMS 3.0 Help Centre content.
   Slide refs use "deck:from-to" (or "deck:n"), pointing at assets/slides/<deck>/NN.jpg.
   Callout labels shown beside each step are read from slides.js, so they always match the red numbers in the images. */
window.HC = {

/* Site switches. showDemo: false hides the Demo journey (header switch, home card, presenter, demo search results). */
config: { showDemo: false },

roles: [
  { id: "hr-setup", name: "HR Admin · setup", short: "HR Admin: setup", color: "setup", icon: "user-cog",
    who: "For the HR Admin or system owner, before go-live.",
    first: "Do these in order; each step feeds the next. Every screen follows the same pattern: Create, fill, Save, Yes on the prompt, Back.",
    ordered: true,
    groups: [ { title: "One-time setup", ids: ["setup-org","setup-users","setup-approval","setup-leave","setup-claim","setup-calendar","setup-ot","setup-notifications","setup-payroll","setup-kpi","setup-esg"] } ] },
  { id: "hr-payroll", name: "HR Admin · employees and payroll", short: "HR Admin: payroll", color: "payroll", icon: "wallet",
    who: "For HR Admins and the payroll team, every month.",
    first: "Start with onboarding: a complete employee record is what makes payroll, leave, claims and approvals work.",
    groups: [
      { title: "Employees", ids: ["onboard","service-changes","bulk-upload"] },
      { title: "Payroll", ids: ["allowances","run-payroll","payroll-failed","payroll-leavers","payroll-mtd","payroll-reports"] },
      { title: "Attendance", ids: ["attendance-errors","ot-request","attendance-upload"] } ] },
  { id: "employee", name: "Employee", short: "Employee", color: "employee", icon: "user",
    who: "For every staff member, on the web portal or the mobile app.",
    first: "Supervisors: tap Switch to Employee Mode first to do these for yourself.",
    groups: [
      { title: "Getting started", ids: ["sign-in"] },
      { title: "Leave and claims", ids: ["apply-leave","cancel-leave","submit-claim"] },
      { title: "Attendance, pay and performance", ids: ["clock-in","payslip","self-eval","notifications","name-card"] } ] },
  { id: "supervisor", name: "Supervisor and management", short: "Supervisor & mgmt", color: "supervisor", icon: "users",
    who: "For supervisors, HODs and management.",
    first: "Approve requests from your desk or phone, keep an eye on your team, and read the trends.",
    groups: [
      { title: "Approvals and team", ids: ["approve-leave","approve-claim","team-view","kpi-score"] },
      { title: "Dashboards and planning", ids: ["leave-dashboard","claim-dashboard","recruitment","hr-advisory"] } ] }
],

guides: {
/* ---------------- HR Admin: setup ---------------- */
"setup-org": { title: "Build the organization structure", role: "hr-setup", module: "Organisation", type: "Setup", platform: ["web"],
  summary: "Create the group of companies, add each company, then publish announcements and the company handbook.",
  menuPath: ["Organization Profile", "Organization Hierarchy"], prerequisites: ["sign-in"],
  steps: [
    { t: "Open Organization Hierarchy", d: "Main Cost Center is the container that holds your group of companies.", s: "company-creation:2" },
    { t: "Enter the group details and save", d: "Only the group name is required; prefix, description, code and SAP code are optional.", s: "company-creation:3-5" },
    { t: "Or create the group from the grid view", d: "The same form, opened from Switch to Grid View.", s: "company-creation:6-10" },
    { t: "Add each company as a sub item", d: "Select the group, click Add Sub Item, enter the company name and company code.", s: "company-creation:11-16" },
    { t: "Check the organization tree", d: "Use Expand All and Collapse All to review the structure.", s: "company-creation:17-18" },
    { t: "Publish a company announcement", d: "Announcements appear on every user's dashboard from the effective date.", s: "company-creation:19-24" },
    { t: "Upload the company handbook", d: "Handbooks appear under User Manual for the user roles you choose.", s: "company-handbook:3-6" } ],
  related: ["setup-users", "setup-approval"], keywords: ["company", "group", "cost center", "announcement", "handbook"] },

"setup-users": { title: "Create users and control access", role: "hr-setup", module: "Organisation", type: "Setup", platform: ["web"],
  summary: "Give each person a login, link it to their employee record and decide which menus each role sees.",
  menuPath: ["User Management", "User", "Create User"], prerequisites: ["setup-org"],
  steps: [
    { t: "Open Create User", s: "onboarding:53" },
    { t: "Fill in the user details", d: "Role decides menus. The email is used for Forgot password and notifications.", s: "onboarding:54",
      w: { k: "warn", t: "Must match", x: "The user's Employee Group must equal the Primary Employee Group on the employee profile, or approvals won't route." } },
    { t: "Assign organizations and save", d: "Pick every company the user may switch between and set the default one.", s: "onboarding:55-56" },
    { t: "Set menu access per role in User Right", d: "Select a role (System Admin, HOD/Supervisor, Employee, Management), open the highlighted setups and Save.", s: "performance-setup:3-8" },
    { t: "Reset a forgotten password", d: "Users click Forgot password, enter their email and click Send Me!; a new password is emailed.", s: "onboarding:57-59" } ],
  related: ["setup-approval", "sign-in"], keywords: ["user", "login", "role", "user right", "access", "password"] },

"setup-approval": { title: "Define the approval workflow", role: "hr-setup", module: "Leave", type: "Setup", platform: ["web"],
  summary: "Decide who approves leave and claims, in which order, for each employee group.",
  menuPath: ["Organization Profile", "Approval Config"], prerequisites: ["setup-users"],
  steps: [
    { t: "Open Approval Config and create a rule", s: "approval-setup:2-3" },
    { t: "Choose the module and the approver", d: "Set up Leave and Claim separately.", s: "approval-setup:4-5" },
    { t: "Set the approver level", d: "Level 1, Level 2 and so on, in the order they approve.", s: "approval-setup:6",
      w: { k: "note", t: "Multi-level", x: "Level 2 sees a request only after Level 1 has approved it." } },
    { t: "Select the employee group", d: "This is the Primary Employee Group on the employee profile; check it matches the user's group.", s: "approval-setup:7-9",
      w: { k: "warn", t: "Most common go-live issue", x: "If the group differs between Approval Config, the employee profile and the user, the approver never sees the request." } },
    { t: "Save the rule", s: "approval-setup:10" } ],
  related: ["approve-leave", "approve-claim"], keywords: ["approval", "approver", "level", "workflow", "employee group"] },

"setup-leave": { title: "Set up leave policies", role: "hr-setup", module: "Leave", type: "Setup", platform: ["web"],
  summary: "Create each leave type, its entitlement by job grade, balance adjustments and who may apply for it.",
  menuPath: ["Organization Profile", "Leave Setup"], prerequisites: ["setup-org"],
  steps: [
    { t: "Create a leave profile for each leave type", d: "Eligibility, pro-rate, carry forward, advance leave, include holiday, deduct pay, min and max days, cut-off date.", s: "leave-setup:2-7" },
    { t: "Set entitlement by job grade and years of service", s: "leave-setup:8-10",
      w: { k: "note", t: "Default grade", x: "JG000 [NIL] is the default job grade." } },
    { t: "Adjust an individual balance", d: "Use Leave Maintenance with an effective date, expiry date and reason.", s: "leave-setup:11-13" },
    { t: "Control who can view, apply and cancel", d: "Leave View/Apply Setup, per user role and leave type.", s: "leave-setup:14-15",
      w: { k: "tip", t: "Leave Sequence", x: "Organization Profile › Leave Setup › Leave Sequence sets which leave types are used next when a balance runs out." } } ],
  related: ["apply-leave", "setup-calendar"], keywords: ["leave", "entitlement", "carry forward", "annual leave", "policy"] },

"setup-claim": { title: "Set up claim policies", role: "hr-setup", module: "Claim", type: "Setup", platform: ["web"],
  summary: "Create claim types, optional panel clinics and the limits per job grade.",
  menuPath: ["Organization Profile", "Claim Setup"], prerequisites: ["setup-org"],
  steps: [
    { t: "Create each claim type", d: "Claim code, claim name, Active.", s: "claim-setup:13-15" },
    { t: "Add panel clinics (optional)", s: "claim-setup:16-19" },
    { t: "Set claim limits by job grade", d: "Max per visit amount, per year amount and Entitled.", s: "claim-setup:20-22",
      w: { k: "note", t: "Medical and dental only", x: "Panel Doctor and Beneficiary fields appear only on medical or dental claim types." } } ],
  related: ["submit-claim", "approve-claim"], keywords: ["claim", "entitlement", "panel doctor", "medical", "reimbursement"] },

"setup-calendar": { title: "Set up calendars, holidays and shift rosters", role: "hr-setup", module: "Attendance", type: "Setup", platform: ["web"],
  summary: "Attach working calendars, public holidays and shifts to TMS codes so every employee gets the right days.",
  menuPath: ["Organization Profile", "Rostering Setup"], prerequisites: ["setup-org"],
  intro: "The TMS code is the employee's work shift, set in Employee Status. Calendars and rosters attach to TMS codes, so everyone on one TMS code shares working days, holidays and shifts.",
  steps: [
    { t: "Assign a calendar to each TMS code", s: "roster-setup:3-6" },
    { t: "Add calendar and TMS codes if needed", d: "System Manager › Option List.", s: "roster-setup:7-10" },
    { t: "Build the calendar profile", d: "Choose the calendar type, then set day types by drag and drop or date range.", s: "roster-setup:11-17" },
    { t: "Add calendar types if needed", s: "roster-setup:18-20" },
    { t: "Upload public holidays from Excel", s: "roster-setup:22-24" },
    { t: "Create calendar events for holidays", s: "roster-setup:25-27" },
    { t: "Place events on the calendar", s: "roster-setup:28-34",
      w: { k: "note", t: "Selectable or not", x: "A holiday set as not selectable blocks leave on that day; selectable suits special cases such as state holidays." } },
    { t: "Build the shift roster", d: "Select the TMS code, then place shift codes by drag and drop or date range.", s: "roster-setup:35-42" },
    { t: "Give one employee their own calendar (optional)", d: "Roster Management › Individual Setup › Employee Calendar.", s: "roster-setup:44-49" } ],
  related: ["setup-ot", "clock-in"], keywords: ["calendar", "holiday", "public holiday", "roster", "shift", "tms"] },

"setup-ot": { title: "Set up overtime rules", role: "hr-setup", module: "Attendance", type: "Setup", platform: ["web"],
  summary: "Decide how raw overtime minutes become payable OT.",
  menuPath: ["Organization Profile", "Rostering Setup"], prerequisites: ["setup-calendar"],
  steps: [
    { t: "OT Break", d: "Break time deducted from OT, because breaks aren't paid.", s: "ot-process:3-6" },
    { t: "OT Condition", d: "How raw OT minutes are validated and rounded, by salary range and day type.", s: "ot-process:7-8" },
    { t: "Minimum OT", d: "Below this many minutes, OT for that day is zero.", s: "ot-process:9-10" },
    { t: "Effective OT Time", d: "When OT starts counting, by shift, TMS code, day type and job grade.", s: "ot-process:11-13" } ],
  related: ["ot-request", "attendance-errors"], keywords: ["ot", "overtime", "break", "minimum ot"] },

"setup-notifications": { title: "Set up notifications", role: "hr-setup", module: "Organisation", type: "Setup", platform: ["web"],
  summary: "Send automatic reminders before contracts, permits, passports, probation or KPI deadlines.",
  menuPath: ["Organization Profile", "Notification Settings"], prerequisites: ["setup-users"],
  steps: [
    { t: "Give the role access first", d: "User Management › User Right › Organization Profile › Calendar Setup › Notification Settings.", s: "notifications-setup:3-5" },
    { t: "Open Notification Settings and add a rule", s: "notifications-setup:6-8" },
    { t: "Create a rule for all companies", d: "Type, alert timing, Active, Notify Employee, recipients, Save Rule.", s: "notifications-setup:9-14" },
    { t: "Create a rule for specific companies", s: "notifications-setup:15-21",
      w: { k: "note", t: "Inherited or Override", x: "Inherited uses the all-companies rule; Override means a company-specific rule replaces it." } },
    { t: "Edit rules and add department overrides", d: "Department overrides send each manager alerts about their own staff only.", s: "notifications-setup:22-26" } ],
  related: ["notifications"], keywords: ["notification", "reminder", "expiry", "passport", "permit", "probation", "email"] },

"setup-payroll": { title: "Set up payroll items and NEISS", role: "hr-setup", module: "Payroll", type: "Setup", platform: ["web"],
  summary: "Create allowances and deductions, define how payroll treats them, and set NEISS categories.",
  menuPath: ["Organization Profile", "Payroll Setup"], prerequisites: ["setup-org"],
  steps: [
    { t: "Add a pay item in Option List", d: "System Manager › Option List, module type Pay Salary Type.", s: "payroll-setup:3-6" },
    { t: "Configure the salary profile", d: "Allowance or deduction, pay type, pay cycle and statutory flags.", s: "payroll-setup:7-11",
      w: { k: "warn", t: "Order matters", x: "Create the item in Option List, configure it here, then assign it in Employee Benefit or Employee Deduction." } },
    { t: "Open NEISS Profile", s: "neiss:5-7" },
    { t: "Add NEISS categories if needed", d: "Option List type NEISS_OCP_TYPE.", s: "neiss:8-10" },
    { t: "Enter NEISS wage bands and amounts", d: "FIXED means a fixed amount. Duplicate categories show a Record Exists message.", s: "neiss:11-14" } ],
  related: ["allowances", "payroll-mtd"], keywords: ["salary profile", "option list", "allowance", "deduction", "neiss"] },

"setup-kpi": { title: "Set up a Performance 2.0 cycle", role: "hr-setup", module: "Performance", type: "Setup", platform: ["web"],
  summary: "Build KPI criteria, decide who gets them, pair reviewers and publish the appraisal to employees.",
  menuPath: ["Performance", "Performance Setup 2.0"], prerequisites: ["setup-users"],
  steps: [
    { t: "Create KPI categories", s: "performance-setup:9-12" },
    { t: "Create KPI criteria", s: "performance-setup:13-16" },
    { t: "Define scope rules", d: "Choose the audience, then the criteria that apply. Check the generated list per employee.", s: "performance-setup:17-24" },
    { t: "Pair reviewees with reviewers", d: "Singly, auto-suggested from a user group, or by pasting codes. Inactive pairs aren't auto-assigned.", s: "performance-setup:25-33" },
    { t: "Build the KPI template", d: "Sections are Mandatory, Supervisor only or Optional, each with a weight.", s: "performance-setup:34-42",
      w: { k: "tip", t: "Fixing a template", x: "To correct a published template, create a new version." } },
    { t: "Publish and notify employees", d: "Template, target employees, review period, notifications, then Publish & Notify.", s: "performance-setup:43-48" } ],
  formula: "Score = average of (score ÷ max score × 100) across criteria\nFinal total = self score × self weight % + supervisor score × supervisor weight %",
  related: ["self-eval", "kpi-score"], keywords: ["kpi", "performance", "appraisal", "template", "criteria", "reviewer"] },

"setup-esg": { title: "Set up ESG and digital name cards", role: "hr-setup", module: "ESG", type: "Setup", platform: ["web", "mobile"],
  summary: "Create employees' digital name cards and record commuting data for ESG reporting.",
  menuPath: ["ESG"], prerequisites: ["onboard"],
  steps: [
    { t: "Upload profile photos", s: "esg-setup:2-4" },
    { t: "Set company description, logo and photo", s: "esg-setup:5-13" },
    { t: "Create a digital card", s: "esg-setup:14-17" },
    { t: "Employees open their card", s: "esg-setup:18-23" },
    { t: "Record employee commuting", s: "esg-setup:24-27" } ],
  related: ["name-card"], keywords: ["esg", "digital card", "name card", "qr", "commuting"] },

/* ---------------- HR Admin: employees and payroll ---------------- */
"onboard": { title: "Onboard a new employee", role: "hr-payroll", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "Create the records every new hire needs so payroll, leave, claims and approvals work.",
  menuPath: ["Employee Management", "Employee Profile"], prerequisites: ["setup-org", "setup-payroll"],
  before: ["Employee code is unique", "Job grade, TMS code and employee group exist", "Statutory numbers to hand (EPF, SOCSO, PCB, NEISS)"],
  steps: [
    { t: "Create the employee profile", s: "onboarding:5-8",
      w: { k: "warn", t: "Primary Employee Group", x: "This decides who approves the employee's leave and claims." } },
    { t: "Add the join date", s: "onboarding:9-11" },
    { t: "Add job details", d: "Department, TMS code (work shift), job grade, title, employee group and type.", s: "onboarding:12-17" },
    { t: "Add the address", s: "onboarding:18-23" },
    { t: "Add the salary", s: "onboarding:24-27" },
    { t: "Add fixed allowances", s: "onboarding:28-31" },
    { t: "Add statutory: EPF", s: "onboarding:32-36" },
    { t: "Add statutory: SOCSO and EIS", d: "SOCSO for Malaysians and, from 1 July 2024, foreign employees. EIS for Malaysian employees with IC.", s: "onboarding:37-40" },
    { t: "Add statutory: PCB", s: "onboarding:41-42" },
    { t: "Add statutory: NEISS", d: "C1 for employment injury and invalidity, C2 for employment injury only, NA if exempt.", s: "onboarding:43-45" },
    { t: "Add bank details", s: "onboarding:46-49" },
    { t: "Add children and spouse status", d: "Enter 0 if single or no children.", s: "onboarding:50-51" },
    { t: "Create the user login", d: "Follow Create users and control access.", s: "" } ],
  table: { title: "Records needed for payroll", head: ["Record", "Where", "Payroll"], rows: [
    ["Employee profile", "Employee Management › Employee Profile", "Required"],
    ["Join date", "Status › Employee Join/Resignation", "Required"],
    ["Job details", "Status › Employee Status", "Required"],
    ["Salary", "Salary › Employee Salary", "Required"],
    ["Statutory", "Statutory › Employee Statutory", "Required"],
    ["Working/Non-Work Child", "Statutory › Working/Non-Work Child", "Required"],
    ["Increment/Promotion (type New Join)", "Status › Increment/Promotion", "Required"] ] },
  related: ["service-changes", "bulk-upload", "run-payroll"], keywords: ["new hire", "new joiner", "employee profile", "statutory", "epf", "socso", "eis", "neiss", "bank"] },

"service-changes": { title: "Confirm, promote or process a resignation", role: "hr-payroll", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "Record confirmations, increments, promotions, resignations and disablement.",
  menuPath: ["Employee Management", "Status"], prerequisites: ["onboard"],
  steps: [
    { t: "Record a confirmation", s: "onboarding:62-63" },
    { t: "Record a resignation", d: "Payroll then shows the employee as Resign And Paid.", s: "onboarding:64-65" },
    { t: "Record an increment or promotion", d: "For new hires choose New Join, keeping the same job grade and title.", s: "onboarding:66-70" },
    { t: "Record disablement", s: "onboarding:79-80" } ],
  related: ["payroll-leavers", "onboard"], keywords: ["confirmation", "resign", "resignation", "increment", "promotion", "leaver", "disablement"] },

"bulk-upload": { title: "Load data in bulk from Excel", role: "hr-payroll", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "Upload many employee, statutory, bank or benefit records at once, fixing errors row by row.",
  menuPath: ["Employee Management", "Upload File"], prerequisites: ["setup-org"],
  steps: [
    { t: "Download and fill the template", s: "onboarding:81-83" },
    { t: "Choose the transfer type and upload", d: "Leave it as --Select-- to process every tab.", s: "onboarding:84" },
    { t: "Review and save the records", s: "onboarding:89-92" },
    { t: "Upload reimbursement claims", d: "Use benefit code REIMBCLAIM_R; the amount appears on the payslip.", s: "reimbursement:3-10" } ],
  related: ["onboard", "allowances"], keywords: ["upload", "excel", "template", "import", "bulk", "reimbursement"] },

"allowances": { title: "Add allowances, bonuses and deductions", role: "hr-payroll", module: "Payroll", type: "Monthly", platform: ["web"],
  summary: "Enter recurring allowances, one-off pay and deductions for payroll.",
  menuPath: ["Payroll Management", "Employee Benefit"], prerequisites: ["setup-payroll", "onboard"],
  steps: [
    { t: "Add a fixed or non-fixed benefit", d: "Fixed (travel, transport) repeats monthly; non-fixed (OT, incentive, bonus) uses a start and end date.", s: "onboarding:71-74",
      w: { k: "tip", t: "01/01/1900", x: "Keep the default date 01/01/1900 for a fixed monthly allowance so you never re-key it." } },
    { t: "Add a deduction", d: "Loan, unpaid leave and similar: code, date from and to, amount.", s: "onboarding:75-78" } ],
  related: ["run-payroll", "setup-payroll"], keywords: ["allowance", "benefit", "bonus", "incentive", "deduction", "loan"] },

"run-payroll": { title: "Process monthly payroll", role: "hr-payroll", module: "Payroll", type: "Monthly", platform: ["web"],
  summary: "Calculate pay with statutory contributions, check the results and publish payslips to staff.",
  menuPath: ["Payroll Management", "Process", "Payroll Process"], prerequisites: ["onboard", "allowances"],
  before: ["New joiners and resignations for the month are recorded", "Allowances, benefits and deductions are entered", "Extra PCB amounts are in Employee PCB Deduction", "Approved claims and uploaded reimbursements are in", "Attendance errors and OT are corrected"],
  steps: [
    { t: "Open Payroll Process", s: "process-payroll:6" },
    { t: "Select year, month, pay cycle and companies", d: "Leave Employee blank to include everyone; tick Show Resigned Employees to include leavers.", s: "process-payroll:7-8" },
    { t: "Process the payroll", s: "process-payroll:11" },
    { t: "Read the results summary", s: "process-payroll:12",
      w: { k: "warn", t: "Failed means a missing record", x: "Open View Processing Log before publishing; see Fix a failed payroll record." } },
    { t: "Publish", d: "Processed records show PROCESSED. After Publish the status is True and employees can see payslips.", s: "process-payroll:13-14" },
    { t: "View a payslip", s: "process-payroll:15-16" } ],
  table: { title: "Result codes", head: ["Result", "Meaning", "What to do"], rows: [
    ["Active", "Active employees for the month", "Check payslips"],
    ["New Joined", "New joiners in the month", "Check pro-rated pay"],
    ["Resigned", "Employees resigning in the month", "Tick Show Resigned Employees"],
    ["Skipped", "Record doesn't match the selection", "Check pay cycle and company"],
    ["Failed", "A required record is missing", "View Processing Log, fix, reprocess"] ] },
  related: ["payroll-failed", "payroll-reports", "payroll-leavers"], keywords: ["payroll", "process", "publish", "salary", "pay run"] },

"payroll-failed": { title: "Fix a failed payroll record", role: "hr-payroll", module: "Payroll", type: "Fix", platform: ["web"],
  summary: "Find which record is missing, add it and reprocess the employee.",
  menuPath: ["Payroll Management", "Process", "Payroll Process"], prerequisites: ["run-payroll"],
  steps: [
    { t: "Open View Processing Log", d: "It names the missing record for Failed or Skipped employees.", s: "process-payroll:15" },
    { t: "Add the missing record", d: "Profile, salary, statutory, status, increment/promotion or join/resignation.", s: "" },
    { t: "Delete the record and process again", d: "Select the employee, click Delete, then Process.", s: "" } ],
  related: ["run-payroll", "onboard"], keywords: ["failed", "error", "processing log", "skipped"] },

"payroll-leavers": { title: "Pay a resigned employee", role: "hr-payroll", module: "Payroll", type: "Monthly", platform: ["web"],
  summary: "Include employees who resign in the month in the payroll run.",
  menuPath: ["Payroll Management", "Process", "Payroll Process"], prerequisites: ["service-changes"],
  steps: [
    { t: "Find resigned employees", d: "Their status is Resign And Paid. Without Show Resigned Employees ticked, they don't appear.", s: "process-payroll:9" },
    { t: "Tick Show Resigned Employees and process", d: "They appear in the month they resign and no longer appear once processed.", s: "process-payroll:10" } ],
  related: ["run-payroll", "service-changes"], keywords: ["resign", "leaver", "final pay", "resigned"] },

"payroll-mtd": { title: "Handle MTD (PCB) and NEISS", role: "hr-payroll", module: "Payroll", type: "Monthly", platform: ["web"],
  summary: "Add extra PCB for a month and set up NEISS per employee; both are calculated in every payroll run.",
  menuPath: ["Payroll Management", "Transaction", "Employee PCB Deduction"], prerequisites: ["setup-payroll"],
  steps: [
    { t: "Add an extra PCB deduction", d: "Employee, PCB deduction profile code, month, year, amount.", s: "mtd:5-6" },
    { t: "Add a NEISS statutory record per employee", d: "Statutory type NEISS, NEISS no., category, Peninsula.", s: "neiss:16-21" },
    { t: "Process payroll as normal", d: "NEISS and PCB are calculated in the run.", s: "neiss:23-32" } ],
  related: ["run-payroll", "setup-payroll"], keywords: ["pcb", "mtd", "tax", "neiss", "lhdn"] },

"payroll-reports": { title: "Print payslips, summaries and EA Forms", role: "hr-payroll", module: "Payroll", type: "Report", platform: ["web"],
  summary: "Print payslips, download payroll summaries and salary analyses, and issue EA Forms.",
  menuPath: ["Report", "Payroll"], prerequisites: ["run-payroll"],
  steps: [
    { t: "Print payslips", s: "process-payroll:18-21" },
    { t: "Give report access", d: "'with (company)' for one company; 'without (company)' prints all companies.", s: "process-payroll:22-23" },
    { t: "Download the payroll summary", s: "process-payroll:24-25" },
    { t: "Generate the salary master analysis", s: "process-payroll:26-27" },
    { t: "Salary master analysis by division", s: "mtd:25-27" },
    { t: "Print EA Forms", s: "payslip-ea:16-20" } ],
  related: ["run-payroll", "payslip"], keywords: ["report", "payslip", "payroll summary", "salary master", "ea form", "excel"] },

"attendance-errors": { title: "Correct attendance errors", role: "hr-payroll", module: "Attendance", type: "Daily", platform: ["web"],
  summary: "Find missing or incorrect attendance records and fix them before payroll.",
  menuPath: ["Roster Management", "Process Attendance Error"], prerequisites: ["setup-calendar"],
  steps: [
    { t: "Process attendance errors for a date range", s: "ot-process:15-16" },
    { t: "Correct the employee's record", d: "Shift in and out, actual times, late-in and early-out minutes and a reason.", s: "ot-process:17-18" } ],
  related: ["ot-request", "attendance-upload"], keywords: ["attendance", "error", "late", "missing punch"] },

"ot-request": { title: "Submit an OT request", role: "hr-payroll", module: "Attendance", type: "Daily", platform: ["web"],
  summary: "Record overtime minutes for an employee and send them for approval.",
  menuPath: ["Roster Management", "Individual Setup", "Employee OT Maintenance"], prerequisites: ["setup-ot"],
  steps: [
    { t: "Create the OT record and submit", s: "ot-process:20-21" },
    { t: "Track it to approval", s: "ot-process:22-23" } ],
  related: ["setup-ot", "attendance-errors"], keywords: ["ot", "overtime", "request"] },

"attendance-upload": { title: "Upload attendance data", role: "hr-payroll", module: "Attendance", type: "Daily", platform: ["web"],
  summary: "Import clock-in and clock-out records in bulk from a file.",
  menuPath: ["Roster Management", "Upload Attendance Data"], prerequisites: ["setup-calendar"],
  steps: [ { t: "Upload the file and save the data", s: "ot-process:25-28" } ],
  related: ["attendance-errors"], keywords: ["attendance", "upload", "import", "clock"] },

/* ---------------- Employee ---------------- */
"sign-in": { title: "Sign in to the portal and app", role: "employee", module: "Organisation", type: "Daily", platform: ["web", "mobile"],
  summary: "Sign in on the web or mobile app, switch to Employee Mode and reset a forgotten password.",
  menuPath: ["Login"], menuPathMobile: ["Mobile app", "Sign In"], prerequisites: [],
  steps: [
    { p: "web", t: "Sign in on the web portal", d: "Username or email address and password.", s: "company-creation:1" },
    { p: "mobile", t: "Sign in on the mobile app", d: "Use the same account as the web portal.", s: "apply-leave:34" },
    { p: "web", t: "Supervisors: switch to Employee Mode", d: "Needed to apply leave or claims for yourself.", s: "apply-leave:3" },
    { p: "mobile", t: "Supervisors: switch to Employee Mode", d: "The deep blue dashboard is Supervisor mode; green is Employee mode.", s: "apply-leave:35" },
    { p: "web", t: "Reset a forgotten password", s: "onboarding:57-59" } ],
  related: ["apply-leave", "clock-in"], keywords: ["login", "sign in", "password", "forgot", "employee mode"] },

"apply-leave": { title: "Apply for leave", role: "employee", module: "Leave", type: "Daily", platform: ["web", "mobile"],
  summary: "Apply for leave on the web or the app and see which balance each day uses.",
  menuPath: ["Leave Management", "Application"], menuPathMobile: ["Mobile app", "Leave", "Create"], prerequisites: ["sign-in"],
  steps: [
    { p: "web", t: "Open Leave Application", s: "apply-leave:4" },
    { p: "web", t: "Start from your leave balance", s: "apply-leave:5-6" },
    { p: "web", t: "Fill in the leave details", d: "Full or half day, dates, standby person, reason and attachment.", s: "apply-leave:7-8" },
    { p: "web", t: "Check & Preview, then confirm", s: "apply-leave:9-10" },
    { p: "web", t: "Or start from My Applications", s: "apply-leave:11-16" },
    { p: "web", t: "Understand how your balance is used", d: "Carry forward first, then current entitlement, then future advance. When a balance runs out, other leave types are used in HR's order.", s: "apply-leave:17-19" },
    { p: "mobile", t: "Open the Leave dashboard", s: "apply-leave:36-37" },
    { p: "mobile", t: "Check your leave balance", d: "Tap a leave type to see its balance.", s: "apply-leave:38-39" },
    { p: "mobile", t: "Apply for leave", d: "Leave type, full or half day, date, reason, file and standby person, then Apply.", s: "apply-leave:40-41" },
    { p: "mobile", t: "Read the leave check before confirming", d: "Carry forward first, then current entitlement, then future advance.", s: "apply-leave:42" } ],
  related: ["cancel-leave", "approve-leave"], keywords: ["leave", "annual leave", "mc", "sick leave", "apply", "balance"] },

"cancel-leave": { title: "Cancel or resubmit leave", role: "employee", module: "Leave", type: "Daily", platform: ["web", "mobile"],
  summary: "Delete a pending request, resubmit a rejected one and read the approval log.",
  menuPath: ["Leave Management", "Application"], menuPathMobile: ["Mobile app", "Leave", "Leave Pending"], prerequisites: ["apply-leave"],
  steps: [
    { p: "web", t: "Read the approval log and rejection reason", s: "apply-leave:20-21" },
    { p: "web", t: "Delete leave awaiting approval", d: "Only while Awaiting For Approval; one day or the whole batch.", s: "apply-leave:23-26" },
    { p: "web", t: "Resubmit rejected or new leave", d: "Details are kept; Check & Preview, then Confirm.", s: "apply-leave:28-32" },
    { p: "mobile", t: "Cancel or resubmit pending leave", d: "Leave Pending: cancel or resubmit by batch or by single day.", s: "apply-leave:43-46" },
    { p: "mobile", t: "View approved and rejected leave", d: "Use the month picker; tap the arrow to expand individual days.", s: "apply-leave:47-49" } ],
  related: ["apply-leave"], keywords: ["cancel", "delete", "resubmit", "rejected", "rollback", "approval log"] },

"submit-claim": { title: "Submit a claim", role: "employee", module: "Claim", type: "Daily", platform: ["web", "mobile"],
  summary: "Submit expense claims with receipts, save drafts and track them to approval.",
  menuPath: ["Claim Management", "Claim Application"], menuPathMobile: ["Mobile app", "Claim", "Apply Claim"], prerequisites: ["sign-in"],
  steps: [
    { p: "web", t: "Create a new claim", d: "Your up-to-date balance shows when you pick the claim type.", s: "apply-claim:4-6" },
    { p: "web", t: "Edit drafts and submit for approval", s: "apply-claim:7-10" },
    { p: "web", t: "See claim history and the monthly report", s: "apply-claim:11-13" },
    { p: "mobile", t: "Apply for a claim", d: "Date, claim type, amount (RM), reason and up to 3 receipts; Submit Claim or Save as Draft.", s: "apply-claim:16-19" },
    { p: "mobile", t: "Submit a draft, cancel a request or view details", s: "apply-claim:20-24" } ],
  related: ["approve-claim", "setup-claim"], keywords: ["claim", "receipt", "expense", "medical", "reimbursement"] },

"clock-in": { title: "Clock in and out", role: "employee", module: "Attendance", type: "Daily", platform: ["mobile"],
  summary: "Clock in with GPS, clock in from outside with a photo, and check your attendance history.",
  menuPath: ["Mobile app", "Home"], prerequisites: ["sign-in"],
  steps: [
    { t: "Open the employee dashboard", s: "clock-in:1-3" },
    { t: "Clock in and clock out", s: "clock-in:4-5" },
    { t: "Clock in while working outside", d: "Take a photo, then clock in.", s: "clock-in:6-7" },
    { t: "Check your attendance history", d: "Green is on time, yellow is late, red is absent.", s: "clock-in:8-10" },
    { t: "Download a monthly report", s: "clock-in:11-12" } ],
  related: ["attendance-errors"], keywords: ["clock in", "clock out", "attendance", "gps", "punch"] },

"payslip": { title: "Get your payslip and EA Form", role: "employee", module: "Payroll", type: "Monthly", platform: ["web", "mobile"],
  summary: "Download your payslip each month and your EA Form each year.",
  menuPath: ["Report", "Payroll", "Print Payslip"], menuPathMobile: ["Mobile app", "Payroll"], prerequisites: ["sign-in"],
  steps: [
    { p: "web", t: "Print your payslip", d: "Your name is selected automatically; Search, tick, Print Payslip.", s: "payslip-ea:9-12",
      w: { k: "note", t: "Not there yet?", x: "Payslips appear only after HR publishes the month's payroll." } },
    { p: "web", t: "Print your EA Form", d: "Report › Government › EA Form; year, yourself, Print.", s: "payslip-ea:16-20" },
    { p: "mobile", t: "View and download your payslip", d: "Pick the month and year, then download.", s: "payslip-ea:4-7",
      w: { k: "note", t: "Not there yet?", x: "Payslips appear only after HR publishes the month's payroll." } },
    { p: "mobile", t: "Download your EA Form", d: "Select the year, tick the T&Cs, then Download.", s: "payslip-ea:14-15" } ],
  related: ["run-payroll"], keywords: ["payslip", "salary slip", "ea form", "tax form"] },

"self-eval": { title: "Complete your KPI self-evaluation", role: "employee", module: "Performance", type: "Daily", platform: ["web"],
  summary: "Pick optional KPIs, get them approved and score yourself.",
  menuPath: ["Performance", "Performance Setup 2.0", "KPI Employee"], prerequisites: ["sign-in"],
  steps: [
    { t: "Open KPI Employee", s: "self-evaluation:3-4" },
    { t: "Pick optional criteria and submit for approval", d: "Mandatory items are pre-ticked; supervisor-only items are hidden.", s: "self-evaluation:5-10" },
    { t: "If your supervisor rejects the selection", d: "It returns to Draft with the reason; pick again and resubmit.", s: "self-evaluation:11-13" },
    { t: "Score yourself and submit", d: "Amber chips mean above target.", s: "self-evaluation:14-17" },
    { t: "View your results", s: "self-evaluation:18-19" } ],
  related: ["kpi-score"], keywords: ["kpi", "appraisal", "performance", "self evaluation", "score"] },

"notifications": { title: "Notifications", role: "employee", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "See document expiry and KPI reminders in the bell and by email.",
  menuPath: ["Notification bell"], prerequisites: ["sign-in"],
  steps: [
    { t: "What you can be notified about", s: "notifications:2" },
    { t: "Open the notification bell", s: "notifications:5-7" },
    { t: "Document expiry reminders", d: "Sent only if HR turned on Notify Employee.", s: "notifications:8-9" },
    { t: "KPI reminders", s: "notifications:10-13" } ],
  related: ["setup-notifications"], keywords: ["notification", "bell", "reminder", "email"] },

"name-card": { title: "Share your digital name card", role: "employee", module: "ESG", type: "Daily", platform: ["web", "mobile"],
  summary: "Open, copy or download the QR code of your digital name card.",
  menuPath: ["ESG", "Digital Card"], menuPathMobile: ["Mobile app", "Profile", "Digital Name Card"], prerequisites: ["sign-in"],
  steps: [
    { p: "web", t: "Open your card's QR code", d: "Open the link, Copy URL or Download QR.", s: "digital-card:3-5" },
    { p: "mobile", t: "Open your digital name card", d: "Profile › Digital Name Card, then open the link, copy the URL or download the QR.", s: "digital-card:8-11" } ],
  related: ["setup-esg"], keywords: ["name card", "digital card", "qr", "business card"] },

/* ---------------- Supervisor and management ---------------- */
"approve-leave": { title: "Approve, reject or roll back leave", role: "supervisor", module: "Leave", type: "Daily", platform: ["web", "mobile"],
  summary: "Act on your team's leave requests on the web or the app.",
  menuPath: ["Supervisor Dashboard", "Leave Approval"], menuPathMobile: ["Mobile app", "Leave", "Leave Pending"], prerequisites: ["setup-approval"],
  steps: [
    { p: "web", t: "Open Leave Approval", s: "leave-approval:3" },
    { p: "web", t: "Approve leave", d: "Select all or specific days, check View Balance, then Approve and Confirm Approval.", s: "leave-approval:4-6",
      w: { k: "note", t: "Multi-level", x: "Level 2 sees a request only after Level 1 approves it." } },
    { p: "web", t: "Reject leave", d: "Pick a reject reason; the employee sees it.", s: "leave-approval:12-14" },
    { p: "web", t: "Roll back a pending request", d: "Returns it to the employee to fix and resubmit; add a reason.", s: "leave-approval:21-23" },
    { p: "mobile", t: "Approve leave", d: "Leave › Leave Pending; Select All, or expand to pick days, then Approve.", s: "leave-approval:8-10",
      w: { k: "note", t: "Multi-level", x: "Level 2 sees a request only after Level 1 approves it." } },
    { p: "mobile", t: "Reject leave", d: "Select the days, then choose a rejection reason.", s: "leave-approval:15-19" },
    { p: "mobile", t: "Roll back a pending request", d: "Only Pending Approval requests; add a reason.", s: "leave-approval:24-26" } ],
  related: ["team-view", "setup-approval"], keywords: ["approve", "reject", "rollback", "leave approval"] },

"approve-claim": { title: "Approve, reject or roll back claims", role: "supervisor", module: "Claim", type: "Daily", platform: ["web", "mobile"],
  summary: "Check receipts and act on your team's claims; download approved claim history.",
  menuPath: ["Supervisor Dashboard", "Claim Approval"], menuPathMobile: ["Mobile app", "Claim", "Claim Pending"], prerequisites: ["setup-approval"],
  steps: [
    { p: "web", t: "Open Claim Approval and approve", s: "claim-approval:3-6" },
    { p: "web", t: "Reject a claim", s: "claim-approval:13-15" },
    { p: "web", t: "Roll back a claim", d: "Only while Awaiting For Approval.", s: "claim-approval:20-22" },
    { p: "web", t: "Download employee claim history", s: "claim-approval:24-26" },
    { p: "mobile", t: "Approve a claim", d: "Open the attachment first; remarks are optional.", s: "claim-approval:8-11" },
    { p: "mobile", t: "Reject a claim", d: "Choose a reject reason, then Submit.", s: "claim-approval:16-18" } ],
  related: ["claim-dashboard", "submit-claim"], keywords: ["approve", "reject", "claim approval", "receipt"] },

"team-view": { title: "Check the team calendar and attendance", role: "supervisor", module: "Attendance", type: "Daily", platform: ["web", "mobile"],
  summary: "See who is on leave and print attendance time sheets.",
  menuPath: ["Leave Approval", "Team Calendar"], menuPathMobile: ["Mobile app", "Attendance"], prerequisites: [],
  steps: [
    { p: "web", t: "Open the team calendar", d: "All approved leave appears here.", s: "leave-approval:28-29" },
    { p: "web", t: "Print the attendance time sheet", d: "Report › Roster › Attendance Time Sheet, by group or by employee.", s: "attendance-dashboard:2-6" },
    { p: "mobile", t: "Check the team calendar", d: "Choose a date to see the day type and any leave.", s: "leave-approval:30" },
    { p: "mobile", t: "View team attendance and export", d: "Use the date slider, then Export Report for a month.", s: "attendance-dashboard:8-9" } ],
  related: ["approve-leave", "leave-dashboard"], keywords: ["team calendar", "attendance", "timesheet", "time sheet"] },

"kpi-score": { title: "Approve KPI selections and score your team", role: "supervisor", module: "Performance", type: "Daily", platform: ["web"],
  summary: "Approve each employee's KPI picks, score them and read the final weighted result.",
  menuPath: ["Performance", "Performance Setup 2.0", "KPI Supervisor"], prerequisites: ["setup-kpi"],
  steps: [
    { t: "Open KPI Supervisor", s: "supervisor-evaluation:3" },
    { t: "Review and approve the selection", d: "Reject to return it to the employee.", s: "supervisor-evaluation:4-7" },
    { t: "When several supervisors review", d: "It stays Pending Approval until every reviewer approves.", s: "supervisor-evaluation:8-9" },
    { t: "Score the employee", d: "When the status is Submitted to Supervisor.", s: "supervisor-evaluation:10-12" },
    { t: "Read the final result", s: "supervisor-evaluation:13-14" } ],
  formula: "Final total = self score × self weight % + supervisor score × supervisor weight %",
  related: ["self-eval", "setup-kpi"], keywords: ["kpi", "appraisal", "score", "performance"] },

"leave-dashboard": { title: "Read the leave dashboard", role: "supervisor", module: "Leave", type: "Report", platform: ["web"],
  summary: "See who is away today, the leave calendar and yearly leave analytics.",
  menuPath: ["Management Dashboard", "Leave Dashboard"], prerequisites: [],
  steps: [
    { t: "Open the leave dashboard", s: "leave-dashboard:3" },
    { t: "On Leave Today", s: "leave-dashboard:4" },
    { t: "Calendar Overview", s: "leave-dashboard:5" },
    { t: "Yearly Analytics", d: "Leave types by count and percentage; filter by period and company.", s: "leave-dashboard:6" } ],
  related: ["claim-dashboard", "team-view"], keywords: ["dashboard", "leave report", "analytics"] },

"claim-dashboard": { title: "Read the claim dashboard and export a summary", role: "supervisor", module: "Claim", type: "Report", platform: ["web"],
  summary: "Track pending claims, balances and spending, and export a claim summary to Excel.",
  menuPath: ["Management Dashboard", "Claim Dashboard"], prerequisites: [],
  steps: [
    { t: "Open the claim dashboard", s: "claim-dashboard:3" },
    { t: "Pending claims", s: "claim-dashboard:4" },
    { t: "Employee status and history", s: "claim-dashboard:5-6" },
    { t: "Approved reports", d: "Monthly spending trend and distribution by claim type.", s: "claim-dashboard:7" },
    { t: "Export the claim summary to Excel", s: "reimbursement:11-17" } ],
  related: ["approve-claim", "leave-dashboard"], keywords: ["dashboard", "claim report", "spending", "excel", "summary"] },

"recruitment": { title: "Request and track a new position", role: "supervisor", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "Raise a recruitment request, get it approved, track hiring and add candidates from resumes.",
  menuPath: ["Recruitment", "Recruitment Request"], prerequisites: [],
  steps: [
    { t: "Raise a recruitment request", s: "workforce-planning:4-8" },
    { t: "Approve it in the Workforce Planner", d: "Only Pending Approval requests can be actioned; approved ones become Active.", s: "workforce-planning:9-14" },
    { t: "Or reject it with a reason", s: "workforce-planning:15-18" },
    { t: "Track hiring in the Recruitment Tracker", s: "workforce-planning:19-25" },
    { t: "Add candidates from resumes", d: "Upload up to 3 resume PDFs and click Extract Data.", s: "recruitment:3-5" } ],
  related: ["hr-advisory"], keywords: ["recruitment", "hiring", "position", "workforce", "candidate", "resume"] },

"hr-advisory": { title: "Ask HR Advisory", role: "supervisor", module: "Organisation", type: "Daily", platform: ["web"],
  summary: "Ask HR questions and get answers with sources from company documents; review feedback.",
  menuPath: ["Agents", "HR Advisory"], prerequisites: [],
  steps: [
    { t: "Open HR Advisory", s: "hr-advisory:3-5" },
    { t: "Ask a question", d: "Sources Consulted shows when the answer comes from company documents.", s: "hr-advisory:6-11" },
    { t: "Give feedback on an answer", s: "hr-advisory:12-13" },
    { t: "Review feedback in the dashboard", s: "hr-advisory:14-19" },
    { t: "Act on feedback and export", d: "Mark Pending, Resolved or Ignore; export to CSV.", s: "hr-advisory:20-28" } ],
  related: ["recruitment"], keywords: ["ai", "hr advisory", "agent", "chat", "policy"] }
},

help: {
  issues: [
    { symptom: "Supervisor does not see a leave or claim request", topic: "Leave", cause: "The employee group differs between Approval Config, the employee's Primary Employee Group and the User record.", fix: ["Open the employee profile and note the Primary Employee Group.", "Make Approval Config and the User record use the same group."], guide: "setup-approval" },
    { symptom: "Level 2 approver cannot approve", topic: "Leave", cause: "Level 1 has not approved yet.", fix: ["Ask the Level 1 approver to act first."], guide: "approve-leave" },
    { symptom: "Payroll shows Failed for an employee", topic: "Payroll", cause: "A required record is missing: profile, salary, statutory, status, increment/promotion or join/resignation.", fix: ["Open View Processing Log.", "Add the missing record.", "Delete the record and process again."], guide: "payroll-failed" },
    { symptom: "Employee cannot see a payslip", topic: "Payroll", cause: "Payroll was processed but not published.", fix: ["Search the month, select the records and click Publish."], guide: "run-payroll" },
    { symptom: "Resigned employee missing from payroll", topic: "Payroll", cause: "Show Resigned Employees is not ticked.", fix: ["Tick Show Resigned Employees, then Search."], guide: "payroll-leavers" },
    { symptom: "Employee cannot pick a date for leave", topic: "Leave", cause: "The public holiday is set as not selectable in Calendar Setting.", fix: ["Change the calendar event if the date should be selectable."], guide: "setup-calendar" },
    { symptom: "Leave or claim balance looks wrong", topic: "Claim", cause: "Job grade or years of service in the entitlement.", fix: ["Check the employee's job grade.", "Check Leave or Claim Entitlement; JG000 [NIL] is the default grade."], guide: "setup-leave" },
    { symptom: "Fixed allowance paid only once", topic: "Payroll", cause: "The allowance has a date range instead of the default date.", fix: ["Use default date 01/01/1900 for fixed monthly allowances."], guide: "allowances" },
    { symptom: "Report menu missing", topic: "Payroll", cause: "The role has no report right.", fix: ["Grant it in User Right: 'with (company)' or 'without (company)'."], guide: "payroll-reports" },
    { symptom: "Employee gets no reminder emails", topic: "Login", cause: "Notify Employee is off on the rule.", fix: ["Tick Notify Employee on the notification rule."], guide: "setup-notifications" },
    { symptom: "Forgot password", topic: "Login", cause: "", fix: ["Click Forgot password, enter your email and click Send Me!; a new password is emailed."], guide: "sign-in" }
  ],
  statuses: [
    { module: "Leave", flow: [["New","neutral"],["Awaiting For Approval","pending"],["Approved","approved"],["Rejected","rejected"]], next: "Approver, Level 1 then Level 2. A rollback returns the request to the employee." },
    { module: "Claim", flow: [["Draft","neutral"],["Awaiting For Approval","pending"],["Approved","approved"],["Rejected","rejected"]], next: "Approver; the employee can cancel the request." },
    { module: "Payroll", flow: [["Processed","processed"],["Published (True)","published"]], next: "HR publishes; then employees see payslips." },
    { module: "KPI", flow: [["Draft","neutral"],["Pending Approval","pending"],["Approved","approved"],["Submitted To Supervisor","processed"],["Completed","published"]], next: "Employee and supervisor in turn." },
    { module: "Recruitment", flow: [["Pending Approval","pending"],["Active","approved"],["Rejected","rejected"],["Recruiting","processed"],["Closed","published"]], next: "Workforce planner, then hiring manager." }
  ]
},

demo: {
  chapters: [
    { id: "why", title: "Why HRMS 3.0", kicker: "Chapter 1", lead: "HR teams lose time re-keying data between paper, chat, spreadsheets and payroll. HRMS 3.0 puts every step in one system." },
    { id: "cycle", title: "One connected HR cycle", kicker: "Chapter 2", lead: "Data entered once flows through to approvals, payroll and reports." },
    { id: "roles", title: "Value for every role", kicker: "Chapter 3", lead: "Spend most time on the role of the person who signs." },
    { id: "compliance", title: "Malaysia-ready compliance", kicker: "Chapter 4", lead: "Statutory contributions are set per employee once and calculated in every payroll run." },
    { id: "moments", title: "Moments that win the room", kicker: "Chapter 5", lead: "Always show these five live; they land faster than any slide." },
    { id: "faq", title: "Questions prospects ask", kicker: "Chapter 6", lead: "Short, direct answers to the usual objections." },
    { id: "next", title: "Path to go-live", kicker: "Chapter 7", lead: "From a signed agreement to a self-sufficient HR team." }
  ],
  stats: [ ["One system", "Leave, claims, attendance, payroll, KPI and ESG"], ["Web + mobile", "Staff and supervisors act from their phones"], ["EPF to EA Form", "Malaysian statutory built into every payroll run"] ],
  pains: [
    { was: "Leave and claims on paper, email or chat", now: "Apply on web or mobile", detail: "Balance checked before submit, with receipts attached.", img: "leave_mobile_b" },
    { was: "Approvals stuck with one person", now: "Approve from the phone", detail: "Multi-level approval routed by employee group.", img: "leave_approve_mobile" },
    { was: "Attendance kept in spreadsheets", now: "GPS clock-in", detail: "Location, photo for outside work, colour-coded history.", img: "clockin" },
    { was: "Payroll rekeyed from many sources", now: "One payroll run", detail: "Salary, statutory, allowances and approved inputs together.", img: "payroll_processed" },
    { was: "Payslips and EA Forms handed out", now: "Self-service documents", detail: "Staff download their own payslip and EA Form.", img: "payslip_mobile" },
    { was: "No view of who's away or what's spent", now: "Live dashboards", detail: "Leave and claim trends for management.", img: "leave_dash" }
  ],
  cycle: [
    { id: "setup", name: "Set up", role: "HR Admin", text: "Company, users, approval levels, leave and claim rules, calendars, payroll items and KPIs, set once.", img: "shift_roster" },
    { id: "onboard", name: "Onboard", role: "HR Admin", text: "Each employee's profile, job, salary, statutory and bank details, by hand or Excel upload.", img: "emp_profile" },
    { id: "request", name: "Request", role: "Employee", text: "Leave, claims, clock-in and self-evaluation from the web or the app.", img: "claim_mobile_b" },
    { id: "approve", name: "Approve", role: "Supervisor", text: "Approve, reject or roll back in two taps, level by level.", img: "leave_approve_web" },
    { id: "payroll", name: "Payroll", role: "HR Admin", text: "Process, check the results, publish. Statutory included.", img: "payroll_result" },
    { id: "payslip", name: "Payslip", role: "Employee", text: "Payslips and EA Forms appear for staff as soon as HR publishes.", img: "ea_form" },
    { id: "insights", name: "Insights", role: "Management", text: "Who's away, leave mix, claim spending by type and month.", img: "claim_dash" }
  ],
  roles: [
    { id: "hr", name: "HR Admin", img: "shift_roster", gains: [ ["Rules set once", "Entitlements by job grade, approval levels, calendars and shift rosters."], ["Clean data from day one", "Excel templates with row-by-row error checks."], ["Payroll in one run", "Statutory calculated, results summarised, published to staff."] ] },
    { id: "employee", name: "Employee", img: "clockin", phone: true, gains: [ ["Self-service anywhere", "Leave, claims and clock-in on the mobile app."], ["No forms to chase", "Live status and approval log for every request."], ["Documents on demand", "Payslip, EA Form and a digital name card."] ] },
    { id: "supervisor", name: "Supervisor", img: "leave_approve_web", gains: [ ["Faster approvals", "Approve, reject or roll back on web or mobile."], ["Clear team view", "Team calendar and attendance time sheets."], ["Fair appraisals", "KPI selection approval and weighted scoring."] ] },
    { id: "management", name: "Management", img: "claim_dash", gains: [ ["Who's away today", "Leave dashboard with calendar overview and yearly analytics."], ["Spending under control", "Claim trend by month and by claim type."], ["Planned headcount", "Recruitment requests approved in the workforce planner."] ] },
    { id: "advanced", name: "AI and planning", img: "hr_advisory", gains: [ ["HR Advisory", "Answers HR questions with sources from company documents."], ["Recruitment tracker", "On Track, Due Soon and Expired positions at a glance."], ["Resume extraction", "Candidate data read from uploaded resume PDFs."] ] }
  ],
  compliance: [
    ["EPF", "Contribution or no-contribution options by employee type."],
    ["SOCSO", "Malaysians, and foreign employees from 1 July 2024."],
    ["EIS", "Malaysian employees with IC."],
    ["PCB (MTD)", "Monthly tax deduction with PCB profiles and extra PCB per month."],
    ["NEISS", "Categories C1 (Skim Caruman I), C2 (Skim Caruman II) and NA."],
    ["EA Form", "Generated by year; employees download it themselves."],
    ["Tax relief data", "Working and non-working children, spouse status, disablement."],
    ["Bank payments", "Multi-bank payment details with a default account per employee."]
  ],
  moments: [
    { title: "Clock in from the phone", text: "GPS map with current address, Slide to Clock In; outside the office, take a photo and clock in.", img: "clockin", phone: true },
    { title: "Leave balance checked before submit", text: "Check & Preview shows which balance each day uses: carry forward, current or future advance.", img: "leave_check" },
    { title: "Approve from the phone in two taps", text: "Select all or single days and Approve; Level 2 sees it only after Level 1.", img: "leave_approve_mobile", phone: true },
    { title: "Payroll in one run", text: "Process, read the results summary, Publish, and payslips appear for staff.", img: "payroll_result" },
    { title: "Ask HR Advisory a policy question", text: "The answer shows Sources Consulted from company documents.", img: "hr_advisory" }
  ],
  faq: [
    ["Can staff use it on their phones?", "Yes. The mobile app covers attendance, leave, claims, payslip and EA Form, plus approvals for supervisors."],
    ["We have several companies. Does it handle a group?", "Yes. A group of companies sits above each company, and users switch between the companies they may see."],
    ["Can approvals have more than one level?", "Yes. Set Level 1, Level 2 and so on per module and employee group."],
    ["How do we move our existing data in?", "Excel templates for profile, bank, statutory, status, increments and more, with errors shown row by row before saving."],
    ["Who controls what each person sees?", "HR sets user rights per role: System Admin, HOD/Supervisor, Employee and Management."],
    ["Can it remind people about expiring documents?", "Yes. Notification rules alert HR, and optionally the employee, before contract, permit, passport or probation dates."],
    ["What if we need help after go-live?", "Self-service in this Help Centre first, then a SainoDesk ticket."]
  ],
  next: [ ["Agree the scope", "Companies, headcount, modules and the payroll start month."], ["Set up and load staff", "HR Admin follows the setup guides and onboarding checklist."], ["Train every role", "A full-day training using this Help Centre."], ["Parallel run, then go live", "One payroll month beside the current process, then switch over."] ]
},

training: {
  path: [ ["Set up", "HR Admin: setup guides 1 to 11, in order", "role-hr-setup"], ["Load staff", "HR Admin: onboarding and bulk upload", "role-hr-payroll"], ["Train users", "All roles: full-day training and role guides", "train-day"], ["Parallel run", "Payroll team: one month beside current payroll", "guide-run-payroll"], ["Go live", "Everyone: this Help Centre, then SainoDesk", "help"] ],
  day: [ ["09:00","Welcome and the end-to-end cycle","Everyone"], ["09:30","HR Admin: foundation setup","HR Admin"], ["11:00","Break",""], ["11:15","HR Admin: employee lifecycle and onboarding","HR Admin"], ["12:15","Payroll processing and reports","Payroll team"], ["13:00","Lunch",""], ["14:00","Employee self-service, web and mobile","Everyone"], ["15:00","Supervisor: approvals and team view","Supervisors"], ["15:45","Break",""], ["16:00","Management dashboards and advanced modules","Management"], ["16:40","Recap, quick-reference cards and Q&A","Everyone"] ]
},

popular: ["run-payroll", "apply-leave", "approve-leave", "onboard", "submit-claim", "payslip"],

synonyms: { payslip: ["salary slip", "pay slip"], pcb: ["mtd", "tax"], mtd: ["pcb", "tax"], ot: ["overtime"], overtime: ["ot"], claim: ["reimbursement", "expense"], reimbursement: ["claim"], "clock": ["attendance", "punch"], attendance: ["clock", "punch"], appraisal: ["kpi", "performance"], kpi: ["appraisal", "performance"], resign: ["leaver", "resignation"], leaver: ["resign"], login: ["sign in", "password"], holiday: ["calendar"] }
};
