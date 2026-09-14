import { Component, inject, signal } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { RegisterService } from '../../../services/auth/register';
import { CustomerType } from '../../../services/models/customer-type.model';


@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  readonly CustomerType = CustomerType;

  private fb =
    inject(FormBuilder);

  private registerService =
    inject(RegisterService);

  private router =
    inject(Router);


  // ==========================================
  // REGEX
  // ==========================================

  private readonly letterPattern =
    /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]+$/;

  private readonly emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


  // ==========================================
  // CUSTOMER TYPES
  // ==========================================

  customerTypes = [
    {
      id: CustomerType.Ogrenci,
      name: 'Öğrenci'
    },
    {
      id: CustomerType.Esnaf,
      name: 'Esnaf'
    },
    {
      id: CustomerType.Emekli,
      name: 'Emekli'
    }
  ];


  // ==========================================
  // FORM
  // ==========================================

  registerForm =
    this.fb.nonNullable.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.letterPattern)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.letterPattern)
        ]
      ],

      birthDate: [
        '',
        [
          Validators.required,
          this.minimumAgeValidator(18)
        ]
      ],

      nationalId: [
        '',
        [
          Validators.required,
          this.tcIdentityValidator
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.email,
          Validators.pattern(this.emailPattern)
        ]
      ],

      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^5\d{9}$/)
        ]
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.letterPattern)
        ]
      ],

      district: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(this.letterPattern)
        ]
      ],

      customerType: [
        0 as CustomerType,
        [
          Validators.required,
          this.customerTypeValidator
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
          )
        ]
      ]

    });


  // ==========================================
  // UI STATE
  // ==========================================

  errorMessage =
    signal('');

  successMessage =
    signal('');

  validationErrors =
    signal<string[]>([]);

  formErrors =
    signal<string[]>([]);

  isLoading =
    signal(false);

  private errorToastTimeout:
    ReturnType<typeof setTimeout> | null = null;


  // ==========================================
  // HATA BİLDİRİMİ
  // ==========================================

  private showErrorToast(
    message: string
  ): void {

    this.errorMessage.set(message);

    if (this.errorToastTimeout) {
      clearTimeout(this.errorToastTimeout);
    }

    this.errorToastTimeout =
      setTimeout(() => {

        this.errorMessage.set('');

        this.errorToastTimeout = null;

      }, 5000);
  }


  closeErrorToast(): void {

    this.errorMessage.set('');

    if (this.errorToastTimeout) {

      clearTimeout(
        this.errorToastTimeout
      );

      this.errorToastTimeout = null;
    }
  }


  // ==========================================
  // DOĞRULAMA BELGESİ
  // ==========================================

  selectedVerificationDocument:
    File | null = null;


  // ==========================================
  // HARF ALANLARI
  // ==========================================

  onLetterInput(
    event: Event,
    controlName:
      'firstName' |
      'lastName' |
      'city' |
      'district'
  ): void {

    const input =
      event.target as HTMLInputElement;

    const cleanedValue =
      input.value.replace(
        /[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g,
        ''
      );

    input.value =
      cleanedValue;

    this.registerForm
      .controls[controlName]
      .setValue(
        cleanedValue,
        {
          emitEvent: false
        }
      );
  }


  // ==========================================
  // TC - SADECE RAKAM
  // ==========================================

  onNationalIdInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const cleanedValue =
      input.value
        .replace(/\D/g, '')
        .slice(0, 11);

    input.value =
      cleanedValue;

    this.registerForm
      .controls
      .nationalId
      .setValue(
        cleanedValue,
        {
          emitEvent: false
        }
      );
  }


  // ==========================================
  // TELEFON - SADECE RAKAM
  // ==========================================

  onPhoneInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const cleanedValue =
      input.value
        .replace(/\D/g, '')
        .slice(0, 10);

    input.value =
      cleanedValue;

    this.registerForm
      .controls
      .phoneNumber
      .setValue(
        cleanedValue,
        {
          emitEvent: false
        }
      );
  }


  // ==========================================
  // CUSTOMER TYPE SEÇ
  // ==========================================

  selectCustomerType(
    type: CustomerType
  ): void {

    this.registerForm
      .controls
      .customerType
      .setValue(type);

    this.registerForm
      .controls
      .customerType
      .markAsTouched();
  }


  // ==========================================
  // DOĞRULAMA BELGESİ SEÇ
  // ==========================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.closeErrorToast();

    if (
      !input.files ||
      input.files.length === 0
    ) {

      this.selectedVerificationDocument =
        null;

      return;
    }

    const file =
      input.files[0];

    const allowedExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png'
    ];

    const extension =
      '.' +
      file.name
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      !allowedExtensions.includes(extension)
    ) {

      this.selectedVerificationDocument =
        null;

      input.value = '';

      this.showErrorToast(
        'Sadece PDF, JPG, JPEG veya PNG formatında belge yükleyebilirsiniz.'
      );

      return;
    }

    const maxFileSize =
      5 * 1024 * 1024;

    if (
      file.size > maxFileSize
    ) {

      this.selectedVerificationDocument =
        null;

      input.value = '';

      this.showErrorToast(
        'Belge boyutu en fazla 5 MB olabilir.'
      );

      return;
    }

    this.selectedVerificationDocument =
      file;
  }


  // ==========================================
  // REGISTER
  // ==========================================

  register(): void {

    this.closeErrorToast();

    this.successMessage.set('');
    this.validationErrors.set([]);
    this.formErrors.set([]);

    if (
      this.registerForm.invalid
    ) {

      this.registerForm
        .markAllAsTouched();

      this.formErrors.set(
        this.getFormErrors()
      );

      return;
    }

    if (
      !this.selectedVerificationDocument
    ) {

      this.formErrors.set([
        'Müşteri tipinizi doğrulamak için belge yüklemelisiniz.'
      ]);

      return;
    }

    this.isLoading.set(true);

    const form =
      this.registerForm.getRawValue();

    this.registerService
      .register(
        {
          firstName:
            form.firstName.trim(),

          lastName:
            form.lastName.trim(),

          birthDate:
            form.birthDate,

          nationalId:
            form.nationalId.trim(),

          email:
            form.email.trim(),

          phoneNumber:
            form.phoneNumber.trim(),

          city:
            form.city.trim(),

          district:
            form.district.trim(),

          customerType:
            form.customerType,

          password:
            form.password
        },

        this.selectedVerificationDocument
      )
      .subscribe({

        next: () => {

          this.isLoading.set(false);

          this.successMessage.set(
            'Başvurunuz başarıyla alınmıştır.'
          );

          this.registerForm.reset({
            firstName: '',
            lastName: '',
            birthDate: '',
            nationalId: '',
            email: '',
            phoneNumber: '',
            city: '',
            district: '',
            customerType: 0 as CustomerType,
            password: ''
          });

          this.selectedVerificationDocument =
            null;

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 4000);
        },


        error: (err) => {

          console.error(
            'Register hatası:',
            err
          );

          if (
            Array.isArray(
              err.error?.errors
            )
          ) {

            this.validationErrors.set(
              err.error.errors
            );

          } else {

            this.showErrorToast(
              err.error?.message ??
              'Başvuru işlemi gerçekleştirilemedi.'
            );

          }

          this.isLoading.set(false);
        }

      });
  }


  // ==========================================
  // FORM HATALARINI TOPLA
  // ==========================================

  private getFormErrors():
    string[] {

    const errors:
      string[] = [];

    const controls =
      this.registerForm.controls;

    if (
      controls.firstName.invalid
    ) {

      errors.push(
        controls.firstName
          .errors?.['required']
          ? 'Ad alanı zorunludur.'
          : 'Ad alanını kontrol ediniz.'
      );
    }

    if (
      controls.lastName.invalid
    ) {

      errors.push(
        controls.lastName
          .errors?.['required']
          ? 'Soyad alanı zorunludur.'
          : 'Soyad alanını kontrol ediniz.'
      );
    }

    if (
      controls.birthDate.invalid
    ) {

      errors.push(
        controls.birthDate
          .errors?.['required']
          ? 'Doğum tarihi alanı zorunludur.'
          : 'Doğum tarihinizi kontrol ediniz.'
      );
    }

    if (
      controls.nationalId.invalid
    ) {

      errors.push(
        controls.nationalId
          .errors?.['required']
          ? 'TC Kimlik Numarası zorunludur.'
          : 'TC Kimlik Numaranızı kontrol ediniz.'
      );
    }

    if (
      controls.email.invalid
    ) {

      errors.push(
        controls.email
          .errors?.['required']
          ? 'E-posta alanı zorunludur.'
          : 'E-posta adresinizi kontrol ediniz.'
      );
    }

    if (
      controls.phoneNumber.invalid
    ) {

      errors.push(
        controls.phoneNumber
          .errors?.['required']
          ? 'Telefon numarası zorunludur.'
          : 'Telefon numaranızı kontrol ediniz.'
      );
    }

    if (
      controls.city.invalid
    ) {

      errors.push(
        controls.city
          .errors?.['required']
          ? 'Şehir alanı zorunludur.'
          : 'Şehir alanını kontrol ediniz.'
      );
    }

    if (
      controls.district.invalid
    ) {

      errors.push(
        controls.district
          .errors?.['required']
          ? 'İlçe alanı zorunludur.'
          : 'İlçe alanını kontrol ediniz.'
      );
    }

    if (
      controls.customerType.invalid
    ) {

      errors.push(
        'Müşteri tipinizi seçiniz.'
      );
    }

    if (
      controls.password.invalid
    ) {

      errors.push(
        controls.password
          .errors?.['required']
          ? 'Şifre alanı zorunludur.'
          : 'Şifrenizi kontrol ediniz.'
      );
    }

    return errors;
  }


  // ==========================================
  // LOGIN
  // ==========================================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);
  }


  // ==========================================
  // TC KİMLİK VALIDATOR
  // ==========================================

  private tcIdentityValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const nationalId =
      String(
        control.value ?? ''
      ).trim();

    if (
      nationalId.length !== 11 ||
      !/^\d{11}$/.test(
        nationalId
      ) ||
      nationalId[0] === '0'
    ) {

      return {
        invalidTc: true
      };
    }

    const digits =
      nationalId
        .split('')
        .map(Number);

    const oddSum =
      digits[0] +
      digits[2] +
      digits[4] +
      digits[6] +
      digits[8];

    const evenSum =
      digits[1] +
      digits[3] +
      digits[5] +
      digits[7];

    let tenthDigit =
      ((oddSum * 7) - evenSum)
      % 10;

    if (
      tenthDigit < 0
    ) {

      tenthDigit += 10;
    }

    if (
      digits[9] !==
      tenthDigit
    ) {

      return {
        invalidTc: true
      };
    }

    const firstTenSum =
      digits
        .slice(0, 10)
        .reduce(
          (sum, digit) =>
            sum + digit,
          0
        );

    if (
      digits[10] !==
      firstTenSum % 10
    ) {

      return {
        invalidTc: true
      };
    }

    return null;
  }


  // ==========================================
  // YAŞ VALIDATOR
  // ==========================================

  private minimumAgeValidator(
    minimumAge: number
  ) {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      if (
        !control.value
      ) {

        return null;
      }

      const birthDate =
        new Date(
          control.value
        );

      if (
        Number.isNaN(
          birthDate.getTime()
        )
      ) {

        return {
          minimumAge: true
        };
      }

      const today =
        new Date();

      const minimumBirthDate =
        new Date(
          today.getFullYear() -
            minimumAge,
          today.getMonth(),
          today.getDate()
        );

      return birthDate <=
        minimumBirthDate
        ? null
        : {
            minimumAge: true
          };
    };
  }


  // ==========================================
  // CUSTOMER TYPE VALIDATOR
  // ==========================================

  private customerTypeValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const value =
      Number(
        control.value
      );

    const valid =
      value ===
        CustomerType.Ogrenci ||

      value ===
        CustomerType.Esnaf ||

      value ===
        CustomerType.Emekli;

    return valid
      ? null
      : {
          invalidCustomerType:
            true
        };
  }
}