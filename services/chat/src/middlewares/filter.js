// const badWords = ['badword1', 'badword2']; // Replace with actual words

// function filterMessage(content) {
//   const regex = new RegExp(badWords.join('|'), 'gi');
//   return content.replace(regex, '[censored]');
// }

// function handlePrivateMessage(message, ws) {
//   const { recipient, content } = message;
//   const recipientSocket = findUserSocket(recipient);

//   const filteredContent = filterMessage(content);

//   if (recipientSocket) {
//     recipientSocket.send(JSON.stringify({
//       type: 'private_message',
//       sender: ws.user.username,
//       content: filteredContent
//     }));
//   } else {
//     ws.send(JSON.stringify({ error: 'User not found' }));
//   }
// }
