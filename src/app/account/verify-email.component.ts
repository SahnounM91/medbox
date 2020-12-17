﻿import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';

import {AccountService, AlertService} from '@app/_services';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  templateUrl: 'verify-email.component.html',
  styleUrls: ['./auth.component.css']
})
export class VerifyEmailComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    const token = this.route.snapshot.queryParams.token;

    // remove token from url to prevent http referer leakage
    this.router.navigate([], {relativeTo: this.route, replaceUrl: true});

    this.accountService.verifyEmail(token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Verification successful, you can now login', {keepAfterRouteChange: true});
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        error: () => {
          this.emailStatus = EmailStatus.Failed;
        }
      });
  }
}
