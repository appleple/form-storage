# form-storage

Just a simple form storage

```sh
npm install form-storage --save
```

```js
const formStorage = new FormStorage('.js-form', {
  name: 'form-basic',
  ignores: [
  '[type="hidden"]',
  '[name="policy"]'
  ]
});
// apply storaged data to the form.
formStorage.apply();
// save the form data to the storage.
formStorage.save();
```

When you just want to remember 'user-name' and 'user-mail'
```js
const formStorage = new FormStorage('.js-form', {
  name: 'form-basic',
  includes: [
  '[name="user-name"]',
  '[name="user-email"]'
  ]
});
```