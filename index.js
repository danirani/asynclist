import fetch from 'node-fetch';
import { asyncList } from './asyncList.js';

export const sleep = (data) => new Promise((completed) => {
  const endOfTimeOut = () => {
    completed(`sleep ${data.timeOut} completed`);
  };

  setTimeout(endOfTimeOut, data.timeOut);
});

const webFetch = (data) => new Promise((completed) => {
  fetch(data.webSite)
    .then((response) => (response.text()))
    .then((text) => `${data.webSite} ${text}`)
    .then(completed)
    .catch((error) => {
      console.log('error message', error);
      completed();
    });
});

const a = asyncList();
const db = 'mysql 7.22';
const secret = { key: 2323, pass: 'myPass' };
const array = { rows: ['one', 'two', 'three'] };
a.store({ database: db });
a.store(secret);
a.store(array);

console.log(a.fetchStore);

a.add(sleep, { timeOut: 3000 });
a.add(webFetch, { webSite: 'https://httpstat.us/200', database: db });
a.add(sleep, { timeOut: 2000 });
a.add(sleep, { timeOut: 1000 });
a.add(webFetch, { webSite: 'https://urlecho.appspot.com/echo?body=Awesome!' });
a.run();
