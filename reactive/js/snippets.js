/**
Some utilities functions used by the snippets
*/
function get(url) {
  return Rx.Observable.create(observer => {
    let req = new XMLHttpRequest();

    req.open("GET", url);

    req.onload = () =>
      req.status === 200
        ? observer.onNext(req.response)
        : observer.onError(new Error(req.statusText));

    req.onerror = () => observer.onError(new Error("Unknown error"));
    req.send();
  });
}

function logValue(val) {
  console.log(val);
}

function getJSON(ary) {
  return Rx.Observable.from(ary).map(str => JSON.parse(str));
}

function snippet1() {
  Rx.Observable.just("Hello World!").subscribe(value => console.log(value));
}
function snippet2() {
  // classic way with event listeners
  console.log("Click on the right half side to read the mouse coordinates");

  var clicks = 0;
  let listener = document.addEventListener("click", function registerClicks(e) {
    if (clicks < 10) {
      if (e.clientX > window.innerWidth / 2) {
        console.log(e.clientX, e.clientY);
        clicks++;
      }
    } else {
      document.removeEventListener("click", listener);
    }
  });
}

function snippet3() {
  // reactive way with RxJS
  console.log("Click on the right half side to read the mouse coordinates");

  Rx.Observable.fromEvent(document, "click")
    .filter(c => c.clientX > window.innerWidth / 2)
    .take(10)
    .subscribe(c => console.log(c.clientX, c.clientY));
}

function snippet4() {
  let observable = Rx.Observable.create(observer => {
    observer.onNext("one");
    observer.onNext("two");
    observer.onNext("three");
    observer.onCompleted(); // end of the stream
  });

  let observer = Rx.Observer.create(
    (onNext = x => {
      console.log("Next " + x);
    }),
    (onError = err => {
      console.log("Error " + err);
    }),
    (onCompleted = () => {
      console.log("Completed");
    })
  );

  observable.subscribe(observer);
}

function snippet5() {
  let test = get("http://jsonplaceholder.typicode.com/posts");

  test.subscribe(
    (onNext = data => {
      console.log("Results " + data);
    }),
    (onError = err => {
      console.log("Error " + err);
    }),
    (onCompleted = () => {
      console.log("Completed");
    })
  );
}

function snippet6() {
  Rx.DOM.get("http://jsonplaceholder.typicode.com/posts").subscribe(
    (onNext = data => {
      console.log("Results " + data.response);
    }),
    (onError = err => {
      console.log("Error " + err);
    })
  );
}

function snippet7() {
  console.log("Move the mouse around");

  Rx.Observable.from(["0", "1", "2"]).subscribe(
    (onNext = x => {
      console.log("Next " + x);
    }),
    (onError = err => {
      console.log("Error " + err);
    }),
    (onCompleted = () => {
      console.log("Completed");
    })
  );

  let allMoves = Rx.Observable.fromEvent(document, "mouseover");
  // .subscribe(
  //   onNext = (x) => { console.log(x.clientX, x.clientY);},
  //   onError = (err) => { console.log('Error ' + err);},
  //   onCompleted = () => { console.log('Completed');}
  // )

  // first solution:
  let allMovesOnTheLeft = allMoves.subscribe(
    (onNext = x => {
      if (x.clientX <= window.innerWidth / 2) {
        console.log("1 - Move on the left: ", x.clientX, x.clientY);
      }
    })
  );

  let allMovesOnTheRight = allMoves.subscribe(
    (onNext = x => {
      if (x.clientX > window.innerWidth / 2) {
        console.log("1 - Move on the right: ", x.clientX, x.clientY);
      }
    })
  );

  // second solution:
  allMovesOnTheLeft = allMoves.filter(x => x.clientX <= window.innerWidth / 2);
  allMovesOnTheRight = allMoves.filter(x => x.clientX > window.innerWidth / 2);

  allMovesOnTheLeft.subscribe(x => {
    console.log("2 - Move on the left: ", x.clientX, x.clientY);
  });
  allMovesOnTheRight.subscribe(x => {
    console.log("2 - Move on the right: ", x.clientX, x.clientY);
  });
}

