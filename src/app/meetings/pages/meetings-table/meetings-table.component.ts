import { Component, OnInit } from '@angular/core';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { MeetingsService } from '../../services/meetings.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { OrganizationsService } from 'src/app/organizations/services/organizations.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-meetings-table',
  templateUrl: './meetings-table.component.html',
  styleUrls: ['./meetings-table.component.css'],
  providers: [MessageService],
})
export class MeetingsTableComponent implements OnInit {
  meetings: Meeting[] = [];
  typeOfMeeting!: TypeOfMeeting;
  organization!: Organization;
  sessions: Session[] = [Session.ordinary, Session.extraordinary];

  formVisible: boolean = false;

  constructor(
    private typesOfMeetingsService: TypesOfMeetingsService,
    private organizationsService: OrganizationsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.typesOfMeetingsService.getById(id)),
        tap((resp) =>
          this.organizationsService
            .getById((resp.arg as TypeOfMeeting).idOrganization!)
            .subscribe(
              (resp2) => (this.organization = resp2.arg as Organization)
            )
        ),
        switchMap((resp3) => {
          this.typeOfMeeting = resp3.arg as TypeOfMeeting;

          return this.typesOfMeetingsService.getMeetings(
            (resp3.arg as TypeOfMeeting).id
          );
        })
      )
      .subscribe((resp4) => (this.meetings = resp4.arg as Meeting[]));
  }

  showDialog() {
    this.formVisible = true;
  }

  hideDialog() {
    this.formVisible = false;
  }

  reloadTable(ok: boolean) {
    this.hideDialog();

    if (ok) {
      this.typesOfMeetingsService
        .getMeetings(this.typeOfMeeting!.id)
        .subscribe((resp) => (this.meetings = resp.arg as Meeting[]));
    }
  }
}
