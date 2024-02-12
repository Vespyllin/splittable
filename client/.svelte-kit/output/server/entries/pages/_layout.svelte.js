import { c as create_ssr_component, a as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import { c as cn } from "../../chunks/utils.js";
import { d as derived, w as writable } from "../../chunks/index.js";
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${add_attribute("class", cn("inset-x-0 mx-auto mt-auto h-fit max-w-[95%]", className), 0)}><footer class="justify-evenly text-center text-[0.7rem] text-sm text-muted-foreground" data-svelte-h="svelte-r9jeqw">Għal Kyle għax kien qed jitnejjikli bid-degree.</footer></div>`;
});
let timeoutAction;
let timeoutEnable;
function withoutTransition(action) {
  if (typeof document === "undefined")
    return;
  clearTimeout(timeoutAction);
  clearTimeout(timeoutEnable);
  const style = document.createElement("style");
  const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
  style.appendChild(css);
  const disable = () => document.head.appendChild(style);
  const enable = () => document.head.removeChild(style);
  if (typeof window.getComputedStyle !== "undefined") {
    disable();
    action();
    window.getComputedStyle(style).opacity;
    enable();
    return;
  }
  if (typeof window.requestAnimationFrame !== "undefined") {
    disable();
    action();
    window.requestAnimationFrame(enable);
    return;
  }
  disable();
  timeoutAction = window.setTimeout(() => {
    action();
    timeoutEnable = window.setTimeout(enable, 120);
  }, 120);
}
const noopStorage = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: (_key) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem: (_key, _value) => {
  }
};
const isBrowser = typeof document !== "undefined";
const localStorageKey = "mode";
const userPrefersMode = createUserPrefersMode();
const systemPrefersMode = createSystemMode();
createDerivedMode();
function createUserPrefersMode() {
  const defaultValue = "system";
  const storage = isBrowser ? localStorage : noopStorage;
  let value = storage.getItem(localStorageKey) || defaultValue;
  const { subscribe, set: _set } = writable(value, () => {
    if (isBrowser) {
      const handler = (e) => {
        if (e.key === localStorageKey) {
          _set(value = e.newValue || defaultValue);
        }
      };
      addEventListener("storage", handler);
      return () => removeEventListener("storage", handler);
    }
  });
  function set(v) {
    _set(value = v);
    storage.setItem(localStorageKey, value);
  }
  return {
    subscribe,
    set
  };
}
function createSystemMode() {
  const defaultValue = void 0;
  let track = true;
  const { subscribe, set } = writable(defaultValue, () => {
    if (isBrowser) {
      const handler = (e) => {
        if (track) {
          set(e.matches ? "light" : "dark");
        }
      };
      const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
      mediaQueryState.addEventListener("change", handler);
      return () => mediaQueryState.removeEventListener("change", handler);
    }
  });
  function query() {
    if (isBrowser) {
      const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
      set(mediaQueryState.matches ? "light" : "dark");
    }
  }
  function tracking(active) {
    track = active;
  }
  return {
    subscribe,
    query,
    tracking
  };
}
function createDerivedMode() {
  const { subscribe } = derived([userPrefersMode, systemPrefersMode], ([$userPrefersMode, $systemPrefersMode]) => {
    if (!isBrowser)
      return void 0;
    const derivedMode = $userPrefersMode === "system" ? $systemPrefersMode : $userPrefersMode;
    withoutTransition(() => {
      const htmlEl = document.documentElement;
      if (derivedMode === "light") {
        htmlEl.classList.remove("dark");
        htmlEl.style.colorScheme = "light";
      } else {
        htmlEl.classList.add("dark");
        htmlEl.style.colorScheme = "dark";
      }
    });
    return derivedMode;
  });
  return {
    subscribe
  };
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-18kgolj_START -->${$$result.title = `<title>Splittable</title>`, ""}<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><!-- HEAD_svelte-18kgolj_END -->`, ""} <main class="flex h-screen max-h-svh flex-col overflow-hidden p-8 pb-2">${slots.default ? slots.default({}) : ``} ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Layout as default
};
