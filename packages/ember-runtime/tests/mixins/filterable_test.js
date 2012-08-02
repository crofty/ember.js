var get = Ember.get, set = Ember.set;


var array, unfilteredArray, filteredArrayController;

module("Ember.Filterable");

module("Ember.Filterable with content", {
  setup: function() {
    Ember.run(function() {
      array = [{ id: 1, name: "Scumbag Dale" }, { id: 2, name: "Scumbag Katz" }, { id: 3, name: "Scumbag Bryn" }];
      unfilteredArray = Ember.A(array);

      filteredArrayController = Ember.ArrayProxy.create(Ember.FilterableMixin, {
        content: unfilteredArray
      });
    });
  },

  teardown: function() {
    Ember.run(function() {
      filteredArrayController.set('content', null);
      filteredArrayController.destroy();
    });
  }
});

test("if you do not specify `filterProperty` filterable has no effect", function() {
  equal(filteredArrayController.get('length'), 3, 'array has 3 items');

  unfilteredArray.pushObject({id: 4, name: 'Scumbag Chavard'});

  equal(filteredArrayController.get('length'), 4, 'array has 4 items');
});

test("you can change the filterProperty and filterValue", function() {
  equal(filteredArrayController.get('length'), 3, 'precond - array has 3 items');

  filteredArrayController.setProperties({filterProperty: 'id', filterValue: 1});

  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'array is filtered by id');

  filteredArrayController.set('filterValue', 2);

  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Katz', 'array is filtered by id');

  filteredArrayController.set('filterProperty', 'name');
  filteredArrayController.set('filterValue', 'Scumbag Bryn');

  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Bryn', 'array is filtered by name');
});


module("Ember.Filterable with content, filterProperty and filterValue", {
  setup: function() {
    Ember.run(function() {
      array = [{ id: 1, name: "Scumbag Dale" }, { id: 2, name: "Scumbag Katz" }, { id: 3, name: "Scumbag Bryn" }];
      unfilteredArray = Ember.A(array);

      filteredArrayController = Ember.ArrayProxy.create(Ember.FilterableMixin, {
        content: unfilteredArray,
        filterProperty: 'id',
        filterValue: 1
      });
    });
  },

  teardown: function() {
    Ember.run(function() {
      filteredArrayController.set('content', null);
      filteredArrayController.destroy();
    });
  }
});

test("filtered object will expose filtered content", function() {
  equal(filteredArrayController.get('length'), 1, 'array is filtered by id');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'the object is the correct one');
});

test("you can add objects in the filtered array", function() {
  equal(filteredArrayController.get('length'), 1, 'array has 1 item');

  unfilteredArray.pushObject({id: 1, name: 'Scumbag Chavard'});

  equal(filteredArrayController.get('length'), 2, 'array has 2 items');
  equal(filteredArrayController.objectAt(1).name, 'Scumbag Chavard', 'a new object added to content was inserted according to given constraint');

  unfilteredArray.addObject({id: 1, name: 'Scumbag Fucs'});

  equal(filteredArrayController.get('length'), 3, 'array has 3 items');
  equal(filteredArrayController.objectAt(2).name, 'Scumbag Fucs', 'a new object added to controller was inserted according to given constraint');
});

test("new objects don't get added if they don't match the filter", function() {
  equal(filteredArrayController.get('length'), 1, 'array has 1 item');

  unfilteredArray.pushObject({id: 5, name: 'Scumbag Chavard'});

  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
});

test("you can change a filter property and the content will be removed", function() {
  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'dale is the only one');

  set(filteredArrayController.objectAt(0), 'id', 2);

  equal(filteredArrayController.get('length'), 0, 'array has no items');
});

test("you can change a filter property and the content will be added", function() {
  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'dale is the only one');

  set(unfilteredArray.objectAt(1), 'id', 1);

  equal(filteredArrayController.get('length'), 2, 'array has two items');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'dale is there');
  equal(filteredArrayController.objectAt(1).name, 'Scumbag Katz', 'katz is there');
});

module("Ember.Filterable with content and filterProperty", {
  setup: function() {
    Ember.run(function() {
      array = [{ name: "Scumbag Dale", display: false}, { name: "Scumbag Katz", display: true}];
      unfilteredArray = Ember.A(array);

      filteredArrayController = Ember.ArrayProxy.create(Ember.FilterableMixin, {
        content: unfilteredArray,
        filterProperty: 'display'
      });
    });
  },

  teardown: function() {
    Ember.run(function() {
      filteredArrayController.set('content', null);
      filteredArrayController.destroy();
    });
  }
});

test("by default filters properties which are true", function(){
  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Katz', 'katz is the only one');

});

module("Ember.Filterable with filterProperty and filterValue", {
  setup: function() {
    Ember.run(function() {
      array = [{ id: 1, name: "Scumbag Dale" }, { id: 2, name: "Scumbag Katz" }, { id: 3, name: "Scumbag Bryn" }];
      unfilteredArray = Ember.A(array);

      filteredArrayController = Ember.ArrayProxy.create(Ember.FilterableMixin, {
        filterProperty: 'id',
        filterValue: 1
      });
    });
  },

  teardown: function() {
    Ember.run(function() {
      filteredArrayController.set('content', null);
      filteredArrayController.destroy();
    });
  }
});

test("you can set content later and it will be filtered", function() {
  equal(filteredArrayController.get('length'), 0, 'array has 0 items');

  Ember.run(function() {
    filteredArrayController.set('content', unfilteredArray);
  });

  equal(filteredArrayController.get('length'), 1, 'array has 1 item');
  equal(filteredArrayController.objectAt(0).name, 'Scumbag Dale', 'dale is in the filtered array');
});
