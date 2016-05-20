var base = process.cwd().replace(/\\/g,"/")+"/client/Engine/Input/Keyboard",
    CreateKeyCodes = require(base+"/KeyCodes");

module.exports = function(){
  var _keycodes = CreateKeyCodes(),
      _key = "",
      _code = 0,
      _shift = false,
      _ctrl = false,
      _alt = false,
      _toggled = false,
      _onKeyEvents = [],
      _it = 0,
      _keyEvent = function(e){
        e.preventDefault();
        e.stopPropagation();
        _code = e.keyCode;
        _key = _keycodes.codes()[_code];
        _shift = !!e.shiftKey;
        _ctrl = !!e.ctrlKey;
        _alt = !!e.altKey;

        for(_it=0;_it<_onKeyEvents.length;_it++){
          if(typeof _onKeyEvents[_it] === 'function'){
            _onKeyEvents[_it]({type:e.type,code:_code,key:_key,shift:_shift,ctrl:_ctrl,alt:_alt});
          }
        }
      }

  function KeyBoard(){
    _keycodes.call();
    KeyBoard.toggleEventListener(true);
  }

  KeyBoard.keycodeLibrary = function(){
    return _keycodes;
  }

  KeyBoard.toggleEventListener = function(toggle){
    if(typeof toggle === 'boolean'){
      _toggled = !toggle;
    }
    WindowElements.document.removeEventListener('keydown',_keyEvent);
    WindowElements.document.removeEventListener('keyup',_keyEvent);

    if(!_toggled){
      WindowElements.document.addEventListener('keydown',_keyEvent);
      WindowElements.document.addEventListener('keyup',_keyEvent);
    }
    _toggled = !_toggled;
  }

  KeyBoard.addKeyListener = function(func){
    if(typeof func === 'function'){
      _onKeyEvents.push(func);
    }
    return KeyBoard;
  }

  KeyBoard.removeKeyListener = function(func){
    if(typeof func === 'function'){
      loop:for(var x=0;x<_onKeyEvents.length;x++){
        if(func.toString() === _onKeyEvents[x].toString()){
          _onKeyEvents.splice(x,1);
          break loop;
        }
      }
    }
    return KeyBoard;
  }

  KeyBoard.key = function(v){
    if(v === undefined){
      return _key;
    }
    _key = (typeof v === 'string' ? v : _key);
    return KeyBoard;
  }

  KeyBoard.code = function(v){
    if(v === undefined){
      return _code;
    }
    _code = (typeof v === 'number' ? v : _code);
    return KeyBoard;
  }

  KeyBoard.shift = function(v){
    if(v === undefined){
      return _shift;
    }
    _shift = !!v;
    return KeyBoard;
  }

  KeyBoard.ctrl = function(v){
    if(v === undefined){
      return _ctrl;
    }
    _ctrl = !!v;
    return KeyBoard;
  }

  KeyBoard.alt = function(v){
    if(v === undefined){
      return _alt;
    }
    _alt = !!v;
    return KeyBoard;
  }


  return KeyBoard;
}
