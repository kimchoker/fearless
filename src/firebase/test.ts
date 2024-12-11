import { ref, set } from "firebase/database";
import database from "./firebase";

const testWrite = async () => {
  const testRef = ref(database, "test/path");
  await set(testRef, { hello: "world" });
  console.log("Data written successfully!");
};

testWrite();
