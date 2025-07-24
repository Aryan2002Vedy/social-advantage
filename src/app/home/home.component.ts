import { Component, CUSTOM_ELEMENTS_SCHEMA,OnInit } from '@angular/core';
import { NgForOf,  NgIf } from '@angular/common';
import { TranslateModule , TranslateService} from '@ngx-translate/core';
import { LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { register } from 'swiper/element/bundle';
import animationData from '../../assets/lottie/head-hero.json'; // use any JSON
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import contactAnimation from '../../assets/lottie/contact.json'; // 👈 Replace with your own
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';



register(); // ✅ Registers swiper web components globally

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, NgForOf, LottieComponent ,  NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  isDark = true;
  form: FormGroup;
  submitted = false;
  submittedAttempted = false;
  navOpen = false;




  ngOnInit():void {
    this.toggleTheme();
  }

  toggleNav() {
  this.navOpen = !this.navOpen;
}

closeNav() {
  this.navOpen = false;
}
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private firestore: FirestoreService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      interest: ['', Validators.required],
      message: [''],
    });

    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

   contactLottieOptions: AnimationOptions = {
    animationData: contactAnimation,
    loop: true,
    autoplay: true,
  };


  scrollToContact(): void {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}


  submitForm() {
    this.submittedAttempted = true;
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.form.invalid) return;

// Convert to IST manually
const istDate = new Date();
istDate.setHours(istDate.getHours() + 5.5); // UTC +5:30

const formData = {
  ...this.form.value,
  date: istDate.toISOString()
};

    this.firestore.addLead(formData).then(() => {
      this.submitted = true;
      this.submittedAttempted = false;
      this.form.reset();
      this.form.get('interest')?.setValue(''); // Reset interest field
    });
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submittedAttempted)
    );
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('light-theme', !this.isDark);
    const homeSection = document.querySelector('#home');
    if (homeSection) {
      homeSection.classList.toggle('light-theme', !this.isDark);
    }
  }

  heroLottieOptions = {
  animationData: animationData, // OR use `animationData`
  autoplay: true,
  loop: true,
};

  services: {
    title: string;
    description: string;
    lottieOptions: AnimationOptions;
    animation: AnimationItem | null;
  }[] = [
    {
      title: 'Meta Ads Management',
      description: 'Run high-converting ad campaigns on Facebook & Instagram.',
      lottieOptions: {
        path: 'assets/lottie/meta.json',
        loop: true,
        autoplay: true,
      },
      animation: null,
    },
    {
      title: 'Landing Page Design',
      description: 'Convert visitors with beautiful, fast landing pages.',
      lottieOptions: {
        path: 'assets/lottie/landing.json',
        loop: true,
        autoplay: true,
      },
      animation: null,
    },
    {
      title: 'CRM Automation',
      description: 'Manage your leads and automate follow-ups like a pro.',
      lottieOptions: {
        path: 'assets/lottie/crm.json',
        loop: true,
        autoplay: true,
      },
      animation: null,
    },
  ];

  funnelSteps = [
    {
      icon: 'assets/images/funnn.png',
      title: 'User Clicks Your Ad',
      description: 'Prospect sees your ad and gets curious.',
    },
    {
      icon: 'assets/images/funnn.png',
      title: 'Lands on Funnel Page',
      description: 'They’re taken to a high-converting page designed for action.',
    },
    {
      icon: 'assets/images/funnn.png',
      title: 'Fills the Form',
      description: 'Your funnel captures vital contact info.',
    },
    {
      icon: 'assets/images/funnn.png',
      title: 'Added to CRM',
      description: 'Details go directly into CRM for immediate tracking.',
    },
    {
      icon: 'assets/images/funnn.png',
      title: 'Automated Follow-up',
      description: 'Your automation takes over — emails, messages, reminders.',
    },
  ];
}
