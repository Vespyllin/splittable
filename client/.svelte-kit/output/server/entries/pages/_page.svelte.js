import { c as create_ssr_component, a as add_attribute, v as validate_component, e as escape } from "../../chunks/ssr.js";
import { S as Separator, B as Button } from "../../chunks/client.js";
import { c as cn } from "../../chunks/utils.js";
import { L as LobbyInput } from "../../chunks/lobbyInput.js";
const SplashHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${add_attribute("class", cn("flex items-center", className), 0)}><img src="./bill.png" alt="" class="left-0 h-32 invert"> <div class="flex-col space-y-2" data-svelte-h="svelte-18373bb"><h1 class="ml-5 mt-auto w-[11rem] text-center text-4xl font-bold text-primary">Splittable</h1> <h2 class="ml-5 mt-auto w-[11rem] text-center text-2xl">Made with Love and Spite</h2></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isFetching = false;
  let username = void 0;
  let lobbyName = void 0;
  let error = { code: "Valid" };
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex h-full w-full flex-col">${validate_component(SplashHeader, "SplashHeader").$$render($$result, { class: "h-[20%] w-full justify-center" }, {}, {})} ${validate_component(Separator, "Separator").$$render($$result, { class: "my-5" }, {}, {})} <div class="my-2 flex w-full flex-col items-center justify-center"><div class="flex flex-col space-y-2 text-center" data-svelte-h="svelte-gko4oh"><h1 class="text-3xl font-semibold tracking-tight">Join a Lobby</h1> <p class="text-lg text-muted-foreground">Join an existing lobby and get splitting 🪓</p></div> <div class="mt-1 flex w-full flex-col">${validate_component(LobbyInput, "LobbyInput").$$render(
      $$result,
      {
        class: "flex w-full flex-col space-y-2",
        error: error.code,
        username,
        lobbyName
      },
      {
        error: ($$value) => {
          error.code = $$value;
          $$settled = false;
        },
        username: ($$value) => {
          username = $$value;
          $$settled = false;
        },
        lobbyName: ($$value) => {
          lobbyName = $$value;
          $$settled = false;
        }
      },
      {}
    )} <p${add_attribute("class", cn("mt-1 text-center text-sm text-red-600", !error.message && "hidden"), 0)}>${escape(error.message)}</p> ${validate_component(Button, "Button").$$render(
      $$result,
      {
        class: "mx-auto mt-2 h-10 w-[97.5%] text-lg",
        disabled: isFetching
      },
      {},
      {
        default: () => {
          return `Join Lobby`;
        }
      }
    )}</div></div> <h1 class="mx-auto mb-1 text-2xl tracking-tight" data-svelte-h="svelte-1xbbttm">Or</h1> <div class="text-center"><a href="/create">${validate_component(Button, "Button").$$render(
      $$result,
      {
        disabled: isFetching,
        class: "mx-auto mt-1 h-10 w-[97.5%] text-lg"
      },
      {},
      {
        default: () => {
          return `Create Your Own Lobby`;
        }
      }
    )}</a></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
