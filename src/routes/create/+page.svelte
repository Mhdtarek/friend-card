<script>
  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { getFirestore, collection, addDoc } from "firebase/firestore";
  import {firebaseConfig} from "$lib/config"

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);

  let message = "";
  let recipient = "";
  let imageFile = null;

  function handleImageUpload(event) {
    imageFile = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!imageFile || !message || !recipient) {
      alert("Please fill in all fields.");
      return;
    }

    const storageRef = ref(storage, imageFile.name);
    await uploadBytes(storageRef, imageFile);

    const downloadURL = await getDownloadURL(storageRef);

    const cardsCollection = collection(db, "cards");
    const newCard = {
      message,
      recipient,
      imageUrl: downloadURL,
      createdAt: new Date()
    };

    await addDoc(cardsCollection, newCard);

    // Reset form fields
    message = "";
    recipient = "";
    imageFile = null;
  }
</script>

<div>
  <h2>Upload an Image and Message</h2>
  <form on:submit={handleSubmit}>
    <label for="image">Select Image:</label>
    <input type="file" id="image" accept="image/*" on:change={handleImageUpload} />
    <label for="message">Message:</label>
    <textarea id="message" bind:value={message}></textarea>
    <label for="recipient">Recipient:</label>
    <input type="text" id="recipient" bind:value={recipient} />
    <button type="submit">Upload</button>
  </form>
</div>
