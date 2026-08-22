import fetch from 'node-fetch';
import FormData from 'form-data';

async function test() {
  try {
    const formData = new FormData();
    formData.append('title', 'test');
    formData.append('description', 'test desc');

    const res = await fetch('http://localhost:3000/hcgi/platform/api/collections/explore_dehu/records', {
      method: 'POST',
      body: formData,
      headers: {
        // Need to pass auth token. Assuming local pocketbase is running on :8090, but here it's proxied?
        // Wait, pocketbase might be running on a different port internally. Let's just create an invalid request to see what the server responds with.
      }
    });
    const json = await res.json();
    console.log("Response:", json);
  } catch(e) {
    console.error("Fetch failed:", e);
  }
}
test();
        