let Rx = require('rx');
let fs = require('fs');
// Rx.Observable.just('Hello World!').subscribe(function(value) {
//   console.log(value);
// })
let readdir = Rx.Observable.fromNodeCallback(fs.readdir);

let source = readdir('C:\\');

source.subscribe(
  onNext = res => console.log('List of directories ' + res),
  onError = err => console.log('Error ' + err),
  onCompleted = () => console.log('Completed')
)
