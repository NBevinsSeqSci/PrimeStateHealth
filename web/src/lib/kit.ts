type KitSubscribePayload = {
  email: string;
  firstName?: string;
};

export const subscribeToKit = async ({
  email,
  firstName,
}: KitSubscribePayload) => {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return { skipped: true };
  }

  const response = await fetch(
    `https://api.kit.com/v4/forms/${formId}/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Kit subscribe failed");
  }

  return { subscribed: true };
};
