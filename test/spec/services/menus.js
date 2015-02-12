'use strict';

describe('Service: menus', function () {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var menus;
  beforeEach(inject(function (_menus_) {
    menus = _menus_;
  }));

  it('should do something', function () {
    expect(!!menus).toBe(true);
  });

});
