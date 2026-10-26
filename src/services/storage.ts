import {
  User,
  WorkflowStageConfig,
  Application,
  ComplianceTask,
  EVCEvent,
  NotificationItem,
  AuditEvent,
  EscalationRule,
  EscalationRecord,
  UserRole,
  WorkflowStageKey,
  ApplicationStatus,
  DocumentVerificationStatus,
  ComplianceStatus
} from '../types';

export const WORKFLOW_STAGES_CONFIG: WorkflowStageConfig[] = [
  {
    key: 'SUBMITTED',
    label: 'Submitted',
    order: 1,
    description: 'Application successfully received with statutory fee receipt and digital signature.',
    defaultSlaDays: 3,
    allowedRoles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'INITIAL_SCRUTINY',
    label: 'Initial Scrutiny',
    order: 2,
    description: 'Desk scrutiny by Regional Office for documentary completeness and land/cadre validation.',
    defaultSlaDays: 7,
    allowedRoles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'RE_SCRUTINY',
    label: 'Re-Scrutiny (Post-Correction)',
    order: 3,
    description: 'Verification of rectified documents submitted by the institution after deficiency memo.',
    defaultSlaDays: 5,
    allowedRoles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'EVC_SCHEDULING',
    label: 'EVC Scheduling',
    order: 4,
    description: 'Constitution of 3-member Expert Visiting Committee (EVC) and scheduling physical/virtual inspection.',
    defaultSlaDays: 10,
    allowedRoles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'EVC_CONDUCTED',
    label: 'EVC Conducted',
    order: 5,
    description: 'Physical inspection completed, geo-tagged photographic evidence & committee report uploaded.',
    defaultSlaDays: 4,
    allowedRoles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'COMMITTEE_REVIEW',
    label: 'Standing Hearing Committee',
    order: 6,
    description: 'SHC/SAC evaluation of EVC report and compliance submissions with legal/regulatory scrutiny.',
    defaultSlaDays: 8,
    allowedRoles: ['BUREAU_ADMIN']
  },
  {
    key: 'COMPLIANCE_REVIEW',
    label: 'Compliance Review',
    order: 7,
    description: 'Final verification of minor deficiencies and statutory undertakings before Executive Council.',
    defaultSlaDays: 5,
    allowedRoles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
  },
  {
    key: 'FINAL_DECISION',
    label: 'Council Final Decision',
    order: 8,
    description: 'Final issuance of Approval Letter (EOA / LoA) or speaking rejection order by competent authority.',
    defaultSlaDays: 3,
    allowedRoles: ['BUREAU_ADMIN']
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-inst-1',
    name: 'Prof. S. K. Narayan',
    email: 'principal@dits.ac.in',
    role: 'INSTITUTION',
    institutionId: 'inst-1',
    region: 'Northern',
    designation: 'Principal & Head of Institution',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr-ro-1',
    name: 'Dr. Rajeshwar Varma',
    email: 'ro.northern@aicte-india.org',
    role: 'REGIONAL_OFFICER',
    region: 'Northern',
    designation: 'Regional Officer & Deputy Director (Northern Region)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Mamidala J. Kumar',
    email: 'advisor.approval@aicte-india.org',
    role: 'BUREAU_ADMIN',
    region: 'HQ New Delhi',
    designation: 'Advisor & Bureau Head (Approval Bureau)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-2026-8812',
    institutionId: 'inst-1',
    institutionName: 'Delhi Institute of Technology & Science',
    institutionCode: 'AICTE-NRO-1-102941',
    institutionType: 'Engineering & Technology',
    region: 'Northern',
    state: 'Delhi (NCT)',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2026-2027',
    submissionDate: '2026-10-12T10:30:00Z',
    currentStage: 'INITIAL_SCRUTINY',
    status: 'IN_PROGRESS',
    assignedOfficerId: 'usr-ro-1',
    assignedOfficerName: 'Dr. Rajeshwar Varma',
    daysInCurrentStage: 6,
    slaDays: 7,
    isOverdue: false,
    documents: [
      {
        id: 'doc-101',
        name: 'Land_Title_Deed_Khasra_942.pdf',
        category: 'Land & Building Title Deed',
        fileSize: '4.8 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-12T10:20:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. Rajeshwar Varma',
        verifiedAt: '2026-10-15T14:10:00Z',
        remarks: 'Ownership clear, 12.5 acres registered in trust name.'
      },
      {
        id: 'doc-102',
        name: 'Delhi_Fire_Safety_NOC_2026.pdf',
        category: 'Fire Safety NOC',
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-12T10:22:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. Rajeshwar Varma',
        verifiedAt: '2026-10-15T14:15:00Z',
        remarks: 'Valid up to 30th September 2027.'
      },
      {
        id: 'doc-103',
        name: 'Approved_Master_Building_Plan.pdf',
        category: 'Approved Building Plan',
        fileSize: '8.4 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-12T10:25:00Z',
        verificationStatus: 'PENDING',
        remarks: 'Architect certificate cross-verification pending with municipal records.'
      },
      {
        id: 'doc-104',
        name: 'Faculty_Cadre_Salary_Audited_2025_26.pdf',
        category: 'Faculty Cadre & Salary Proof',
        fileSize: '5.6 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-12T10:28:00Z',
        verificationStatus: 'PENDING'
      }
    ],
    statusHistory: [
      {
        id: 'hist-1',
        stage: 'SUBMITTED',
        status: 'IN_PROGRESS',
        changedBy: 'Prof. S. K. Narayan',
        role: 'INSTITUTION',
        timestamp: '2026-10-12T10:30:00Z',
        notes: 'Annual EOA application submitted with statutory fee of INR 1,50,000 via BharatKosh transaction ref BK-994102.'
      },
      {
        id: 'hist-2',
        stage: 'INITIAL_SCRUTINY',
        status: 'IN_PROGRESS',
        changedBy: 'Dr. Rajeshwar Varma',
        role: 'REGIONAL_OFFICER',
        timestamp: '2026-10-14T09:15:00Z',
        notes: 'Assigned to Northern Regional Office for initial documentary scrutiny.'
      }
    ],
    infrastructure: {
      landAreaAcres: 12.5,
      landOwnershipType: 'Owned',
      builtUpAreaSqMeters: 28450,
      totalClassrooms: 48,
      totalLaboratories: 32,
      computerCenterCapacity: 450,
      centralLibraryVolumes: 64200
    },
    facultyStats: {
      professors: 14,
      associateProfessors: 28,
      assistantProfessors: 72,
      studentFacultyRatio: '1:18'
    },
    programs: [
      { id: 'prog-1', name: 'Computer Science & Engineering', level: 'UG', currentIntake: 180, proposedIntake: 180, nbaAccredited: true },
      { id: 'prog-2', name: 'Artificial Intelligence & Data Science', level: 'UG', currentIntake: 60, proposedIntake: 120, nbaAccredited: false },
      { id: 'prog-3', name: 'Electronics & Communication Engg', level: 'UG', currentIntake: 120, proposedIntake: 120, nbaAccredited: true },
      { id: 'prog-4', name: 'M.Tech Cyber Security', level: 'PG', currentIntake: 18, proposedIntake: 18, nbaAccredited: false }
    ]
  },
  {
    id: 'APP-2026-7934',
    institutionId: 'inst-2',
    institutionName: 'Apex Institute of Technology & Management',
    institutionCode: 'AICTE-WRO-1-240182',
    institutionType: 'Management (MBA/PGDM)',
    region: 'Western',
    state: 'Maharashtra',
    applicationType: 'Increase in Intake',
    academicYear: '2026-2027',
    submissionDate: '2026-10-04T14:15:00Z',
    currentStage: 'INITIAL_SCRUTINY',
    status: 'CORRECTION_REQUESTED',
    assignedOfficerId: 'usr-ro-wro',
    assignedOfficerName: 'Dr. Sunil K. Kulkarni',
    daysInCurrentStage: 9,
    slaDays: 7,
    isOverdue: true,
    documents: [
      {
        id: 'doc-201',
        name: 'Lease_Agreement_Pune_Campus.pdf',
        category: 'Land & Building Title Deed',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-04T14:00:00Z',
        verificationStatus: 'REJECTED',
        verifiedBy: 'Dr. Sunil K. Kulkarni',
        verifiedAt: '2026-10-18T11:30:00Z',
        remarks: 'Registered lease deed expired on 30 Sept 2026. Renewal deed not registered with Sub-Registrar.'
      },
      {
        id: 'doc-202',
        name: 'Faculty_Cadre_Details.pdf',
        category: 'Faculty Cadre & Salary Proof',
        fileSize: '1.9 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-10-04T14:05:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. Sunil K. Kulkarni',
        verifiedAt: '2026-10-18T11:40:00Z',
        remarks: 'Cadre ratio meets 1:2:6 norm.'
      }
    ],
    statusHistory: [
      {
        id: 'hist-201',
        stage: 'SUBMITTED',
        status: 'IN_PROGRESS',
        changedBy: 'Registrar, Apex Tech',
        role: 'INSTITUTION',
        timestamp: '2026-10-04T14:15:00Z',
        notes: 'Submitted for Intake increase in PGDM from 120 to 180.'
      },
      {
        id: 'hist-202',
        stage: 'INITIAL_SCRUTINY',
        status: 'CORRECTION_REQUESTED',
        changedBy: 'Dr. Sunil K. Kulkarni',
        role: 'REGIONAL_OFFICER',
        timestamp: '2026-10-18T11:45:00Z',
        notes: 'Discrepancy in land lease documentation. Registered 30-year lease renewal deed required.',
        correctionReason: 'Land lease deed expired on 30-09-2026. Registered copy with Sub-Registrar stamp not attached. Please upload registered renewal lease deed.'
      }
    ],
    infrastructure: {
      landAreaAcres: 5.2,
      landOwnershipType: 'Government Leased',
      leaseExpiryDate: '2026-09-30',
      builtUpAreaSqMeters: 14200,
      totalClassrooms: 24,
      totalLaboratories: 10,
      computerCenterCapacity: 200,
      centralLibraryVolumes: 32000
    },
    facultyStats: {
      professors: 5,
      associateProfessors: 10,
      assistantProfessors: 22,
      studentFacultyRatio: '1:15'
    },
    programs: [
      { id: 'prog-21', name: 'Master of Business Administration (MBA)', level: 'PG', currentIntake: 120, proposedIntake: 180, nbaAccredited: true }
    ]
  },
  {
    id: 'APP-2026-6120',
    institutionId: 'inst-3',
    institutionName: 'Kaveri College of Pharmacy & Research',
    institutionCode: 'AICTE-SRO-1-841920',
    institutionType: 'Pharmacy',
    region: 'Southern',
    state: 'Tamil Nadu',
    applicationType: 'New Technical Institution',
    academicYear: '2026-2027',
    submissionDate: '2026-09-20T11:00:00Z',
    currentStage: 'EVC_SCHEDULING',
    status: 'IN_PROGRESS',
    assignedOfficerId: 'usr-ro-sro',
    assignedOfficerName: 'Dr. C. Annamalai',
    daysInCurrentStage: 4,
    slaDays: 10,
    isOverdue: false,
    documents: [
      {
        id: 'doc-301',
        name: 'Land_Title_10_Acres_Freehold.pdf',
        category: 'Land & Building Title Deed',
        fileSize: '6.2 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-09-20T10:40:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. C. Annamalai',
        verifiedAt: '2026-09-28T16:00:00Z',
        remarks: 'Title search certificate cleared by Standing Counsel.'
      },
      {
        id: 'doc-302',
        name: 'Fire_Safety_NOC_Madurai.pdf',
        category: 'Fire Safety NOC',
        fileSize: '3.1 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-09-20T10:45:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. C. Annamalai',
        verifiedAt: '2026-09-28T16:05:00Z'
      },
      {
        id: 'doc-303',
        name: 'Gov_Body_Resolution_2026.pdf',
        category: 'AICTE Governing Body Resolution',
        fileSize: '1.4 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-09-20T10:50:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. C. Annamalai',
        verifiedAt: '2026-09-28T16:10:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist-301',
        stage: 'SUBMITTED',
        status: 'IN_PROGRESS',
        changedBy: 'Chairman, Kaveri Trust',
        role: 'INSTITUTION',
        timestamp: '2026-09-20T11:00:00Z',
        notes: 'Submitted application for establishing new pharmacy institute with B.Pharm 60 intake.'
      },
      {
        id: 'hist-302',
        stage: 'INITIAL_SCRUTINY',
        status: 'IN_PROGRESS',
        changedBy: 'Dr. C. Annamalai',
        role: 'REGIONAL_OFFICER',
        timestamp: '2026-09-28T16:20:00Z',
        notes: 'Desk scrutiny cleared without deficiency. Recommended for physical EVC inspection.'
      },
      {
        id: 'hist-303',
        stage: 'EVC_SCHEDULING',
        status: 'IN_PROGRESS',
        changedBy: 'Dr. C. Annamalai',
        role: 'REGIONAL_OFFICER',
        timestamp: '2026-10-21T09:30:00Z',
        notes: '3-member Expert Committee formulated for on-site visit scheduled for 28-10-2026.'
      }
    ],
    infrastructure: {
      landAreaAcres: 10.0,
      landOwnershipType: 'Owned',
      builtUpAreaSqMeters: 18500,
      totalClassrooms: 16,
      totalLaboratories: 18,
      computerCenterCapacity: 120,
      centralLibraryVolumes: 18000
    },
    facultyStats: {
      professors: 3,
      associateProfessors: 6,
      assistantProfessors: 15,
      studentFacultyRatio: '1:15'
    },
    programs: [
      { id: 'prog-31', name: 'Bachelor of Pharmacy (B.Pharm)', level: 'UG', currentIntake: 0, proposedIntake: 60, nbaAccredited: false }
    ]
  },
  {
    id: 'APP-2026-5541',
    institutionId: 'inst-4',
    institutionName: 'Bengal Institute of Architecture & Town Planning',
    institutionCode: 'AICTE-ERO-1-391024',
    institutionType: 'Architecture & Planning',
    region: 'Eastern',
    state: 'West Bengal',
    applicationType: 'Introduction of New Course',
    academicYear: '2026-2027',
    submissionDate: '2026-08-15T09:40:00Z',
    currentStage: 'COMMITTEE_REVIEW',
    status: 'IN_PROGRESS',
    assignedOfficerId: 'usr-admin-1',
    assignedOfficerName: 'Dr. Mamidala J. Kumar',
    daysInCurrentStage: 3,
    slaDays: 8,
    isOverdue: false,
    documents: [
      {
        id: 'doc-401',
        name: 'CoA_Approval_Copy_2026.pdf',
        category: 'Affidavit for Mandatory Disclosure',
        fileSize: '2.8 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-08-15T09:30:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. Mamidala J. Kumar',
        verifiedAt: '2026-10-10T12:00:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist-401',
        stage: 'SUBMITTED',
        status: 'IN_PROGRESS',
        changedBy: 'Dean Architecture',
        role: 'INSTITUTION',
        timestamp: '2026-08-15T09:40:00Z',
        notes: 'Introduction of M.Plan (Urban Planning) course.'
      },
      {
        id: 'hist-402',
        stage: 'EVC_CONDUCTED',
        status: 'IN_PROGRESS',
        changedBy: 'ERO Inspection Lead',
        role: 'REGIONAL_OFFICER',
        timestamp: '2026-10-18T17:00:00Z',
        notes: 'Inspection completed satisfactorily with geo-fenced mobile app.'
      },
      {
        id: 'hist-403',
        stage: 'COMMITTEE_REVIEW',
        status: 'IN_PROGRESS',
        changedBy: 'Dr. Mamidala J. Kumar',
        role: 'BUREAU_ADMIN',
        timestamp: '2026-10-22T10:00:00Z',
        notes: 'Placed before Standing Appellate Committee for final review.'
      }
    ],
    infrastructure: {
      landAreaAcres: 7.5,
      landOwnershipType: 'Owned',
      builtUpAreaSqMeters: 16800,
      totalClassrooms: 20,
      totalLaboratories: 12,
      computerCenterCapacity: 150,
      centralLibraryVolumes: 22000
    },
    facultyStats: {
      professors: 4,
      associateProfessors: 8,
      assistantProfessors: 18,
      studentFacultyRatio: '1:12'
    },
    programs: [
      { id: 'prog-41', name: 'Bachelor of Architecture (B.Arch)', level: 'UG', currentIntake: 80, proposedIntake: 80, nbaAccredited: true },
      { id: 'prog-42', name: 'Master of Planning (Urban Planning)', level: 'PG', currentIntake: 0, proposedIntake: 20, nbaAccredited: false }
    ]
  },
  {
    id: 'APP-2026-4290',
    institutionId: 'inst-5',
    institutionName: 'Karnataka Polytechnic Institute',
    institutionCode: 'AICTE-SWRO-1-772910',
    institutionType: 'Polytechnic & Applied Arts',
    region: 'South-Western',
    state: 'Karnataka',
    applicationType: 'Extension of Approval (EOA)',
    academicYear: '2026-2027',
    submissionDate: '2026-07-10T15:20:00Z',
    currentStage: 'FINAL_DECISION',
    status: 'APPROVED',
    assignedOfficerId: 'usr-admin-1',
    assignedOfficerName: 'Dr. Mamidala J. Kumar',
    daysInCurrentStage: 1,
    slaDays: 3,
    isOverdue: false,
    documents: [
      {
        id: 'doc-501',
        name: 'EOA_Compliance_Documents_All.pdf',
        category: 'Affidavit for Mandatory Disclosure',
        fileSize: '9.2 MB',
        fileType: 'application/pdf',
        uploadedAt: '2026-07-10T15:00:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. Mamidala J. Kumar',
        verifiedAt: '2026-10-23T11:00:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist-501',
        stage: 'FINAL_DECISION',
        status: 'APPROVED',
        changedBy: 'Dr. Mamidala J. Kumar',
        role: 'BUREAU_ADMIN',
        timestamp: '2026-10-24T14:30:00Z',
        notes: 'Statutory approval granted by AICTE Approval Bureau under APH 2026-27 norms. EOA Letter issued.'
      }
    ],
    infrastructure: {
      landAreaAcres: 8.0,
      landOwnershipType: 'Owned',
      builtUpAreaSqMeters: 19500,
      totalClassrooms: 30,
      totalLaboratories: 24,
      computerCenterCapacity: 250,
      centralLibraryVolumes: 26000
    },
    facultyStats: {
      professors: 2,
      associateProfessors: 12,
      assistantProfessors: 40,
      studentFacultyRatio: '1:20'
    },
    programs: [
      { id: 'prog-51', name: 'Diploma Mechanical Engineering', level: 'Diploma', currentIntake: 120, proposedIntake: 120, nbaAccredited: true },
      { id: 'prog-52', name: 'Diploma Electrical & Electronics', level: 'Diploma', currentIntake: 60, proposedIntake: 60, nbaAccredited: false }
    ]
  }
];

