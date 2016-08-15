'use strict';

const _group = require('../src/__model');

describe ('project', function() {
  it ('should not assign unknown properties', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'dummy',
      valNOK: 'dummy value'
    };

    expect(obj.model[obj.prop]).toBeNull();

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBeNull();
  });

  it ('should assign a name', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'name',
      valOK: 'group #1'
    };

    expect(obj.model[obj.prop]).toBe('unnamed');

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should keep the last name if setting an invalid', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'name',
      valOK: 'group #1',
      valOK2: '🍺',
      valNOK: 1,
      valNOK2: '<p>dummy</p>',
    };

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe('unnamed');

    obj.model[obj.prop] = obj.valOK2;
    expect(obj.model[obj.prop]).toBe(obj.valOK2);

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.model[obj.prop] = obj.valNOK2;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should not look in the prototype chain for the name', function() {
    const model1 = _group.createProject();
    const model2 = _group.createProject();

    model2.name = 'group #2';
    expect(model1.name).toBe('unnamed');
  });

  it ('should assign a valid array of paths', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'paths',
      valOK: 'path/to/somewhere',
      valOK2: 'another/path/to/somewhere',
      valOK3: ['path/to/somewhere', 'another/path/to/somewhere'],
      valNOK: [],
      valNOK2: 1,
      valNOK3: {}
    };

    obj.model.addPaths(obj.valOK);
    expect(obj.model[obj.prop]).toEqual([obj.valOK]);

    obj.model.addPaths(obj.valOK2);
    expect(obj.model[obj.prop]).toEqual(obj.valOK3);

    let removedPaths = obj.model.clearPaths();
    expect(obj.model[obj.prop]).toEqual([]);
    expect(removedPaths).toEqual(obj.valOK3);

    obj.model.addPaths(obj.valOK3);
    expect(obj.model[obj.prop]).toEqual(obj.valOK3);
  });

  it ('should assign an icon', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'icon',
      valOK: 'icon-mark-github',
      valOK2: 'devicon-angular'
    };

    expect(obj.model[obj.prop]).toBe('');

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.model[obj.prop] = obj.valOK2;
    expect(obj.model[obj.prop]).toBe(obj.valOK2);
  });

  it ('should keep the last icon if setting an invalid', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'icon',
      valOK: 'icon-mark-github',
      valNOK: 'dummy'
    };

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe('');

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should assign a color', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'color',
      valOK: '#fff000'
    };

    expect(obj.model[obj.prop]).toBe('');

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.valOK = '#fff';
    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should keep the last color if setting an invalid', function() {
    const obj = {
      model: _group.createProject(),
      prop: 'color',
      valOK: '#fff000',
      valNOK: 'dummy'
    };

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.valNOK = '#ffff';
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should set as prototype of another group model only', function() {
    const obj1 = _group.createProject();
    const obj2 = _group.createProject();
    obj2.name = 'asd';

    const setPrototype = function (target, proto) {
      return Object.setPrototypeOf(target, proto);
    };

    expect(setPrototype.bind(null, obj1, obj2)).not.toThrow();
    expect(Object.getPrototypeOf(obj1)).toEqual(obj2);

    expect(setPrototype.bind(null, obj1, {})).toThrow();
    expect(Object.getPrototypeOf(obj1)).toEqual(obj2);
  });

  it ('should get the group\'s breadcrumb', function() {
    const obj = {
      model1: _group.createProject(),
      model2: _group.createProject(),
      valOK: 'unnamed',
      valOK2: 'unnamed / unnamed',
      valOK3: 'group #2 / group #1'
    };

    expect(obj.model1.breadcrumb()).toEqual(obj.valOK);

    Object.setPrototypeOf(obj.model1, obj.model2);
    expect(obj.model1.breadcrumb()).toEqual(obj.valOK2);

    obj.model1.name = 'group #1';
    obj.model2.name = 'group #2';

    expect(obj.model1.breadcrumb()).toEqual(obj.valOK3);
  });
});