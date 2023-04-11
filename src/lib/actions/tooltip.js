/*
This action triggers a custom tooltip component to appear when a given element is hovered. You supply
the component (and any number of props) as input parameters to the action. 

Usage:

<div
  use=tooltip={{
    component: MyTooltip,
    props: {
      title: 'My Custom Tooltip'
    }
  }}
> Hover me </div>

The action will handle the positioning of the tooltip using Popper.js. Set the popper 
options in here to change where and how the tooltip gets positioned. 

At minimum, the custom tooltip component MUST have the following features (note the id attribute of wrapper):

<script>
  export let x;
  export let y;
</script>

<div id="tooltip" style="top: {y}px; left: {x}px;">
TOOL TIP CONTENT
</div>

<style>
  .tooltip {
    position: absolute;
  }
</style>

*/

import { createPopper } from "@popperjs/core";

export function tooltip(element, params = {}) {
  let tooltipRef;
  let popperRef;
  let tooltipComponent = params.component;
  let tooltipProps = params.props;

  function generateGetBoundingClientRect(x = 0, y = 0) {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x
    });
  }

  const virtualElement = {
    getBoundingClientRect: generateGetBoundingClientRect()
  };

  function mouseOver(event) {
    tooltipRef = new tooltipComponent({
      props: {
        ...tooltipProps,
        x: event.pageX,
        y: event.pageY
      },
      target: document.body
    });

    let tooltip = document.querySelector("#tooltip");
    tooltip.setAttribute("data-show", "");

    popperRef = createPopper(virtualElement, tooltip, {
      placement: tooltipProps.placement || "top",
      strategy: "fixed",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8]
          }
        }
      ]
    });
  }

  function mouseMove(event) {
    let { clientX: x, clientY: y } = event;
    virtualElement.getBoundingClientRect = generateGetBoundingClientRect(x, y);
    popperRef.update();

    tooltipRef.$set({
      x: event.pageX,
      y: event.pageY
    });
  }

  function mouseLeave() {
    let tooltip = document.querySelector("#tooltip");
    tooltip.removeAttribute("data-show");

    if (popperRef) {
      popperRef.destroy();
      popperRef = null;
    }

    tooltipRef.$destroy();

    // HACKY FIX: remove old tooltips
    let tooltips = document.querySelectorAll(".tooltip-container");
    if (tooltips.length > 0) {
      for (var t of tooltips) {
        t.remove();
      }
    }
  }

  element.addEventListener("mouseover", mouseOver);
  element.addEventListener("mouseleave", mouseLeave);
  element.addEventListener("mousemove", mouseMove);

  return {
    update(params) {
      // will run any time any of the input params change. Make it reactive
      tooltipProps = params.props;

      // clear old event listeners
      element.removeEventListener("mouseover", mouseOver);
      element.removeEventListener("mouseleave", mouseLeave);
      element.removeEventListener("mousemove", mouseMove);

      // add updated ones
      element.addEventListener("mouseover", mouseOver);
      element.addEventListener("mouseleave", mouseLeave);
      element.addEventListener("mousemove", mouseMove);
    },

    destroy() {
      element.removeEventListener("mouseover", mouseOver);
      element.removeEventListener("mouseleave", mouseLeave);
      element.removeEventListener("mousemove", mouseMove);
    }
  };
}
