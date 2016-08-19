
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

/**
 * [paginationButtons 根据需要渲染的按钮数量，当前页号和总页数来渲染按钮的显示情况]
 * @method paginationButtons
 * @author chengjianhua
 * @date   2016-08-19
 * @param  {[Number]}          buttons [需要显示的按钮的数量]
 * @param  {[Number]}          page    [当前页号]
 * @param  {[Number]}          pages   [总页数]
 * @return {[Array]}                  [包含当前按钮显示情况的数组]
 */
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

/**
 * [stringIsNotEmpty 判断字符串是否内容不为空，过滤掉各种空白字符]
 * @method stringIsNotEmpty
 * @author chengjianhua
 * @date   2016-08-19
 * @param  {[string]}         string [需要判断是否不为空的字符串]
 * @return {[bool]}                [字符串不空白则返回真，否则假]
 */
function stringIsNotEmpty(string) {
  return string.replace(/(^\s*)|(\s*$)/g, '').length !== 0;
}

export {
  paginationButtons,
  stringIsNotEmpty
};
