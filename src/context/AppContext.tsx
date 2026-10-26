import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Application,
  ComplianceTask,
  EVCEvent,
  NotificationItem,
  AuditEvent,
  EscalationRule,
  EscalationRecord,
  WorkflowStageKey,
  ApplicationStatus,
  DocumentVerificationStatus,
  NotificationChannel
} from '../types';
import {
  DEMO_USERS,
  AppDataService,
  WORKFLOW_STAGES_CONFIG
} from '../services/storage';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  applications: Application[];
  complianceTasks: ComplianceTask[];
  evcEvents: EVCEvent[];
  notifications: NotificationItem[];
  auditEvents: AuditEvent[];
  escalationRules: EscalationRule[];
  escalationRecords: EscalationRecord[];
  unreadNotificationCount: number;
  submitApplication: (appData: Partial<Application>) => Application;
  updateApplicationStage: (
    appId: string,
    newStage: WorkflowStageKey,
    notes: string,
    finalStatus?: ApplicationStatus
  ) => void;
  requestCorrection: (appId: string, reason: string) => void;
  resubmitCorrection: (appId: string, notes: string) => void;
  verifyDocument: (
    appId: string,
    docId: string,
    status: DocumentVerificationStatus,
    remarks?: string
  ) => void;
  submitComplianceDocument: (taskId: string, docName: string) => void;
  verifyComplianceTask: (taskId: string, isApproved: boolean, notes: string) => void;
  createComplianceTask: (task: Omit<ComplianceTask, 'id' | 'lastUpdated'>) => ComplianceTask;
  scheduleEVC: (evcData: Omit<EVCEvent, 'id' | 'scheduledAt'>) => EVCEvent;
  updateEVCStatus: (evcId: string, status: EVCEvent['status'], summary?: string) => void;
  triggerManualEscalation: (appId: string, reason: string) => void;
  sendTestReminder: (
    title: string,
    message: string,
    channel: NotificationChannel,
    relatedType: 'APPLICATION' | 'COMPLIANCE' | 'EVC' | 'ESCALATION',
    relatedId: string
  ) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  retryNotification: (notifId: string) => void;
  updateEscalationRule: (ruleId: string, updates: Partial<EscalationRule>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aicte_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0]; // Prof. S.K. Narayan (Institution)
  });

  const [applications, setApplications] = useState<Application[]>(() =>
    AppDataService.getApplications()
  );
  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>(() =>
    AppDataService.getComplianceTasks()
  );
  const [evcEvents, setEvcEvents] = useState<EVCEvent[]>(() =>
    AppDataService.getEVCEvents()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    AppDataService.getNotifications()
  );
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() =>
    AppDataService.getAuditEvents()
  );
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(() =>
    AppDataService.getEscalationRules()
  );
  const [escalationRecords, setEscalationRecords] = useState<EscalationRecord[]>(() =>
    AppDataService.getEscalationRecords()
  );

  useEffect(() => {
    localStorage.setItem('aicte_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(target);
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.isRead && (n.recipientRole === currentUser.role || currentUser.role === 'BUREAU_ADMIN')
  ).length;

  // Add notification helper
  const addNotification = (
    title: string,
    message: string,
    channel: NotificationChannel,
    relatedType: 'APPLICATION' | 'COMPLIANCE' | 'EVC' | 'ESCALATION',
    relatedId: string,
    recipientRole: UserRole,
    recipientName: string,
    recipientContact: string,
    status: 'SENT' | 'PENDING' | 'FAILED' | 'SIMULATED' = 'SIMULATED'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      channel,
      relatedType,
      relatedId,
      recipientRole,
      recipientName,
      recipientContact,
      timestamp: new Date().toISOString(),
      isRead: false,
      deliveryStatus: status,
      deliveryDetails: {
        provider:
          channel === 'IN_APP'
            ? 'Internal System Event Bus'
            : channel === 'WHATSAPP'
            ? 'WhatsApp Cloud API (Sandbox / Simulated)'
            : channel === 'SMS'
            ? 'National Informatics Centre SMS Gateway (Simulated)'
            : 'AICTE Secure SMTP Server (Simulated)',
        attempts: 1,
        simulatedLatencyMs: Math.floor(100 + Math.random() * 300),
        gatewayResponse: '200 OK - Dispatched to mock recipient'
      }
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    AppDataService.saveNotifications(updated);
  };

  const submitApplication = (appData: Partial<Application>): Application => {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: Application = {
      id: newId,
      institutionId: currentUser.institutionId || 'inst-1',
      institutionName: appData.institutionName || 'Delhi Institute of Technology & Science',
      institutionCode: appData.institutionCode || 'AICTE-NRO-1-102941',
      institutionType: appData.institutionType || 'Engineering & Technology',
      region: appData.region || 'Northern',
      state: appData.state || 'Delhi (NCT)',
      applicationType: appData.applicationType || 'Extension of Approval (EOA)',
      academicYear: '2026-2027',
      submissionDate: new Date().toISOString(),
      currentStage: 'SUBMITTED',
      status: 'IN_PROGRESS',
      assignedOfficerId: 'usr-ro-1',
      assignedOfficerName: 'Dr. Rajeshwar Varma',
      daysInCurrentStage: 0,
      slaDays: 3,
      isOverdue: false,
      documents: appData.documents || [],
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          stage: 'SUBMITTED',
          status: 'IN_PROGRESS',
          changedBy: currentUser.name,
          role: currentUser.role,
          timestamp: new Date().toISOString(),
          notes: 'Application submitted successfully with verified digital credentials.'
        }
      ],
      infrastructure: appData.infrastructure || {
        landAreaAcres: 10.0,
        landOwnershipType: 'Owned',
        builtUpAreaSqMeters: 20000,
        totalClassrooms: 30,
        totalLaboratories: 20,
        computerCenterCapacity: 300,
        centralLibraryVolumes: 40000
      },
      facultyStats: appData.facultyStats || {
        professors: 8,
        associateProfessors: 16,
        assistantProfessors: 40,
        studentFacultyRatio: '1:18'
      },
      programs: appData.programs || []
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    AppDataService.saveApplications(updatedApps);

    // Audit Event
    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: newId,
      action: 'APPLICATION_SUBMITTED',
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED',
      reason: `Application submitted for ${newApp.applicationType} - ${newApp.institutionName}`
    });
    setAuditEvents([newAudit, ...auditEvents]);

    // Notification to Regional Officer
    addNotification(
      `New Application Submitted: ${newId}`,
      `${newApp.institutionName} has submitted application ${newId} for ${newApp.applicationType}.`,
      'IN_APP',
      'APPLICATION',
      newId,
      'REGIONAL_OFFICER',
      'Regional Officer (Northern)',
      'ro.northern@aicte-india.org',
      'SENT'
    );

    // Simulated email confirmation to Institution
    addNotification(
      `Acknowledgement: Submission of AICTE Application ${newId}`,
      `Your application ${newId} has been acknowledged for academic year 2026-27. Desk scrutiny is underway.`,
      'EMAIL',
      'APPLICATION',
      newId,
      'INSTITUTION',
      currentUser.name,
      currentUser.email,
      'SIMULATED'
    );

    return newApp;
  };

  const updateApplicationStage = (
    appId: string,
    newStage: WorkflowStageKey,
    notes: string,
    finalStatus?: ApplicationStatus
  ) => {
    const targetStageConfig = WORKFLOW_STAGES_CONFIG.find((s) => s.key === newStage);
    const sla = targetStageConfig ? targetStageConfig.defaultSlaDays : 7;

    const updatedApps = applications.map((app) => {
      if (app.id !== appId) return app;

      const oldStage = app.currentStage;
      const status: ApplicationStatus = finalStatus || 'IN_PROGRESS';

      const newHistoryEntry = {
        id: `hist-${Date.now()}`,
        stage: newStage,
        status,
        changedBy: currentUser.name,
        role: currentUser.role,
        timestamp: new Date().toISOString(),
        notes
      };

      return {
        ...app,
        currentStage: newStage,
        status,
        daysInCurrentStage: 0,
        slaDays: sla,
        isOverdue: false,
        statusHistory: [newHistoryEntry, ...app.statusHistory]
      };
    });

    setApplications(updatedApps);
    AppDataService.saveApplications(updatedApps);

    // Audit log
    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: appId,
      action: finalStatus ? `RECORD_${finalStatus}` : 'ADVANCE_WORKFLOW_STAGE',
      previousStatus: applications.find((a) => a.id === appId)?.currentStage,
      newStatus: newStage,
      reason: notes
    });
    setAuditEvents([newAudit, ...auditEvents]);

    // Dispatch notification
    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      addNotification(
        `Application ${appId} Stage Updated`,
        `Application stage advanced to ${targetStageConfig?.label || newStage}. ${notes}`,
        'IN_APP',
        'APPLICATION',
        appId,
        'INSTITUTION',
        targetApp.institutionName,
        'institution.contact@gov.in',
        'SENT'
      );

      // Also trigger SMS notification simulation
      addNotification(
        `AICTE Update: ${appId}`,
        `Your application stage is now ${targetStageConfig?.label}. Status: ${finalStatus || 'In Progress'}.`,
        'SMS',
        'APPLICATION',
        appId,
        'INSTITUTION',
        targetApp.institutionName,
        '+91 98100 22334',
        'SIMULATED'
      );
    }
  };

  const requestCorrection = (appId: string, reason: string) => {
    if (!reason || reason.trim().length === 0) {
      alert('Mandatory reason is required to request correction.');
      return;
    }

    const updatedApps = applications.map((app) => {
      if (app.id !== appId) return app;
      const newHistoryEntry = {
        id: `hist-${Date.now()}`,
        stage: app.currentStage,
        status: 'CORRECTION_REQUESTED' as ApplicationStatus,
        changedBy: currentUser.name,
        role: currentUser.role,
        timestamp: new Date().toISOString(),
        notes: `Correction requested: ${reason}`,
        correctionReason: reason
      };

      return {
        ...app,
        status: 'CORRECTION_REQUESTED' as ApplicationStatus,
        statusHistory: [newHistoryEntry, ...app.statusHistory]
      };
    });

    setApplications(updatedApps);
    AppDataService.saveApplications(updatedApps);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: appId,
      action: 'REQUEST_CORRECTION',
      previousStatus: 'IN_PROGRESS',
      newStatus: 'CORRECTION_REQUESTED',
      reason
    });
    setAuditEvents([newAudit, ...auditEvents]);

    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      addNotification(
        `Deficiency Memo Issued for ${appId}`,
        `Correction requested by Regional Office: "${reason}". Please rectify and resubmit.`,
        'IN_APP',
        'APPLICATION',
        appId,
        'INSTITUTION',
        targetApp.institutionName,
        'institution.contact@gov.in',
        'SENT'
      );

      addNotification(
        `Urgent: AICTE Deficiency Memo ${appId}`,
        `Action Required: ${reason}. Login to upload required documents.`,
        'WHATSAPP',
        'APPLICATION',
        appId,
        'INSTITUTION',
        targetApp.institutionName,
        '+91 98100 22334',
        'SIMULATED'
      );
    }
  };

  const resubmitCorrection = (appId: string, notes: string) => {
    const updatedApps = applications.map((app) => {
      if (app.id !== appId) return app;
      const newHistoryEntry = {
        id: `hist-${Date.now()}`,
        stage: 'RE_SCRUTINY' as WorkflowStageKey,
        status: 'IN_PROGRESS' as ApplicationStatus,
        changedBy: currentUser.name,
        role: currentUser.role,
        timestamp: new Date().toISOString(),
        notes: `Rectified submission: ${notes}`
      };

      return {
        ...app,
        currentStage: 'RE_SCRUTINY' as WorkflowStageKey,
        status: 'IN_PROGRESS' as ApplicationStatus,
        daysInCurrentStage: 0,
        statusHistory: [newHistoryEntry, ...app.statusHistory]
      };
    });

    setApplications(updatedApps);
    AppDataService.saveApplications(updatedApps);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: appId,
      action: 'RESUBMIT_CORRECTION',
      previousStatus: 'CORRECTION_REQUESTED',
      newStatus: 'RE_SCRUTINY',
      reason: notes
    });
    setAuditEvents([newAudit, ...auditEvents]);

    addNotification(
      `Compliance Resubmitted for ${appId}`,
      `Institution has uploaded rectified documents for re-scrutiny.`,
      'IN_APP',
      'APPLICATION',
      appId,
      'REGIONAL_OFFICER',
      'Regional Officer',
      'ro.northern@aicte-india.org',
      'SENT'
    );
  };

  const verifyDocument = (
    appId: string,
    docId: string,
    status: DocumentVerificationStatus,
    remarks?: string
  ) => {
    const updatedApps = applications.map((app) => {
      if (app.id !== appId) return app;
      const updatedDocs = app.documents.map((d) => {
        if (d.id !== docId) return d;
        return {
          ...d,
          verificationStatus: status,
          verifiedBy: currentUser.name,
          verifiedAt: new Date().toISOString(),
          remarks: remarks || d.remarks
        };
      });
      return { ...app, documents: updatedDocs };
    });

    setApplications(updatedApps);
    AppDataService.saveApplications(updatedApps);

    const targetDoc = applications
      .find((a) => a.id === appId)
      ?.documents.find((d) => d.id === docId);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: appId,
      action: status === 'VERIFIED' ? 'VERIFY_DOCUMENT' : 'REJECT_DOCUMENT',
      previousStatus: targetDoc?.verificationStatus,
      newStatus: status,
      reason: `Document [${targetDoc?.name}]: ${remarks || 'Document verified according to AICTE norms'}`
    });
    setAuditEvents([newAudit, ...auditEvents]);
  };

  const submitComplianceDocument = (taskId: string, docName: string) => {
    const updatedTasks = complianceTasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status: 'PENDING_VERIFICATION' as const,
        submittedDocName: docName,
        submittedDocDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
    });

    setComplianceTasks(updatedTasks);
    AppDataService.saveComplianceTasks(updatedTasks);

    const task = complianceTasks.find((t) => t.id === taskId);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: taskId,
      action: 'SUBMIT_COMPLIANCE_DOCUMENT',
      previousStatus: task?.status,
      newStatus: 'PENDING_VERIFICATION',
      reason: `Submitted compliance document: ${docName}`
    });
    setAuditEvents([newAudit, ...auditEvents]);

    addNotification(
      `Compliance Document Uploaded: ${taskId}`,
      `${currentUser.name} uploaded proof for "${task?.title || taskId}". Pending officer review.`,
      'IN_APP',
      'COMPLIANCE',
      taskId,
      'REGIONAL_OFFICER',
      task?.assignedOfficer || 'Regional Officer',
      'ro.regional@aicte-india.org',
      'SENT'
    );
  };

  const verifyComplianceTask = (taskId: string, isApproved: boolean, notes: string) => {
    const updatedTasks = complianceTasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status: isApproved ? ('COMPLIANT' as const) : ('OVERDUE' as const),
        verificationNotes: notes,
        lastUpdated: new Date().toISOString()
      };
    });

    setComplianceTasks(updatedTasks);
    AppDataService.saveComplianceTasks(updatedTasks);

    const task = complianceTasks.find((t) => t.id === taskId);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: taskId,
      action: isApproved ? 'VERIFY_COMPLIANCE_APPROVED' : 'VERIFY_COMPLIANCE_REJECTED',
      previousStatus: task?.status,
      newStatus: isApproved ? 'COMPLIANT' : 'OVERDUE',
      reason: notes
    });
    setAuditEvents([newAudit, ...auditEvents]);

    if (task) {
      addNotification(
        `Compliance Verification: ${taskId}`,
        `Your submission for "${task.title}" has been ${isApproved ? 'verified and marked Compliant' : 'rejected: ' + notes}.`,
        'IN_APP',
        'COMPLIANCE',
        taskId,
        'INSTITUTION',
        task.institutionName,
        'institution.contact@gov.in',
        'SENT'
      );
    }
  };

  const createComplianceTask = (
    taskData: Omit<ComplianceTask, 'id' | 'lastUpdated'>
  ): ComplianceTask => {
    const newTask: ComplianceTask = {
      ...taskData,
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      lastUpdated: new Date().toISOString()
    };
    const updated = [newTask, ...complianceTasks];
    setComplianceTasks(updated);
    AppDataService.saveComplianceTasks(updated);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: newTask.id,
      action: 'CREATE_COMPLIANCE_TASK',
      newStatus: newTask.status,
      reason: `Mandatory compliance tracked: ${newTask.title} for ${newTask.institutionName}`
    });
    setAuditEvents([newAudit, ...auditEvents]);

    return newTask;
  };

  const scheduleEVC = (evcData: Omit<EVCEvent, 'id' | 'scheduledAt'>): EVCEvent => {
    const newEvc: EVCEvent = {
      ...evcData,
      id: `EVC-2026-${Math.floor(100 + Math.random() * 900)}`,
      scheduledAt: new Date().toISOString()
    };
    const updated = [newEvc, ...evcEvents];
    setEvcEvents(updated);
    AppDataService.saveEVCEvents(updated);

    // Update application stage if matching
    const matchingApp = applications.find((a) => a.id === evcData.applicationId);
    if (matchingApp && matchingApp.currentStage !== 'EVC_SCHEDULING') {
      updateApplicationStage(
        matchingApp.id,
        'EVC_SCHEDULING',
        `EVC visit scheduled on ${new Date(evcData.visitDate).toLocaleDateString()} led by ${evcData.teamLeader}`
      );
    }

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: newEvc.id,
      action: 'SCHEDULE_EVC_VISIT',
      newStatus: 'SCHEDULED',
      reason: `Scheduled inspection for ${newEvc.institutionName} on ${newEvc.visitDate}. Chair: ${newEvc.teamLeader}`
    });
    setAuditEvents([newAudit, ...auditEvents]);

    addNotification(
      `EVC Inspection Scheduled: ${newEvc.institutionName}`,
      `Inspection date set for ${new Date(newEvc.visitDate).toLocaleDateString()}. Team Leader: ${newEvc.teamLeader}`,
      'EMAIL',
      'EVC',
      newEvc.id,
      'INSTITUTION',
      newEvc.institutionName,
      'principal@inst.ac.in',
      'SIMULATED'
    );

    return newEvc;
  };

  const updateEVCStatus = (evcId: string, status: EVCEvent['status'], summary?: string) => {
    const updated = evcEvents.map((e) => {
      if (e.id !== evcId) return e;
      return {
        ...e,
        status,
        inspectionReportSummary: summary || e.inspectionReportSummary
      };
    });
    setEvcEvents(updated);
    AppDataService.saveEVCEvents(updated);

    const target = evcEvents.find((e) => e.id === evcId);
    if (target && status === 'REPORT_SUBMITTED') {
      // Advance application to EVC_CONDUCTED
      const app = applications.find((a) => a.id === target.applicationId);
      if (app) {
        updateApplicationStage(
          app.id,
          'EVC_CONDUCTED',
          `EVC inspection report submitted by committee chair ${target.teamLeader}. Summary: ${summary || 'Satisfactory'}`
        );
      }
    }
  };

  const triggerManualEscalation = (appId: string, reason: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const newRecord: EscalationRecord = {
      id: `ESC-2026-${Math.floor(100 + Math.random() * 900)}`,
      applicationId: appId,
      institutionName: app.institutionName,
      stage: app.currentStage,
      overdueDays: Math.max(1, app.daysInCurrentStage - app.slaDays),
      escalatedFrom: currentUser.name,
      escalatedTo: 'Bureau Head & Advisor, AICTE HQ New Delhi',
      timestamp: new Date().toISOString(),
      reason,
      status: 'PENDING'
    };

    const updated = [newRecord, ...escalationRecords];
    setEscalationRecords(updated);
    AppDataService.saveEscalationRecords(updated);

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId: appId,
      action: 'MANUAL_ESCALATION_TRIGGERED',
      reason: `Case escalated to Bureau Head: ${reason}`
    });
    setAuditEvents([newAudit, ...auditEvents]);

    addNotification(
      `PRIORITY ESCALATION: ${appId}`,
      `Application ${appId} (${app.institutionName}) has been escalated to Bureau Head. Reason: ${reason}`,
      'IN_APP',
      'ESCALATION',
      newRecord.id,
      'BUREAU_ADMIN',
      'Dr. Mamidala J. Kumar',
      'advisor.approval@aicte-india.org',
      'SENT'
    );

    addNotification(
      `AICTE SLA Escalation Alert`,
      `CRITICAL: Overdue case ${appId} escalated for Bureau Head intervention.`,
      'SMS',
      'ESCALATION',
      newRecord.id,
      'BUREAU_ADMIN',
      'Dr. Mamidala J. Kumar',
      '+91 98119 00001',
      'SIMULATED'
    );
  };

  const sendTestReminder = (
    title: string,
    message: string,
    channel: NotificationChannel,
    relatedType: 'APPLICATION' | 'COMPLIANCE' | 'EVC' | 'ESCALATION',
    relatedId: string
  ) => {
    addNotification(
      title,
      message,
      channel,
      relatedType,
      relatedId,
      currentUser.role,
      currentUser.name,
      channel === 'WHATSAPP' ? '+91 98765 43210' : channel === 'SMS' ? '+91 98765 43210' : currentUser.email,
      'SIMULATED'
    );

    const newAudit = AppDataService.recordAudit({
      actingUser: currentUser.name,
      userRole: currentUser.role,
      relatedId,
      action: 'GENERATE_TEST_REMINDER',
      reason: `Dispatched test alert via ${channel}: ${title}`
    });
    setAuditEvents([newAudit, ...auditEvents]);
  };

  const markNotificationAsRead = (notifId: string) => {
    const updated = notifications.map((n) =>
      n.id === notifId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    AppDataService.saveNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    AppDataService.saveNotifications(updated);
  };

  const retryNotification = (notifId: string) => {
    const updated = notifications.map((n) => {
      if (n.id !== notifId) return n;
      return {
        ...n,
        deliveryStatus: 'SENT' as const,
        deliveryDetails: {
          ...n.deliveryDetails,
          provider: n.deliveryDetails?.provider || 'Gateway Retry Engine',
          attempts: (n.deliveryDetails?.attempts || 1) + 1,
          simulatedLatencyMs: 120,
          gatewayResponse: '200 OK - Retried and successfully delivered'
        }
      };
    });
    setNotifications(updated);
    AppDataService.saveNotifications(updated);
  };

  const updateEscalationRule = (ruleId: string, updates: Partial<EscalationRule>) => {
    const updated = escalationRules.map((r) =>
      r.id === ruleId ? { ...r, ...updates } : r
    );
    setEscalationRules(updated);
    AppDataService.saveEscalationRules(updated);
  };

  const resetAllData = () => {
    AppDataService.resetAllData();
    setApplications(AppDataService.getApplications());
    setComplianceTasks(AppDataService.getComplianceTasks());
    setEvcEvents(AppDataService.getEVCEvents());
    setNotifications(AppDataService.getNotifications());
    setAuditEvents(AppDataService.getAuditEvents());
    setEscalationRules(AppDataService.getEscalationRules());
    setEscalationRecords(AppDataService.getEscalationRecords());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        applications,
        complianceTasks,
        evcEvents,
        notifications,
        auditEvents,
        escalationRules,
        escalationRecords,
        unreadNotificationCount,
        submitApplication,
        updateApplicationStage,
        requestCorrection,
        resubmitCorrection,
        verifyDocument,
        submitComplianceDocument,
        verifyComplianceTask,
        createComplianceTask,
        scheduleEVC,
        updateEVCStatus,
        triggerManualEscalation,
        sendTestReminder,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        retryNotification,
        updateEscalationRule,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
