<script lang="ts">
    import LobbyForm from "$lib/components/LobbyForm/lobbyform.svelte";
    import LoveSpiteHeader from "$lib/components/LoveSpiteHeader/lovespiteheader.svelte";
    import Button from "$lib/components/ui/button/button.svelte"
</script>

<div class="h-screen w-screen flex flex-col p-8">
    <LoveSpiteHeader />

    <LobbyForm />

    <div class="flex-col space-y-2 text-center my-2">
        <h1 class="text-xl font-semibold tracking-tight">Or</h1>
    </div>
    <Button class="w-full">
        Create Your Own Lobby
    </Button> 

    <div class="absolute h-[1rem] inset-x-0 bottom-3 mx-auto w-[300px]">
        <footer class="text-sm text-[0.7rem] text-muted-foreground text-center">Għal Kyle għax kien qed jitnejjikli bid-degree.</footer>
    </div>
</div>