export const INITIAL_COMPLIANCE_TASKS: ComplianceTask[] = [
  {
    id: 'CMP-2026-01',
    institutionId: 'inst-1',
    institutionName: 'Delhi Institute of Technology & Science',
    relatedApplicationId: 'APP-2026-8812',
    complianceType: 'Building Safety Certificate',
    title: 'Submission of Structural Stability Certificate by Govt. Chartered Engineer',
    submissionDeadline: '2026-11-05T23:59:59Z',
    documentExpiryDate: '2026-11-15T00:00:00Z',
    status: 'DUE_SOON',
    assignedOfficer: 'Dr. Rajeshwar Varma',
    lastUpdated: '2026-10-20T10:00:00Z',
    remarks: 'Required under APH Chapter 2. Previous certificate validity expiring.'
  },
  {
    id: 'CMP-2026-02',
    institutionId: 'inst-1',
    institutionName: 'Delhi Institute of Technology & Science',
    relatedApplicationId: 'APP-2026-8812',
    complianceType: 'Fire Safety NOC',
    title: 'Annual Renewal of Fire Safety Certificate (Delhi Fire Services)',
    submissionDeadline: '2027-09-30T23:59:59Z',
    documentExpiryDate: '2027-09-30T00:00:00Z',
    status: 'COMPLIANT',
    assignedOfficer: 'Dr. Rajeshwar Varma',
    lastUpdated: '2026-10-15T14:15:00Z',
    submittedDocName: 'Delhi_Fire_Safety_NOC_2026.pdf',
    submittedDocDate: '2026-10-12T10:22:00Z',
    remarks: 'Clearance verified on municipal portal.'
  },
  {
    id: 'CMP-2026-03',
    institutionId: 'inst-2',
    institutionName: 'Apex Institute of Technology & Management',
    relatedApplicationId: 'APP-2026-7934',
    complianceType: 'Land & Lease Validity',
    title: 'Registration of 30-Year Lease Renewal with Sub-Registrar Office',
    submissionDeadline: '2026-10-20T23:59:59Z',
    documentExpiryDate: '2026-09-30T00:00:00Z',
    status: 'OVERDUE',
    assignedOfficer: 'Dr. Sunil K. Kulkarni',
    lastUpdated: '2026-10-18T11:45:00Z',
    remarks: 'Deficiency notice issued. Submission overdue by 5 days.'
  },
  {
    id: 'CMP-2026-04',
    institutionId: 'inst-2',
    institutionName: 'Apex Institute of Technology & Management',
    relatedApplicationId: 'APP-2026-7934',
    complianceType: 'Anti-Ragging Affidavit',
    title: 'Online Anti-Ragging Undertaking by Students and Parents (100% compliance)',
    submissionDeadline: '2026-10-30T23:59:59Z',
    status: 'PENDING_VERIFICATION',
    assignedOfficer: 'Dr. Sunil K. Kulkarni',
    lastUpdated: '2026-10-24T08:30:00Z',
    submittedDocName: 'Anti_Ragging_Consolidated_Affidavit_2026.pdf',
    submittedDocDate: '2026-10-24T08:20:00Z',
    remarks: 'Submitted for verification by institute nodal officer.'
  },
  {
    id: 'CMP-2026-05',
    institutionId: 'inst-3',
    institutionName: 'Kaveri College of Pharmacy & Research',
    relatedApplicationId: 'APP-2026-6120',
    complianceType: 'Institutional Undertaking',
    title: 'Bank Guarantee / Fixed Deposit Receipt (FDR) Lien in favour of Member Secretary, AICTE',
    submissionDeadline: '2026-11-12T23:59:59Z',
    status: 'DUE_SOON',
    assignedOfficer: 'Dr. C. Annamalai',
    lastUpdated: '2026-10-21T09:30:00Z',
    remarks: 'INR 35 Lakhs FDR lien marking for new technical institute.'
  },
  {
    id: 'CMP-2026-06',
    institutionId: 'inst-4',
    institutionName: 'Bengal Institute of Architecture & Town Planning',
    relatedApplicationId: 'APP-2026-5541',
    complianceType: 'Faculty Cadre Ratio',
    title: 'Recruitment proof for Professor of Urban Planning under 7th CPC',
    submissionDeadline: '2026-10-01T23:59:59Z',
    status: 'EXPIRED',
    assignedOfficer: 'Dr. Mamidala J. Kumar',
    lastUpdated: '2026-10-02T11:00:00Z',
    remarks: 'Previous ad-hoc appointment validity expired.'
  }
];

