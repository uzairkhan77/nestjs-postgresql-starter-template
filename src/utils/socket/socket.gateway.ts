// import { OnModuleInit } from '@nestjs/common';

// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';

// import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: ['*'],
//     methods: ['GET', 'POST'],
//   },
// })
// export class SocketsGateway implements OnModuleInit {
//   @WebSocketServer()
//   server: Server;

//   onModuleInit() {
//     this.server.setMaxListeners(15);
//     this.server.on('connection', (socket) => {
//       console.log('Connected to sockets');
//     });
//   }

//   @SubscribeMessage('updateUser')
//   handleUpdateUser(@MessageBody('userId') userId: string): void {
//     console.log('user updated', userId);
//     console.log('Socket emitted and user updated');

//     this.server.emit(`user_${userId}`, {
//       message: 'user updated',
//     });
//   }
// }
