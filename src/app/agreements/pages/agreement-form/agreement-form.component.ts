import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { AgreementsService } from '../../services/agreements.service';
import { Message, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

interface Area {
  label: string;
  value: string;
  id: string;
}

@Component({
  selector: 'app-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css'],
})
export class AgreementFormComponent implements OnInit {
  newAgreement: Agreement = {
    id: '',
    number: 0,
    area: '',
    meeting: '',
    session: '',
    meetingStartTime: new Date(),
    meetingEndTime: new Date(),
    createdBy: '',
    meetingDate: new Date(),
    solution: '',
    fulfilled: false,
    agreementCompilanceDate: new Date(),
  };
  success: boolean = false;
  messages: Message[] = [];
  areas: Area[] = [
    { label: 'RRHH', value: 'RRHH', id: 'rh' },
    { label: 'Transporte', value: 'Transporte', id: 'tr' },
    { label: 'Contabilidad', value: 'Contabilidad', id: 'co' },
    { label: 'Logística', value: 'Logística', id: 'lo' },
  ];
  meetings: string[] = ['Reunion 1', 'Reunion 2', 'Reunion 3'];
  sessions: string[] = ['Ordinaria', 'Extraordinaria'];
  creators: string[] = ['Doug Left', 'Douglas Izquierdo', 'Otros'];
  today: Date = new Date();

  constructor(
    private agreementsService: AgreementsService,
    private primengConfig: PrimeNGConfig,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.messages = [
      { severity: 'success', detail: 'Agreement created successfully' },
    ];
  }

  create(): void {
    this.success = false;
    this.generateNumber();
    this.generateId();
    this.setTime();
    this.agreementsService.insert(this.newAgreement);
    console.log(this.newAgreement);
    this.success = true;
    this.clear();
  }

  setTime(): void {
    let hours: number = this.newAgreement.meetingStartTime.getHours();
    let minutes: number = this.newAgreement.meetingStartTime.getMinutes();
    this.newAgreement.meetingStartTime = new Date(
      this.newAgreement.meetingStartTime
    );
    this.newAgreement.meetingStartTime.setHours(hours);
    this.newAgreement.meetingStartTime.setMinutes(minutes);

    hours = this.newAgreement.meetingEndTime.getHours();
    minutes = this.newAgreement.meetingEndTime.getMinutes();
    this.newAgreement.meetingEndTime = new Date(
      this.newAgreement.meetingEndTime
    );
    this.newAgreement.meetingEndTime.setHours(hours);
    this.newAgreement.meetingEndTime.setMinutes(minutes);
  }

  getDayBeginning(): Date {
    const beginning: Date = new Date(this.today);
    beginning.setHours(9);
    beginning.setMinutes(0);
    return beginning;
  }

  getDayEnd(): Date {
    const beginning: Date = new Date(this.today);
    beginning.setHours(17);
    beginning.setMinutes(0);
    return beginning;
  }

  // getNotTodayEnd(): Date {
  //   return this.newAgreement.meetingDate.getTime() <=
  //     this.getDayBeginning().getTime()
  //     ? this.getDayEnd()
  //     : this.today;
  // }

  generateNumber(): void {
    const num: number | undefined =
      this.agreementsService.agreements.at(-1)?.number;
    this.newAgreement.number = num ? num + 1 : 1;
  }

  generateId(): void {
    const area: string = this.areas.find(
      (x) => x.label === this.newAgreement.area
    )!.id;
    const num: number = this.newAgreement.number;
    const id: string = `${area}${num}`;
    this.newAgreement.id = id;
  }

  clear(): void {
    this.newAgreement = {
      id: '',
      number: 0,
      area: '',
      meeting: '',
      session: '',
      meetingStartTime: new Date(),
      meetingEndTime: new Date(),
      createdBy: '',
      meetingDate: new Date(),
      solution: '',
      fulfilled: false,
      agreementCompilanceDate: new Date(),
    };
  }
}