export const INITIAL_EVC_EVENTS: EVCEvent[] = [
  {
    id: 'EVC-2026-101',
    applicationId: 'APP-2026-6120',
    institutionName: 'Kaveri College of Pharmacy & Research',
    region: 'Southern',
    visitDate: '2026-10-28T09:30:00Z',
    teamLeader: 'Prof. K. Ramaswamy (IIT Madras)',
    expertMembers: [
      'Dr. P. Sundaram (NIPER Mohali)',
      'Er. V. Chandrasekar (PWD Superintending Engineer, Architecture)'
    ],
    status: 'SCHEDULED',
    inspectionReportSummary: 'Physical verification of 10-acre site, machine room, central instrumentation facility and library stock.',
    scheduledAt: '2026-10-21T09:30:00Z'
  },
  {
    id: 'EVC-2026-092',
    applicationId: 'APP-2026-5541',
    institutionName: 'Bengal Institute of Architecture & Town Planning',
    region: 'Eastern',
    visitDate: '2026-10-18T10:00:00Z',
    teamLeader: 'Prof. Anirban Roy (Jadavpur University)',
    expertMembers: [
      'Ar. Debolina Sen (Council of Architecture)',
      'Er. Subhash Ghosh (KMDA Planning Member)'
    ],
    status: 'REPORT_SUBMITTED',
    inspectionReportSummary: 'Inspected new M.Plan CAD studio, GIS lab and library. Found infrastructure adequate with minor recommendation on acoustical cladding.',
    scheduledAt: '2026-10-05T11:00:00Z'
  },
  {
    id: 'EVC-2026-110',
    applicationId: 'APP-2026-8812',
    institutionName: 'Delhi Institute of Technology & Science',
    region: 'Northern',
    visitDate: '2026-11-10T10:00:00Z',
    teamLeader: 'Prof. R. P. Singh (DTU Delhi)',
    expertMembers: [
      'Prof. Geeta Khanna (NSUT Delhi)',
      'Dr. A. K. Mathur (Industry Expert, NASSCOM)'
    ],
    status: 'SCHEDULED',
    inspectionReportSummary: 'Special surprise EVC for AI & Data Science high-performance compute lab readiness.',
    scheduledAt: '2026-10-23T16:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deficiency Memo Issued for APP-2026-7934',
    message: 'Correction requested for Land Lease Deed on application APP-2026-7934. Reason: Registered copy not submitted.',
    channel: 'IN_APP',
    relatedType: 'APPLICATION',
    relatedId: 'APP-2026-7934',
    recipientRole: 'INSTITUTION',
    recipientName: 'Apex Institute of Technology & Management',
    recipientContact: 'principal@apextech.ac.in',
    timestamp: '2026-10-18T11:45:00Z',
    isRead: false,
    deliveryStatus: 'SENT',
    deliveryDetails: {
      provider: 'Internal In-App Dispatcher',
      attempts: 1,
      simulatedLatencyMs: 45
    }
  },
  {
    id: 'notif-2',
    title: 'WhatsApp Alert: Compliance Deadline Expired',
    message: 'AICTE Alert: Land lease compliance for APP-2026-7934 is overdue. Please submit immediately to prevent application rejection.',
    channel: 'WHATSAPP',
    relatedType: 'COMPLIANCE',
    relatedId: 'CMP-2026-03',
    recipientRole: 'INSTITUTION',
    recipientName: 'Apex Institute of Technology & Management',
    recipientContact: '+91 98230 44102',
    timestamp: '2026-10-21T08:00:00Z',
    isRead: false,
    deliveryStatus: 'SIMULATED',
    deliveryDetails: {
      provider: 'WhatsApp Business Cloud API (Simulated)',
      attempts: 1,
      simulatedLatencyMs: 310,
      gatewayResponse: '200 OK - Message delivered to WhatsApp recipient webhook'
    }
  },
  {
    id: 'notif-3',
    title: 'EVC Visit Scheduled: Kaveri College of Pharmacy',
    message: 'Expert Visiting Committee scheduled on 28-10-2026. Committee lead: Prof. K. Ramaswamy (IIT Madras).',
    channel: 'EMAIL',
    relatedType: 'EVC',
    relatedId: 'EVC-2026-101',
    recipientRole: 'REGIONAL_OFFICER',
    recipientName: 'Dr. C. Annamalai',
    recipientContact: 'ro.southern@aicte-india.org',
    timestamp: '2026-10-21T09:35:00Z',
    isRead: true,
    deliveryStatus: 'SIMULATED',
    deliveryDetails: {
      provider: 'SMTP / NIC Mail Relay (Simulated)',
      attempts: 1,
      simulatedLatencyMs: 180,
      gatewayResponse: '250 2.0.0 OK Message accepted for delivery'
    }
  },
  {
    id: 'notif-4',
    title: 'SMS Reminder: Building Safety Certificate Due',
    message: 'AICTE Notice: Structural stability compliance for APP-2026-8812 is due by 05-Nov-2026. Portal: aicte-india.org',
    channel: 'SMS',
    relatedType: 'COMPLIANCE',
    relatedId: 'CMP-2026-01',
    recipientRole: 'INSTITUTION',
    recipientName: 'Delhi Institute of Technology & Science',
    recipientContact: '+91 98110 55219',
    timestamp: '2026-10-24T09:00:00Z',
    isRead: false,
    deliveryStatus: 'SIMULATED',
    deliveryDetails: {
      provider: 'CDAC National SMS Gateway (Simulated)',
      attempts: 1,
      simulatedLatencyMs: 140,
      gatewayResponse: 'SMS_SENT_DLT_TE_ID_1407161829'
    }
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-99104',
    timestamp: '2026-10-24T14:30:00Z',
    actingUser: 'Dr. Mamidala J. Kumar',
    userRole: 'BUREAU_ADMIN',
    relatedId: 'APP-2026-4290',
    action: 'RECORD_FINAL_DECISION',
    previousStatus: 'IN_PROGRESS',
    newStatus: 'APPROVED',
    reason: 'Complied with all infrastructure and faculty norms as per APH 2026-27 Chapter II. EOA granted for 2026-27.',
    ipAddress: '10.20.1.14 (AICTE HQ LAN)'
  },
  {
    id: 'AUD-99081',
    timestamp: '2026-10-22T10:00:00Z',
    actingUser: 'Dr. Mamidala J. Kumar',
    userRole: 'BUREAU_ADMIN',
    relatedId: 'APP-2026-5541',
    action: 'ADVANCE_WORKFLOW_STAGE',
    previousStatus: 'EVC_CONDUCTED',
    newStatus: 'COMMITTEE_REVIEW',
    reason: 'EVC inspection report submitted and uploaded. Placed for SAC appraisal.',
    ipAddress: '10.20.1.14 (AICTE HQ LAN)'
  },
  {
    id: 'AUD-98920',
    timestamp: '2026-10-21T09:30:00Z',
    actingUser: 'Dr. C. Annamalai',
    userRole: 'REGIONAL_OFFICER',
    relatedId: 'APP-2026-6120',
    action: 'SCHEDULE_EVC_INSPECTION',
    previousStatus: 'INITIAL_SCRUTINY',
    newStatus: 'EVC_SCHEDULING',
    reason: 'Initial desk scrutiny cleared. EVC constituted with IIT Madras expert chair.',
    ipAddress: '14.139.182.45 (SRO Chennai Office)'
  },
  {
    id: 'AUD-98845',
    timestamp: '2026-10-18T11:45:00Z',
    actingUser: 'Dr. Sunil K. Kulkarni',
    userRole: 'REGIONAL_OFFICER',
    relatedId: 'APP-2026-7934',
    action: 'REQUEST_CORRECTION',
    previousStatus: 'IN_PROGRESS',
    newStatus: 'CORRECTION_REQUESTED',
    reason: 'Land lease deed expired on 30-09-2026. Registered copy with Sub-Registrar stamp not attached. Please upload registered renewal lease deed.',
    ipAddress: '14.139.112.22 (WRO Mumbai Office)'
  },
  {
    id: 'AUD-98710',
    timestamp: '2026-10-15T14:10:00Z',
    actingUser: 'Dr. Rajeshwar Varma',
    userRole: 'REGIONAL_OFFICER',
    relatedId: 'APP-2026-8812',
    action: 'VERIFY_DOCUMENT',
    previousStatus: 'PENDING',
    newStatus: 'VERIFIED',
    reason: 'Document: Land_Title_Deed_Khasra_942.pdf verified against revenue record.',
    ipAddress: '10.20.4.88 (NRO Chandigarh Office)'
  },
  {
    id: 'AUD-98540',
    timestamp: '2026-10-12T10:30:00Z',
    actingUser: 'Prof. S. K. Narayan',
    userRole: 'INSTITUTION',
    relatedId: 'APP-2026-8812',
    action: 'APPLICATION_SUBMITTED',
    previousStatus: 'DRAFT',
    newStatus: 'SUBMITTED',
    reason: 'Application submitted for Extension of Approval (EOA) 2026-27 with digital signature token.',
    ipAddress: '115.240.90.11 (Delhi Institute Gateway)'
  }
];

