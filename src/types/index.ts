export type UserRole = 'INSTITUTION' | 'REGIONAL_OFFICER' | 'BUREAU_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  region?: string;
  designation: string;
  avatar?: string;
}

export type ApplicationType =
  | 'Extension of Approval (EOA)'
  | 'New Technical Institution'
  | 'Increase in Intake'
  | 'Introduction of New Course'
  | 'Closure of Course/Institute'
  | 'Change of Site/Location';

export type InstitutionType =
  | 'Engineering & Technology'
  | 'Management (MBA/PGDM)'
  | 'Pharmacy'
  | 'Architecture & Planning'
  | 'Polytechnic & Applied Arts';

export type WorkflowStageKey =
  | 'SUBMITTED'
  | 'INITIAL_SCRUTINY'
  | 'RE_SCRUTINY'
  | 'EVC_SCHEDULING'
  | 'EVC_CONDUCTED'
  | 'COMMITTEE_REVIEW'
  | 'COMPLIANCE_REVIEW'
  | 'FINAL_DECISION';

export interface WorkflowStageConfig {
  key: WorkflowStageKey;
  label: string;
  order: number;
  description: string;
  defaultSlaDays: number;
  allowedRoles: UserRole[];
}

export type ApplicationStatus =
  | 'IN_PROGRESS'
  | 'CORRECTION_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'DEFICIENCY_NOTED';

export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ApplicationDocument {
  id: string;
  name: string;
  category:
    | 'Land & Building Title Deed'
    | 'Fire Safety NOC'
    | 'Approved Building Plan'
    | 'Affidavit for Mandatory Disclosure'
    | 'Faculty Cadre & Salary Proof'
    | 'Audited Balance Sheet'
    | 'AICTE Governing Body Resolution';
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  verificationStatus: DocumentVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface StatusHistoryEntry {
  id: string;
  stage: WorkflowStageKey;
  status: ApplicationStatus;
  changedBy: string;
  role: UserRole;
  timestamp: string;
  notes: string;
  correctionReason?: string;
}

export interface ProgramDetails {
  id: string;
  name: string;
  level: 'UG' | 'PG' | 'Diploma';
  currentIntake: number;
  proposedIntake: number;
  nbaAccredited: boolean;
}

export interface Application {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  institutionType: InstitutionType;
  region: 'Northern' | 'Western' | 'Eastern' | 'Southern' | 'South-Western' | 'Central';
  state: string;
  applicationType: ApplicationType;
  academicYear: string;
  submissionDate: string;
  currentStage: WorkflowStageKey;
  status: ApplicationStatus;
  assignedOfficerId: string;
  assignedOfficerName: string;
  daysInCurrentStage: number;
  slaDays: number;
  isOverdue: boolean;
  documents: ApplicationDocument[];
  statusHistory: StatusHistoryEntry[];
  infrastructure: {
    landAreaAcres: number;
    landOwnershipType: 'Owned' | 'Government Leased' | 'Private Leased';
    leaseExpiryDate?: string;
    builtUpAreaSqMeters: number;
    totalClassrooms: number;
    totalLaboratories: number;
    computerCenterCapacity: number;
    centralLibraryVolumes: number;
  };
  facultyStats: {
    professors: number;
    associateProfessors: number;
    assistantProfessors: number;
    studentFacultyRatio: string;
  };
  programs: ProgramDetails[];
}

export type ComplianceType =
  | 'Institutional Undertaking'
  | 'Land & Lease Validity'
  | 'Building Safety Certificate'
  | 'Fire Safety NOC'
  | 'Faculty Cadre Ratio'
  | 'Anti-Ragging Affidavit'
  | 'NBA/NAAC Accreditation Proof'
  | 'Financial Audit Report';

export type ComplianceStatus =
  | 'COMPLIANT'
  | 'DUE_SOON'
  | 'PENDING_VERIFICATION'
  | 'OVERDUE'
  | 'EXPIRED';

export interface ComplianceTask {
  id: string;
  institutionId: string;
  institutionName: string;
  relatedApplicationId: string;
  complianceType: ComplianceType;
  title: string;
  submissionDeadline: string;
  documentExpiryDate?: string;
  status: ComplianceStatus;
  assignedOfficer: string;
  lastUpdated: string;
  submittedDocName?: string;
  submittedDocDate?: string;
  remarks?: string;
  verificationNotes?: string;
}

export interface EVCEvent {
  id: string;
  applicationId: string;
  institutionName: string;
  region: string;
  visitDate: string;
  teamLeader: string;
  expertMembers: string[];
  status: 'SCHEDULED' | 'INSPECTION_COMPLETED' | 'REPORT_SUBMITTED' | 'DEFERRED';
  inspectionReportSummary?: string;
  deficienciesFound?: string[];
  scheduledAt: string;
}

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP';
export type DeliveryStatus = 'SENT' | 'PENDING' | 'FAILED' | 'SIMULATED';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  relatedType: 'APPLICATION' | 'COMPLIANCE' | 'EVC' | 'ESCALATION';
  relatedId: string;
  recipientRole: UserRole;
  recipientName: string;
  recipientContact: string;
  timestamp: string;
  isRead: boolean;
  deliveryStatus: DeliveryStatus;
  deliveryDetails?: {
    provider: string;
    attempts: number;
    simulatedLatencyMs: number;
    gatewayResponse?: string;
  };
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actingUser: string;
  userRole: UserRole;
  relatedId: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  ipAddress: string;
}

export interface EscalationRule {
  id: string;
  stage: WorkflowStageKey;
  triggerDays: number;
  escalateToRole: string;
  escalateToName: string;
  channels: NotificationChannel[];
  isActive: boolean;
}

export interface EscalationRecord {
  id: string;
  applicationId: string;
  institutionName: string;
  stage: WorkflowStageKey;
  overdueDays: number;
  escalatedFrom: string;
  escalatedTo: string;
  timestamp: string;
  reason: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
}
