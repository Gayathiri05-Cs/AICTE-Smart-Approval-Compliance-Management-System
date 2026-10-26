import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Building,
  Layers,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ApplicationType, InstitutionType, ApplicationDocument, ProgramDetails } from '../types';

interface NewApplicationPageProps {
  onSuccess: (newAppId: string) => void;
  onCancel: () => void;
}

export const NewApplicationPage: React.FC<NewApplicationPageProps> = ({ onSuccess, onCancel }) => {
  const { submitApplication, currentUser } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [institutionName, setInstitutionName] = useState(
    currentUser.role === 'INSTITUTION' ? 'Delhi Institute of Technology & Science' : ''
  );
  const [institutionCode, setInstitutionCode] = useState(
    currentUser.role === 'INSTITUTION' ? 'AICTE-NRO-1-102941' : 'AICTE-NRO-1-998811'
  );
  const [institutionType, setInstitutionType] = useState<InstitutionType>('Engineering & Technology');
  const [region, setRegion] = useState<'Northern' | 'Western' | 'Eastern' | 'Southern' | 'South-Western' | 'Central'>('Northern');
  const [state, setState] = useState('Delhi (NCT)');
  const [applicationType, setApplicationType] = useState<ApplicationType>('Extension of Approval (EOA)');

  // Infrastructure State
  const [landArea, setLandArea] = useState(10.5);
  const [ownershipType, setOwnershipType] = useState<'Owned' | 'Government Leased' | 'Private Leased'>('Owned');
  const [builtUpArea, setBuiltUpArea] = useState(24000);
  const [classrooms, setClassrooms] = useState(36);
  const [laboratories, setLaboratories] = useState(28);
  const [libraryVolumes, setLibraryVolumes] = useState(45000);
  const [computerCapacity, setComputerCapacity] = useState(350);

  // Programs State
  const [programs, setPrograms] = useState<ProgramDetails[]>([
    {
      id: 'p-1',
      name: 'Computer Science & Engineering',
      level: 'UG',
      currentIntake: 120,
      proposedIntake: 180,
      nbaAccredited: true
    },
    {
      id: 'p-2',
      name: 'Electronics & Communication',
      level: 'UG',
      currentIntake: 60,
      proposedIntake: 60,
      nbaAccredited: false
    }
  ]);

  const [newProgName, setNewProgName] = useState('');
  const [newProgLevel, setNewProgLevel] = useState<'UG' | 'PG' | 'Diploma'>('UG');
  const [newProgIntake, setNewProgIntake] = useState(60);

  // Documents State
  const [uploadedDocs, setUploadedDocs] = useState<ApplicationDocument[]>([
    {
      id: 'doc-up-1',
      name: 'Registered_Title_Deed_Campus.pdf',
      category: 'Land & Building Title Deed',
      fileSize: '4.2 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'PENDING'
    },
    {
      id: 'doc-up-2',
      name: 'Fire_Safety_NOC_Current_Year.pdf',
      category: 'Fire Safety NOC',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'PENDING'
    }
  ]);

  const handleAddProgram = () => {
    if (!newProgName.trim()) return;
    setPrograms([
      ...programs,
      {
        id: `p-${Date.now()}`,
        name: newProgName.trim(),
        level: newProgLevel,
        currentIntake: 0,
        proposedIntake: Number(newProgIntake),
        nbaAccredited: false
      }
    ]);
    setNewProgName('');
    setNewProgIntake(60);
  };

  const handleRemoveProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleAddSampleDoc = (category: ApplicationDocument['category'], defaultName: string) => {
    setUploadedDocs([
      ...uploadedDocs,
      {
        id: `doc-${Date.now()}`,
        name: defaultName,
        category,
        fileSize: (Math.random() * 4 + 1.2).toFixed(1) + ' MB',
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'PENDING'
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!institutionName.trim() || !institutionCode.trim()) {
      alert('Please fill in institution name and AICTE code.');
      return;
    }

    if (programs.length === 0) {
      alert('Please add at least one academic program.');
      return;
    }

    const createdApp = submitApplication({
      institutionName,
      institutionCode,
      institutionType,
      region,
      state,
      applicationType,
      infrastructure: {
        landAreaAcres: Number(landArea),
        landOwnershipType: ownershipType,
        builtUpAreaSqMeters: Number(builtUpArea),
        totalClassrooms: Number(classrooms),
        totalLaboratories: Number(laboratories),
        computerCenterCapacity: Number(computerCapacity),
        centralLibraryVolumes: Number(libraryVolumes)
      },
      facultyStats: {
        professors: Math.floor(programs.length * 2),
        associateProfessors: Math.floor(programs.length * 4),
        assistantProfessors: Math.floor(programs.length * 10),
        studentFacultyRatio: '1:18'
      },
      programs,
      documents: uploadedDocs
    });

    onSuccess(createdApp.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Statutory AICTE Approval Application Form
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Academic Session 2026-27 · Online Application Submission Wizard
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: 'Basic Institutional Details' },
          { num: 2, label: 'Land & Infrastructure' },
          { num: 3, label: 'Programs & Intake' },
          { num: 4, label: 'Document Dossier' }
        ].map((step) => (
          <div
            key={step.num}
            onClick={() => setCurrentStep(step.num)}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              currentStep === step.num
                ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-sm'
                : currentStep > step.num
                ? 'border-emerald-500/40 bg-emerald-950/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  currentStep === step.num
                    ? 'bg-indigo-600 text-white'
                    : currentStep > step.num
                    ? 'bg-emerald-500 text-slate-900'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step.num}
              </span>
              <span className="font-semibold text-xs truncate">{step.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Form Content Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
              1. Institutional Identification & Application Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. National Institute of Technology & Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  AICTE Permanent Institute ID *
                </label>
                <input
                  type="text"
                  value={institutionCode}
                  onChange={(e) => setInstitutionCode(e.target.value)}
                  placeholder="e.g. AICTE-NRO-1-102941"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Discipline / Institution Type
                </label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value as InstitutionType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Management (MBA/PGDM)">Management (MBA/PGDM)</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Architecture & Planning">Architecture & Planning</option>
                  <option value="Polytechnic & Applied Arts">Polytechnic & Applied Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Application Type Requested *
                </label>
                <select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Extension of Approval (EOA)">Extension of Approval (EOA)</option>
                  <option value="Increase in Intake">Increase in Intake</option>
                  <option value="Introduction of New Course">Introduction of New Course</option>
                  <option value="New Technical Institution">New Technical Institution</option>
                  <option value="Change of Site/Location">Change of Site/Location</option>
                  <option value="Closure of Course/Institute">Closure of Course/Institute</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Regional Jurisdiction
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Northern">Northern Regional Office (Chandigarh/Delhi)</option>
                  <option value="Western">Western Regional Office (Mumbai)</option>
                  <option value="Southern">Southern Regional Office (Chennai)</option>
                  <option value="Eastern">Eastern Regional Office (Kolkata)</option>
                  <option value="South-Western">South-Western Regional Office (Bengaluru)</option>
                  <option value="Central">Central Regional Office (Bhopal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  State / Union Territory
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Delhi (NCT)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <span>Continue to Infrastructure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Land & Infrastructure */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
              2. Campus Land, Building & Infrastructure Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Land Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Land Ownership Status
                </label>
                <select
                  value={ownershipType}
                  onChange={(e) => setOwnershipType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="Owned">Owned (Clear Freehold Title)</option>
                  <option value="Government Leased">Government Leased (30+ Years)</option>
                  <option value="Private Leased">Private Leased</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Built-up Area (Sq. Meters)
                </label>
                <input
                  type="number"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Total Classrooms
                </label>
                <input
                  type="number"
                  value={classrooms}
                  onChange={(e) => setClassrooms(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Total Laboratories
                </label>
                <input
                  type="number"
                  value={laboratories}
                  onChange={(e) => setLaboratories(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Central Library Volumes
                </label>
                <input
                  type="number"
                  value={libraryVolumes}
                  onChange={(e) => setLibraryVolumes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <span>Continue to Programs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Programs & Intake */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
              3. Proposed Programs & Student Intake Capacities
            </h3>

            {/* Existing Programs Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="p-3">Program Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Current Intake</th>
                    <th className="p-3">Proposed Intake</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-slate-200">{prog.name}</td>
                      <td className="p-3 text-slate-400">{prog.level}</td>
                      <td className="p-3 font-mono text-slate-300">{prog.currentIntake}</td>
                      <td className="p-3 font-mono text-indigo-300 font-semibold">{prog.proposedIntake}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveProgram(prog.id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Program Form */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <span className="text-xs font-semibold text-slate-300">Add Academic Course</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newProgName}
                    onChange={(e) => setNewProgName(e.target.value)}
                    placeholder="e.g. Master of Business Administration"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <select
                    value={newProgLevel}
                    onChange={(e) => setNewProgLevel(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="UG">UG (Bachelor)</option>
                    <option value="PG">PG (Master)</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newProgIntake}
                    onChange={(e) => setNewProgIntake(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    placeholder="Intake"
                  />
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shrink-0 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
              >
                <span>Continue to Documents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Document Dossier */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
              4. Statutory Document Vault & Digital Declarations
            </h3>

            <div className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200">{doc.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {doc.category} · {doc.fileSize}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedDocs(uploadedDocs.filter((d) => d.id !== doc.id))}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Attach Sample Document buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                Attach Additional AICTE Mandatory Documents:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleAddSampleDoc('Approved Building Plan', 'Municipal_Approved_Building_Plan_2026.pdf')
                  }
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  + Approved Building Plan
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddSampleDoc('Faculty Cadre & Salary Proof', 'Bank_Salary_Statement_Faculty_2026.pdf')
                  }
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  + Faculty Cadre Proof
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddSampleDoc('Affidavit for Mandatory Disclosure', 'Affidavit_Undertaking_Stamp_Paper.pdf')
                  }
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                >
                  + Mandatory Affidavit
                </button>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-slate-300 flex items-start gap-3 mt-4">
              <input type="checkbox" id="declaration" required className="mt-0.5 rounded text-indigo-600" />
              <label htmlFor="declaration" className="cursor-pointer">
                I hereby declare that all infrastructure, land documents, and faculty appointments comply
                with the AICTE Approval Process Handbook (APH 2026-27). Any discrepancy discovered by the
                Expert Visiting Committee (EVC) will lead to withdrawal of statutory approval.
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit AICTE Dossier</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
