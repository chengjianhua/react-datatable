
function range(len, start) {
  let end = 0;
  const out = [];

  if (start === undefined) {
    start = 0;
    end = len;
  } else {
    end = start;
    start = len;
  }

  for (let i = start; i < end ;i++) {
    out.push(i);
  }

  return out;
}

function paginationButtons(buttons, page, pages) {
  let numbers = [];
  // const buttons = buttons;
  const half = Math.floor(buttons / 2);

  if (pages <= buttons) {
    numbers = range(0, pages);
  } else if (page <= half) {
    numbers = range(0, buttons - 2);
    numbers.push('ellipsis');
    numbers.push(pages - 1);
  } else if (page >= pages - 1 - half) {
    numbers = range(pages - (buttons - 2), pages);
    numbers.unshift('ellipsis'); // no unshift in ie6
    numbers.unshift(0);
  } else {
    numbers = range(page - half + 2, page + half - 1);
    numbers.push('ellipsis');
    numbers.push(pages - 1);
    numbers.unshift('ellipsis');
    numbers.unshift(0);
  }

  return numbers;
}

export {paginationButtons};
