"use server";

export function sendFormData(formData: FormData) {
  // Extract form data
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();

  return fetch("/api/send-form", {
    method: "POST",
    body: formData,
  });
}
