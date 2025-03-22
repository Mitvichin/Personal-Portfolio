export const sendMessage = (data: { [k: string]: FormDataEntryValue }) => {
  return fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((data) => console.log(data));
};
