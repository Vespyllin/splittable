import { c as create_ssr_component, b as compute_rest_props, f as spread, i as escape_attribute_value, g as escape_object, a as add_attribute, v as validate_component } from "./ssr.js";
import { c as cn } from "./utils.js";
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<input${spread(
    [
      {
        class: escape_attribute_value(cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}>`;
});
const LobbyInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  let { error } = $$props;
  let { username = "" } = $$props;
  let { lobbyName = "" } = $$props;
  let { isLoading = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.lobbyName === void 0 && $$bindings.lobbyName && lobbyName !== void 0)
    $$bindings.lobbyName(lobbyName);
  if ($$props.isLoading === void 0 && $$bindings.isLoading && isLoading !== void 0)
    $$bindings.isLoading(isLoading);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div${add_attribute("class", cn("flex flex-col space-y-2", className), 0)}>${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "username",
        placeholder: "nickname",
        type: "text",
        autocapitalize: "none",
        autocorrect: "off",
        disabled: isLoading,
        class: cn("h-auto text-lg", error === "Username" && "border-red-600"),
        value: username
      },
      {
        value: ($$value) => {
          username = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "lobby",
        placeholder: "lobby name",
        type: "text",
        autocapitalize: "none",
        autocorrect: "off",
        disabled: isLoading,
        class: cn("h-auto text-lg", error === "Lobby" && "border-red-600"),
        value: lobbyName
      },
      {
        value: ($$value) => {
          lobbyName = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Input as I,
  LobbyInput as L
};
