export enum VerificationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export enum CustomerType {
  Ogrenci = 1,
  Esnaf = 2,
  Emekli = 3
}

export interface CustomerVerificationDto {
  id: number;
  customerRegistrationId: number;

  customerName: string;

  customerType: CustomerType;

  originalFileName: string;
  contentType: string;
  fileSize: number;

  status: VerificationStatus;

  uploadedAt: string;

  verifiedAt: string | null;

  verificationNote: string | null;
}