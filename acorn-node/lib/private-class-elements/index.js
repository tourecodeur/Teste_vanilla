/* Generated by `npm run build`, do not edit! */

"use strict"

var acorn = require("acorn")
if (false) {
  throw new Error(("acorn-private-class-elements requires acorn@^6.1.0, not " + (acorn.version)))
}
var tt = acorn.tokTypes
var TokenType = acorn.TokenType

module.exports = function(Parser) {
  // Only load this plugin once.
  if (Parser.prototype.parsePrivateName) {
    return Parser
  }

  // Make sure `Parser` comes from the same acorn as our `tt`,
  // otherwise the comparisons fail.
  var cur = Parser
  while (cur && cur !== acorn.Parser) {
    cur = cur.__proto__
  }
  if (cur !== acorn.Parser) {
    throw new Error("acorn-private-class-elements does not support mixing different acorn copies")
  }

  Parser = /*@__PURE__*/(function (Parser) {
    function Parser_ () {
      Parser.apply(this, arguments);
    }

    if ( Parser ) Parser_.__proto__ = Parser;
    Parser_.prototype = Object.create( Parser && Parser.prototype );
    Parser_.prototype.constructor = Parser_;

    Parser_.prototype._branch = function _branch () {
      this.__branch = this.__branch || new Parser({ecmaVersion: this.options.ecmaVersion}, this.input)
      this.__branch.end = this.end
      this.__branch.pos = this.pos
      this.__branch.type = this.type
      this.__branch.value = this.value
      this.__branch.containsEsc = this.containsEsc
      return this.__branch
    };

    Parser_.prototype.parsePrivateClassElementName = function parsePrivateClassElementName (element) {
      element.computed = false
      element.key = this.parsePrivateName()
      if (element.key.name == "constructor") { this.raise(element.key.start, "Classes may not have a private element named constructor") }
      var accept = {get: "set", set: "get"}[element.kind]
      var privateBoundNames = this._privateBoundNamesStack[this._privateBoundNamesStack.length - 1]
      if (Object.prototype.hasOwnProperty.call(privateBoundNames, element.key.name) && privateBoundNames[element.key.name] !== accept) {
        this.raise(element.start, "Duplicate private element")
      }
      privateBoundNames[element.key.name] = element.kind || true
      delete this._unresolvedPrivateNamesStack[this._unresolvedPrivateNamesStack.length - 1][element.key.name]
      return element.key
    };

    Parser_.prototype.parsePrivateName = function parsePrivateName () {
      var node = this.startNode()
      node.name = this.value
      this.next()
      this.finishNode(node, "PrivateName")
      if (this.options.allowReserved == "never") { this.checkUnreserved(node) }
      return node
    };

    // Parse # token
    Parser_.prototype.getTokenFromCode = function getTokenFromCode (code) {
      if (code === 35) {
        ++this.pos
        var word = this.readWord1()
        return this.finishToken(this.privateNameToken, word)
      }
      return Parser.prototype.getTokenFromCode.call(this, code)
    };

    // Manage stacks and check for undeclared private names
    Parser_.prototype.parseClass = function parseClass (node, isStatement) {
      this._privateBoundNamesStack = this._privateBoundNamesStack || []
      var privateBoundNames = Object.create(this._privateBoundNamesStack[this._privateBoundNamesStack.length - 1] || null)
      this._privateBoundNamesStack.push(privateBoundNames)
      this._unresolvedPrivateNamesStack = this._unresolvedPrivateNamesStack || []
      var unresolvedPrivateNames = Object.create(null)
      this._unresolvedPrivateNamesStack.push(unresolvedPrivateNames)
      var _return = Parser.prototype.parseClass.call(this, node, isStatement)
      this._privateBoundNamesStack.pop()
      this._unresolvedPrivateNamesStack.pop()
      if (!this._unresolvedPrivateNamesStack.length) {
        var names = Object.keys(unresolvedPrivateNames)
        if (names.length) {
          names.sort(function (n1, n2) { return unresolvedPrivateNames[n1] - unresolvedPrivateNames[n2]; })
          this.raise(unresolvedPrivateNames[names[0]], "Usage of undeclared private name")
        }
      } else { Object.assign(this._unresolvedPrivateNamesStack[this._unresolvedPrivateNamesStack.length - 1], unresolvedPrivateNames) }
      return _return
    };

    // Parse private element access
    Parser_.prototype.parseSubscript = function parseSubscript (base, startPos, startLoc, noCalls, maybeAsyncArrow) {
      if (!this.eat(tt.dot)) {
        return Parser.prototype.parseSubscript.call(this, base, startPos, startLoc, noCalls, maybeAsyncArrow)
      }
      var node = this.startNodeAt(startPos, startLoc)
      node.object = base
      node.computed = false
      if (this.type == this.privateNameToken) {
        node.property = this.parsePrivateName()
        if (!this._privateBoundNamesStack.length || !this._privateBoundNamesStack[this._privateBoundNamesStack.length - 1][node.property.name]) {
          this._unresolvedPrivateNamesStack[this._unresolvedPrivateNamesStack.length - 1][node.property.name] = node.property.start
        }
      } else {
        node.property = this.parseIdent(true)
      }
      return this.finishNode(node, "MemberExpression")
    };

    // Prohibit delete of private class elements
    Parser_.prototype.parseMaybeUnary = function parseMaybeUnary (refDestructuringErrors, sawUnary) {
      var _return = Parser.prototype.parseMaybeUnary.call(this, refDestructuringErrors, sawUnary)
      if (_return.operator == "delete") {
        if (_return.argument.type == "MemberExpression" && _return.argument.property.type == "PrivateName") {
          this.raise(_return.start, "Private elements may not be deleted")
        }
      }
      return _return
    };

    return Parser_;
  }(Parser))
  Parser.prototype.privateNameToken = new TokenType("privateName")
  return Parser
}
