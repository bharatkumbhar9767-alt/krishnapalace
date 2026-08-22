import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090'); // Does not need to be a real server for local SDK errors!

async function test() {
  try {
    await pb.collection('rooms').getOne('');
  } catch (e) {
    console.log("Empty ID:", e.message);
  }

  try {
    await pb.collection('rooms').getOne(undefined);
  } catch (e) {
    console.log("Undefined ID:", e.message);
  }
  
  try {
    await pb.collection('rooms').getOne(null);
  } catch (e) {
    console.log("Null ID:", e.message);
  }
}

test();
