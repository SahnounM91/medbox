import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AccountService, AlertService} from '@app/_services';
import {MustMatch} from '@app/_helpers';
import {HttpClient} from '@angular/common/http';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./auth.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  categories: any;
  selectedCategory;
  specialties: any;
  selectedSpecialty;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      category: ['', Validators.required],
      specialty: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\D*(\d\D*){8,13}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.http.get('assets/specialties.json').subscribe(res => {
      this.categories = res;
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    console.log(this.form);
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Registration successful, please check your email for verification instructions', {keepAfterRouteChange: true});
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  onChangeCategory(value: any) {
    this.specialties = this.categories[this.selectedCategory].specialties;
    console.log(this.categories[this.selectedCategory].name);
  }

  onChangeSpecialty(value: any) {

    console.log(this.selectedSpecialty);
  }
}
