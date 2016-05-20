var base = process.cwd().replace(/\\/g,"/")+"/client/Engine/Input",
    CreateKeyBoard = require(base+"/Keyboard/Keyboard"),
    CreateMouse = require(base+"/Mouse/Mouse");

module.exports = function(){
  var _environments = {
    default:{

    }
  },
  _mouse = CreateMouse(),
  _keyboard = CreateKeyBoard(),
  _environment = 'default',
  _onBindingUpdateEvents = {"*":[]},
  _itb = 0,
  _nameb = "*",
  _bindingUpdateEvent = function(e){
    /* e = name(String), added(object info), removed(String), environment(String) */

    /* Global listener */
    _nameb = "*";
    for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
      if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
        _onBindingUpdateEvents[_nameb][x](e);
      }
    }

    /* added name listener */
    _nameb = e.name;
    if(_onBindingUpdateEvents[_nameb] !== undefined){
      for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
        if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
          _onBindingUpdateEvents[_nameb][x](e);
        }
      }
    }

    /* removed name listener */
    _nameb = e.removed;
    if(_onBindingUpdateEvents[_nameb] !== undefined){
      for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
        if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
          _onBindingUpdateEvents[_nameb][x](e);
        }
      }
    }

  },
  _inputEvent = function(e){
    /* e = type(String), code(Int), key(String), shift(Bool), ctrl(Bool), alt(Bool), moveX(Int), moveY(Int) */
  }

  function Inputs(){
    Inputs.toggleListening('mouse',true);
    Inputs.toggleListening('keyboard',true);
  }

  Inputs.addBindingUpdateListener = function(name,func){
    if(typeof name === 'function'){
      _onBindingUpdateEvents["*"].push(name);
    }
    else if(typeof name === 'string'){
      if(_onBindingUpdateEvents[name] === undefined){
        _onBindingUpdateEvents[name] = [];
      }
      _onBindingUpdateEvents[name].push(func);
    }
    return Inputs;
  }

  Inputs.removeBindingUpdateListener = function(name,func){
    if(typeof name === 'function'){
      func = name;
      name = "*";
    }
    if(typeof name === 'string' && _onBindingUpdateEvents[name] !== undefined){
      loop:for(var x=0;x<_onBindingUpdateEvents[name].length;x++){
        if(func.toString() === _onBindingUpdateEvents[name][x].toString()){
          _onBindingUpdateEvents[name].splice(x,1);
        }
      }
    }
    return Inputs
  }

  Inputs.toggleListening = function(type,toggle){
    if(typeof type === 'string'){
      switch(type){
        case 'mouse':
          if(toggle){
            _mouseToggle = !toggle;
          }
          _mouse.removeMouseListener(_inputEvent);
          if(!_mouseToggle){
            _mouse.addMouseListener(_inputEvent).call();
          }
          _mouseToggle = !_mouseToggle;
        break;
        case 'keyboard':
          if(toggle){
            _keyboardToggle = !toggle;
          }
          _keyboard.removeKeyListener(_inputEvent);
          if(!_keyboardToggle){
            _keyboard.addKeyListener(_inputEvent).call();
          }
          _keyboardToggle = !_keyboardToggle;
        break;
      }
    }
    return Inputs;
  }

  Inputs.environment = function(v){
    if(v === undefined){
      return _environment;
    }
    _environment = (typeof v === 'string' && _environments[v] ? v : _environment);
    return Inputs;
  }

  Inputs.addEnvironment = function(v){
    if(typeof v === 'string' && !_environments[v]){
      _environments[v] = {};
    }
    return Inputs;
  }

  Inputs.removeEnvironment = function(v){
    if(typeof v === 'string' && v !== 'default'){
      _environments[v] = null;
    }
    return Inputs;
  }

  Inputs.addBinding = function(environment,name,type,key,func,shift,ctrl,alt){

    /* Overload for environment */
    var __environment = (typeof func === 'function' ? environment : 'default'),
        __name = (typeof func === 'function' ? name : environment),
        __type = (typeof func === 'function' ? type : name),
        __key = (typeof func === 'function' ? key : type),
        __func = (typeof func === 'function' ? func : key),
        __shift = (typeof func === 'function' ? shift : func),
        __ctrl = (typeof func === 'function' ? ctrl : shift),
        __alt = (typeof func === 'function' ? alt : ctrl),
        __readable,
        __bindings = {},
        __bindingKeys = [],
        __bindingKey = {},
        __removal = "";

    __readable = (__shift ? "Shift ": "")+(__ctrl ? "Ctrl " : "")+(__alt ? "Alt " : "")+__type;
    if(_environments[__environment]){
      __bindings = _environments[__environment];

      /* Overwrite Existing if There */
      __bindingKeys = Object.keys(__bindings);
      loop:for(var x=0;x<__bindingKeys.length;x++){
        __bindingKey = __bindings[__bindingKeys[x]];

        if(__bindingKey.key === __key && __bindingKey.type === __type && __bindingKey.shift === !!__shift && __bindingKey.ctrl === !!__ctrl && __bindingKey.alt === !!__alt){
          __bindings[__bindingKeys[x]] = null;
          __removal = __bindingKeys[x];
          break loop;
        }
      }
      __bindings[__name] = {readable:__readable,key:__key,type:__type,func:__func,shift:!!__shift,ctrl:!!__ctrl,alt:!!__alt};
      _bindingUpdateEvent({name:__name,added:__bindings[__name],removed:__removal,environment:__environment});
    }
    return Inputs;
  }

  Inputs.removeBinding = function(environment,name){
    var __environment = (name === undefined ? 'default' : environment),
        __name = (name === undefined ? environment : name);

    if(_environments[__environment]){
      _environments[__environment][__name] = null;
      _bindingUpdateEvent({added:undefined,removed:__name,environment:__environment});
    }
    return Inputs;
  }

  return Inputs;
}