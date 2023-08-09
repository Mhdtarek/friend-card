<script>
  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { getFirestore, collection, addDoc } from "firebase/firestore";
  import {firebaseConfig} from "$lib/config"

  let created = false
  let uploading = false
  let url = ""

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
    uploading = true

    let doc = await addDoc(cardsCollection, newCard);

    // Reset form fields
    message = "";
    recipient = "";
    imageFile = null;

    uploading = false
    created = true

    console.log(doc.id)

    let docID = doc.id

    console.log(docID)

    url = document.location.origin + "/card/" + docID

    console.log(url)
  }
  export function shareOrCopyURL(url) {
  // Check if the Web Share API is supported by the browser
  if (navigator.share) {
    navigator.share({
      title: 'Check out this link',
      url: url,
    })
    .then(() => {
      alert('URL shared successfully');
    })
    .catch((error) => {
      console.error('Error sharing URL:', error);
      // If sharing fails, copy the URL to clipboard
      copyToClipboard(url);
    });
  } else {
    // If Web Share API is not supported, copy the URL to clipboard
    copyToClipboard(url);
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('URL copied to clipboard');
}
</script>

<div class="container">
  {#if !created}
  <h2>Create a card for your loved one:</h2>
  <form on:submit={handleSubmit} >
    <label for="image">Select Image:</label>
    <input type="file" id="image" accept="image/*" on:change={handleImageUpload} />
    <label for="message">Message:</label>
    <textarea id="message" bind:value={message}></textarea>
    <label for="recipient">Recipient:</label>
    <input type="text" id="recipient" bind:value={recipient} />
    <button type="submit" aria-busy={uploading}>Create</button>
  </form>
  {/if}
  {#if created}
    <h1>Success! Created!</h1>
    <button on:click={() => shareOrCopyURL(url)}>Share</button>
  {/if}
</div>
