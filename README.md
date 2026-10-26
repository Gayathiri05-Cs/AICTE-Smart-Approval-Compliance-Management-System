# AICTE Smart Approval & Compliance Management System
### Smart India Hackathon (SIH 2026) — Problem Statement ID: SIH26262

**Category:** Integrated AICTE Approval Workflow Automation, Compliance Monitoring, and Alert Management System.

---

## 1. Executive Summary

The **AICTE Smart Approval & Compliance Management System** is a production-grade enterprise web application built to automate and streamline the statutory approval lifecycle for technical higher education institutions across India under the **AICTE Approval Process Handbook (APH 2026-27)**.

The system delivers:
1. **Automated Statutory Workflow Pipeline:** 8 configurable stages from submission to council decision.
2. **Role-Based Command Dashboards:** Dynamic pendency monitoring and Recharts analytics.
3. **Statutory Deadline & Compliance Tracker:** Real-time tracking of land leases, fire safety NOCs, building certificates, and faculty cadre ratios with automated countdowns.
4. **Multi-Channel Alert & Escalation Engine:** Automated reminder dispatches via In-App, Email (SMTP), SMS (NIC Gateway), and WhatsApp Business API simulation.
5. **Tamper-Evident Digital Audit Trail:** Append-only cryptographic ledger of every state transition, deficiency memo, and official decision with CSV export.

---

## 2. Technology Stack & System Architecture

### Frontend (Client Tier)
- **Framework:** React 19 + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 (Deep midnight navy, electric indigo, vibrant teal)
- **Typography:** Plus Jakarta Sans & JetBrains Mono (Google Fonts)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Stage funnels, regional workload, compliance donut, submission trends)
- **State Management & Persistence:** Resilient local storage database with seed data and auto-recovery

### Production Backend Target Architecture
- **API Server:** Python FastAPI (Async high-performance ASGI server)
- **Database:** PostgreSQL 16 with ACID isolation and spatial GIS support
- **Background Worker & Cron:** Celery + Redis (Hourly scheduled SLA checks, auto-escalations)
- **Document Vault:** Secure Private Object Storage (S3 / MinIO compliant)
- **Notification Adapters:**
  - **In-App:** WebSocket / Server-Sent Events (SSE)
  - **Email:** Postfix TLS / SMTP Relay
  - **SMS:** National Informatics Centre (NIC) SMS Gateway / CDAC
  - **WhatsApp:** WhatsApp Business Cloud API (Meta Graph API v19.0)

---

## 3. Demo Personas & Pre-configured Credentials

The prototype features interactive Single Sign-On (SSO) with three verified roles:

| Role | Demo Persona | Designation & Office | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **Institution User** | **Prof. S. K. Narayan** (`principal@dits.ac.in`) | Principal, Delhi Institute of Technology & Science | Submit applications, upload deeds & NOCs, view live stepper, resolve deficiency memos, submit compliance documents. |
| **Regional Officer** | **Dr. Rajeshwar Varma** (`ro.northern@aicte-india.org`) | Deputy Director, Northern Regional Office | Desk scrutiny, verify uploaded deeds, issue mandatory deficiency memos, schedule 3-member EVC inspections, trigger SLA escalations. |
| **Bureau Administrator** | **Dr. Mamidala J. Kumar** (`advisor.approval@aicte-india.org`) | Advisor & Bureau Head, AICTE HQ New Delhi | Pan-India overview, configure SLA days, manage escalation rules, view unredacted audit trails, record final statutory approvals/rejections. |

> **Note on Prototype Authentication:** The app provides a 1-click persona switcher in the top navigation bar and a dedicated SSO modal.

---

## 4. Five Core Features Walkthrough

### Feature 1 — Automated Approval Workflow
- Configurable statutory stages:
  1. `SUBMITTED`
  2. `INITIAL_SCRUTINY`
  3. `RE_SCRUTINY` (Post-Correction)
  4. `EVC_SCHEDULING`
  5. `EVC_CONDUCTED`
  6. `COMMITTEE_REVIEW` (Standing Hearing Committee)
  7. `COMPLIANCE_REVIEW`
  8. `FINAL_DECISION` (Statutory EOA Granted / Rejected)
- Progress stepper with real-time stage time and SLA countdowns.
- Authorized return-for-correction requiring **mandatory statutory justification**.
- Resubmission tracking with complete history.

### Feature 2 — Role-Based Dashboard & Pendency Analytics
- Live KPI cards: Total Dossiers, In Scrutiny, Correction Needed, Overdue Breaches, Scheduled EVCs, Compliance Due Soon.
- Dynamic Recharts:
  - Applications by Stage (Bar Chart)
  - Compliance Health Distribution (Donut Chart)
  - Regional Workload & Pendency (Grouped Bar Chart)
  - Monthly Submission Trend (Area Chart)
- Clickable metrics that filter directory views immediately.

### Feature 3 — Deadline & Compliance Tracker
- Dual views: **Table View** and **Calendar Schedule View**.
- Tracks institutional undertakings, land lease expirations, fire NOCs, and anti-ragging affidavits.
- Accurate countdown calculations (days remaining or days overdue).
- Institutional proof upload modal and officer verification drawer.

### Feature 4 — Multi-Channel Alert & Escalation Engine
- Dedicated Notification Center with filterable streams (In-App, Email, SMS, WhatsApp).
- Delivery status tracking: `Sent`, `Pending`, `Failed`, and `Simulated`.
- **"Trigger Test Alert"** button allowing jury and examiners to simulate multi-channel dispatches on demand.
- Configurable escalation rules (e.g., pendency > 7 days alerts Regional Officer; > 12 days alerts Bureau Head).

### Feature 5 — Digital Audit Trail & Regulatory Safeguards
- Append-only immutable audit ledger.
- Captures: Actor identity, role, timestamp, action name, old status & new status, reasoning, and IP address.
- Interactive chronological timeline and high-density tabular view.
- 1-click **Export to CSV** for regulatory compliance reporting.

---

## 5. Local Setup & Environment

### Environment Variables
Configure the following in `.env` (refer to `.env.example`):

```bash
# Application Port
PORT=3000

# Optional Gemini API Key for AI features (if enabled)
GEMINI_API_KEY="your-api-key"
```

### Running the Prototype
```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 6. SIH 2026 Jury Demonstration Script (Quick 3-Minute Tour)

1. **Dashboard & KPIs:**
   - Notice the high-level overview for the logged-in persona.
   - Click the **"SLA Overdue"** KPI card to immediately jump to overdue cases.
2. **Submit a New Application (Institution User):**
   - Click **"Submit New Application"** to launch the 4-step wizard.
   - Add a program and submit to observe real-time audit logging and notification triggers.
3. **Desk Scrutiny & Deficiency Memo (Regional Officer):**
   - Switch role to **Regional Officer** via the top right menu.
   - Open application `APP-2026-7934`, inspect the Document Vault, verify documents, or issue a deficiency memo.
4. **Trigger EVC Inspection:**
   - Navigate to **EVC Schedules**, constitute a 3-member committee, and upload inspection minutes to advance the stage to `EVC_CONDUCTED`.
5. **Audit Trail & CSV Export:**
   - Navigate to **Digital Audit Trail**, observe the chronological events recorded from your previous actions, and click **Export CSV**.
