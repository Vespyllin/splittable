import { c as create_ssr_component, b as compute_rest_props, d as subscribe, f as spread, g as escape_object, a as add_attribute, v as validate_component, e as escape, h as each } from "../../../chunks/ssr.js";
import { b as builder, a as addMeltEventListener, c as createBitAttrs, B as Button, S as Separator } from "../../../chunks/client.js";
import "dequal";
import { c as createDispatcher, H as Header, P as Plus } from "../../../chunks/Plus.js";
import { c as cn } from "../../../chunks/utils.js";
import { I as Input, L as LobbyInput } from "../../../chunks/lobbyInput.js";
function createLabel() {
  const root = builder("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
function getLabelData() {
  const NAME = "label";
  const PARTS = ["root"];
  const getAttrs = createBitAttrs(NAME, PARTS);
  return {
    NAME,
    getAttrs
  };
}
const Label$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder2;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root } } = createLabel();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  createDispatcher();
  const { getAttrs } = getLabelData();
  const attrs = getAttrs("root");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  builder2 = $root;
  {
    Object.assign(builder2, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder: builder2 }) : ``}` : `<label${spread([escape_object(builder2), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder: builder2 }) : ``}</label>`}`;
});
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Label$1, "LabelPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const ItemInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  let { item = {
    name: "",
    total: "",
    quantity: "",
    price: ""
  } } = $$props;
  let { name, total, quantity, price } = item;
  let { onSubmit: submitCallback } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  if ($$props.onSubmit === void 0 && $$bindings.onSubmit && submitCallback !== void 0)
    $$bindings.onSubmit(submitCallback);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    item = { name, total, quantity, price };
    $$rendered = `<div${add_attribute("class", cn("grid grid-cols-6 gap-2", className), 0)}>${validate_component(Input, "Input").$$render(
      $$result,
      {
        class: "col-span-5 text-lg",
        placeholder: "Item Name",
        value: name
      },
      {
        value: ($$value) => {
          name = $$value;
          $$settled = false;
        }
      },
      {}
    )}  ${validate_component(Button, "Button").$$render($$result, { type: "reset" }, {}, {
      default: () => {
        return `-`;
      }
    })} <div class="col-span-2">${validate_component(Input, "Input").$$render(
      $$result,
      {
        placeholder: "Quantity",
        type: "number",
        class: "text-lg",
        value: quantity
      },
      {
        value: ($$value) => {
          quantity = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="col-span-2">${validate_component(Input, "Input").$$render(
      $$result,
      {
        placeholder: "Price",
        type: "number",
        class: "text-lg",
        value: price
      },
      {
        value: ($$value) => {
          price = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="col-span-2">${validate_component(Input, "Input").$$render(
      $$result,
      {
        placeholder: "Total",
        type: "number",
        class: "text-lg",
        value: total
      },
      {
        value: ($$value) => {
          total = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let error = { code: "Valid" };
  let username = void 0;
  let lobbyName = void 0;
  let data = [];
  let addDisabled = false;
  let createDisabled = true;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (data.length != 0) {
        const { name, total, quantity, price } = data[0];
        addDisabled = !name || !total || !quantity || !price;
      } else {
        addDisabled = false;
      }
    }
    createDisabled = data.length == 0 || addDisabled || !username || !lobbyName;
    $$rendered = `<div class="flex w-full grow flex-col">${validate_component(Header, "MinimalHeader").$$render($$result, {}, {}, {})} ${validate_component(Separator, "Separator").$$render($$result, { class: "my-3" }, {}, {})} <div class="mb-4 flex w-full flex-col items-center gap-y-2"><div class="flex flex-col space-y-2 text-center" data-svelte-h="svelte-176ozjb"><h1 class="text-2xl font-semibold tracking-tight">Create a Lobby</h1></div> <div class="w-full">${validate_component(LobbyInput, "LobbyInput").$$render(
      $$result,
      {
        class: "w-full",
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
    )} <p${add_attribute("class", cn("text-center text-sm text-red-600", !error.message && "hidden"), 0)}>${escape(error.message)}</p></div> <div class="mt-2 flex w-full items-center">${validate_component(Label, "Label").$$render($$result, { class: "align-text-bottom text-2xl" }, {}, {
      default: () => {
        return `Receipt Items`;
      }
    })} ${validate_component(Button, "Button").$$render(
      $$result,
      {
        disabled: addDisabled,
        class: "ml-auto h-8 w-12"
      },
      {},
      {
        default: () => {
          return `${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}`;
        }
      }
    )}</div> <div class="h-full w-full">${data.length == 0 ? `<div class="flex items-center px-16 py-2 text-muted-foreground" data-svelte-h="svelte-ao2zho"><h1 class="text-lg">🤔 You can&#39;t split a bill with no items...</h1></div>` : ``} ${each(data, (term, idx) => {
      return `${idx != 0 ? `${validate_component(Separator, "Separator").$$render($$result, { class: "mx-auto my-2 w-[75%]" }, {}, {})}` : ``} ${validate_component(ItemInput, "ReceiptItemInput").$$render(
        $$result,
        {
          onSubmit: () => data = data.toSpliced(idx, 1),
          item: term
        },
        {
          item: ($$value) => {
            term = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })}</div></div> ${validate_component(Button, "Button").$$render(
      $$result,
      {
        class: "mx-auto mb-2 mt-auto h-12 w-full text-lg",
        disabled: createDisabled
      },
      {},
      {
        default: () => {
          return `Create Lobby`;
        }
      }
    )}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
