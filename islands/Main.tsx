/** @jsx h */
import { h, useEffect, useState } from "$fresh/runtime.ts";

function Input(
  {
    value,
    setValue,
  }: {
    value: string;
    setValue: (value: string) => void;
  },
) {
  return (
    <div>
      <p style={{ padding: 10 }}>Enter a url to monitor:</p>
      <input
        placeholder="https://github.com"
        value={value}
        onChange={(e) => setValue((e.target! as HTMLInputElement).value)}
      />
    </div>
  );
}

function Urls(
  {
    id,
    urls,
    setUrls,
  }: {
    id: number;
    urls: string[];
    setUrls: (urls: string[]) => void;
  },
) {
  const [urlsState, setUrlsState] = useState<Map<string, "up" | "down">>(
    new Map(),
  );
  useEffect(() => {
    if (id !== 0) {
      fetch(`/api/pinger?id=${id}`).then((res) => res.json()).then(
        (data) => {
          setUrlsState(new Map(Object.entries(data)));
        },
      );
    }
  });

  return (
    <div>
      <ul>
        {urls.map((url, i) => (
          <li key={i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <a style={{ padding: 10 }} href={url}>{url}</a>
              <p
                style={{
                  padding: 10,
                  color: urlsState.get(url) === "up" ? "green" : "red",
                }}
              >
                {urlsState.get(url)}
              </p>
              <button onClick={() => setUrls(urls.filter((_, j) => j !== i))}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddButton(
  {
    newUrl,
    urls,
    setUrls,
  }: {
    newUrl: string;
    urls: string[];
    setUrls: (urls: string[]) => void;
  },
) {
  const addUrl = () => {
    setUrls([...urls, newUrl]);
  };
  return (
    <div>
      <button
        onClick={addUrl}
      >
        Add
      </button>
    </div>
  );
}

export default function Main() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    const maybeId: number = JSON.parse(localStorage.getItem("id") || "0");
    if (maybeId != 0) {
      setId(maybeId);
      localStorage.setItem("id", maybeId.toString());
    } else {
      fetch("/api/genId").then((res) => res.text()).then(parseInt).then(
        (newId) => {
          setId(newId);
          localStorage.setItem("id", newId.toString());
        },
      );
    }
  }, []);
  useEffect(() => {
    setUrls(JSON.parse(localStorage.getItem("urls") || "[]"));
  }, []);
  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls));
  }, [urls]);
  useEffect(() => {
    if (urls.length === 0) {
      return;
    }
    fetch("/api/pinger", {
      method: "POST",
      body: JSON.stringify({
        id,
        urls,
      }),
    });
  }, [urls]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Input value={url} setValue={setUrl} />
      <AddButton newUrl={url} urls={urls} setUrls={setUrls} />
      <Urls id={id} urls={urls} setUrls={setUrls} />
    </div>
  );
}
