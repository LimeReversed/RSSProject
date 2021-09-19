import {RssList} from "../services/rssService";

test("Initializes rssList, RssList, Contains the right rssSources", () => {
    let source = "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/";
    let sourceList = [source];
    let rssList = new RssList(sourceList);
    // console.log("I'm in test");
    // console.log(rssList.rssObjects);
    expect(rssList.rssObjects.length).toBeGreaterThan(0);
  });