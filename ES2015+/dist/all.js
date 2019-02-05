"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var foo =
/*#__PURE__*/
function () {
  function foo() {
    _classCallCheck(this, foo);
  }

  _createClass(foo, [{
    key: "m1",
    value: function m1() {
      console.log("method1");
    }
  }]);

  return foo;
}();

var cl1 = new foo();
cl1.m1();
[1, 2, 3].map(function (n) {
  return n + 1;
});
//# sourceMappingURL=all.js.map
