<script>
  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";
  import { getFirestore, doc, getDoc } from "firebase/firestore";
  import {firebaseConfig} from "$lib/config"

  export let data;

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);

  let cardData = {};
  let fetchError = null;

  // Fetch card data from Firestore
  async function fetchCardData() {
    try {
      const cardDocRef = doc(db, "cards", data.slug); // Replace with actual document ID
      const cardDocSnap = await getDoc(cardDocRef);
      if (cardDocSnap.exists()) {
        cardData = cardDocSnap.data();
      } else {
        fetchError = "Card data not found.";
      }
    } catch (error) {
      fetchError = "Error fetching card data.";
      console.error(error);
    }
  }

  onMount(() => {
    fetchCardData();
  });
</script>

<style>
  main {
  display: flex;
  align-items: center;
  justify-content: center;
  height:100vh;
  background-color: #073b4c;
}

.birthdayCard {
  position: relative;
  width: 250px;
  height:350px;
  cursor: pointer;
  transform-style: preserve-3d;
	transform: perspective(2500px);
  transition: 1s;
}

.birthdayCard:hover {
	transform: perspective(2500px) rotate(5deg);
	box-shadow: inset 100px 20px 100px rgba(0,0,0,.2), 0 10px 100px rgba(0,0,0,0.5);
}

.birthdayCard:hover .cardFront {
  transform: rotateY(-160deg); 
}

.birthdayCard:hover .happy {
  visibility:hidden; 
}

.cardFront {
  position: relative;
  background-color: #fff;
  width: 250px;
  height:350px;
  overflow: hidden;
  transform-origin: left;
  box-shadow: inset 100px 20px 100px rgba(0,0,0,.2), 30px 0 50px rgba(0,0,0,0.4);
  transition: .6s;
}

.happy {
  position: absolute;
margin-left: auto;
margin-right: auto;
left: 0;
right: 0;
text-align: center;  font-family: Tahoma, sans-serif;
  text-align: center;
  margin:30px; 
  background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  transition: .1s;
}


.cardInside {
  position: absolute;
  background-color: #fff;
  width: 250px;
  height:350px;
  z-index:-1;
  left:0;
  top:0;
  box-shadow: inset 100px 20px 100px rgba(0,0,0,0.2);
}

p {
  font-family: 'Brush Script MT', cursive;
  margin: 40px;
  color: #333;
}

.name {
  position: absolute;
  left: 20px;
  bottom:20px;
  width: 50%;
  color: #333;
  font-weight: italic;
  margin: 0;
}

.back {
  font-family: Tahoma, sans-serif;
  color: #333;
  text-align: center;
  margin:30px; 
  outline-color:#333;
  outline-style: dotted;
}
.cardImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

</style>

<main>
  <div class="birthdayCard">
    <div class="cardFront">
      <p class="happy">For {cardData.recipient}</p>
      <img src={cardData.imageUrl} alt="Card Front" class="cardImage" />
    </div>
    <div class="cardInside">
      {#if fetchError}
      <p>Error: {fetchError}</p>
      {:else}
      <p>Dear {cardData.recipient}</p>
      <p>{cardData.message}</p>

      <p class="name">Using <a href="/">app</a> by Mhdtarek</p>
      {/if}
    </div>
  </div>
</main>
