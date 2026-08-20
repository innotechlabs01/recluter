import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WizardData {
  // Step 1: Company
  companyName: string
  industry: string
  location: string
  contactName: string
  contactRole: string
  contactEmail: string
  
  // Step 2: Position
  positionTitle: string
  positionsCount: number
  area: string
  experienceLevel: string
  positionType: string
  workMode: string
  positionLocation: string
  startDate: string
  
  // Step 3: Profile
  minExperience: number
  englishLevel: string
  education: string
  certifications: string
  technicalSkills: string
  softSkills: string
  mandatoryRequirements: string
  desirableRequirements: string
  
  // Step 4: Conditions
  salaryMin: number
  salaryMax: number
  currency: string
  contractType: string
  schedule: string
  timezone: string
  benefits: string
  additionalInfo: string
  
  // Step 5: Selection
  candidatesCount: number
  deadline: string
  interviewCount: number
  technicalTests: string
  processRequirements: string
}

interface WizardStore {
  currentStep: number
  data: WizardData
  setStep: (step: number) => void
  updateData: (data: Partial<WizardData>) => void
  reset: () => void
}

const initialData: WizardData = {
  companyName: '',
  industry: '',
  location: '',
  contactName: '',
  contactRole: '',
  contactEmail: '',
  positionTitle: '',
  positionsCount: 1,
  area: '',
  experienceLevel: '',
  positionType: '',
  workMode: '',
  positionLocation: '',
  startDate: '',
  minExperience: 0,
  englishLevel: '',
  education: '',
  certifications: '',
  technicalSkills: '',
  softSkills: '',
  mandatoryRequirements: '',
  desirableRequirements: '',
  salaryMin: 0,
  salaryMax: 0,
  currency: 'USD',
  contractType: '',
  schedule: '',
  timezone: '',
  benefits: '',
  additionalInfo: '',
  candidatesCount: 5,
  deadline: '',
  interviewCount: 2,
  technicalTests: '',
  processRequirements: '',
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      data: initialData,
      setStep: (step) => set({ currentStep: step }),
      updateData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
      reset: () => set({ currentStep: 1, data: initialData }),
    }),
    {
      name: 'recluter-wizard',
    }
  )
)
