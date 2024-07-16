export async function sendNotification(
  token: string,
  options: {
    title: string;
    body: string;
    data?: Record<string, string>;
  },
) {
  const message = {
    to: token,
    sound: "default",
    ...options,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
