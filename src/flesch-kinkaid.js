/*eslint prefer-const: "error", sourceType: "module" */
/*eslint-env es6*/
// const syllables = x => (x.replace(/e$/i, '').match(/[aeiouy]+/gi) || ['']).length

const syllables = x => {
    /*
     * basic algortithm: each vowel-group indicates a syllable, except for: final
     * (silent) e 'ia' ind two syl @AddSyl and @SubSyl list regexps to massage the
     * basic count. Each match from @AddSyl adds 1 to the basic count, each
     * @SubSyl match -1 Keep in mind that when the regexps are checked, any final
     * 'e' will have been removed, and all '\'' will have been removed.
     */
    const subSyl = [
        /cial/,
        /tia/,
        /cius/,
        /cious/,
        /giu/, // belgium!
        /ion/,
        /iou/,
        /sia$/,
        /.ely$/, // absolutely! (but not ely!)
        /sed$/, // doused, housed, used
    ]

    const addSyl = [
        /ia/,
        /riet/,
        /dien/,
        /iu/,
        /io/,
        /ii/,
        /[aeiouym]bl$/, // -Vble, plus -mble
        /[aeiou]{3}/, // agreeable
        /^mc/,
        /ism$/, // -isms
        /([^aeiouy])\1l$/, // middle twiddle battle bottle, etc.
        /[^l]lien/, // // alien, salient [1]
        /^coa[dglx]./, // [2]
        /[^gq]ua[^auieo]/, // i think this fixes more than it breaks
        /dnt$/, // couldn't
    ]

    // (comments refer to titan's /usr/dict/words)
    // [1] alien, salient, but not lien or ebbullient...
    // (those are the only 2 exceptions i found, there may be others)
    // [2] exception for 7 words:
    // coadjutor coagulable coagulate coalesce coalescent coalition coaxial

    if (undefined === x || null === x || '' === x) return 0;

    const xx = x.toLowerCase().replace(/'/g, '').replace(/e\b/g, '');
    if (1 === xx.length) return 1;

    const scrugg = xx.split(/[^aeiouy]+/).filter(Boolean); // '-' should be perhaps added?

    var syl = 0;

    for (var regex of subSyl) {
        syl -= (xx.match(regex) || []).length;
    }

    for (var regex of addSyl) {
        syl += (xx.match(regex) || []).length;
    }

    if (scrugg.length > 0 && '' === scrugg[0]) {
        syl += scrugg.length - 1;
    } else {
        syl += scrugg.length;
    }

    for (var word of xx.split(/\b/).map(x => x.trim()).filter(Boolean).filter(x => !x.match(/[.,'!?]/g))) {
        if (!word.match(/[aeiouy]/)) {
            // got no vowels? ("the", "crwth")
            syl += 1;
        }
    }

    return syl;

}
const words = x => (x.split(/\s+/) || ['']).length
const sentences = x => (x.split('. ') || ['']).length
const syllablesPerWord = x => syllables(x) / words(x)
const wordsPerSentence = x => words(x) / sentences(x)

const rate = x => 206.835 - 1.015 * wordsPerSentence(x) - 84.6 * syllablesPerWord(x)
const grade = x => 0.39 * wordsPerSentence(x) + 11.8 * syllablesPerWord(x) - 15.59
const test = (fn, x, y) => console.log(x + (Math.round(fn(x)) === Math.round(y) ? 'Pass' : 'Fail (' + fn(x) + ')'))

test(syllables, "The cat sat on the mat.", 6);
test(words, "The cat sat on the mat.", 6);
test(sentences, "The cat sat on the mat.", 1);
test(rate, "The cat sat on the mat.", 116);

test(words, "This sentence, taken as a reading passage unto itself, is being used to prove a point.", 16);
test(syllables, "This sentence, taken as a reading passage unto itself, is being used to prove a point.", 23);
test(rate, "This sentence, taken as a reading passage unto itself, is being used to prove a point.", 74.1);

test(words, "The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.", 13);
test(syllables, "The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.", 25);
test(rate, "The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.", 37);
test(grade, "The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.", 13);