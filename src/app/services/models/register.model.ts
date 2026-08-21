import { CustomerType } from './customer-type.model';

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  nationalId: string;
  email: string;
  phoneNumber: string;
  city: string;
  district: string;
  customerType: CustomerType;
  password: string;
}