import plugin from './index';

function mockValidResult() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
    };

    global.classMaps = classMaps;

    expect(
      plugin()(
        `const titleClass = 'text-xl font-weight'; const descriptionClass = 'text-base'`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} ${classMaps['font-weight']}'; const descriptionClass = '${classMaps['text-base']}'`
    );
  };
}

function mockNotBreakNativeSyntax() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
      relative: 'd',
      absolute: 'e',
      uppercase: 'f',
    };

    global.classMaps = classMaps;

    expect(
      plugin({
        sourcemap: false,
      })(
        `const titleClass = 'text-xl font-weight relative uppercase'; const descriptionClass = 'text-base absolute'; function relative(){}; let absolute = ''; const obj = { uppercase: '' };`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} ${classMaps['font-weight']} ${classMaps.relative} ${classMaps.uppercase}'; const descriptionClass = '${classMaps['text-base']} ${classMaps.absolute}'; function relative(){}; let absolute = ''; const obj = { uppercase: '' };`
    );
  };
}

function mockCommentDisableEnableIsWork() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
      relative: 'd',
      absolute: 'e',
      uppercase: 'f',
    };

    global.classMaps = classMaps;

    expect(
      plugin({
        sourcemap: false,
      })(
        `//minion-disable\nconst titleClass = 'text-xl font-weight relative uppercase'; //minion-enable\nconst descriptionClass = 'text-base absolute'; function relative(){}; let absolute = ''; const obj = { uppercase: '' };`
      ).code
    ).toBe(
      `//minion-disable\nconst titleClass = 'text-xl font-weight relative uppercase'; //minion-enable\nconst descriptionClass = '${classMaps['text-base']} ${classMaps.absolute}'; function relative(){}; let absolute = ''; const obj = { uppercase: '' };`
    );
  };
}

function mockValidResultWithGetClassMaps() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
    };

    global.classMaps = undefined;

    expect(
      plugin({
        getClassMaps: () => classMaps,
      })(
        `const titleClass = 'text-xl font-weight'; const descriptionClass = 'text-base'`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} ${classMaps['font-weight']}'; const descriptionClass = '${classMaps['text-base']}'`
    );
  };
}

function mockValidResultWithClassMapsFieldName() {
  return () => {
    const fieldName = 'abcdefgh';
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
    };

    global[fieldName] = classMaps;

    expect(
      plugin({
        classMapsFieldName: fieldName,
      })(
        `const titleClass = 'text-xl font-weight'; const descriptionClass = 'text-base'`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} ${classMaps['font-weight']}'; const descriptionClass = '${classMaps['text-base']}'`
    );
  };
}

function mockValidResultWithSourcemap() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
      'font-weight': 'c',
    };

    global.classMaps = classMaps;

    expect(
      plugin({
        sourcemap: true,
      })(
        `const titleClass = 'text-xl font-weight'; const descriptionClass = 'text-base'`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} ${classMaps['font-weight']}'; const descriptionClass = '${classMaps['text-base']}'`
    );
  };
}

function mockUnlistedClassInClassMaps() {
  return () => {
    const classMaps = {
      'text-base': 'a',
      'text-xl': 'b',
    };

    global.classMaps = classMaps;

    expect(
      plugin({
        sourcemap: true,
      })(
        `const titleClass = 'text-xl font-weight'; const descriptionClass = 'text-base'`
      ).code
    ).toBe(
      `const titleClass = '${classMaps['text-xl']} font-weight'; const descriptionClass = '${classMaps['text-base']}'`
    );
  };
}

it('valid result', mockValidResult());
it('not break native syntax', mockNotBreakNativeSyntax());
it('comment disable & enable is work', mockCommentDisableEnableIsWork());
it(
  'valid result with classMapsFieldName',
  mockValidResultWithClassMapsFieldName()
);
it('valid result with getClassMaps', mockValidResultWithGetClassMaps());
it('valid result with sourcemap', mockValidResultWithSourcemap());
it(
  'valid result if class is unlisted in classMaps',
  mockUnlistedClassInClassMaps()
);
