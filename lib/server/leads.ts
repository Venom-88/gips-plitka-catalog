import { encrypt, decrypt } from "./encryption";

// Персональные данные заявок шифруются (152-ФЗ). Служебные поля — открытые.

type LeadInput = {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
};

export function encryptLeadFields(input: LeadInput) {
  return {
    name: encrypt(input.name),
    phone: encrypt(input.phone),
    email: input.email ? encrypt(input.email) : null,
    message: input.message ? encrypt(input.message) : null,
  };
}

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  area: number | null;
  productSlug: string | null;
  source: string;
  status: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function decryptLead(row: LeadRow) {
  return {
    ...row,
    name: decrypt(row.name),
    phone: decrypt(row.phone),
    email: row.email ? decrypt(row.email) : null,
    message: row.message ? decrypt(row.message) : null,
  };
}
