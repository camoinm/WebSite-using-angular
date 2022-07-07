import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Leader[] {
    return LEADERS;
  }

  getLeader(id: string): Leader {
    return LEADERS.filter((Leader) => (Leader.id === id))[0]; //filtre les plat selon l'id
  }

  getFeaturedLeader(): Leader {
    return LEADERS.filter((Leader) => Leader.featured)[0];
  }
}
