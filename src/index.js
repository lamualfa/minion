import MagicString from 'magic-string';
import { tokenize } from 'esprima';

function isCommentDisable(string) {
  return /minion-disable/g.test(string);
}

function isCommentEnable(string) {
  return /minion-enable/g.test(string);
}

function byLength(a, b) {
  return b.length - a.length;
}

function getPattern(classMaps) {
  return new RegExp(
    `${Object.entries(classMaps)
      .map(([originalClass]) => originalClass)
      .sort(byLength)
      .join('|')}`,
    'g'
  );
}

function processString(string, { classMaps, pattern }) {
  return string.replace(pattern, (key) => classMaps[key]);
}

function buildResult(magicString, options) {
  const result = { code: magicString.toString() };
  if (options.sourcemap !== false)
    result.map = magicString.generateMap({ hires: true });

  return result;
}

function processCode(code, options) {
  const magicString = new MagicString(code);
  const tokens = tokenize(code, {
    comment: true,
    range: true,
  });

  let isDisable;

  tokens.forEach(({ type, value, range }) => {
    if (type === 'LineComment') {
      if (isCommentDisable(value)) isDisable = true;
      else if (isCommentEnable(value)) isDisable = false;

      return;
    }

    if (isDisable) return;

    if (type === 'String')
      magicString.overwrite(range[0], range[1], processString(value, options));
  });

  return buildResult(magicString, options);
}

function getClassMaps(options = {}) {
  if (options.getClassMaps) return options.getClassMaps();
  else if (options.classMapsFieldName && global[options.classMapsFieldName])
    return global[options.classMapsFieldName];

  return global.classMaps;
}

export default function minion(options) {
  const classMaps = getClassMaps(options);
  if (!classMaps) return false;
  const pattern = getPattern(classMaps);


  return function execProcessCode(code) {
    return processCode(code, {
      ...options,
      classMaps,
      pattern,
    });
  };
}
