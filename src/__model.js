'use strict';

const groupModel = {
  type: 'group',
  name: 'unnamed',
  sortBy: 'position',
  icon: '',
  color: ''
};

const projectModel = {
  type: 'project',
  name: 'unnamed',
  icon: '',
  color: '',
  paths: []
};

const methods = {
  breadcrumb: function _breadcrumb () {
    let proto = Object.getPrototypeOf(this);
    let protoName = '';
    if (proto !== Object.prototype) {
      protoName = proto.breadcrumb();
    }
    return protoName.length === 0 ? this.name : `${protoName} / ${this.name}`;
  }
};

const groupMethods = {};

const projectMethods = {
  clearPaths: function _clearPaths () {
    const removedPaths = this.paths;
    this.paths = [];
    return removedPaths;
  },
  addPaths: function _addPaths (paths) {
    if (!paths) {
      return;
    }
    if (Array.isArray(paths)) {
      paths.forEach(
        (path) => this.addPaths(path)
      );
      return;
    }
    if (typeof paths !== 'string') {
      return;
    }
    if (this.paths.indexOf(paths) === -1) {
      this.paths.push(paths);
    }
  },
  removePaths: function _removePaths (paths) {
    paths.forEach(
      (path) => {
        console.log(path);
        // const idx = this.paths.indexOf(path);
        // if (idx !== -1) {
        //   this.paths.splice(idx, 1);
        // }
      }
    );
  }
};

Object.assign(groupMethods, methods);
Object.assign(projectMethods, methods);

const handler = {
  setPrototypeOf: function _setPrototypeOf (target, prototype) {
    if (Object.getPrototypeOf(target) === Object.getPrototypeOf(prototype)) {
      Object.setPrototypeOf(target, prototype);
      return true;
    }
    return false;
  },
  get: function _get (target, property) {
    if (target.hasOwnProperty(property)) {
      return target[property];
    }
    if (typeof target[property] === 'function') {
      return target[property];
    }
    return null;
  },
  set: function _set (target, property, value, receiver) {
    const allowedProps = [
      'name',
      'sortBy',
      'icon',
      'color',
      'paths'
    ];
    if (allowedProps.indexOf(property) === -1) {
      return true;
    }
    let cleanValue;
    if (property === 'name') {
      // TODO: make this in a helper function?
      const UNSAFE_CHARS_PATTERN = /[<>\/\u2028\u2029]/g;
      const UNICODE_CHARS = {
        '<': '\\u003C',
        '>': '\\u003E',
        '/': '\\u002F',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
      };
      cleanValue = value.replace && value.replace(
        UNSAFE_CHARS_PATTERN,
        function (unsafeChar) { return UNICODE_CHARS[unsafeChar];}
      ) === value ? value : target[property];
    }
    else if (property === 'sortBy') {
      const allowed = [
        'position',
        'reverse-position',
        'alphabetically',
        'reverse-alphabetically'
      ];
      if (target.type !== 'group') {
        return null;
      }
      cleanValue = allowed.indexOf(value) !== -1 ? value : target[property];
    }
    else if (property === 'icon') {
      const allowed = [
        'icon-',
        'devicon-'
      ];
      cleanValue = allowed.map(
        (val) => value.startsWith(val) ? value : undefined
      ).filter(
        (val) => val !== undefined
      );

      cleanValue = cleanValue.length === 1 ? cleanValue[0] : target[property];
    }
    else if (property === 'color') {
      const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
      cleanValue = regEx.exec(value) !== null ? value : target[property];
    }
    else if (property === 'paths' && Array.isArray(value) && !value.length) {
      target[property] = [];
      return true;
    }
    target[property] = cleanValue;
    return true;
  }
};

module.exports = {
  createGroup: function _createGroup () {
    let model = Object.assign({}, groupModel, groupMethods);
    Object.preventExtensions();
    return new Proxy(model, handler);
  },
  createProject: function _createProject () {
    let model = Object.assign({}, projectModel, projectMethods);
    Object.preventExtensions();
    return new Proxy(model, handler);
  }
};