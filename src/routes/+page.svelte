<script lang="ts">
    import LobbyForm from "$lib/components/LobbyForm/lobbyform.svelte";
    import Button from "$lib/components/ui/button/button.svelte"
</script>

<div class="h-screen w-screen flex flex-col p-8">
    <div class="flex h-[25%] justify-center mt-5 mb-10">
        <img src="./bill.png" alt="" class="h-full invert left-0">
        <p class="text-4xl my-auto ml-5 w-[11rem]">Made with Love and Spite🧡</p>
    </div>

    <LobbyForm />

    <div class="flex-col space-y-2 text-center my-2">
        <h1 class="text-xl font-semibold tracking-tight">Or</h1>
    </div>

    <Button class="w-full">
        Create Your Own Lobby
    </Button> 

    <div class="absolute h-fit inset-x-0 bottom-2 mx-auto w-[300px]">
        <footer class="text-sm text-muted-foreground text-center">Għal Kyle għax kien qed jitnejjikli bid-degree.</footer>
    </div>
</div>