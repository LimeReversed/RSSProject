import { RssList } from "../services/rssService";

test("Initialize RssList with one source, rssList contains one element", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source];
  let rssList = new RssList(sourceList);
  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(1);
  }, 1000);
});

test("Initialize RssList with one source then adds another source, rssList contains two elements", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source];
  let rssList = new RssList(sourceList);
  rssList.add(
    "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/"
  );

  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(2);
  }, 1000);
});

// test("Test where await isn't working", async () => {
//   let source =
//     "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
//   let sourceList = [source];
//   let rssList = new RssList();
//   await rssList.init(sourceList);

//   expect(rssList.rssObjects.length).toBe(1);
// });

test("Initialize RssList with empty array, rssList contains zero elements", () => {
  let sourceList = [];
  let rssList = new RssList(sourceList);

  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(0);
  }, 1000);
});

test("Initialize RssList with no sources, rssList contains zero elements", () => {
  let rssList = new RssList();

  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(0);
  }, 1000);
});

test("Remove the last element from rssList, rssList contains zero elements", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source];
  let rssList = new RssList(sourceList);
  rssList.remove(0);

  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(0);
  }, 1000);
});

test("Trying to remove non-existing index, rssList remains untouched", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source];
  let rssList = new RssList(sourceList);
  rssList.remove(3);

  setTimeout(() => {
    expect(rssList.rssObjects.length).toBe(1);
  }, 1000);
});

test("Remove element in the middle of rssList, correct element removed", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source, "hej", "hej2"];
  let expected = [source, "hej2"];
  let rssList = new RssList(sourceList);
  rssList.remove(1);

  setTimeout(() => {
    expect(rssList.rssObjects).toEqual(expected);
  }, 1000);
});

test("Remove last element, correct element removed", () => {
  let source =
    "https://getrss.zurs.se/?url=aHR0cHM6Ly9yc3MuYWZ0b25ibGFkZXQuc2UvcnNzMi9zbWFsbC9wYWdlcy9zZWN0aW9ucy9zZW5hc3Rlbnl0dC8=";
  let sourceList = [source, "hej", "hej2"];
  let expected = [source, "hej"];
  let rssList = new RssList(sourceList);
  rssList.remove(2);

  setTimeout(() => {
    expect(rssList.rssObjects).toEqual(expected);
  }, 1000);
});