function snippet8() {
  let a = Rx.Observable.interval(200).map(i => "A" + i);
  let b = Rx.Observable.interval(100).map(i => "B" + i);
  let subscription = Rx.Observable.merge(a, b).subscribe(x => console.log(x));

  setTimeout(() => {
    console.log("Cancelling subscription");
    subscription.dispose();
  }, 2000);
}

function snippet9() {
  // sequence operators

  // check the documentation: if range(0, 5) the behaviour is wierd!
  let src = Rx.Observable.range(1, 5);
  let upper = src.map(x => x * 2);
  upper.subscribe(x => console.log("from map: " + x));

  let even = src.filter(x => x % 2 === 0);
  even.subscribe(x => console.log("from filter: " + x));

  // let sum = src.reduce( (x1, x2) => x1 + x2); it works too, more clean
  let sum = src.reduce((x1, x2) => x1 + x2, 0);
  sum.subscribe(sum => console.log("from reduce: " + sum));

  let avg = src
    .reduce(
      (acc, current) => {
        return { sum: acc.sum + current, count: acc.count + 1 };
      },
      { sum: 0, count: 0 }
    )
    .map(x => x.sum / x.count);
  avg.subscribe(avg => console.log("avg from reduce: " + avg));

  // we must use scan instead of reduce because src2 has no end
  let src2 = Rx.Observable.interval(500);
  avg = src2
    .scan(
      (acc, current) => {
        return { sum: acc.sum + current, count: acc.count + 1 };
      },
      { sum: 0, count: 0 }
    )
    .map(x => x.sum / x.count);
  let subscription = avg.subscribe(avg => console.log("avg from scan: " + avg));

  setTimeout(() => {
    console.log("Cancelling avg subscription");
    subscription.dispose();
  }, 3000);
}

function snippet10() {
  // Hanhling errors
  getJSON([
    '{"a":1,"b":2}',
    '{"success: true}', // this is invalid JSON
    '{"failure": false}'
  ]).subscribe(
    json => {
      console.log("Parsed JSON: ", json);
    },
    err => {
      console.log(err.message);
    }
  );

  let caught = getJSON(['{"a":1,"b":2}', '{"success: true}']).catch(
    Rx.Observable.return({ error: "error while parsing JSON" })
  );

  caught.subscribe(
    json => {
      console.log("2-Parsed JSON: ", json);
    },
    // this will not be executed because we catched errors before with catch
    err => {
      console.log("Error: ", err);
    }
  );
}

function snippet11() {
  let source = Rx.Observable.interval(1000);
  let publisher = source.publish();

  let observer1 = publisher.subscribe(x => {
    console.log("Observer 1: " + x);
  });
  publisher.connect();

  let observer2;
  setTimeout(() => {
    observer2 = publisher.subscribe(x => {
      console.log("Observer 2: " + x);
    });
  }, 5000);

  setTimeout(() => {
    observer1.dispose();
    observer2.dispose();
  }, 10000);
}

function execSnippet() {
  console.clear();

  let snippet = $("#snippets").val();
  switch (snippet) {
    case "1":
      snippet1();
      break;
    case "2":
      snippet2();
      break;
    case "3":
      snippet3();
      break;
    case "4":
      snippet4();
      break;
    case "5":
      snippet5();
      break;
    case "6":
      snippet6();
      break;
    case "7":
      snippet7();
      break;
    case "8":
      snippet8();
      break;
    case "9":
      snippet9();
      break;
    case "10":
      snippet10();
      break;
    case "11":
      snippet11();
      break;
    default:
      console.log("Choose a RxJS snippet to run and see the code");
  }
}

$(function() {
  execSnippet();
});
