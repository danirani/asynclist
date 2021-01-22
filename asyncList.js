export const asyncList = () => {
  const procList = [];
  const showLog = true;
  const dataStore = {};

  const add = (funcToCall, dataObject) => {
    procList.push({ execFunction: funcToCall, execData: dataObject });
  };

  const store = (newDataObject) => {
    Object.assign(dataStore, newDataObject);
  };

  const run = async () => {
    const log = (result) => {
      if (showLog) {
        console.log('=>', result);
      }
    };

    await procList.reduce(
      (activePromise, process) => activePromise.then(
        () => process.execFunction(process.execData).then(log),
      ),
      Promise.resolve(null),
    );
  };

  return {
    fetchStore: dataStore,
    store,
    add,
    run,

  };
};
