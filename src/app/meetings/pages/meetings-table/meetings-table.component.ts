import { Component, OnInit } from '@angular/core';
import { MeetingWithArea, Session } from '../../interfaces/meeting.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { MeetingsService } from '../../services/meetings.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { AreasService } from 'src/app/areas/services/areas.service';

@Component({
  selector: 'app-meetings-table',
  templateUrl: './meetings-table.component.html',
  styleUrls: ['./meetings-table.component.css'],
})
export class MeetingsTableComponent implements OnInit {
  meetings: MeetingWithArea[] = [];
  typesOfMeetings: TypeOfMeeting[] = [];
  areas: Area[] = [];
  sessions: Session[] = [Session.ordinary, Session.extraordinary];

  constructor(
    private meetingsService: MeetingsService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private areasService: AreasService
  ) {}

  ngOnInit(): void {
    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.typesOfMeetingsService.getAll().subscribe((resp) => {
      this.typesOfMeetings = resp;
      this.typesOfMeetings.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.meetingsService.getAll().subscribe((resp) => {
      resp.forEach((value) => {
        const meeting: MeetingWithArea = {
          id: value.id,
          typeOfMeeting: this.typesOfMeetings.find(
            (typeOfMeeting) => typeOfMeeting.id === value.FK_idTypeOfMeeting
          )?.name!,
          area: this.areas.find(
            (area) =>
              area.id ===
              this.typesOfMeetings.find(
                (typeOfMeeting) => typeOfMeeting.id === value.FK_idTypeOfMeeting
              )?.FK_idWorkArea!
          )?.name!,
          name: value.name,
          session: value.session,
          date: value.date,
        };

        this.meetings.push(meeting);
      });
    });
  }
}
