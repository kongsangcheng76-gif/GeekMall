// GA4 Event Tracking + Cart System for GeekMall
(function () {
  // Category mapping (English key → Chinese label)
  var categoryMap = {
    'laptops': '筆記型電腦',
    'smartphones': '手機',
    'tablets': '平板電腦',
    'graphics-cards': '顯示卡',
    'motherboards': '主機板',
    'monitors': '顯示器',
    'headphones': '耳機/音頻',
    'smartwatches': '智慧手錶',
    'keyboards-mice': '鍵鼠周邊',
    'networking': '網絡設備'
  };

  // ---- Cart (localStorage) ----
  window.GeekCart = {
    items: [],

    init: function () {
      try {
        var saved = localStorage.getItem('geekcart');
        if (saved) this.items = JSON.parse(saved);
      } catch (e) { this.items = []; }
      this.updateBadge();
    },

    save: function () {
      localStorage.setItem('geekcart', JSON.stringify(this.items));
      this.updateBadge();
    },

    addItem: function (product) {
      var existing = this.items.find(function (i) { return i.id === product.id; });
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push(Object.assign({}, product, { quantity: 1 }));
      }
      this.save();
    },

    removeItem: function (id) {
      this.items = this.items.filter(function (i) { return i.id !== id; });
      this.save();
    },

    getTotal: function () {
      return this.items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    },

    getCount: function () {
      return this.items.reduce(function (s, i) { return s + i.quantity; }, 0);
    },

    updateBadge: function () {
      var badges = document.querySelectorAll('.cart-count');
      var count = this.getCount();
      badges.forEach(function (b) { b.textContent = count; });
    },

    clear: function () {
      this.items = [];
      this.save();
    }
  };

  // ---- GA4 Tracking ----
  window.GA4 = {
    track: function (eventName, params) {
      if (typeof gtag === 'function') {
        gtag('event', eventName, params);
      }
    },

    buildItem: function (p, index) {
      var obj = {
        item_id: String(p.id),
        item_name: p.name,
        item_brand: p.brand,
        item_category: categoryMap[p.category] || p.category,
        price: p.price
      };
      if (typeof index === 'number') obj.index = index;
      if (p.quantity) obj.quantity = p.quantity;
      return obj;
    },

    viewItemList: function (items, listId, listName) {
      this.track('view_item_list', {
        item_list_id: listId,
        item_list_name: listName,
        items: items.map(function (item, i) { return GA4.buildItem(item, i + 1); })
      });
    },

    selectItem: function (item, listId, listName) {
      this.track('select_item', {
        item_list_id: listId,
        item_list_name: listName,
        items: [this.buildItem(item)]
      });
    },

    viewItem: function (item) {
      this.track('view_item', {
        currency: 'USD',
        value: item.price,
        items: [this.buildItem(item)]
      });
    },

    addToCart: function (item) {
      this.track('add_to_cart', {
        currency: 'USD',
        value: item.price,
        items: [this.buildItem(Object.assign({}, item, { quantity: 1 }))]
      });
    },

    beginCheckout: function (items, totalValue) {
      this.track('begin_checkout', {
        currency: 'USD',
        value: totalValue,
        items: items.map(function (item) { return GA4.buildItem(item); })
      });
    },

    purchase: function (items, totalValue, transactionId) {
      this.track('purchase', {
        transaction_id: transactionId,
        currency: 'USD',
        value: totalValue,
        items: items.map(function (item) { return GA4.buildItem(item); })
      });
    },

    search: function (searchTerm) {
      this.track('search', { search_term: searchTerm });
    },

    filterApplied: function (filterType, filterValue) {
      this.track('filter_applied', { filter_type: filterType, filter_value: filterValue });
    },

    sortApplied: function (sortType) {
      this.track('sort_applied', { sort_type: sortType });
    }
  };

  // Init cart on load
  GeekCart.init();
})();
