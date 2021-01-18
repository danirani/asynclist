import fetch from 'node-fetch';

export const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const asyncTimeout = (delay) => (
  new Promise(
    (resolve) => { setTimeout(() => resolve(delay), delay); },
  )
).then((d) => `Waited ${d} seconds`);

const asyncFetch = (url) => fetch(url)
  .then((response) => (response.text()))
  .then((text) => `Fetched ${url}, and got back ${text}`);

function runTask(spec) {
  return (spec.task === 'wait')
    ? asyncTimeout(spec.duration)
    : asyncFetch(spec.url);
}

const asyncThingsToDo = [
  { task: 'wait', duration: 1000 },
  { task: 'fetch', url: 'https://httpstat.us/200' },
  { task: 'wait', duration: 4000 },
  { task: 'fetch', url: 'https://urlecho.appspot.com/echo?body=Awesome!' },
];

const runInParallel = async () => {
  const tasks = asyncThingsToDo.map(runTask); // Run all our tasks in parallel.
  const results = await Promise.all(tasks); // Gather up the results.
  results.forEach((x) => console.log(x)); // Print them out on the console.
  console.log('-- parallel end -- ');
};

const runInSequence = async () => {
  const starterPromise = Promise.resolve(null);
  const log = (result) => console.log(result);

  await asyncThingsToDo.reduce(
    (p, spec) => p.then(() => runTask(spec).then(log)),
    starterPromise,
  );

  console.log('-- sequence end -- ');
};

// https://jrsinclair.com/articles/2019/how-to-run-async-js-in-parallel-or-sequential/
runInSequence();
runInParallel();
