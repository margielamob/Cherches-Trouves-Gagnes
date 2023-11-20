/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FriendRequestService } from './friend-request.service';

describe('Service: FriendRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendRequestService]
    });
  });

  it('should ...', inject([FriendRequestService], (service: FriendRequestService) => {
    expect(service).toBeTruthy();
  }));
});
