export const sendMessage = (body: { [k: string]: FormDataEntryValue }) => {
  return new Promise((res, rej) => {
    fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (!response.ok) {
          rej(await response.json());
        }

        res(await response.json());
      })
      .catch(() => {
        throw new Error("Sending your message failed! Please try again later!");
      });
  });
};
