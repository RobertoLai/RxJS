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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJmb28iLCJjb25zb2xlIiwibG9nIiwiY2wxIiwibTEiLCJtYXAiLCJuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFNQSxHOzs7QUFDSixpQkFBYztBQUFBO0FBQUU7Ozs7eUJBRVg7QUFDSEMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksU0FBWjtBQUNEOzs7Ozs7QUFHSCxJQUFNQyxHQUFHLEdBQUcsSUFBSUgsR0FBSixFQUFaO0FBQ0FHLEdBQUcsQ0FBQ0MsRUFBSjtBQUVBLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVVDLEdBQVYsQ0FBYyxVQUFBQyxDQUFDO0FBQUEsU0FBSUEsQ0FBQyxHQUFHLENBQVI7QUFBQSxDQUFmIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgZm9vIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIG0xKCkge1xuICAgIGNvbnNvbGUubG9nKFwibWV0aG9kMVwiKTtcbiAgfVxufVxuXG5jb25zdCBjbDEgPSBuZXcgZm9vKCk7XG5jbDEubTEoKTtcblxuWzEsIDIsIDNdLm1hcChuID0+IG4gKyAxKTtcbiJdfQ==