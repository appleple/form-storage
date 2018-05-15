# form-storage

A JavaScript library stores the form-data to the localstorage and restore them.

<img src="./docs/screenshot.png" />

```sh
npm install form-storage --save
```

```js
const formStorage = new FormStorage('.js-form', {
  name: 'form-basic', // you can decide local-storage name 
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

When you just want to remember 'user-name' and 'user-email'
```js
const formStorage = new FormStorage('.js-form', {
  name: 'form-basic',
  includes: [
  '[name="user-name"]',
  '[name="user-email"]'
  ]
});
```