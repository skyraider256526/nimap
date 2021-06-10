const fetcher = (url: string) =>
  fetch(`${process.env.API_URL || "http://localhost:8080"}${url}`).then(r =>
    r.json()
  );

export default fetcher;