export const INITIAL_ESCALATION_RULES: EscalationRule[] = [
  {
    id: 'esc-rule-1',
    stage: 'INITIAL_SCRUTINY',
    triggerDays: 7,
    escalateToRole: 'REGIONAL_OFFICER',
    escalateToName: 'Regional Officer in Charge',
    channels: ['IN_APP', 'EMAIL'],
    isActive: true
  },
  {
    id: 'esc-rule-2',
    stage: 'INITIAL_SCRUTINY',
    triggerDays: 12,
    escalateToRole: 'BUREAU_ADMIN',
    escalateToName: 'Bureau Head (Approval Bureau HQ)',
    channels: ['IN_APP', 'EMAIL', 'WHATSAPP'],
    isActive: true
  },
  {
    id: 'esc-rule-3',
    stage: 'EVC_SCHEDULING',
    triggerDays: 10,
    escalateToRole: 'BUREAU_ADMIN',
    escalateToName: 'EVC National Coordinator & Bureau Advisor',
    channels: ['IN_APP', 'EMAIL'],
    isActive: true
  },
  {
    id: 'esc-rule-4',
    stage: 'COMMITTEE_REVIEW',
    triggerDays: 10,
    escalateToRole: 'BUREAU_ADMIN',
    escalateToName: 'Member Secretary & Chairman, AICTE',
    channels: ['IN_APP', 'SMS'],
    isActive: true
  }
];

