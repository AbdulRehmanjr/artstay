import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEducationString = (type: TraingEducationEnum): string => {
  const map = {
    FORMAL: 'Formal',
    NON_FORMAL: 'Non-Formal'
  }
  return map[type] || type
}

export const getTrainingString = (type: TraingEducationEnum): string => {
  const map = {
    FORMAL: 'Formal',
    NON_FORMAL: 'Non-Formal'
  }
  return map[type] || type
}

export const getCertificateString = (type: CertificationEnum): string => {
  const map = {
    NONE: 'None',
    PROFESSIONAL: 'Professional',
    TRADE: 'Trade',
    WORKSHOP: 'Workshop'
  }
  return map[type] || type
}

export const getRecognitionString = (type:RecongnitionEnum): string => {
  const map = {
    STATE: 'State Level',
    NATIONAL: 'National Level',
    INTERNATIONAL: 'International Level'
  }
  return map[type] || type
}

export const getExperienceString = (type: ExperienceEnum): string => {
  const map = {
    APPRENTICE: 'Apprentice',
    CRAFTMAN: 'Craftsman',
    MASTER: 'Master',
    GRANDMASTER: 'Grandmaster'
  }
  return map[type] || type
}