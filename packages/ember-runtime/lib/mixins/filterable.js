var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

/**
 @class

 @extends Ember.Mixin
 @extends Ember.MutableEnumerable
*/
Ember.FilterableMixin = Ember.Mixin.create(Ember.MutableEnumerable, {
  filterProperty: null,
  filterValue: true,

  addObject: function(obj) {
    var content = get(this, 'content');
    content.pushObject(obj);
  },

  removeObject: function(obj) {
    var content = get(this, 'content');
    content.removeObject(obj);
  },

  destroy: function() {
    var content = get(this, 'content'),
        filterProperty = get(this, 'filterProperty');

    if (content && filterProperty) {
      forEach(content, function(item) {
        Ember.removeObserver(item, filterProperty, this, 'contentItemFilterPropertyDidChangePropertyDidChange');
      }, this);
    }

    return this._super();
  },

  isFiltered: Ember.computed('filterProperty', function() {
    return !!get(this, 'filterProperty');
  }),

  arrangedContent: Ember.computed('content', 'filterProperty', 'filterValue', function(key, value) {
    var content = get(this, 'content'),
        isFiltered = get(this, 'isFiltered'),
        filterProperty = get(this, 'filterProperty'),
        filterValue = get(this, 'filterValue'),
        self = this;

    if (content && isFiltered) {
      forEach(content, function(item) {
        Ember.addObserver(item, filterProperty, this, 'contentItemFilterPropertyDidChange');
      }, this);
      content = content.slice();
      content = content.filter(function(item){
        return get(item, filterProperty) === filterValue;
      });

      return Ember.A(content);
    }

    return content;
  }).cacheable(),

  _contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content'),
        filterProperty = get(this, 'filterProperty');

    if (content && filterProperty) {
      forEach(content, function(item) {
        Ember.removeObserver(item, filterProperty, this, 'contentItemFilterPropertyDidChange');
      }, this);
    }

    this._super();
  }, 'content'),

  contentArrayWillChange: function(array, idx, removedCount, addedCount) {
    var isFiltered = get(this, 'isFiltered');

    if (isFiltered) {
      var arrangedContent = get(this, 'arrangedContent');
      var removedObjects = array.slice(idx, idx+removedCount);
      var filterProperty = get(this, 'filterProperty');

      forEach(removedObjects, function(item) {
        arrangedContent.removeObject(item);

        Ember.removeObserver(item, filterProperty, this, 'contentItemFilterPropertyDidChange');
      });
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  contentArrayDidChange: function(array, idx, removedCount, addedCount) {
    var isFiltered = get(this, 'isFiltered'),
        filterProperty = get(this, 'filterProperty');

    if (isFiltered) {
      var addedObjects = array.slice(idx, idx+addedCount);
      var arrangedContent = get(this, 'arrangedContent');

      forEach(addedObjects, function(item) {
        this.insertItemFiltered(item);

        Ember.addObserver(item, filterProperty, this, 'contentItemFilterPropertyDidChange');
      }, this);
    }

    return this._super(array, idx, removedCount, addedCount);
  },

  contentItemFilterPropertyDidChange: function(item) {
    var arrangedContent = get(this, 'arrangedContent'),
        index = arrangedContent.indexOf(item);

    arrangedContent.removeObject(item);
    this.insertItemFiltered(item);
  },

  insertItemFiltered: function(item){
    var arrangedContent = get(this, 'arrangedContent'),
        filterProperty = get(this, 'filterProperty'),
        filterValue = get(this, 'filterValue');

    if( get(item,filterProperty) === filterValue){
      arrangedContent.pushObject(item);
    }
  }

});
