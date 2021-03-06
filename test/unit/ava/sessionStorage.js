import test from 'ava';
import './helpers/setupBrowserEnv'
import Ls from '../../../src/index';
import Vue from 'vue';

const namespace = 'test__';

Vue.use(Ls, {
  namespace: namespace,
  storage: 'session',
  name: 'session'
});

test.beforeEach(() => {
  window.sessionStorage.clear();
});

test('Set item', (t) => {
  Vue.session.set('set_item_test', 'val');

  t.is(JSON.parse(window.sessionStorage.getItem(`${namespace}set_item_test`)).value, 'val');
});

test('Get key by index', (t) => {
  Vue.session.set('key_item_one_test', 'val_one');
  Vue.session.set('key_item_two_test', 'val_two');

  t.is(Vue.session.key(1), `${namespace}key_item_two_test`);
});

test('Get item', (t) => {
  window.sessionStorage.setItem(`${namespace}get_item_test`, JSON.stringify({value: 'val', expire: null}));

  t.is(Vue.session.get('get_item_test'), 'val');
});

test('Get item try', (t) => {
  window.sessionStorage.setItem(`${namespace}get_item_test`, ';');

  t.is(Vue.session.get('get_item_test', 1), 1);
});

test('Get default value', (t) => {
  t.is(Vue.session.get('undefined_item_test', 10), 10);
});

test('Expired item', (t) => {
  Vue.session.set('expired_item_test', 'val', -1);

  t.is(Vue.session.get('expired_item_test'), null);
});

test('Not expired item', (t) => {
  Vue.session.set('expired_item_test', 'val', 1);

  t.is(Vue.session.get('expired_item_test'), 'val');
});

test('Remove item', (t) => {
  window.sessionStorage.setItem(`${namespace}remove_item_test`, JSON.stringify({value: 'val', expire: null}));
  Vue.session.remove('remove_item_test');

  t.is(window.sessionStorage.getItem(`${namespace}remove_item_test`), null);
});

test('Clear', (t) => {
  Vue.session.set('item_test', 'val');
  Vue.session.clear();

  t.is(Vue.session.get('item_test'), null);
});

test('Empty clear', (t) => {
  Vue.session.clear();
  t.is(Vue.session.length, 0);
});

test('Clear namespace', (t) => {
  t.plan(2);

  Vue.session.set('item_test', 'val');
  window.sessionStorage.setItem('item_test', JSON.stringify({value: 'val', expire: null}));

  Vue.session.clear();

  t.is(Vue.session.get('item_test'), null);
  t.is(JSON.parse(window.sessionStorage.getItem(`item_test`)).value, 'val');
});

test('Get length', (t) => {
  Vue.session.set('item_one_test', 'val');
  Vue.session.set('item_two_test', 'val');

  t.is(Vue.session.length, 2);
});

test('Serialized data', (t) => {
  t.plan(5);

  Vue.session.set('item_object', {foo: 'boo'});
  Vue.session.set('item_array', [2, 3, 4, 5]);
  Vue.session.set('item_number', 6);
  Vue.session.set('item_string', '7');
  Vue.session.set('item_boolean', false);

  t.deepEqual(Vue.session.get('item_object'), {foo: 'boo'});
  t.deepEqual(Vue.session.get('item_array'), [2, 3, 4, 5]);
  t.is(Vue.session.get('item_number'), 6);
  t.is(Vue.session.get('item_string'), '7');
  t.is(Vue.session.get('item_boolean'), false);
});

test('Plugin context', (t) => {
  new Vue({
    created () {
      this.$session.set('item_test', 'val');

      t.is(this.$session.get('item_test'), 'val');
    }
  });
});
