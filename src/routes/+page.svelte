<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";

  // This is the page data that is fetched from the API
  export let data: PageData;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
    <h2 class="h2">Welcome to Wine Tracker!</h2>
    <!-- Animated Logo -->
    <figure>
      <div class="img-bg"></div>
      <img
        src="/WintryWineCellar.png"
        alt="Wintry Wine Cellar"
        class="logo-img"
      />
    </figure>
  </div>
</div>

<style lang="postcss">
  figure {
    @apply flex relative items-center flex-col;
    position: relative; /* Ensure this is here to act as a reference for absolute positioning */
  }

  .img-bg {
    @apply z-[-1] rounded-full blur-[50px] transition-all;
    position: absolute; /* Position it absolutely within the figure */
    top: 50%; /* Center the glow */
    left: 50%; /* Center the glow */
    transform: translate(-50%, -50%); /* Center the glow */
    width: 80%; /* Make the glow larger than the image */
    height: 80%; /* Make the glow larger than the image */
    animation:
      pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
      glow 5s linear infinite;
  }

  .logo-img {
    @apply relative z-10; /* Ensure the image is above the glow */
    max-width: 80%; /* Makes the image responsive */
    height: auto; /* Maintains the aspect ratio */
  }

  @keyframes glow {
    0% {
      @apply bg-primary-400/50;
    }
    33% {
      @apply bg-secondary-400/50;
    }
    66% {
      @apply bg-tertiary-400/50;
    }
    100% {
      @apply bg-primary-400/50;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1); /* Original size */
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5); /* Scaled up */
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .img-bg {
      animation: none;
    }
  }
</style>