export const INITIAL_ESCALATION_RECORDS: EscalationRecord[] = [
  {
    id: 'ESC-2026-042',
    applicationId: 'APP-2026-7934',
    institutionName: 'Apex Institute of Technology & Management',
    stage: 'INITIAL_SCRUTINY',
    overdueDays: 2,
    escalatedFrom: 'Automated SLA Monitor (Rule #1)',
    escalatedTo: 'Dr. Sunil K. Kulkarni (Regional Officer, WRO)',
    timestamp: '2026-10-23T18:00:00Z',
    reason: 'Initial scrutiny crossed SLA threshold of 7 days without resolution or committee referral.',
    status: 'ACKNOWLEDGED'
  }
];

// LocalStorage helpers with resilient in-memory fallback
const STORAGE_PREFIX = 'aicte_smart_system_v1_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export class AppDataService {
  static getApplications(): Application[] {
    return getStorage<Application[]>('applications', INITIAL_APPLICATIONS);
  }

  static saveApplications(data: Application[]): void {
    setStorage('applications', data);
  }

  static getComplianceTasks(): ComplianceTask[] {
    return getStorage<ComplianceTask[]>('compliance_tasks', INITIAL_COMPLIANCE_TASKS);
  }

  static saveComplianceTasks(data: ComplianceTask[]): void {
    setStorage('compliance_tasks', data);
  }

  static getEVCEvents(): EVCEvent[] {
    return getStorage<EVCEvent[]>('evc_events', INITIAL_EVC_EVENTS);
  }

  static saveEVCEvents(data: EVCEvent[]): void {
    setStorage('evc_events', data);
  }

  static getNotifications(): NotificationItem[] {
    return getStorage<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
  }

  static saveNotifications(data: NotificationItem[]): void {
    setStorage('notifications', data);
  }

  static getAuditEvents(): AuditEvent[] {
    return getStorage<AuditEvent[]>('audit_events', INITIAL_AUDIT_EVENTS);
  }

  static saveAuditEvents(data: AuditEvent[]): void {
    setStorage('audit_events', data);
  }

  static getEscalationRules(): EscalationRule[] {
    return getStorage<EscalationRule[]>('escalation_rules', INITIAL_ESCALATION_RULES);
  }

  static saveEscalationRules(data: EscalationRule[]): void {
    setStorage('escalation_rules', data);
  }

  static getEscalationRecords(): EscalationRecord[] {
    return getStorage<EscalationRecord[]>('escalation_records', INITIAL_ESCALATION_RECORDS);
  }

  static saveEscalationRecords(data: EscalationRecord[]): void {
    setStorage('escalation_records', data);
  }

  static recordAudit(event: Omit<AuditEvent, 'id' | 'timestamp' | 'ipAddress'>): AuditEvent {
    const events = this.getAuditEvents();
    const newEvent: AuditEvent = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '10.20.1.' + Math.floor(10 + Math.random() * 80) + ' (Verified AICTE VPN)',
      ...event
    };
    const updated = [newEvent, ...events];
    this.saveAuditEvents(updated);
    return newEvent;
  }

  static resetAllData(): void {
    setStorage('applications', INITIAL_APPLICATIONS);
    setStorage('compliance_tasks', INITIAL_COMPLIANCE_TASKS);
    setStorage('evc_events', INITIAL_EVC_EVENTS);
    setStorage('notifications', INITIAL_NOTIFICATIONS);
    setStorage('audit_events', INITIAL_AUDIT_EVENTS);
    setStorage('escalation_rules', INITIAL_ESCALATION_RULES);
    setStorage('escalation_records', INITIAL_ESCALATION_RECORDS);
  }
}
