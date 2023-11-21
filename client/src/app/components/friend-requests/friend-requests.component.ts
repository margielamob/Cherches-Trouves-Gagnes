// import { Component, OnInit } from '@angular/core';
// import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
// import { UserService } from '@app/services/user-service/user.service';
// import { Observable } from 'rxjs';

// @Component({
//     selector: 'app-friend-requests',
//     templateUrl: './friend-requests.component.html',
//     styleUrls: ['./friend-requests.component.scss'],
// })
// export class FriendRequestsComponent implements OnInit {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     receivedRequests$: Observable<any>;
//     currunetUserId: string;

//     constructor(private friendReq: FriendRequestService, private userService: UserService) {
//         this.userService.getCurrentUser().subscribe((user) => {
//             if (user) {
//                 this.currunetUserId = user.uid;
//             }
//         });
//     }
//     ngOnInit() {
//     //     this.userService.getCurrentUser().subscribe((user) => {
//     //         if (user) {
//     //             this.currunetUserId = user.uid;
//     //             this.receivedRequests$ = this.friendReq.getReceivedFriendRequests(this.currunetUserId).pipe(
//     //                 mergeMap((requests: (FriendRequest & { docId: string })[]) =>
//     //                     requests.length > 0
//     //                         ? from(requests).pipe(
//     //                               mergeMap((request: FriendRequest & { docId: string }) =>
//     //                                   this.friendReq.getUserData(request.from as string).pipe(map((userData) => ({ ...request, userData }))),
//     //                               ),
//     //                               toArray(),
//     //                           )
//     //                         : of([]),
//     //                 ),
//     //             );
//     //         }
//     //     });
//     // }
// }
