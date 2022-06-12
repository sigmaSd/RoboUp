/** @jsx h */
import { h, useEffect, useState } from "$fresh/runtime.ts";

function Input(
  {
    value = "",
    setValue,
  }: {
    value: string;
    setValue: (value: string) => void;
  },
) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue((e.target! as HTMLInputElement).value)}
      />
    </div>
  );
}

function Urls(
  {
    urls,
    setUrls,
  }: {
    urls: string[];
    setUrls: (urls: string[]) => void;
  },
) {
  return (
    <div>
      <ul>
        {urls.map((url, i) => (
          <li key={i}>
            <a style={{ "padding": 10 }} href={url}>{url}</a>
            <button onClick={() => setUrls(urls.filter((_, j) => j !== i))}>
              Delete
            </button>
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
  const [urls, setUrls] = useState<string[]>(
    JSON.parse(localStorage.getItem("urls") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls));
  }, [urls]);
  useEffect(() => {
    if (urls.length === 0) {
      return;
    }
    fetch("/api/pinger", {
      method: "POST",
      body: JSON.stringify(urls),
    });
  }, [urls]);

  return (
    <div>
      <Input value={url} setValue={setUrl} />
      <AddButton newUrl={url} urls={urls} setUrls={setUrls} />
      <Urls urls={urls} setUrls={setUrls} />
    </div>
  );
}
